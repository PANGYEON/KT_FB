
import * as React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { SubscriptionProvider } from './SubscriptionContext';

//Auth 페이지
import LoginScreen from './src/screens/AuthScreens/LoginScreen';
import RegisterScreen from './src/screens/AuthScreens/RegisterScreen';
import RegisterInfoScreen from './src/screens/AuthScreens/RegisterInfoScreen';
import ActivityLevelScreen from './src/screens/AuthScreens/ActivityLevelScreen';
import DietGoalScreen from './src/screens/AuthScreens/DietGoalScreen';
import PwSearchScreen from './src/screens/AuthScreens/PwSearchScreen';
import PrivacyScreen from './src/screens/AuthScreens/PrivacyScreen';

// 프로필
import ProfileScreen from './src/screens/ProfileScreen';

// 1:1 문의
import QuestionScreen from './src/screens/QuestionScreen';

// 앱 시작할때 나오는 페이지
import SplashScreen from './src/screens/SplashScreen';

// 이미지 입력하는
import ImageInScreen from './src/screens/ImageInScreen';

// 카메라
import CameraScreen from './src/screens/CameraScreen';

// 챗봇
import ChatBotScreen from './src/screens/ChatBotScreen';

// 바텀 네비게이션
import BottomTabNavigator from './BottomTabNavigator';


const Stack = createNativeStackNavigator();

const AuthChecker = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        if (token !== null) {
          navigation.navigate('BottomTabNavigator');
        } else {
          navigation.navigate('Login');
        }
      } catch (e) {
        console.log('Error checking token', e);
      }
    };
    checkLoginStatus();
  }, []);
  return null;
};


const MyStack = () => {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => { setSplash(false) }, 3000);
  }, []);
  return (
    <NativeBaseProvider>
      {splash ? <SplashScreen /> :
        <NavigationContainer>
          <SubscriptionProvider>
            <AuthChecker />
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DietGoal" component={DietGoalScreen} options={{ headerShown: false }} />
              <Stack.Screen name="PwSearch" component={PwSearchScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Question" component={QuestionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ImageIn" component={ImageInScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </SubscriptionProvider>
        </NavigationContainer>
      }
    </NativeBaseProvider>
  );
};
export default MyStack;