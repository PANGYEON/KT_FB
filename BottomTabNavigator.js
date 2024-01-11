import React,{useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text,Dimensions,View, StyleSheet,BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './src/screens/HomeScreen';
import HomeIcon from './src/icons/HomeIcon.png';

import ReportScreen from './src/screens/ReportScreen';
import ReportIcon from './src/icons/ReportIcon.png';

import BoardScreen from './src/screens/BoardScreen';
import BoardIcon from './src/icons/BoardIcon.png';

import ChatScreen from './src/screens/ChatScreen';
import FriendIcon from './src/icons/FriendIcon.png';


const { width, height } = Dimensions.get('window');
const FontScale = Math.min(width, height) / 100;
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  useEffect(() => {
    //뒤로가기 하면 홈으로 보내버림
    const backAction = () => {
      navigation.navigate('BottomTabNavigator', { screen: '홈' });
      return true; // 이벤트 전파 중지
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
  return (
    // 각 탭을 눌렀을 때 해당페이지로 이동
    <Tab.Navigator screenOptions={{
      tabBarStyle: styles.NaviContainer,
    }}>
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Image source={HomeIcon} style={styles.tabIcon} />),
          tabBarLabel: ({ focused }) => (
            <View style={[styles.tabBarLabel, focused && styles.focusedTab]}>
              <Text style={{ color: focused ? 'black' : 'gray', fontSize: FontScale * 4}}>홈</Text>
            </View>
          )
        }}
      />
      <Tab.Screen
        name="리포트"
        component={ReportScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Image source={ReportIcon} style={styles.tabIcon} />),
          tabBarLabel: ({ focused }) => (
            <View style={[styles.tabBarLabel, focused && styles.focusedTab]}>
              <Text style={{ color: focused ? 'black' : 'gray', fontSize: FontScale * 4}}>리포트</Text>
            </View>
          )
        }}
      />
      <Tab.Screen
        name="게시판"
        component={BoardScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Image source={BoardIcon} style={styles.tabIcon} />),
          tabBarLabel: ({ focused }) => (
            <View style={[styles.tabBarLabel, focused && styles.focusedTab]}>
              <Text style={{ color: focused ? 'black' : 'gray', fontSize: FontScale * 4}}>게시판</Text>
            </View>
          )
        }}
      />
      <Tab.Screen
        name="친구"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Image source={FriendIcon} style={styles.tabIcon} />),
          tabBarLabel: ({ focused }) => (
            <View style={[styles.tabBarLabel, focused && styles.focusedTab]}>
              <Text style={{ color: focused ? 'black' : 'gray', fontSize: FontScale * 4}}>친구</Text>
            </View>
          )
        }}
      />
    </Tab.Navigator>
  );
};
 
const styles = StyleSheet.create({
  NaviContainer: {
    height: height * 0.1,
    paddingBottom: '1%',
  },
  tabIcon: {
    width: width * 0.08,
    height: height * 0.04,
  },
  tabBarLabel: {
    borderBottomWidth: 0,
    color: 'gray',
    marginTop: '-10%',
  },
  focusedTab: {
    borderBottomWidth: 5,
    borderBottomColor: '#8E86FA',
  },
});
 
export default BottomTabNavigator;