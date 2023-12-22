import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MonthScreen from './MonthScreen';
import DailyScreen from './DailyScreen';

const TopTab = createMaterialTopTabNavigator();

const ReportScreen = () => {
  return (
    <TopTab.Navigator initialRouteName="Calendar" swipeEnabled={false}>
      <TopTab.Screen name="Calendar" component={MonthScreen} />
      <TopTab.Screen name="Daily" component={DailyScreen} />
    </TopTab.Navigator>
  );
};
export default ReportScreen;