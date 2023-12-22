import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { Calendar } from 'react-native-calendars';

const MonthScreen = () => {
  const [monthsToRender, setMonthsToRender] = useState([
    '2023-11-01',
    '2023-12-01',
    '2024-01-01',
    '2024-02-01',
  ]);
  const [currentMonth, setCurrentMonth] = useState('');
  const swiperRef = useRef(null);

  const initializeCurrentMonth = () => {
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0];
    const currentYearMonth = currentDateString.substring(0, 7);

    const foundIndex = monthsToRender.findIndex(month => month.startsWith(currentYearMonth));
    if (foundIndex !== -1) {
      setCurrentMonth(monthsToRender[foundIndex]);
      if (swiperRef.current) {
        setTimeout(() => swiperRef.current.scrollTo(foundIndex, false), 0);
      }
    } else {
      // 현재 달을 배열에 추가하는 로직
      const newMonths = [...monthsToRender, currentYearMonth];
      setMonthsToRender(newMonths);
      setCurrentMonth(currentYearMonth);
    }
  };

  useEffect(() => {
    initializeCurrentMonth();
  }, []);

  const handleIndexChanged = (index) => {
    setCurrentMonth(monthsToRender[index]);
    if (index === monthsToRender.length - 1) {
      const lastMonth = monthsToRender[monthsToRender.length - 1];
      const nextMonth = new Date(lastMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthString = nextMonth.toISOString().split('T')[0].substring(0, 7);
      const newMonths = [...monthsToRender, nextMonthString];
      setMonthsToRender(newMonths);
    }
  };

  const customHeader = () => {
    return (
      <View style={{ alignItems: 'center', height: 80 }}>
        <Text style={{ fontSize: 34, paddingTop: 30 }}>
          {currentMonth.split('-')[0]} {currentMonth.split('-')[1]}
        </Text>
      </View>
    );
  };

  return (
    <Swiper
      ref={swiperRef}
      index={monthsToRender.indexOf(currentMonth)}
      loop={false}
      showsPagination={false}
      onIndexChanged={handleIndexChanged}
      horizontalScroll={true}
    >
      {monthsToRender.map((month, index) => (
        <View key={index}>
          <Calendar
            current={month}
            hideArrows={true}
            renderHeader={customHeader}
            // 다른 Calendar 속성 추가
          />
        </View>
      ))}
    </Swiper>
  );
};

export default MonthScreen;