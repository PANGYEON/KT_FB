
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, Modal,Dimensions } from 'react-native';
import { useNavigation,useRoute  } from '@react-navigation/native';
import ChatBotScreen from './ChatBotScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  // const [photoUri, setPhotoUri] = useState(null);
  const [photoUri, setPhotoUri] = useState('https://via.placeholder.com/150');

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    if (route.params?.photo) {
      setPhotoUri(`file://${route.params.photo}`);
    }
  }, [route.params?.photo]);

  useEffect(() => {
    getTokenAndFetchUserInfo();
  }, []);
  
  const getTokenAndFetchUserInfo = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@user_token');
      if (storedToken) {
        fetchUserInfo(storedToken);
      }
    } catch (e) {
      console.log('Error retrieving token', e);
    }
  };
  
  const fetchUserInfo = async (token) => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/user/info/',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      };
  
      const response = await axios(config);
      if (response.status === 200) {
        // console.log(response)
        setUserName(response.data.user.name); // Set the user's name in state
      } else {
        console.log('Failed to fetch user info');
      }
    } catch (error) {
      console.log('Error fetching user info', error);
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
      <Text style={styles.greetingText}>안녕하세요, {userName}님!</Text>
              <Text style={styles.greetingText}>오늘의 식단을 기록하세요:)</Text>
      </View>

      {/* 이미지 불러오기 공간 */}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}


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
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  }
});

export default HomeScreen;