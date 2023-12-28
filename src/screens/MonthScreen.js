import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';  

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
  const [monthsToRender, setMonthsToRender] = useState([
    '2023-11-01',
    '2023-12-01',
    '2024-01-01',
    '2024-02-01',
  ]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [initialIndex, setInitialIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    // 현재 날짜를 얻어옵니다.
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0];
    const currentYearMonth = currentDateString.substring(0, 7);

    // 현재 날짜가 있는 월의 인덱스를 찾습니다.
    const foundIndex = monthsToRender.findIndex(month => month.startsWith(currentYearMonth));
    if (foundIndex !== -1) {
      setInitialIndex(foundIndex);
      setCurrentMonth(monthsToRender[foundIndex]);
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
            <Text key={index} style={styles.dayLabel}>{day}</Text>
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

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayContainer,
                    {
                      backgroundColor: isSelected ? 'skyblue' : (isToday ? 'blue' : 'transparent'),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayContainer: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 20,
    borderWidth : 1,
  },
  dayText: {
    fontSize: 16,
  },
  arrowButton: {
    fontSize: 24,
  },
});


export default MonthScreen;