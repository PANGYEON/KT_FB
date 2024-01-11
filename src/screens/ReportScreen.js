import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MonthScreen from './MonthScreen';
import DailyScreen from './DailyScreen';
 
const TopTab = createMaterialTopTabNavigator();
 
const ReportScreen = () => {
  const dimensions = useWindowDimensions();
 
  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View style={[styles.tabContainer, { width: dimensions.width * 0.8 }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
 
          let borderRadiusStyle = {};
          if (index === 0) { // 첫 번째 탭
            borderRadiusStyle = {
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
            };
          } else if (index === state.routes.length - 1) { // 마지막 탭
            borderRadiusStyle = {
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
            };
          }
 
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
 
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
 
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                styles.tab,
                isFocused ? { backgroundColor: '#8E86FA' } : null,
                borderRadiusStyle // 둥근 모서리 스타일을 적용합니다.
              ]}
            >
              <Text style={{
                      color: isFocused ? 'white' : 'gray',
                      fontSize: 20,
                      fontWeight: '900',
                          }}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
 
  return (
    <TopTab.Navigator
      initialRouteName="Calendar"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <TopTab.Screen name="Calendar" component={MonthScreen} />
      <TopTab.Screen name="Daily" component={DailyScreen} />
    </TopTab.Navigator>
  );
};
 
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    height: '9%',
    borderRadius: 50, // 모든 탭에 대한 기본 둥근 모서리
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: '3%',
    //borderWidth: 1,
    elevation: 10,
   
    //marginLeft: 'auto',
    //marginRight: 'auto',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //alignSelf: 'center',
    marginHorizontal: '1%',
    height: '90%',
  },
});
 
export default ReportScreen;