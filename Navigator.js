
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import LoginScreen from './src/screens/AuthScreens/LoginScreen';
import RegisterScreen from './src/screens/AuthScreens/RegisterScreen';
import RegisterInfoScreen from './src/screens/AuthScreens/RegisterInfoScreen';
import ActivityLevelScreen from './src/screens/AuthScreens/ActivityLevelScreen';
import DietGoalScreen from './src/screens/AuthScreens/DietGoalScreen';
import PwSearchScreen from './src/screens/AuthScreens/PwSearchScreen';


import ProfileScreen from './src/screens/ProfileScreen';


import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();



const MyStack = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />

          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DietGoal" component={DietGoalScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PwSearch" component={PwSearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};
export default MyStack;