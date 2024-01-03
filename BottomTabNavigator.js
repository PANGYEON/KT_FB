import React,{useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import ReportScreen from './src/screens/ReportScreen';
import ChatScreen from './src/screens/ChatScreen';
 
import HomeIcon from './src/icons/HomeIcon.png';
import ReportIcon from './src/icons/ReportIcon.png';
import BoardIcon from './src/icons/BoardIcon.png';
import ChatIcon from './src/icons/ChatIcon.png';
import { Image, Text,Dimensions,View, StyleSheet,BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const FontScale = Math.min(width, height) / 100;
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const navigation = useNavigation();
  useEffect(() => {
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
        name="채팅"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (<Image source={ChatIcon} style={styles.tabIcon} />),
          tabBarLabel: ({ focused }) => (
            <View style={[styles.tabBarLabel, focused && styles.focusedTab]}>
              <Text style={{ color: focused ? 'black' : 'gray', fontSize: FontScale * 4}}>채팅</Text>
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