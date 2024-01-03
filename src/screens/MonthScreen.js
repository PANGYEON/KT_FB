// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text } from 'react-native';
// import Swiper from 'react-native-swiper';
// import { Calendar } from 'react-native-calendars';

// const MonthScreen = () => {
//   const [monthsToRender, setMonthsToRender] = useState([
//     '2023-11-01',
//     '2023-12-01',
//     '2024-01-01',
//     '2024-02-01',
//   ]);
//   const [currentMonth, setCurrentMonth] = useState('');
//   const swiperRef = useRef(null);

//   const initializeCurrentMonth = () => {
//     const today = new Date();
//     const currentDateString = today.toISOString().split('T')[0];
//     const currentYearMonth = currentDateString.substring(0, 7);

//     const foundIndex = monthsToRender.findIndex(month => month.startsWith(currentYearMonth));
//     if (foundIndex !== -1) {
//       setCurrentMonth(monthsToRender[foundIndex]);
//       if (swiperRef.current) {
//         setTimeout(() => swiperRef.current.scrollTo(foundIndex, false), 0);
//       }
//     } else {
//       // 현재 달을 배열에 추가하는 로직
//       const newMonths = [...monthsToRender, currentYearMonth];
//       setMonthsToRender(newMonths);
//       setCurrentMonth(currentYearMonth);
//     }
//   };

//   useEffect(() => {
//     initializeCurrentMonth();
//   }, []);

//   const handleIndexChanged = (index) => {
//     setCurrentMonth(monthsToRender[index]);
//     if (index === monthsToRender.length - 1) {
//       const lastMonth = monthsToRender[monthsToRender.length - 1];
//       const nextMonth = new Date(lastMonth);
//       nextMonth.setMonth(nextMonth.getMonth() + 1);
//       const nextMonthString = nextMonth.toISOString().split('T')[0].substring(0, 7);
//       const newMonths = [...monthsToRender, nextMonthString];
//       setMonthsToRender(newMonths);
//     }
//   };

//   const customHeader = () => {
//     return (
//       <View style={{ alignItems: 'center', height: 80 }}>
//         <Text style={{ fontSize: 34, paddingTop: 30 }}>
//           {currentMonth.split('-')[0]} {currentMonth.split('-')[1]}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <Swiper
//       ref={swiperRef}
//       index={monthsToRender.indexOf(currentMonth)}
//       loop={false}
//       showsPagination={false}
//       onIndexChanged={handleIndexChanged}
//       horizontalScroll={true}
//     >
//       {monthsToRender.map((month, index) => (
//         <View key={index}>
//           <Calendar
//             current={month}
//             hideArrows={true}
//             renderHeader={customHeader}
//             // 다른 Calendar 속성 추가
//           />
//         </View>
//       ))}
//     </Swiper>
//   );
// };

// export default MonthScreen;
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
 
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
        week.push('');
      } else {
        week.push(day);
        day++;
      }
    }
    dateData.push(week);
    if (day > totalDays) {
      break;
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
 
const getDayName = (day) => {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return dayNames[day];
};
 
const MonthScreen = () => {
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  // const currentMonth = today.getMonth() + 1;
  // const currentYear = today.getFullYear();
  // const currentDate = today.getDate();
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
        {/* {monthArray.map((week, index) => (
          <View key={index} style={styles.weekContainer}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.dayContainer,
                  {
                    backgroundColor:
                      selectedDate === `${currentYear}-${currentMonth}-${day}`
                        ? 'skyblue'
                        : today.getFullYear() === currentYear &&
                          today.getMonth() + 1 === currentMonth &&
                          today.getDate() === day
                        ? 'blue'
                        : 'transparent',
                  },
                ]}
                onPress={() => handleDayPress(currentYear, currentMonth, day)}
                disabled={day === ''}
              >
                <Text style={[
                  styles.dayText,
                  {
                    color:
                      today.getFullYear() === currentYear &&
                      today.getMonth() + 1 === currentMonth &&
                      today.getDate() === day
                        ? 'white'
                        : 'black',
                  },
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))} */}
 
        {monthArray.map((week, index) => (
          <View key={index} style={styles.weekContainer}>
            {week.map((day, dayIndex) => {
              const dateString = `${currentYear}-${currentMonth}-${day}`;
              const isSelected = selectedDates.includes(dateString);
              const isToday = today.getFullYear() === currentYear &&
                            today.getMonth() + 1 === currentMonth &&
                            today.getDate() === day;
 
              const backgroundColor = isSelected ? 'skyblue' : (isToday ? 'blue' : 'transparent');
             
              const dayOfWeek = getDayName(new Date(currentYear, currentMonth - 1, day).getDay());
 
              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayContainer,
                    {
                      backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'white', // 투명한 부분을 red로 변경
                    },
                  ]}
                  onPress={() => handleDayPress(currentYear, currentMonth, day)}
                  disabled={day === ''}
                >
                  <Text style={[
                    styles.dayText,
                    {
                      color: isSelected || isToday ? 'white' : 'black',
                    },
                    dayOfWeek === '토' ? styles.saturday : (dayOfWeek === '일' ? styles.sunday : null),
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };
 
  const handleDayPress = (year, month, day) => {
    // const newSelectedDate = `${year}-${month}-${day}`;
    // // setSelectedDate(`${year}-${month}-${day}`);
 
    // // 이미 선택한 날짜인지 확인 후, 선택한 날짜 배열에 추가
    // if (!selectedDates.includes(newSelectedDate)) {
    //   const updatedSelectedDates = [...selectedDates, newSelectedDate];
    //   setSelectedDates(updatedSelectedDates);
    // }
 
    const selectedDateString = `${year}-${month}-${day}`;
    const isSelected = selectedDates.includes(selectedDateString);
 
    let updatedSelectedDates = [...selectedDates];
 
    if (isSelected) {
      // 선택한 날짜를 다시 누르면 배경색 제거
      updatedSelectedDates = updatedSelectedDates.filter(date => date !== selectedDateString);
    } else {
      // 새로운 날짜를 선택하면 선택한 날짜 배열에 추가
      updatedSelectedDates.push(selectedDateString);
    }
 
    setSelectedDates(updatedSelectedDates);
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
 
const calWidth = windowWidth*0.12;
const calHeight = windowHeight*0.09;
const FontScale = Math.min(windowWidth, windowHeight) / 100;
 
const styles = StyleSheet.create({
  // 캘린더화면의 내비게이션아래 전체화면 스타일조정
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: '5%',
    paddingHorizontal: '2%',
    backgroundColor: 'lightblue',
  },
 
  // 년도와 월표시부분 스타일 조정
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    paddingHorizontal: '2%',
    backgroundColor: 'red',
  },
 
  // 년도와 월의 글자스타일 조정
  headerText: {
    fontSize: 7 * FontScale,
    fontWeight: '900',
    backgroundColor: 'yellow',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //width: calWidth,
    //height: calHeight,
    //marginBottom: 10,
    backgroundColor: '#333',
  },
 
  // 요일텍스트스타일
  dayLabel: {
    fontSize: 5 * FontScale,
    fontWeight: 'bold',
    //width: calWidth,
    backgroundColor: 'yellow',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginBottom: 10,
    backgroundColor: 'lightgreen',
  },
  dayContainer: {
    //width: 40,
    //height: 70,
    width: calWidth,
    height: calHeight,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // borderRadius: 20,
    borderWidth : 1,
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
});
 
 
export default MonthScreen;