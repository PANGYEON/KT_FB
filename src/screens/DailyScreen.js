import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
const DailyScreen = () => {
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
      setCurrentMonth(monthsToRender[0]);
    }
  }, []);

  const handleIndexChanged = (index) => {
    setCurrentMonth(monthsToRender[index]);
    if (index === monthsToRender.length - 1) {
      const lastMonth = monthsToRender[monthsToRender.length - 1];
      const nextMonth = new Date(lastMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const newMonths = [...monthsToRender, nextMonth.toISOString().split('T')[0]];
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
  

  const initializeCurrentMonth = () => {
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0];
    const currentYearMonth = currentDateString.substring(0, 7);

    const foundIndex = monthsToRender.findIndex(month => month.startsWith(currentYearMonth));
    if (foundIndex !== -1) {
      setCurrentMonth(monthsToRender[foundIndex]);
      // Swiper 컴포넌트의 현재 인덱스를 업데이트합니다.
      if (swiperRef.current) {
        // 타이머를 사용하여 스와이퍼가 올바르게 로드된 후에 스크롤합니다.
        setTimeout(() => swiperRef.current.scrollTo(foundIndex, false), 0);
      }
    } else {
      setCurrentMonth(monthsToRender[0]);
    }
  };

  useEffect(() => {
    initializeCurrentMonth();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      initializeCurrentMonth();
    }, [monthsToRender])
  );
  return (
    <Swiper
      ref={swiperRef}
      index={initialIndex}
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

export default DailyScreen;