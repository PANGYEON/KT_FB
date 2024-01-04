

import { ScrollView, StyleSheet,Image,TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { View, Text, Button, VStack, HStack, Center } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';

const ImageInScreen = () => {
  const route = useRoute();
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();
  const [apiResult, setApiResult] = useState(null);
  const [foodNames, setFoodNames] = useState([]);

  useEffect(() => {
    if (route.params?.photo) {
      setPhotoUri(route.params.photo);
    }
    if (route.params?.apiResult) {
      setApiResult(route.params.apiResult);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params?.photo) {
      setPhotoUri(route.params.photo);
    }
    if (route.params?.apiResult) {
      // apiResult를 객체로 변환
      const resultObj = JSON.parse(route.params.apiResult);
      setApiResult(resultObj);

      // foodNames 추출 및 상태 업데이트
      if (resultObj.predict && resultObj.predict.foodNames) {
        setFoodNames(resultObj.predict.foodNames);
      }
    }
  }, [route.params]);
  // useEffect(() => {
  //   if (route.params?.photo) {
  //     setPhotoUri(`file://${route.params.photo}`);
  //   }
  //   if (route.params?.apiResult) {
  //     setApiResult(route.params.apiResult);
  //   }
  // }, [route.params?.photo, route.params?.apiResult]);
  // useEffect(() => {
  //   if (route.params?.photo) {
  //     setPhotoUri(route.params.photo); // Set the photo URI
  //   }
  //   if (route.params?.apiResult) {
  //     setApiResult(route.params.apiResult); // Set the API result
  //   }
  // }, [route.params]);


  // useEffect(() => {
  //   if (route.params?.photo) {
  //     setPhotoUri(route.params.photo);
  //   }
  //   if (route.params?.apiResult) {
  //     setApiResult(route.params.apiResult);
  //   }
  // }, [route.params]);

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
  // const registerMeal = () => {
  //   // ReportScreen 내의 DailyScreen으로 이동
  //   navigation.navigate('BottomTabNavigator', {
  //     screen: '리포트', 
  //     params: {
  //       screen: 'Daily',
  //       params: { selectedMeal: selectedMeal }
  //     }
  //   });
  // };
 const registerMeal = () => {
    // ReportScreen 내의 DailyScreen으로 이동
    navigation.navigate('BottomTabNavigator', {
      screen: '리포트', 
      params: {
        screen: 'Daily',
        params: { selectedMeal: selectedMeal
                  ,photoUri: photoUri }
      }
    });
  };
  // const registerMeal = () => {
  //   // 식단 등록 시, 선택된 식사 시간과 사진 URI를 함께 전달
  //   navigation.navigate('Daily', {
  //     selectedMeal: selectedMeal,
  //     photoUri: photoUri
  //   });
  // };

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

        <Text>식품 목록:</Text>
      {foodNames.map((foodName, index) => (
        <Text key={index}>{foodName}</Text>
      ))}
        
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
