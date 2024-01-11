
import React, { useState, useEffect, Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Button } from 'native-base';
import ChatBotScreen from './ChatBotScreen';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { odApi, processAndSendData } from '../ai_model/BP_Food';

const DailyScreen = () => {
  // 상태변수 설정
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedMeal, setSelectedMeal] = useState('아침'); // 식사시간대 상태
  const [isModalVisible, setModalVisible] = useState(false); // 모달창 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const mealDate = route.params?.mealDate || ''; // 날짜 가져오는 변수
  const [isCalendarVisible, setCalendarVisible] = useState(false); // 캘린더 상태
  const [selectedDate, setSelectedDate] = useState(''); // 날짜 선택 상태
  const { width, height } = Dimensions.get('window');

  // 날짜선택과 선택날짜에 대한 식사데이터 렌더링 
  const fetchDataAndRender = async () => {
    await fetchMealData(selectedDate, selectedMeal);
  };

  // 로딩상태 모달창 
  const LoadingModal = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.loadingModalContainer}>
          <ActivityIndicator size="large" color="#8E86FA" />
          <Text style={{ marginTop: 20, fontSize: 20 }}>사진을 분석중이에요</Text>
        </View>
      </Modal>
    );
  };

  // 현재 날짜 체크
  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // 캘린더 모달창 토글
  const toggleCalendarModal = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  // 식사 영양소 데이터 초기상태
  const [mealNutrients, setMealNutrients] = useState({
    carbs: 0,
    col: 0,
    fat: 0,
    kcal: 0,
    nat: 0,
    protein: 0,
    sugar: 0,
    diet_rating: ''
  });

  // 갤러리에서 이미지 선택해주는 함수
  const openGallery = () => {

    // launchImageLibrary에 전달되는 설정 옵션 
    const options = {
      mediaType: 'photo', // 미디어타입을 사진으로 제한
      quality: 1, // 이미지 품질 최상
    };

    // 갤러리에서 이미지 선택하는 기능 
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) { // 이미지 선택을 취소한 경우  
        console.log('User cancelled image picker');
      } else if (response.errorCode) { // 이미지 선택 중 오류가 발생
        console.log('ImagePicker Error: ', response.errorMessage);
      } else { // 정상적인 작업 
        const source = { uri: response.assets[0].uri }; // 선택한 이미지 정보 저장
        // 이미지를 서버로 전송
        const image = new FormData(); 
        image.append('file', {
          uri: source.uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName
        });

        setIsLoading(true);

        // 이미지 uri 저장
        await AsyncStorage.setItem('@latest_photo', source.uri);
        console.log(source.uri);
        // 이미지 분석
        await processAndSendData(source.uri, response.assets[0].fileName);
        const apiResult = await odApi(source.uri, response.assets[0].fileName);

        // ImageInScreen으로 이동하면서 photoUri 전달
        setIsLoading(false); // 로딩해제
        navigation.navigate('ImageIn', { photo: source.uri, apiResult, selectDay: selectedDate, image });
      }
    });
  };

  // 캘린더에서 날짜를 선택했을 때 호출해주는 함수
  const handleDateSelect = async (day) => {
    setSelectedDate(day.dateString); // 선택날짜 저장
    setCalendarVisible(false); // 캘린더 숨김


    const mealTypes = ['아침', '점심', '저녁', '간식'];
    const newData = {}; // 식사정보
    let totalData = null; // 전체영양소 정보
 
    // 서버에서 식사데이터를 가져옴
    for (const mealType of mealTypes) {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        const response = await axios.get(`http://edm-diet.japaneast.cloudapp.azure.com/Meal_Date/api/Meal/?meal_date=${day.dateString}&meal_type=${mealType}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        newData[mealType] = {
          food_name: response.data.food_name,
          meal_serving: response.data.meal_serving,
          칼로리: response.data.kcal.toFixed(1),
          탄수화물: response.data.carbs.toFixed(1),
          당류: response.data.sugar.toFixed(1),
          단백질: response.data.protein.toFixed(1),
          지방: response.data.fat.toFixed(1),
          나트륨: response.data.nat.toFixed(1),
          콜레스테롤: response.data.col.toFixed(1),
          imagelink: response.data.imagelink
        };

        if (!totalData) { // 전체 데이터가 아직 설정되지 않았다면 설정
          totalData = {
            carbs: response.data.total_carbs,
            protein: response.data.total_protein,
            fat: response.data.total_fat,
            sugar: response.data.total_sugar,
            kcal: response.data.total_kcal,
            nat: response.data.total_nat,
            col: response.data.total_col,
            diet_rating: response.data.diet_rating
          };
        }
      } catch (error) {
        console.error('Error fetching meal data:', error);
      }
    }

    setMealData(newData);
    setMealNutrients(totalData); // 전체 영양소 정보를 상태에 저장
  };

  // 식사시간대를 선택했을 때 호출
  const handleMealSelect = async (mealType) => {
    setSelectedMeal(mealType);
    await fetchMealData(selectedDate, mealType);
  };

  // 시간대를 선택했을 때 그에 해당하는 식사데이터 업데이트
  const fetchMealData = async (date, mealType) => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const response = await axios.get(`http://edm-diet.japaneast.cloudapp.azure.com/Meal_Date/api/Meal/?meal_date=${date}&meal_type=${mealType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 영양소정보 업데이트
      setMealNutrients({
        carbs: response.data.total_carbs,
        protein: response.data.total_protein,
        fat: response.data.total_fat,
        sugar: response.data.total_sugar,
        kcal: response.data.total_kcal,
        nat: response.data.total_nat,
        col: response.data.total_col,
        diet_rating: response.data.diet_rating
      });

      //식사데이터 출력
      setMealData(prevMealData => ({
        ...prevMealData,
        [mealType]: {
          ...prevMealData[mealType],
          food_name: response.data.food_name,
          meal_serving: response.data.meal_serving,
          칼로리: response.data.kcal.toFixed(1),
          탄수화물: response.data.carbs.toFixed(1),
          당류: response.data.sugar.toFixed(1),
          단백질: response.data.protein.toFixed(1),
          지방: response.data.fat.toFixed(1),
          나트륨: response.data.nat.toFixed(1),
          콜레스테롤: response.data.col.toFixed(1),
          imagelink: response.data.imagelink,
          un_food_name: response.data.un_food_name
        }
      }));
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };

  // 
  useEffect(() => {
    if (route.params?.selectedMeal && route.params?.photoUri && route.params?.mealDataList) {
      const updatedMealInfo = {
        ...mealData[route.params.selectedMeal],
        menu: route.params.mealDataList.map(item => `${item.menu} - ${item.portion} 인분`).join(', ')
      };
      setSelectedMeal(route.params.selectedMeal);
      setMealData(prevMealData => ({
        ...prevMealData,
        [route.params.selectedMeal]: updatedMealInfo
      }));
    }
  }, [route.params]);

  //
  useEffect(() => {
    if (mealDate) {
      setSelectedDate(mealDate);
      fetchMealData(mealDate, selectedMeal);
    }
    else {
      const today = getCurrentDate();
      setSelectedDate(today);
      fetchMealData(today, selectedMeal);
    }
  }, []);

  //
  useFocusEffect(
    React.useCallback(() => {
      fetchDataAndRender();
    }, [selectedDate, selectedMeal])
  );

  //
  useEffect(() => {
    const updateTabBarVisibility = () => {
      navigation.setOptions({
        tabBarStyle: isLoading ? { display: 'none' } : {
          height: height * 0.1,
          paddingBottom: '1%',
        },
      });
    };

    updateTabBarVisibility();
  }, [isLoading, navigation]);

  // 각 식사 시간별 식사 정보
  const [mealData, setMealData] = useState({
    아침: {
      food_name: '',
      meal_serving: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      imagelink: '',
      un_food_name: ''
    },
    점심: {
      // //점심 식사에 대한 정보
      food_name: '',
      meal_serving: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      imagelink: '',
      un_food_name: ''
    },
    저녁: {
      // 저녁 식사에 대한 정보
      food_name: '',
      meal_serving: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      imagelink: '',
      un_food_name: ''
    },
    간식: {
      // 간식 식사에 대한 정보
      food_name: '',
      meal_serving: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      imagelink: '',
      un_food_name: ''
    },
  });

  const meals = ['아침', '점심', '저녁', '간식'];


  // 현재날짜정보
  const renderDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  // 식사시간대 선택시 버튼 스타일 조정
  const getButtonStyle = (meal) => ({
    width: '20%',
    backgroundColor: selectedMeal === meal ? '#8E86FA' : 'transparent',
    borderColor: selectedMeal === meal ? '#8E86FA' : 'transparent',
  });

  const getButtonTextStyle = (meal) => ({
    color: selectedMeal === meal ? 'white' : 'black',
    fontSize: 16,
    justifyContent: 'center',
  });

  // 모달창 토글
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // 식단 평가 색상 설정
  const getBackgroundColor = () => {
    switch (mealNutrients.diet_rating) {
      case 'Bad':
        return '#FA6565';
      case 'Not Bad':
        return 'FA9B65';
      case 'Good':
        return '#EEE064';
      case 'Very Good':
        return '#96CCF3';
      case 'Perfect':
        return '#2FFF9B';
      default:
        return 'lightgray'; // Default color if no match is found
    }
  };

  if (isLoading) {
    // 로딩 중이라면 로딩 화면을 표시
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color="#8E86FA" />
          <Text style={{ marginTop: 20, fontSize: 20 }}>사진을 분석중이에요</Text>
        </View>
        <LoadingModal isVisible={isLoading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 날짜 표시 부분 */}
      <TouchableOpacity onPress={toggleCalendarModal}>
        <Text style={styles.dateText}>{selectedDate !== '' ? selectedDate : renderDate()}</Text>
      </TouchableOpacity>

      {/* 캘린더 모달창 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={toggleCalendarModal}
      >
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: '20%' }}>
          <View style={{ width: '90%', height: '60%', justifyContent: 'center', backgroundColor: 'white', borderRadius: 20 }}>
            <Calendar
              onDayPress={(day) => handleDateSelect(day)}
            />
            <TouchableOpacity
              style={{ alignSelf: 'center', marginTop: '10%', backgroundColor: '#8E86FA', borderRadius: 20 }}
              onPress={toggleCalendarModal} // 모달 닫기 이벤트 추가
            >
              <Text style={{ fontSize: 18, margin: '5%', color: 'white', fontWeight: '900' }}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* 상단의 날짜의 전체 식단 평가와 영양소 정보 영역 */}
      <View style={[styles.testbox, { backgroundColor: getBackgroundColor() }]}>
        {/* 식단평가결과 */}
        <Text style={styles.perfectText}>{mealNutrients.diet_rating}</Text>
      </View>
      {/* 영양소 정보 */}
      <View style={styles.contentContainer}>
        <View style={styles.contentstext}>
            <View style={{ ...styles.PersonalRegions, marginBottom: '5%' }}>
            <Text style={{ fontSize: 16, color: 'black', }}>섭취 칼로리</Text>
            <Text style={{ fontSize: 16, color: 'black', }}>{mealNutrients.kcal.toFixed(1)}kcal </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>탄수화물</Text>
            <Text style={styles.kcal}>{mealNutrients.carbs.toFixed(1)}g </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}> - 당류</Text>
            <Text style={styles.kcal}>{mealNutrients.sugar.toFixed(1)}g </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>지방</Text>
            <Text style={styles.kcal}>{mealNutrients.fat.toFixed(1)}g </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>단백질</Text>
            <Text style={styles.kcal}>{mealNutrients.protein.toFixed(1)}g </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>나트륨</Text>
            <Text style={styles.kcal}>{mealNutrients.nat.toFixed(1)}mg </Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>콜레스테롤</Text>
            <Text style={styles.kcal}>{mealNutrients.col.toFixed(1)}mg </Text>
          </View>
        </View>
        
      </View>

      {/* 시간대별 식단정보 표시 영역 */}
      <View style={styles.mealsContainer}>
        {/* 시간대 버튼을 매핑 */}
        {meals.map((meal) => (
          <Button key={meal} onPress={() => handleMealSelect(meal)} style={getButtonStyle(meal)} borderTopRadius={20} borderBottomRadius={20}>
            <Text style={getButtonTextStyle(meal)}>{meal}</Text>
          </Button>
        ))}
      </View>
      {/* 시간대가 선택되었을 때 */}
      <View style={styles.selectedMealContainer}>
        {/* 사진과 메뉴를 표시해주는 부분 */}
        <View style={styles.selectedMealInfo_1}>
          <TouchableOpacity style={styles.selectPhotoButton} onPress={openGallery}>
            {mealData[selectedMeal]?.imagelink ? (
              <Image
                source={{ uri: mealData[selectedMeal].imagelink }}
                style={styles.MealImg}
              />
            ) : (
              <>
                <Image
                  source={require('../icons/GalleryIcon.png')}
                  style={styles.photoIcon}
                />
                <Text style={styles.selectPhotoButtonText}>사진 선택</Text>
              </>
            )}
          </TouchableOpacity>
          <View style={styles.MealMenu}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: '3%', marginTop: '3%' }}>
              {'< '}{selectedMeal ? `${selectedMeal} 메뉴` : ''}{' >'}
            </Text>
            {/* 메뉴정보표시 -- 많을 경우 스크롤 기능 */}
            <ScrollView contentContainerStyle={styles.TodayIs} style={{ height: 100 }}>
              {/* 데이터에 존재하는 이미지일 경우 */}
              {Array.isArray(mealData[selectedMeal].food_name) && mealData[selectedMeal].food_name.length > 0 ? (
                mealData[selectedMeal].food_name.map((food, index) => {
                  if (food.trim() !== '' && mealData[selectedMeal].meal_serving && mealData[selectedMeal].meal_serving[index] > 0) {
                    return (
                      <View key={index} style={{ flexDirection: 'column', marginBottom: 5 }}>
                        <Text>{food} : {mealData[selectedMeal].meal_serving[index]} 인분</Text>
                      </View>
                    );
                  }
                  return null;
                })
              ) : null}
              {/* 존재하지 않는 이미지일 경우 */}
              {Array.isArray(mealData[selectedMeal].un_food_name) && mealData[selectedMeal].un_food_name.filter(name => name.trim() !== '').length > 0 && (
                <View>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
                    없는 이미지
                  </Text>
                  {mealData[selectedMeal].un_food_name.filter(name => name.trim() !== '').map((name, index) => (
                    <Text key={index}>- {name}</Text>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>


        </View>
        {/* 영양소를 표시해주는 부분 */}
        <View style={styles.selectedMealInfo_2}>
          <View style={{
            marginBottom: '5%',
          }}>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>탄수화물</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].탄수화물}g </Text>
            </View>
            <View style={{ ...styles.PersonalRegions, marginLeft: '10%', }}>
              <Text style={{ fontSize: 13 }}>- 당류</Text>
              <Text style={{ fontSize: 13 }}>{mealData[selectedMeal].당류}g </Text>
            </View>
          </View>

          <View style={{
          }}>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>단백질</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].단백질}g </Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>지방</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].지방}g </Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>나트륨</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].나트륨}mg </Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>콜레스테롤</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].콜레스테롤}mg </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 챗봇버튼 */}
      <TouchableOpacity style={styles.chatbotButton} onPress={toggleModal}>
        <Image source={require('../icons/ChatBotIcon.png')} style={styles.chatbotIcon} />
      </TouchableOpacity>

      {/* 챗봇 모달창 */}
      <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChatBotScreen onClose={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // 네비게이션 밑의 전체영역(Daily전체부분 스타일)
  container: {
    flex: 1,
    padding: '5%',
    paddingTop: '-5%',
  },
  // 날짜 표시 영역
  dateText: {
    fontSize: 20,
    marginTop: '1%',
    textAlign: 'center',
  },

  // 식단평가 영역
  testbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '1%',
    borderRadius: 10,
    width: '50%',
    height: 30,
  },
  perfectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // 통계 부분 전체영역
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    padding: 12,
    marginVertical: '3%',
    borderRadius: 20,
  },

  //통계부분 글 영역
  contentstext: {
  },

  //글 안의 영양소 별 줄 맞추기
  PersonalRegions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1%'
  },

  // 영양소 텍스트 조절
  nutrient: {
    fontSize: 14,
    color: 'black',
    marginBottom: '1%',
  },

  //통계부분 사진 영역
  contentsImg: {
    width: 140,
    height: 140,
    backgroundColor: 'white',
  },
  // 식사시간대 선택부분 영역
  mealsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1%',
    backgroundColor: '#D7D4FF',
    borderRadius: 20,
  },

  // 식사시간대별 메뉴표시 영역
  selectedMealContainer: {
    paddingVertical: '5%',
    paddingRight: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  MealImg: {
    width: 170,
    height: 150,
  },
  MealMenu: {
    marginLeft: '10%',
  },

  TodayIs: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },



  // 챗봇버튼
  chatbotButton: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: '#D7D4FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  // 챗봇버튼영역의 아이콘영역
  chatbotIcon: {
    width: 30,
    height: 30,
  },

  // 챗봇을 눌렀을 때의 modal창 영역 바깥 부분
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // 챗봇 modal 창
  modalContent: {
    flex: 1,
    minWidth: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 30,
  },

  // 챗봇을 눌렀을 때의 modal창 영역 바깥 부분
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  photoIcon: {
    width: '30%', // 원하는 크기로 조정
    height: '30%', // 원하는 크기로 조정
    marginBottom: 10, // 이미지 아래 간격 조정
  },

  // "사진 선택" 버튼 스타일
  selectPhotoButton: {
    width: 170,
    height: 150,
    backgroundColor: '#D7D4FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectPhotoButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },

  // 로딩화면 스타일 조정
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingLeft: 20,
  },
  loadingView: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default DailyScreen;