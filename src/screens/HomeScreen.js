
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatBotScreen from './ChatBotScreen';

const HomeScreen = ({route}) => {
  const navigation = useNavigation();
  const { token } = route.params || {};
  const [userName, setUserName] = useState(''); 
  const [isModalVisible, setModalVisible] = useState(false);

  // 사진 불러오기 공간을 위한 임시 이미지 URL (나중에 실제 이미지로 교체)
  const tempImageUrl = 'https://via.placeholder.com/150';
  useEffect(() => {
    if (token) {
      getUserInfo();
    }
  }, [token]);

  const getUserInfo = async () => {
    try {
      const config = {
        method: 'post',
        url: 'http://192.168.10.53:5500/api/user/info/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({ "access_token": token })
      };

      const response = await axios(config);
      console.log(response); // 서버 응답 출력

      //setUserName(response.data.user.name); // 사용자 이름 설정
      if (response.data && response.data.user && response.data.user.name) {
        setUserName(response.data.user.name); // 사용자 이름 설정
      } else {
        console.log("사용자 이름 필드가 없습니다.");
      }
    } catch (error) {
      console.log("사용자 이름 필드가 없습니다.", error);
      // 에러 처리
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    
    <View style={styles.container}>
      {/* 프로필 페이지 버튼 */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={{color:'black', fontSize:20}}>프로필</Text>
      </TouchableOpacity>

      {/* 인사말과 식단 안내 메시지 */}
      <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>안녕하세요, {userName ? userName : '게스트'}님!</Text>
              <Text style={styles.greetingText}>오늘의 식단을 기록하세요!</Text>
      </View>

      {/* 이미지 불러오기 공간 */}
      <Image
        source={{ uri: tempImageUrl }}
        style={styles.image}
      />

      {/* 사진 촬영 버튼 */}
      {/* <Button title="사진 촬영" onPress={() => navigation.navigate('ImageIn')} /> */}
      <Button title="사진 촬영" onPress={() => navigation.navigate('CameraScreen')} />

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
        animationType="slide"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    // backgroundColor: '#ddd',
    borderRadius: 5,
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  }
});

export default HomeScreen;