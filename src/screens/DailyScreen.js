import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'native-base';
import ChatBotScreen from './ChatBotScreen';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart'

const DailyScreen = () => {
  const navigation = useNavigation();
  const [selectedMeal, setSelectedMeal] = useState('아침');
  const [isModalVisible, setModalVisible] = useState(false);
  const tempImageUrl = 'https://via.placeholder.com/150';
  const screenWidth = Dimensions.get("window").width;
  // 각 식사 시간별 식사 정보
  const mealData = {
    아침: {
      menu: '된장찌개',
      칼로리: '604kcal',
      탄수화물: '150g',
      당류: '50g',
      식이섬유: '10g',
      단백질: '150g',
      지방: '150g',
      나트륨: '50mg',
      콜레스테롤: '50mg',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: tempImageUrl, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    점심: {
      // //점심 식사에 대한 정보
      // menu: '된장찌개',
      // 칼로리: '604kcal',
      // 탄수화물: '150g',
      // 당류: '50g',
      // 식이섬유: '10g',
      // 단백질: '150g',
      // 지방: '150g',
      // 나트륨: '50mg',
      // 콜레스테롤: '50mg',
      // //... 아침 식사에 대한 다른 영양소나 식사 정보
      //image: tempImageUrl, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    저녁: {
      // 저녁 식사에 대한 정보
      menu: '된장찌개',
      칼로리: '604kcal',
      탄수화물: '150g',
      당류: '50g',
      식이섬유: '10g',
      단백질: '150g',
      지방: '150g',
      나트륨: '50mg',
      콜레스테롤: '50mg',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: tempImageUrl, // 실제 아침 식사 이미지 URL로 변경하세요
    },
    간식: {
      // 간식 식사에 대한 정보
      menu: '된장찌개',
      칼로리: '604kcal',
      탄수화물: '150g',
      당류: '50g',
      식이섬유: '10g',
      단백질: '150g',
      지방: '150g',
      나트륨: '50mg',
      콜레스테롤: '50mg',
      //... 아침 식사에 대한 다른 영양소나 식사 정보
      image: tempImageUrl, // 실제 아침 식사 이미지 URL로 변경하세요
    },
  };
 
 
  const meals = ['아침', '점심', '저녁', '간식'];
 
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
  const totalSugar = calculateTotalNutrient('당류');

  const total_nutr = [
  { name: '탄수화물', population: 50, color: '#D7D4FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: '단백질', population: 100, color: '#C1BEEF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: '지방', population: 60, color: '#EBE9FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: '당류', population: 70, color: '#817bd1', legendFontColor: '#7F7F7F', legendFontSize: 15 }
  ];
 
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
  };
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
      return { text: 'Good', color: 'lightblue' };
    } else {
      return { text: 'Bad', color: 'red' };
    }
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
      <Text style={styles.dateText}>{renderDate()}</Text>
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
          <View style={{...styles.PersonalRegions, marginBottom: '5%'}}>
            <Text style={{fontSize: 16, color: 'black',}}>섭취 칼로리</Text>
            <Text style={{fontSize: 16, color: 'black',}}>604kcal</Text>
          </View>
          <View style={{marginBottom: '5%'}}>
            <View style={styles.PersonalRegions}>
              <Text style={styles.nutrient}>탄수화물</Text>
              <Text style={styles.kcal}>{totalCarbohydrates.toFixed(1)}g</Text>
            </View>
            <View style={{...styles.PersonalRegions, marginLeft: '10%',}}>
              <Text style={{fontSize: 13}}>- 당류</Text>
              <Text style={{fontSize: 13}}>50g</Text>
            </View>
            <View style={{...styles.PersonalRegions, marginLeft: '10%'}}>
              <Text style={{fontSize: 13}}>- 식이섬유</Text>
              <Text style={{fontSize: 13}}>10g</Text>
            </View>
          </View>
         
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>단백질</Text>
            <Text style={styles.kcal}>{totalProtein.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>지방</Text>
            <Text style={styles.kcal}>{totalFat.toFixed(1)}g</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>나트륨</Text>
            <Text style={styles.kcal}>{totalSodium.toFixed(1)}mg</Text>
          </View>
          <View style={styles.PersonalRegions}>
            <Text style={styles.nutrient}>콜레스테롤</Text>
            <Text style={styles.kcal}>{totalCholesterol.toFixed(1)}mg</Text>
          </View>
        </View>

        {/* piechart */}
        {/* <View style={styles.contentsImg}>
          <PieChart 
            data = { total_nutr }
            width = { 140}
            hegith = { 140 }
            chartConfig={chartConfig}
            accessor={'population'}
            backgroundColor={'transparent'}
            />
        </View> */}

      </View>
      {/* <TouchableOpacity>
        <View style={{...styles.testbox, marginBottom: '5%'}}>
          <Text>평가하기</Text>
        </View>
      </TouchableOpacity> */}
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
                  source={require('../icons/photoIcon.png')}
                  style={styles.photoIcon}
                />
                <Text style={styles.selectPhotoButtonText}>사진 선택</Text>
            </TouchableOpacity>
          )}
 
          <View style={styles.MealMenu}>
            <View>
              <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: '20%'}}>{'< '}{selectedMeal ? `${selectedMeal} 메뉴` : ''}{' >'}</Text>
              <Text style={{}}>{mealData[selectedMeal]?.menu}</Text>
            </View>
 
            <View>
              <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: '20%'}}>{'< '}인분{' >'}</Text>
              <Text style={{}}>{mealData[selectedMeal]?.menu}</Text>
            </View>
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
            <View style={{...styles.PersonalRegions, marginLeft: '10%',}}>
              <Text style={{fontSize: 13}}>- 당류</Text>
              <Text style={{fontSize: 13}}>{mealData[selectedMeal].당류}</Text>
            </View>
            <View style={{...styles.PersonalRegions, marginLeft: '10%'}}>
              <Text style={{fontSize: 13}}>- 식이섬유</Text>
              <Text style={{fontSize: 13}}>{mealData[selectedMeal].식이섬유}</Text>
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
 
  //통계부분 piechart 영역
  contentsImg: {
    width: 150,
    height: 150,
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
});
 
export default DailyScreen;