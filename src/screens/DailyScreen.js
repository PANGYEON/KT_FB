
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { Button } from 'native-base';
import ChatBotScreen from './ChatBotScreen';
import { useNavigation } from '@react-navigation/native';

const DailyScreen = () => {
  const navigation = useNavigation();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const meals = ['아침', '점심', '저녁', '간식'];

  const renderDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  const getButtonStyle = (meal) => ({
    width: '20%',
    backgroundColor: selectedMeal === meal ? '#D7D4FF' : 'transparent', // 연보라색 코드로 변경
    borderColor: selectedMeal === meal ? '#D7D4FF' : 'transparent'
  });

  const getButtonTextStyle = (meal) => ({
    color: selectedMeal === meal ? 'white' : 'black',
    fontSize:20,
    justifyContent:'center'
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex:1}}>
      <Text style={{ fontSize: 34, paddingTop: 30 }}>{renderDate()}</Text>
      <Text style={{ fontSize: 20, paddingTop: 10 }}>좋았어</Text>
      <View style={{ backgroundColor: 'grey', padding: 10 ,height:250,margin:20,borderRadius: 20}}>
        {/* 여기에 다른 컨텐츠가 추가될 수 있습니다#F3EFEF */}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: 'lightgray',marginLeft:10,marginRight:10,borderRadius: 20 }}>
        {meals.map(meal => (
          <Button key={meal} onPress={() => setSelectedMeal(meal)} style={getButtonStyle(meal)} borderTopRadius={20} borderBottomRadius={20}>
            <Text style={getButtonTextStyle(meal)}>{meal}</Text>
          </Button>
        ))}
      </View>
      <View style={{ padding: 10 }}>
        <Text>{selectedMeal ? `${selectedMeal} 메뉴` : ''}</Text>
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          backgroundColor: '#D7D4FF', // 원하는 색상
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5
        }}
        onPress={toggleModal}>
        <Image source={require('../icons/ChatBotIcon.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            flex:1,
            minWidth:'80%',
            maxHeight:'80%',
            backgroundColor: '#fff',
            borderRadius:30,
        }}>
            <ChatBotScreen onClose={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DailyScreen;