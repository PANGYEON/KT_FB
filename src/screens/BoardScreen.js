// BoardScreen.js
import React, { useState } from 'react';
import { Button, View, Input, Image } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Modal } from 'react-native';
import ChatBotScreen from './ChatBotScreen'; 

const BoardScreen = () => {
  const navigation = useNavigation();
  // 텍스트 상태를 관리하기 위한 useState 훅
  const [text, setText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // 버튼 클릭시 실행될 함수
  const handlePress = () => {
    console.log(text);  // 콘솔에 텍스트 출력
    navigation.navigate("Home");
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{flex:1}}>
      <Input 
        value={text}
        onChangeText={setText} // 텍스트가 변경될 때마다 text 상태를 업데이트
        placeholder="여기에 텍스트를 입력하세요"
      />
      <Button onPress={handlePress}>이전</Button>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          backgroundColor: '#D7D4FF', 
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
}

export default BoardScreen;

