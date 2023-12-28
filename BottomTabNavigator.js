import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import ReportScreen from './src/screens/ReportScreen';
import ChatScreen from './src/screens/ChatScreen';

import HomeIcon from './src/icons/HomeIcon.png';
import ReportIcon from './src/icons/ReportIcon.png';
import BoardIcon from './src/icons/BoardIcon.png';
import ChatIcon from './src/icons/ChatIcon.png';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="홈" component={HomeScreen} options={{ headerShown: false , tabBarIcon: () => (<Image source={HomeIcon} style={{ width: 25, height: 25 }} />)}}/>
      <Tab.Screen name="리포트" component={ReportScreen} options={{ headerShown: false , tabBarIcon: () => (<Image source={ReportIcon} style={{ width: 25, height: 25 }} />)}}/>
      <Tab.Screen name="게시판" component={BoardScreen} options={{ headerShown: false , tabBarIcon: () => (<Image source={BoardIcon} style={{ width: 25, height: 25 }} />)}}/>
      <Tab.Screen name="채팅" component={ChatScreen} options={{ headerShown: false , tabBarIcon: () => (<Image source={ChatIcon} style={{ width: 25, height: 25 }} />)}}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;