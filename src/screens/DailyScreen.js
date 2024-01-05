
import React, { useState, useEffect, Component } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import ChatBotScreen from './ChatBotScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedMeal, setSelectedMeal] = useState('아침');
  const [isModalVisible, setModalVisible] = useState(false);
  const tempImageUrl = 'https://via.placeholder.com/150';
  // 인분 선택을 위한 state
  const [selectedPortion, setSelectedPortion] = useState('1');
  const [isPortionModalVisible, setPortionModalVisible] = useState(false); // 인분 선택 Modal 표시 여부
  const [photoUri, setPhotoUri] = useState('https://via.placeholder.com/150');
  const [menuPortions, setMenuPortions] = useState({});
  const [integerPart, setIntegerPart] = useState('0');
  const [fractionalPart, setFractionalPart] = useState('0');
  const [portions, setPortions] = useState({});
  const handleIntegerChange = (selectedValue, selectedIndex) => {
    setIntegerPart(selectedValue);
    setSelectedPortion(`${selectedValue}.${fractionalPart}`);
  };
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

  const renderSelectedMealMenu = () => {
    const mealInfo = mealData[selectedMeal];
    if (!mealInfo || !mealInfo.menu) {
      return null;
    }
  
    return (
      <View>
        {mealInfo.menu.map((item, index) => (
          <Text key={index} style={styles.mealMenu}>{item}</Text>
        ))}
      </View>
    );
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
    fetchMealData(day.dateString); // 선택된 날짜에 대한 식사 데이터 요청
  };
  const handleFractionalChange = (selectedValue, selectedIndex) => {
    setFractionalPart(selectedValue);
    setSelectedPortion(`${integerPart}.${selectedValue}`);
  };

  // 인분 선택 시 Modal을 토글하는 함수
  const togglePortionModal = () => {
    // 여기에 Modal 표시 및 숨김을 위한 로직 작성
    setPortionModalVisible(!isPortionModalVisible);
  };

  const fetchMealData = async (date) => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      const response = await axios.get(`http://edm-diet.japaneast.cloudapp.azure.com/Meal_Date/api/Meal/?meal_date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // 여기에서 응답 데이터를 처리합니다.
      console.log(response.data); // 데이터 로깅
      setMealNutrients(response.data); 
      // setMealData(response.data); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching meal data:', error);
    }
  };
  // useEffect(() => {
  //   console.log('Received params:', route.params);
  //   if (route.params?.selectedMeal && route.params?.photoUri) {
  //     setSelectedMeal(route.params.selectedMeal);
  //     setPhotoUri(route.params.photoUri);
  //     const updatedMealData = { ...mealData };
  //     updatedMealData[route.params.selectedMeal].image = route.params.photoUri;

  //     setMealData(updatedMealData); // 업데이트된 mealData 상태 설정
  //     // 여기에서 필요한 처리를 수행합니다.
  //   }
  // }, [route.params]);
  useEffect(() => {
    // 컴포넌트 마운트 시 현재 날짜의 식사 데이터 가져오기
    const todayDate = getCurrentDate();
    setSelectedDate(todayDate);
    fetchMealData(todayDate);
    if (route.params?.selectedMeal) {
      setSelectedMeal(route.params.selectedMeal);
    }
  }, [route.params]);
  useEffect(() => {
    if (route.params?.selectedMeal && route.params?.photoUri && route.params?.checkedFoodList) {
      // 초기 메뉴 인분 수 설정 (기본값: '1.0')
      const initialPortions = {};
      route.params.checkedFoodList.forEach(menu => {
        initialPortions[menu] = '1.0';
      });
      setMenuPortions(initialPortions);
      setPortions(initialPortions);
      console.log(route.params.checkedFoodList)
      const updatedMealInfo = {
        ...mealData[route.params.selectedMeal],
        image: route.params.photoUri,
        menu: route.params.checkedFoodList // 배열을 문자열로 변환
      };

      // 전체 mealData를 업데이트
      setMealData(prevMealData => ({
        ...prevMealData,
        [route.params.selectedMeal]: updatedMealInfo
      }));
    }
  }, [route.params]);
  // 각 식사 시간별 식사 정보
  const [mealData, setMealData] = useState({
    아침: {
      menu: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: photoUri, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    점심: {
      // //점심 식사에 대한 정보
      menu: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      // //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: photoUri, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    저녁: {
      // 저녁 식사에 대한 정보
      menu: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: photoUri, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    간식: {
      // 간식 식사에 대한 정보
      menu: '',
      칼로리: '',
      탄수화물: '',
      당류: '',
      식이섬유: '',
      단백질: '',
      지방: '',
      나트륨: '',
      콜레스테롤: '',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: photoUri, // 실제 아침 식사 이미지 URL로 변경하세요
    },
  });
  // 각 메뉴의 인분 수 변경 핸들러
  const handleMenuPortionChange = (menu, selectedValue) => {
    setMenuPortions(prev => ({
      ...prev,
      [menu]: selectedValue
    }));
  };

  const meals = ['아침', '점심', '저녁', '간식'];
  const integerPartDataSource = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const fractionalPartDataSource = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const renderMenuPortionControl = () => {
    return Object.entries(menuPortions).map(([menu, portion], index) => {
      const [integerPart, fractionalPart] = portion.split('.');
  
      return (
        <View key={index} style={styles.menuItemContainer}>
          <Text style={styles.menuText}>{menu}</Text>
          <View style={styles.portionPickerContainer}>
            <ScrollPicker
              dataSource={integerPartDataSource}
              selectedIndex={parseInt(integerPart)}
              onValueChange={(value) => handleMenuPortionChange(menu, `${value}.${fractionalPart}`)}
              wrapperHeight={180}
              itemHeight={40}
              highlightColor="#d8d8d8"
              highlightBorderWidth={2}
            />
            <Text style={styles.dot}>.</Text>
            <ScrollPicker
              dataSource={fractionalPartDataSource}
              selectedIndex={parseInt(fractionalPart)}
              onValueChange={(value) => handleMenuPortionChange(menu, `${integerPart}.${value}`)}
              wrapperHeight={180}
              itemHeight={40}
              highlightColor="#d8d8d8"
              highlightBorderWidth={2}
            />
          </View>
        </View>
      );
    });
  };



  // 총 영양소 합계 계산 함수
  const calculateTotalNutrient = (nutrientKey) => {
    return Object.values(mealData).reduce((acc, meal) => {
      if (meal && meal[nutrientKey]) {
        const nutrientValue = parseFloat(meal[nutrientKey].replace(/[^\d.-]/g, '')) || 0;
        return acc + nutrientValue;
      }
      return acc;
    }, 0);
  };
 
  // 각 영양소 총 합 계산
  const totalCarbohydrates = calculateTotalNutrient('탄수화물');
  const totalProtein = calculateTotalNutrient('단백질');
  const totalFat = calculateTotalNutrient('지방');
  const totalSodium = calculateTotalNutrient('나트륨');
  const totalCholesterol = calculateTotalNutrient('콜레스테롤');
 
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
 
  ///////////////////////////////////////////(test)
  const evaluateCarbohydrates = (value) => {
    if (value >= 600 && value <= 700) {
      return { text: 'Perfect', color: 'lightgreen' };
    } else if (value >= 400 && value <= 500) {
      return { text: mealNutrients.diet_rating, color: 'lightblue' };
    } else {
      return { text: 'Bad', color: 'red' };
    }
  };

  const renderFoodNames = () => {
    return (
      <View style={styles.foodListContainer}>
        {route.params?.checkedFoodList.map((foodName, index) => (
          <Text key={index} style={styles.foodItemText}>{foodName}</Text>
        ))}
      </View>
    );
  };


  // 탄수화물 값 평가 결과 가져오기
  const carbohydratesEvaluation = evaluateCarbohydrates(totalCarbohydrates);
  //////////////////////////////////////////////////////////////////////////////////
 
 
  // navigation.navigate('MonthScreen', {
  //   carbohydratesText: carbohydratesEvaluation.text,
  //   carbohydratesColor: carbohydratesEvaluation.color,
  // });
 
 
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
        <View
          style={styles.modalContainer}
        >
          <View
            style={styles.modalContent}
          >
            <Calendar
              onDayPress={(day) => handleDateSelect(day)}
              // 필요에 따라 캘린더의 외관과 기능을 커스터마이징할 수 있습니다
            />
          </View>
        </View>
      </Modal>
      {/* <View style={styles.testbox}>
        <Text style={styles.perfectText}>{carbohydratesEvaluation}</Text>
      </View> */}
      {/* // perfectText에 결과 할당 및 testbox 스타일 설정(test) */}
      <View style={[styles.testbox, { backgroundColor: carbohydratesEvaluation.color }]}>
        <Text style={styles.perfectText}>{carbohydratesEvaluation.text}</Text>
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
        <View style={styles.contentsImg}>
          <Text>이미지부분</Text>
        </View>
      </View>

      <View style={styles.mealsContainer}>
        {meals.map((meal) => (
          <Button key={meal} onPress={() => setSelectedMeal(meal)} style={getButtonStyle(meal)} borderTopRadius={20} borderBottomRadius={20}>
            <Text style={getButtonTextStyle(meal)}>{meal}</Text>
          </Button>
        ))}
      </View>
      <View style={styles.selectedMealContainer}>
        <View style={styles.selectedMealInfo_1}>
          {mealData[selectedMeal]?.image ? (
            <Image
              source={{ uri: mealData[selectedMeal].image }}
              style={styles.MealImg}
            />
          ) : (
            <TouchableOpacity style={styles.selectPhotoButton}>
              <Image
                source={require('../icons/A.png')}
                style={styles.photoIcon}
              />
              <Text style={styles.selectPhotoButtonText}>사진 선택</Text>
            </TouchableOpacity>
          )}
 
          <View style={styles.MealMenu}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: '20%' }}>{'< '}{selectedMeal ? `${selectedMeal} 메뉴` : ''}{' >'}</Text>
            <View style={styles.TodayIs}>
              {/* <Text style={{}}>{mealData[selectedMeal]?.menu}</Text> */}
              {renderSelectedMealMenu()}
              {/* <View style={styles.Size}>
                <TouchableOpacity onPress={() => setPortionModalVisible(true)}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: '20%' }}>
                    {selectedPortion}인분
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
 
            <Modal
    animationType="slide"
    transparent={true}
    visible={isPortionModalVisible}
    onRequestClose={() => setPortionModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.numbermodalContent}>
        {renderMenuPortionControl()}
        <Button onPress={() => setPortionModalVisible(false)} style={styles.confirmButton}>
          <Text>확인</Text>
        </Button>
      </View>
    </View>
  </Modal>
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
  mealTitle: {
    // 식사 시간 제목 스타일
    fontSize: 18,
    fontWeight: 'bold',
    // 추가 스타일링
  },
  mealMenu: {
    // 식사 메뉴 스타일
    fontSize: 16,
    color: 'black',
    // 추가 스타일링
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
    //textAlign: 'center',
    alignSelf: 'center',
    //color: 'white',
    //padding: '1%',
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
    //height: '100%',
    //backgroundColor: 'white',
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
    //marginLeft: 10,
    //marginRight: 10,
    borderRadius: 20,
  },
 
  // 식사시간대별 메뉴표시 영역
  selectedMealContainer: {
    paddingVertical: '5%',
    paddingRight: '5%',
    //backgroundColor: 'lightblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
 
  selectedMealInfo_1: {
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //backgroundColor: 'white',
  },
 
  MealImg: {
    //backgroundColor: 'blue',
    width: 170,
    height: 150,
    //borderWidth: 2,
    //borderColor: 'black',
    //marginBottom: 20,
  },
  MealMenu: {
    marginLeft: '10%',
  },
 
  TodayIs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
 
  Size: {
    flexDirection: 'row',
  },
 
  selectedMealInfo_2: {
    //backgroundColor: 'orange',
    //flexDirection: 'row',
    //marginTop: '5%',
    //justifyContent: 'space-between',
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
 
  // 인분 선택 modal 창
  numbermodalContent: {
    flex: 1,
    minWidth: '80%',
    maxHeight: '30%',
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  foodListContainer: {
    // 음식 목록 컨테이너 스타일
    alignItems: 'flex-start', // 왼쪽 정렬
    // 추가 스타일링
  },
  foodItemText: {
    // 각 음식 항목 텍스트 스타일
    fontSize: 16,
    color: 'black',
    // 추가 스타일링
  },
  // image: {
 
  // }
 
  // noImageContainer: {
  //   width: 150,
  //   height: 150,
  //   backgroundColor: '#D7D4FF',
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
 
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
  
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  menuText: {
    fontSize: 16,
    color: 'black'
  },
  portionPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    fontSize: 24,
    marginHorizontal: 10
  },
  confirmButton: {
    width: 100,
    justifyContent: 'center',
    marginTop: 20
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
export default DailyScreen;