// 리포트페이지 - 캘린터화면
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기

// 휴대폰화면 너비와 높이에 따른 화면크기 조정
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// 월과 년도를 받아서 해당 년도의 월의 총 일수를 반환(마지막 날짜를 찾기 위함)
const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

// 주어진 년도와 월의 캘린더 데이터 생성 함수
const getMonthData = (month, year) => {
  const firstDay = new Date(year, month - 1, 1); // 첫번째 날짜
  const startingDay = firstDay.getDay(); // 첫번째 날짜의 요일
  const totalDays = daysInMonth(month, year); // 총일수
  let day = 1; // 날짜변수 초기화
  let dateData = []; // 캘린더데이터 초기화

  for (let i = 0; i < 6; i++) { // 한달간의 주의 수 (6주)
    let week = [];
    for (let j = 0; j < 7; j++) { // 한주의 일수(7일)

      if ((i === 0 && j < startingDay) || day > totalDays) {
        // 이전 달의 날짜인지, 현재 달의 날짜인지, 다음 달의 날짜인지 확인하여 다른 값을 넣어줌
        week.push('')
      } else {
        // 현재 달의 날짜
        week.push(day);
        day++;
      }
    }
    dateData.push(week);
    if (day > totalDays) {
      break
    }
  }

  return dateData;
};

// 월의 이름 설정 (1월 ~ 12월이라 설정)
const getMonthName = (month) => {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return monthNames[month - 1];
};


const MonthScreen = () => {
  // 변수설정
  const today = new Date(); // 현재 날짜
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 현재 월 정보
  const [currentYear, setCurrentYear] = useState(today.getFullYear()); // 현재 년도 정보
  const [mealData, setMealData] = useState({}); // 식단 결과 데이터

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('@user_token');
          const response = await axios.get('http://edm-diet.japaneast.cloudapp.azure.com/user_meal/get_meal/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const meals = response.data.user_meals_evaluation;
          const formattedMeals = {};
          meals.forEach(meal => {
            formattedMeals[meal.meal_date] = {
              evaluation: meal.meal_evaluation,
              sumCarb: meal.sum_carb,
              sumProtein: meal.sum_protein
            };
          });
          setMealData(formattedMeals);
        } catch (error) {
          console.error('Error fetching meal data:', error);
        }
      };
      fetchData();
    }, [])
  );

  const monthName = getMonthName(currentMonth);

  // 화면 포커스가 변경될 때마다 현재 달과 연도를 업데이트
  useFocusEffect(
    React.useCallback(() => {
      const date = new Date();
      setCurrentMonth(date.getMonth() + 1);
      setCurrentYear(date.getFullYear());
    }, [])
  );

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 
  const renderCalendar = () => {
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const monthArray = getMonthData(currentMonth, currentYear); // 현재월의 날짜 배열

    return (
      <View>
        <View style={styles.weekDays}>
          {/* 각 요일을 순회하며 text component 표시 */}
          {weekDays.map((day, index) => (
            <Text key={index} style={[styles.dayLabel, day === '토' ? styles.saturday : (day === '일' ? styles.sunday : null)]}>{day}</Text>
          ))}
        </View>

        {/* 주차별로 캘린더의 날짜를 렌더링 */}
        {monthArray.map((week, index) => (
          <View key={index} style={styles.weekContainer}>
            {week.map((day, dayIndex) => {
              const isCurrentMonth = day > 0;
              const dateString = isCurrentMonth ? `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
              const isToday = today.getFullYear() === currentYear &&
                today.getMonth() + 1 === currentMonth &&
                today.getDate() === day;

              const mealEvaluation = mealData[dateString];
              const mealInfo = mealData[dateString];

              const getBackgroundColor = () => {
                switch (mealInfo.evaluation) {
                  case 'Bad':
                    return '#FA6565';
                  case 'Not Bad':
                    return '#FA9B65';
                  case 'Good':
                    return '#EEE064';
                  case 'Very Good':
                    return '#96CCF3';
                  case 'Perfect':
                    return '#2FFF9B';
                  default:
                    return 'lightgray';
                }
              };

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[styles.dayContainer]}
                  disabled={!isCurrentMonth}
                >
                  {/* 오늘날짜에 대한 스타일 조정 */}
                  <View style={[isToday ? styles.today : null]}>
                    <Text style={[
                      styles.dayText,
                      isToday ? styles.todayText : null,
                    ]}>
                      {day}
                    </Text>
                  </View>
                  {/* 각 날짜에 대한 식단 결과를 표시 */}
                  {isCurrentMonth && mealInfo && mealInfo.sumCarb !== 0 && mealInfo.sumProtein !== 0 && (
                    <View style={{ backgroundColor: getBackgroundColor(), borderRadius: 20, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: '900' }}>{mealInfo.evaluation}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* 이전버튼 */}
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrowButton}>{'<'}</Text>
        </TouchableOpacity>
        {/* 년과 월 표시 */}
        <Text style={styles.headerText}>{currentYear}년 {monthName}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          {/* 다음 버튼 */}
          <Text style={styles.arrowButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      {/* 캘린더 렌더링 */}
      {renderCalendar()}
    </View>
  );
};

const calWidth = windowWidth * 0.12;
const calHeight = windowHeight * 0.09;
const FontScale = Math.min(windowWidth, windowHeight) / 100;

const styles = StyleSheet.create({
  // 캘린더화면의 내비게이션아래 전체화면 스타일조정
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: '5%',
    paddingHorizontal: '2%',
  },

  // 년도와 월표시부분 스타일 조정
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    paddingHorizontal: '2%',
  },

  // 년도와 월의 글자스타일 조정
  headerText: {
    fontSize: 7 * FontScale,
    fontWeight: '900',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  // 요일텍스트스타일
  dayLabel: {
    fontSize: 5 * FontScale,
    fontWeight: 'bold',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayContainer: {
    width: calWidth,
    height: calHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  arrowButton: {
    fontSize: 7 * FontScale,
    fontWeight: '900',
  },
  sunday: {
    color: '#D56968', // 일요일 텍스트 색상을 빨간색으로 설정
  },
  saturday: {
    color: '#6488E4', // 토요일 텍스트 색상을 파란색으로 설정
  },
  today: {
    backgroundColor: '#D7D4FF', // 배경색을 #D7D4FF로 변경
    borderRadius: 30 / 2, // 원형 모양 유지
    width: 30, // 원의 너비 유지
    height: 30, // 원의 높이 유지
    alignItems: 'center', // 가로 방향으로 중앙 정렬
    justifyContent: 'center', // 세로 방향으로 중앙 정렬
  },
  dayText: {
    fontSize: 5 * FontScale,
  },
  todayText: {
    color: 'white', // 오늘 날짜의 텍스트 색상을 흰색으로 설정
  },
});


export default MonthScreen;