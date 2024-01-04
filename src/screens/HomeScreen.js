

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, Modal, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ChatBotScreen from './ChatBotScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { odApi } from '../ai_model/BP_Food';

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


  
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        const imageName = response.assets[0].fileName;
  
        try {
          const apiResult = await odApi(source.uri, imageName);
          navigation.navigate('ImageIn', { photo: source.uri, apiResult });
        } catch (error) {
          console.error('Error fetching data from odApi', error);
        }
      }
    });
  };
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
        <Text style={{ color: 'black', fontSize: 20 }}>프로필</Text>
      </TouchableOpacity>

      {/* 인사말과 식단 안내 메시지 */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText1}>안녕하세요, {userName}님!</Text>
        <View style={styles.divider} />
        <Text style={styles.greetingText2}>오늘의 식단을 기록하세요:)</Text>
      </View>
      <View style={styles.ImgContainer}>
      {/* 이미지 불러오기 공간 */}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}


      {/* 사진 촬영 버튼 */}
      {/* <Button title="사진 촬영" onPress={() => navigation.navigate('ImageIn')} /> */}
      {/* <Button title="사진 촬영" onPress={() => navigation.navigate('CameraScreen')} />
       */}
      <TouchableOpacity
        style={styles.takePhoto} onPress={() => navigation.navigate('CameraScreen')}
      //</View>onPress={() => navigation.navigate('CameraScreen')}
      >
        <Image source={require('../icons/A.png')} style={{ width: 30, height: 30 }} />
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginTop: '2%' }}>사진촬영</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.galleryButton}
  onPress={openGallery}
>
  <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>갤러리</Text>
</TouchableOpacity>
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
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            flex: 1,
            minWidth: '80%',
            maxHeight: '80%',
            backgroundColor: '#fff',
            borderRadius: 30,
          }}>
            <ChatBotScreen onClose={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>

  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '10%',
    //justifyContent: 'center',
    //alignItems: 'center',
    //backgroundColor: 'lightyellow',
  },
  galleryButton: {
    // Your styling for the gallery button
    backgroundColor: '#D7D4FF',
    width: width * 0.8,
    height: height * 0.15,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    //position: 'absolute',
    //top: 20,
    //right: 20,
    //padding: 10,
    marginTop: '-5%',
    alignSelf: 'flex-end',
    borderRadius: 5,
    //backgroundColor: 'yellow',
  },
  greetingContainer: {
    marginTop: '15%',
    marginBottom: 20,
    //backgroundColor: 'lightgreen',
  },
  greetingText1: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    height: 2, // 구분선의 세로 길이를 지정합니다.
    backgroundColor: '#ccc', // 구분선의 색상을 지정합니다.
    marginVertical: '3%', // 구분선의 상하 여백을 퍼센트로 조정합니다.
  },
  greetingText2: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: '5%',
  },
  ImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.25,
    marginBottom: 20,
    borderRadius: 20,
  },
  takePhoto: {
    backgroundColor: '#D7D4FF',
    width: width * 0.8,
    height: height * 0.15,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBotButton: {
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
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    flex: 1,
    minWidth: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 30,
  },
});

export default HomeScreen;