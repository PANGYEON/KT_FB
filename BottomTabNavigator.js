import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import ReportScreen from './src/screens/ReportScreen';
import ChatScreen from './src/screens/ChatScreen';
import MonthScreen from './src/screens/MonthScreen';
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="홈" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="리포트" component={ReportScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="게시판" component={BoardScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="채팅" component={ChatScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;