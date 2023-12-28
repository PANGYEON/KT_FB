import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MonthScreen from './MonthScreen';
import DailyScreen from './DailyScreen';

const Tab = createMaterialTopTabNavigator();

const ReportScreen = () => {
  const screenOptions = {
    tabBarOptions: {
      swipeEnabled: false,// 기존의 tabBarOptions 설정을 여기로 이동
      labelStyle: { fontSize: 16 },
      // 다른 tabBarOptions 설정 추가 가능
    },
    swipeEnabled: false, // 다른 screenOptions 설정 추가 가능
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Calendar" component={MonthScreen} />
      <Tab.Screen name="Daily" component={DailyScreen} />
    </Tab.Navigator>
  );
};

export default ReportScreen;