
import {ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { View, Text, Button, VStack, HStack } from 'native-base';

const GalleryScreen = () => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const meals = ['아침', '점심', '저녁', '간식'];

  const getButtonStyle = (meal) => ({
    width: '20%',
    backgroundColor: selectedMeal === meal ? '#D7D4FF' : 'transparent',
    borderColor: selectedMeal === meal ? '#D7D4FF' : 'transparent'
  });

  const getButtonTextStyle = (meal) => ({
    color: selectedMeal === meal ? 'white' : 'black',
    fontSize: 20,
    justifyContent: 'center'
  });

  const handleScroll = (numbers, event) => {
    const y = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(y / 40);
    setSelectedNumber(numbers[selectedIndex]);
  };

  return (
    <View flex={1}>
      <View backgroundColor="lightgreen" p={4} height={200} margin={30} marginTop={20} borderTopRadius={20} borderBottomRadius={20}>
       </View>
       <View >
         <Text style={{ fontSize: 34, paddingTop: 30 }}>시간대</Text>
       </View>
      
      <VStack space={4} alignItems="center" mt={4}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: 'lightgray', marginLeft: 10, marginRight: 10, borderRadius: 20 }}>
          {meals.map(meal => (
            <Button key={meal} onPress={() => setSelectedMeal(meal)} style={getButtonStyle(meal)}>
              <Text style={getButtonTextStyle(meal)}>{meal}</Text>
            </Button>
          ))}
        </View> */}
        {/* 숫자 선택기 */}
        {/* 수평으로 배치된 숫자 선택기 */}
        <HStack space={3} justifyContent="center">
        <View style={styles.selectorContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              snapToInterval={40}
              snapToAlignment={"start"}
              onScroll={(event) => handleScroll([0, 1, 2, 3], event)}
              showsVerticalScrollIndicator={false}
            >
              {[0, 1, 2, 3].map((number, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.text}>{number}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.highlightLine} />
            <View style={styles.highlightLineBottom} />
          </View>

          <View style={styles.selectorContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              snapToInterval={40}
              snapToAlignment={"start"}

              onScroll={(event) => handleScroll([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], event)}
              showsVerticalScrollIndicator={false}
            >
              {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((number, index) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.text}>{number}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.highlightLine} />
            <View style={styles.highlightLineBottom} />
          </View>
          <Text style={styles.unitText}>인분</Text>
        </HStack>
        <Button onPress={() => console.log("식단 등록 기능 구현 예정")}>
          식단 등록
        </Button>
      </VStack>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: 120,
    width: 100,
    marginVertical: 10
  },
  scrollViewContent: {
    paddingTop: 40, // ScrollView 시작 부분에 추가
    paddingBottom: 40, // ScrollView 끝 부분에 추가
  },
  item: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  },
  highlightLine: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: -50,
    height: 1,
    backgroundColor: 'black',
  },
  highlightLineBottom: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: -50,
    height: 1,
    backgroundColor: 'black',
  },
  unitText: {
    fontSize: 20,
    alignSelf: 'flex-end',
    paddingBottom: 55 // 조정하여 "인분" 텍스트의 위치를 맞춤
  }
});

export default GalleryScreen;
