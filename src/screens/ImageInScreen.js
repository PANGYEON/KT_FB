

import { ScrollView, StyleSheet,Image,TouchableOpacity } from 'react-native';
import React, { useState,useEffect } from 'react';
import { View, Text, Button, VStack, HStack, Center } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

const ImageInScreen = () => {
  const route = useRoute();
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();
  const [apiResult, setApiResult] = useState(null);
  const [foodNames, setFoodNames] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [checkedFoods, setCheckedFoods] = useState({});
  // useEffect(() => {
  //   if (route.params?.photo) {
  //     setPhotoUri(route.params.photo);
  //   }
  //   if (route.params?.apiResult) {
  //     setApiResult(route.params.apiResult);
  //   }
  // }, [route.params]);

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

  const meals = ['아침', '점심', '저녁', '간식'];
  const handleFoodCheck = (foodName, isChecked) => {
    setCheckedFoods(prev => ({ ...prev, [foodName]: isChecked }));
  };
  const getButtonStyle = (meal) => ({
    width: '20%',
    backgroundColor: selectedMeal === meal ? '#8E86FA' : 'transparent',
    borderColor: selectedMeal === meal ? '#8E86FA' : 'transparent'
  });

  const getButtonTextStyle = (meal) => ({
    color: selectedMeal === meal ? 'white' : 'black',
    fontSize: 20,
    justifyContent: 'center'
  });

  const handleImagePress = () => {
    navigation.navigate('CameraScreen');
  };
  const registerMeal = () => {
    const checkedFoodList = Object.keys(checkedFoods).filter(foodName => checkedFoods[foodName]);
    navigation.navigate('BottomTabNavigator', {
      screen: '리포트',
      params: {
        screen: 'Daily',
        params: {
          selectedMeal: selectedMeal,
          photoUri: photoUri,
          checkedFoodList: checkedFoodList
        }
      }
    });
  };

  return (
    <View flex={1}>
      <TouchableOpacity style={{ padding:20, justifyContent: 'center', alignItems: 'center'}} onPress={handleImagePress}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={{ width: 300, height: 300 }} />
        )}
      </TouchableOpacity>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 30, paddingTop: 20 }}>식사 시간대</Text>
      </View>

      <VStack space={4} alignItems="center" mt={4}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#D7D4FF', marginLeft: 10, marginRight: 10, borderRadius: 20 }}>
          {meals.map(meal => (
            <Button key={meal} onPress={() => setSelectedMeal(meal)} style={getButtonStyle(meal)}>
              <Text style={getButtonTextStyle(meal)}>{meal}</Text>
            </Button>
          ))}
        </View>

        {/* <Text>식품 목록</Text> */}
        {foodNames.map((foodName, index) => (
        <HStack key={index} alignItems="center">
          <CheckBox
            value={checkedFoods[foodName]}
            onValueChange={(isChecked) => handleFoodCheck(foodName, isChecked)}
            tintColors={{ true: '#8E86FA', false: '#EBEBEB' }}
          />
          <Text>{foodName}</Text>
        </HStack>
      ))}
        
        <Button isDisabled={!selectedMeal} onPress={registerMeal}>
          식단 등록
        </Button>
      </VStack>
    </View>
  );
};

export default ImageInScreen;
