
import React, { useState, useEffect, Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'native-base';
import ChatBotScreen from './ChatBotScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { odApi, processAndSendData } from '../ai_model/BP_Food';
const DailyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedMeal, setSelectedMeal] = useState('아침');
  const [isModalVisible, setModalVisible] = useState(false);
  const tempImageUrl = 'https://via.placeholder.com/150';

  const [photoUri, setPhotoUri] = useState('https://via.placeholder.com/150');

  
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };
  const toggleCalendarModal = () => {
    setCalendarVisible(!isCalendarVisible);
  };
  const [mealNutrients, setMealNutrients] = useState({
    carbs: 0,
    col: 0,
    fat: 0,
    kcal: 0,
    nat: 0,
    protein: 0,
    sugar: 0,
    diet_rating:''
  });

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        const image = new FormData();
        image.append('file', {
          uri: source.uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName
        });
        await AsyncStorage.setItem('@latest_photo', source.uri);
        console.log(source.uri)
        await processAndSendData(source.uri, response.assets[0].fileName);
        const apiResult = await odApi(source.uri, response.assets[0].fileName);

        // ImageInScreen으로 이동하면서 photoUri 전달

        navigation.navigate('ImageIn', { photo: source.uri, apiResult, selectDay: selectedDate, image });
      }
    });
  };
  // const handleDateSelect = (day) => {
  //   setSelectedDate(day.dateString);
  //   setCalendarVisible(false);
  //   fetchMealData(day.dateString); // 선택된 날짜에 대한 식사 데이터 요청
  // };
  const handleDateSelect = async (day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
  
    const mealTypes = ['아침', '점심', '저녁', '간식'];
    const newData = {};
    let totalData = null;
  
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
  
  const handleMealSelect = async (mealType) => {
    setSelectedMeal(mealType);
    await fetchMealData(selectedDate, mealType);
  };

  // const fetchMealData = async (date) => {
  //   try {
  //     const token = await AsyncStorage.getItem('@user_token');
  //     const response = await axios.get(`http://edm-diet.japaneast.cloudapp.azure.com/Meal_Date/api/Meal/?meal_date=${date}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  //     // 여기에서 응답 데이터를 처리합니다.
  //     // console.log(response.data); // 데이터 로깅
  //     setMealNutrients(response.data); 
  //     // setMealData(response.data); // 상태 업데이트
  //   } catch (error) {
  //     console.error('Error fetching meal data:', error);
  //   }
  // };
  const fetchMealData = async (date, mealType) => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const response = await axios.get(`http://edm-diet.japaneast.cloudapp.azure.com/Meal_Date/api/Meal/?meal_date=${date}&meal_type=${mealType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data.imagelink)
      // 전체 영양소 정보를 mealNutrients에 저장합니다.
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
      // setPhotoUri(response.data.imagelink);
      // 선택된 식사 유형에 해당하는 영양소 정보를 mealData에 저장합니다.
      setMealData(prevMealData => ({
        ...prevMealData,
        [mealType]: {
          ...prevMealData[mealType],
          food_name:response.data.food_name,
          meal_serving:response.data.meal_serving,
          칼로리: response.data.kcal.toFixed(1),
          탄수화물: response.data.carbs.toFixed(1),
          당류: response.data.sugar.toFixed(1),
          단백질: response.data.protein.toFixed(1),
          지방: response.data.fat.toFixed(1),
          나트륨: response.data.nat.toFixed(1),
          콜레스테롤: response.data.col.toFixed(1),
          imagelink:response.data.imagelink,
          un_food_name:response.data.un_food_name
        }
      }));
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };



  useEffect(() => {
     console.log(mealData['간식'].food_name)
    if (route.params?.selectedMeal && route.params?.photoUri && route.params?.mealDataList) {
      const updatedMealInfo = {
        ...mealData[route.params.selectedMeal],
        // image: route.params.photoUri,
        menu: route.params.mealDataList.map(item => `${item.menu} - ${item.portion} 인분`).join(', ')
      };
      setSelectedMeal(route.params.selectedMeal);
      setMealData(prevMealData => ({
        ...prevMealData,
        [route.params.selectedMeal]: updatedMealInfo
      }));
    }
  }, [route.params]);
  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
    fetchMealData(today, selectedMeal);
  }, []);
  // 각 식사 시간별 식사 정보
  const [mealData, setMealData] = useState({
    아침: {
      food_name: '',
      meal_serving:'',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      imagelink: '', // 실제 아침 식사 이미지 URL로 변경하세요
      un_food_name:''
    },
    점심: {
      // //점심 식사에 대한 정보
      food_name: '',
      meal_serving:'',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      // //... 아침 식사에 대한 다른 영양소나 식사 정보
      imagelink: '', // 실제 아침 식사 이미지 URL로 변경하세요
      un_food_name:''
    },
    저녁: {
      // 저녁 식사에 대한 정보
      food_name: '',
      meal_serving:'',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      imagelink: '', // 실제 아침 식사 이미지 URL로 변경하세요
      un_food_name:''
    },
    간식: {
      // 간식 식사에 대한 정보
      food_name: '',
      meal_serving:'',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      imagelink: '', // 실제 아침 식사 이미지 URL로 변경하세요
      un_food_name:''
    },
  });
  
  const meals = ['아침', '점심', '저녁', '간식'];
  

  const renderDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCalendarModal}>
        <Text style={styles.dateText}>{selectedDate !== '' ? selectedDate : renderDate()}</Text>
      </TouchableOpacity>

      <Modal
      animationType="slide"
      transparent={true}
      visible={isCalendarVisible}
      onRequestClose={toggleCalendarModal}
    >
      {/* <View
        style={styles.CalendarModalContainer}
      >
          <Calendar
            onDayPress={(day) => handleDateSelect(day)}
            style={styles.CalendarSelf}
            theme={{
              calendarBackground: 'transparent',
            }}
            // 필요에 따라 캘린더의 외관과 기능을 커스터마이징할 수 있습니다
          />
      </View> */}
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: '20%'}}>
        <View style={{ width: '90%', height: '60%',justifyContent: 'center', backgroundColor: 'white', borderRadius: 20 }}>
          {/* 여기에 캘린더 컴포넌트 혹은 다른 컨텐츠를 넣으세요 */}
          <Calendar
            onDayPress={(day) => handleDateSelect(day)}
            //style={styles.CalendarSelf}
            //theme={{
              //calendarBackground: 'transparent',
            //}}
            />
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: '10%', backgroundColor: '#8E86FA', borderRadius: 20}}
            onPress={toggleCalendarModal} // 모달 닫기 이벤트 추가
          >
            <Text style={{fontSize: 18, margin: '5%', color: 'white', fontWeight: '900'}}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
      {/* // perfectText에 결과 할당 및 testbox 스타일 설정(test) */}
      <View style={[styles.testbox]}>
        <Text style={styles.perfectText}>{mealNutrients.diet_rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        {/* 여기에 다른 컨텐츠가 추가될 수 있습니다#F3EFEF */}
        <View style={styles.contentstext}>
        <View style={{ ...styles.PersonalRegions, marginBottom: '5%' }}>
            <Text style={{ fontSize: 16, color: 'black', }}>섭취 칼로리</Text>
            <Text style={{ fontSize: 16, color: 'black', }}>{mealNutrients.kcal.toFixed(1)}kcal</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>탄수화물</Text>
            <Text style={styles.kcal}>{mealNutrients.carbs.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}> - 당류</Text>
            <Text style={styles.kcal}>{mealNutrients.sugar.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>지방</Text>
            <Text style={styles.kcal}>{mealNutrients.fat.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>단백질</Text>
            <Text style={styles.kcal}>{mealNutrients.protein.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>나트륨</Text>
            <Text style={styles.kcal}>{mealNutrients.nat.toFixed(1)}mg</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>콜레스테롤</Text>
            <Text style={styles.kcal}>{mealNutrients.col.toFixed(1)}mg</Text>
          </View>
        </View>
        {/* <View style={styles.contentsImg}>
          <Text>이미지부분</Text>
        </View> */}
      </View>

      <View style={styles.mealsContainer}>
        {meals.map((meal) => (
          <Button key={meal} onPress={() => handleMealSelect(meal)} style={getButtonStyle(meal)} borderTopRadius={20} borderBottomRadius={20}>
          <Text style={getButtonTextStyle(meal)}>{meal}</Text>
        </Button>
        ))}
      </View>
      <View style={styles.selectedMealContainer}>
        <View style={styles.selectedMealInfo_1}>
          {mealData[selectedMeal]?.imagelink ? (
            <Image
              source={{ uri: mealData[selectedMeal].imagelink }}
              style={styles.MealImg}
            />
          ) : (
            <TouchableOpacity style={styles.selectPhotoButton} onPress={openGallery}>
              <Image
                source={require('../icons/A.png')}
                style={styles.photoIcon}
              />
              <Text style={styles.selectPhotoButtonText}>사진 선택</Text>
            </TouchableOpacity>
          )}

<View style={styles.MealMenu}>
  <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: '3%', marginTop: '3%' }}>
    {'< '}{selectedMeal ? `${selectedMeal} 메뉴` : ''}{' >'}
  </Text>
  <ScrollView contentContainerStyle={styles.TodayIs} style={{ height: 200 }}>
    {/* 기존 메뉴 리스트 렌더링 (메뉴가 있는 경우에만) */}
    {/* {Array.isArray(mealData[selectedMeal].food_name) && mealData[selectedMeal].food_name.length > 0 ? (
      mealData[selectedMeal].food_name.map((food, index) => (
        <View key={index} style={{ flexDirection: 'column', marginBottom: 5 }}>
          <Text>{food} : {mealData[selectedMeal].meal_serving && mealData[selectedMeal].meal_serving[index]} 인분</Text>
        </View>
      ))
    ) : null} */}
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
    {/* un_food_name이 있는 경우 추가 텍스트 렌더링 */}
    {/* {mealData[selectedMeal].un_food_name && mealData[selectedMeal].un_food_name !== '' ? (
      <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
        없는 이미지 : {mealData[selectedMeal].un_food_name}
      </Text>
    ) : null} */}
    {Array.isArray(mealData[selectedMeal].un_food_name) && mealData[selectedMeal].un_food_name.filter(name => name.trim() !== '').length > 0 && (
  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
    없는 이미지 : {mealData[selectedMeal].un_food_name.filter(name => name.trim() !== '').join(', ')}
  </Text>
)}
  </ScrollView>
</View>


        </View>
        <View style={styles.selectedMealInfo_2}>
          <View style={{
            marginBottom: '5%',
            //marginRight: '5%',
            //backgroundColor: 'red',
            //width: '30%'
          }}>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>탄수화물</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].탄수화물}</Text>
            </View>
            <View style={{ ...styles.PersonalRegions, marginLeft: '10%', }}>
              <Text style={{ fontSize: 13 }}>- 당류</Text>
              <Text style={{ fontSize: 13 }}>{mealData[selectedMeal].당류}</Text>
            </View>
            <View style={{ ...styles.PersonalRegions, marginLeft: '10%' }}>
              <Text style={{ fontSize: 13 }}>- 식이섬유</Text>
              <Text style={{ fontSize: 13 }}>{mealData[selectedMeal].식이섬유}</Text>
            </View>
          </View>

          <View style={{
            //backgroundColor: 'red',
            //width: '30%'
          }}>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>단백질</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].단백질}</Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>지방</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].지방}</Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>나트륨</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].나트륨}</Text>
            </View>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>콜레스테롤</Text>
              <Text style={styles.kcal}>{mealData[selectedMeal].콜레스테롤}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.chatbotButton} onPress={toggleModal}>
        <Image source={require('../icons/ChatBotIcon.png')} style={styles.chatbotIcon} />
      </TouchableOpacity>

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
    //backgroundColor: 'pink',
    padding: '5%',
    paddingTop: '-5%',
  },
  // 날짜 표시 영역
  dateText: {
    fontSize: 20,
    //padding: '1%',
    marginTop: '1%',
    //backgroundColor: 'yellow',
    //alignSelf: 'center',
    textAlign: 'center',
  },

  // 식단평가 영역
  testbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '1%',
    backgroundColor: 'lightgreen',
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
    //height: 250,
    marginVertical: '3%',
    borderRadius: 20,
  },

  //통계부분 글 영역
  contentstext: {
    width: '50%',
  },

  //글 안의 영양소 별 줄 맞추기
  PersonalRegions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'column', // 이 부분을 'column'으로 변경
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
    width: '20%', // 원하는 크기로 조정
    height: '20%', // 원하는 크기로 조정
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
    //marginTop: 20,
  },
  selectPhotoButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  

});

export default DailyScreen;