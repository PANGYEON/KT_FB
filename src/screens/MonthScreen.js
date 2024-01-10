
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getMonthData = (month, year) => {
  const firstDay = new Date(year, month - 1, 1);
  const startingDay = firstDay.getDay();
  const totalDays = daysInMonth(month, year);
  let day = 1;
  let dateData = [];

  for (let i = 0; i < 6; i++) {
    let week = [];
    for (let j = 0; j < 7; j++) {

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

const getMonthName = (month) => {
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return monthNames[month - 1];
};

const MonthScreen = () => {
  const today = new Date();
  
  const [selectedDates, setSelectedDates] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [mealData, setMealData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        let response = await axios.get('http://edm-diet.japaneast.cloudapp.azure.com/user_meal/get_meal/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        let meals = response.data.user_meals_evaluation;
        let formattedMeals = {};
        meals.forEach(meal => {
          // sum_carb와 sum_protein도 저장
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
  }, []);
  const monthData = getMonthData(currentMonth, currentYear);
  const monthName = getMonthName(currentMonth);

  // 화면 포커스가 변경될 때마다 현재 달과 연도를 업데이트
  useFocusEffect(
    React.useCallback(() => {
      const date = new Date();
      setCurrentMonth(date.getMonth() + 1);
      setCurrentYear(date.getFullYear());
    }, [])
  );

  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  
  

  const renderCalendar = () => {
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const monthArray = getMonthData(currentMonth, currentYear);
  
    return (
      <View>
        <View style={styles.weekDays}>
          {weekDays.map((day, index) => (
            <Text key={index} style={[styles.dayLabel, day === '토' ? styles.saturday : (day === '일' ? styles.sunday : null)]}>{day}</Text>
          ))}
        </View>
  
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

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[styles.dayContainer]}
                  disabled={!isCurrentMonth}
                >
                  <View style={[isToday ? styles.today : null]}>
                    <Text style={[
                      styles.dayText,
                      isToday ? styles.todayText : null,
                      // 다른 조건부 스타일이 필요하다면 여기에 추가
                    ]}>
                      {day}
                    </Text>
                  </View>
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
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.arrowButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{currentYear}년 {monthName}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.arrowButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
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
    //backgroundColor: 'lightblue',
  },

  // 년도와 월표시부분 스타일 조정
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    paddingHorizontal: '2%',
    //backgroundColor: 'red',
  },

  // 년도와 월의 글자스타일 조정
  headerText: {
    fontSize: 7 * FontScale,
    fontWeight: '900',
    //backgroundColor: 'yellow',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //width: calWidth,
    //height: calHeight,
    //marginBottom: 10,
    //backgroundColor: '#333',
  },

  // 요일텍스트스타일
  dayLabel: {
    fontSize: 5 * FontScale,
    fontWeight: 'bold',
    //width: calWidth,
    //backgroundColor: 'yellow',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginBottom: 10,
    //backgroundColor: 'lightgreen',
  },
  dayContainer: {
    //width: 40,
    //height: 70,
    width: calWidth,
    height: calHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderRadius: 20,
    //borderWidth : 1,
  },
  dayText: {
    fontSize: 4 * FontScale,
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
    // color: 'white', // 텍스트 색상을 흰색으로 변경 (오늘 날짜에만 적용되도록 이 부분을 수정)
  },
  todayText: {
    color: 'white', // 오늘 날짜의 텍스트 색상을 흰색으로 설정 (기존에 있던 스타일에서 이 부분을 분리)
  },
});


export default MonthScreen;