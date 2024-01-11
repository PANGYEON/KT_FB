// 리포트페이지 - 네비게이션 관련
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; //상단네비
// 페이지 두개 불러오기
import MonthScreen from './MonthScreen';
import DailyScreen from './DailyScreen';

// 상단 탭 네비게이션
const TopTab = createMaterialTopTabNavigator();

const ReportScreen = () => {
  // 디바이스의 화면 크기를 통해 탭바 조정
  const dimensions = useWindowDimensions();

  // 탭을 선택하면 해당 탭으로 이동
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
                borderRadiusStyle
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
    // 탭을 눌렀을 때 해당 탭관련 페이지로 이동
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
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: '3%',
    elevation: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1%',
    height: '90%',
  },
});

export default ReportScreen;