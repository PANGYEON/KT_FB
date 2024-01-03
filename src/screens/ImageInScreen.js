

import { ScrollView, StyleSheet,Image,TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { View, Text, Button, VStack, HStack, Center } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

const ImageInScreen = () => {
  const route = useRoute();
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();
  const [apiResult, setApiResult] = useState(null);

  // useEffect(() => {
  //   if (route.params?.photo) {
  //     setPhotoUri(`file://${route.params.photo}`);
  //   }
  //   if (route.params?.apiResult) {
  //     setApiResult(route.params.apiResult);
  //   }
  // }, [route.params?.photo, route.params?.apiResult]);
  useEffect(() => {
    if (route.params?.photo) {
      setPhotoUri(`file://${route.params.photo}`);
    }
    // if (route.params?.apiResult) {
    //   setApiResult(route.params.apiResult);
    // }
  }, [route.params?.photo]);

  const [selectedMeal, setSelectedMeal] = useState(null);
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

  const handleImagePress = () => {
    // 'CameraScreen'으로 이동
    navigation.navigate('CameraScreen');
  };
  const registerMeal = () => {
    // ReportScreen 내의 DailyScreen으로 이동
    navigation.navigate('BottomTabNavigator', {
      screen: '리포트', 
      params: {
        screen: 'Daily',
        params: { selectedMeal: selectedMeal }
      }
    });
  };
  return (
    <View flex={1}>
      <TouchableOpacity onPress={handleImagePress}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={{ width: 300, height: 300 }} />
        )}
      </TouchableOpacity>
      <View >
        <Text style={{ fontSize: 34, paddingTop: 30 }}>시간대</Text>
      </View>

      <VStack space={4} alignItems="center" mt={4}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: 'lightgray', marginLeft: 10, marginRight: 10, borderRadius: 20 }}>
          {meals.map(meal => (
            <Button key={meal} onPress={() => setSelectedMeal(meal)} style={getButtonStyle(meal)}>
              <Text style={getButtonTextStyle(meal)}>{meal}</Text>
            </Button>
          ))}
        </View>

        <View><Text>{JSON.stringify(apiResult, null, 2)}</Text></View>
        <Button isDisabled={!selectedMeal} onPress={registerMeal}>
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

export default ImageInScreen;
