import { ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, VStack, HStack } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
// import { color } from 'native-base/lib/typescript/theme/styled-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fs, RNFS } from 'react-native-fs'
const PortionSizeModal = ({ isVisible, onClose, onSelect, initialSize }) => {
  const [integerPart, setIntegerPart] = useState(Math.floor(initialSize));
  const [fractionPart, setFractionPart] = useState(Math.round((initialSize % 1) * 10));
 
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>인분을 선택해주세요</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%', marginBottom: '5%' }}>
            <ScrollPicker
              dataSource={[0, 1, 2, 3]}
              selectedIndex={integerPart}
              wrapperBackground={'transparent'}
              renderItem={(data, index, isSelected) => <Text>{data}</Text>}
              onValueChange={(data, selectedIndex) => setIntegerPart(selectedIndex)}
            />
            <Text style={{fontSize: 30}}>.</Text>
            <ScrollPicker
            style={{backgroundColor:'#D7D4FF'}}
            wrapperBackground={'transparent'}
              dataSource={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
              selectedIndex={fractionPart}
              renderItem={(data, index, isSelected) => <Text>{data}</Text>}
              onValueChange={(data, selectedIndex) => setFractionPart(selectedIndex)}
            />
          </View>
          <TouchableOpacity title="Confirm" onPress={() => onSelect(integerPart + fractionPart / 10)} style={{alignItems: 'center', justifyContent: 'center'}} >
            <Text style={{backgroundColor: '#8E86FA', padding: '5%', width: '50%', textAlign: 'center', borderRadius: 10, color: 'white'}}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const ImageInScreen = () => {
  const route = useRoute();
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();
  const [apiResult, setApiResult] = useState(null);
  const [foodNames, setFoodNames] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [checkedFoods, setCheckedFoods] = useState({});
 
  const [portionSizes, setPortionSizes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFoodForPortion, setCurrentFoodForPortion] = useState(null);
  const [inferResult, setinferResult] = useState();
 
  const isAnyFoodChecked = () => {
    return Object.values(checkedFoods).some(isChecked => isChecked);
  };
 
  useEffect(() => {
    // console.log(route.params.selectDay) 오늘 날짜
    // console.log('ii', route.params.image)
 
    if (route.params?.photo) {
      setPhotoUri(route.params.photo);
    }
    if (route.params?.apiResult) {
      // apiResult를 객체로 변환
      const resultObj = JSON.parse(route.params.apiResult);
      setApiResult(resultObj);
      // console.log(resultObj.inferResult)
      setinferResult(resultObj.inferResult)
      // foodNames 추출 및 상태 업데이트
      if (resultObj.predict && resultObj.predict.foodNames) {
        setFoodNames(resultObj.predict.foodNames);
      }
      const initialPortionSizes = {};
      if (resultObj.predict && resultObj.predict.foodNames) {
        resultObj.predict.foodNames.forEach(foodName => {
          initialPortionSizes[foodName] = 1.0;
        });
      }
      setPortionSizes(initialPortionSizes);
    }
  }, [route.params]);
 
  const handlePortionSizeChange = (newSize) => {
    setPortionSizes(prev => ({ ...prev, [currentFoodForPortion]: newSize }));
    setModalVisible(false);
  };
 
  const openPortionModal = (foodName) => {
    setCurrentFoodForPortion(foodName);
    setModalVisible(true);
  };
  const meals = ['아침', '점심', '저녁', '간식'];
  const handleFoodCheck = (foodName, isChecked) => {
    setCheckedFoods(prev => ({ ...prev, [foodName]: isChecked }));
  };
  const getButtonStyle = (meal) => ({
    width: '20%',
    backgroundColor: selectedMeal === meal ? '#8E86FA' : 'transparent',
    borderColor: selectedMeal === meal ? '#8E86FA' : 'transparent',
    borderRadius: 15
  });
 
  const getButtonTextStyle = (meal) => ({
    color: selectedMeal === meal ? 'white' : 'black',
    fontSize: 20,
    justifyContent: 'center'
  });
 
  const handleImagePress = () => {
    // navigation.navigate('CameraScreen');
  };
 
  // 이미지 업로드 함수
  const uploadImage = async (uri) => {
    let formData = new FormData();
    let file = {
      uri: uri,
      name: 'photo.jpg', // 파일명과 확장자를 적절하게 설정하세요
      type: 'image/jpeg' // 적절한 MIME 타입을 설정하세요
    };
 
    formData.append('imagelink', file);
 
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://edm-diet.japaneast.cloudapp.azure.com/user_meal/upload/',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };
 
    try {
      const response = await axios(config);
      return response.data; // 업로드 후 받은 응답
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
 
 
  const registerMeal = async () => {
    const mealDataList = Object.keys(checkedFoods)
      .filter(foodName => checkedFoods[foodName])
      .map(foodName => ({
        menu: foodName,
        portion: portionSizes[foodName]
      }));
    const mealDate = route.params?.selectDay; // 선택된 날짜
    const mealType = selectedMeal; // 선택된 식사 시간 (아침, 점심, 저녁, 간식)
    const uploadResult = await uploadImage(photoUri);
 
    const data = JSON.stringify({
      inferResult: inferResult,
      mealType: mealType,
      mealdate: mealDate,
      imagelink: uploadResult.imagelink,
      predict: {
        foodNames: mealDataList.map(item => item.menu),
        serving: mealDataList.map(item => item.portion)
      }
    });
 
    console.log(data)
    const token = await AsyncStorage.getItem('@user_token');
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://edm-diet.japaneast.cloudapp.azure.com/user_meal/save_user_meal/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 실제 토큰으로 교체
      },
      data: data
    };
    try {
      // API 요청 전송
      const response = await axios(config);
      console.log(response.data);
      // 성공적인 응답 처리
    } catch (error) {
      console.error('Error sending meal data:', error);
    }
    navigation.navigate('BottomTabNavigator', {
      screen: '리포트',
      params: {
        screen: 'Daily',
        params: {
          selectedMeal: selectedMeal,
          photoUri: photoUri,
          mealDataList: mealDataList, // Passing the list of menu and portions
          mealDate: mealDate,
        }
      }
    });
  };
 
 
   return (
    <View flex={1}>
      <TouchableOpacity style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }} onPress={handleImagePress}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={{ width: 300, height: 300 }} />
        )}
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 25, paddingTop: 20 }}>식사 시간대</Text>
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
        {foodNames.length > 0 ? (
        <ScrollView
          style={{ maxHeight: 200 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
        >
          {foodNames.map((foodName, index) => (
            <HStack key={index} alignItems="center" style={{ marginVertical: 5 }}>
              <CheckBox
                value={checkedFoods[foodName]}
                onValueChange={(isChecked) => handleFoodCheck(foodName, isChecked)}
                tintColors={{ true: '#8E86FA', false: '#8E86FA' }}
              />
              <Text style={{ marginLeft: 1, marginTop: '-1%',marginRight: '5%' }}>{foodName}</Text>
              <TouchableOpacity onPress={() => openPortionModal(foodName)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{borderColor: '#ccc', borderWidth: 1, padding: '1%', borderRadius: 5}}>{portionSizes[foodName]}</Text>
                  <Text>인분</Text>
                </View>
              </TouchableOpacity>
            </HStack>
          ))}
        </ScrollView>
) : (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ textAlign: 'center', marginTop: 20 }}>
      죄송합니다 탐지된 음식이 없습니다. 이미지를 눌러 다시 선택해주세요
    </Text>
    <Button
      onPress={() => navigation.navigate('BottomTabNavigator', { screen: '홈' })}
      style={{
        marginTop: 20,
        backgroundColor: '#8E86FA',
        borderRadius: 15,
      }}
    >
      <Text style={{ color: 'white' }}>처음으로</Text>
    </Button>
  </View>
)}
 
        <Button
          isDisabled={!selectedMeal || !isAnyFoodChecked()}
          onPress={registerMeal}
          style={{
            backgroundColor: '#8E86FA',
            borderRadius: 15,
          }}
        >
          식단 등록
        </Button>
      </VStack>
      <PortionSizeModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handlePortionSizeChange}
        initialSize={portionSizes[currentFoodForPortion] || 1.0}
      />
    </View>
  );
};
 
export default ImageInScreen;