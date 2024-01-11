// 홈화면 - 메인페이지
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // api 통신
import { View, Text, Button, TouchableOpacity, Image, StyleSheet, Modal, Dimensions, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ChatBotScreen from './ChatBotScreen'; // 챗봇 모달 화면
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기
import { launchImageLibrary } from 'react-native-image-picker'; // 갤러리 image 고르기
import { odApi, processAndSendData } from '../ai_model/BP_Food'; // ai 코드 연동해서 통신

//애니메이션 불러오기
import Animation from '../animation/Animation';


const HomeScreen = () => {
  // 상태변수 설정
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false); // 권한 요청 모달 상태

  //애니메이션 불러오기
  const [showAnimation, setShowAnimation] = useState(false);

  //이미지가 없는 제일 첫 화면 150x150 빈 이미지 출력
  const [photoUri, setPhotoUri] = useState('https://via.placeholder.com/150');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // 현재날짜 설정
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // 디바이스의 가로/세로 정보 받기
  const { width, height } = Dimensions.get('window');

  // 최근사진을 관리
  const loadLatestPhoto = async () => {
    const latestPhotoUri = await AsyncStorage.getItem('@latest_photo');
    if (latestPhotoUri) {
      setPhotoUri(latestPhotoUri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLatestPhoto();
    }, [])
  );
  useEffect(() => {
    getTokenAndFetchUserInfo();
    getTodayDate();
  }, []);

  useEffect(() => {
    const updateTabBarVisibility = () => {
      navigation.setOptions({
        tabBarStyle: isLoading ? { display: 'none' } : {
          height: height * 0.1,
          paddingBottom: '1%',
        },
      });
    };

    updateTabBarVisibility();
  }, [isLoading, navigation]);

  // 사진촬영버튼 누르면 호출
  const handleTakePhotoPress = () => {
    checkCameraPermission();
  };

  // 카메라 권한 확인
  const checkCameraPermission = async () => {
    let hasPermission = false;
    try {
      hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!hasPermission) {
        // 권한이 없으면 권한 요청 모달을 보여줍니다.
        setPermissionModalVisible(true);
      } else {
        // 권한이 있으면 카메라 화면으로 넘어갑니다.
        navigation.navigate('CameraScreen');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // 권한 요청 처리
  const PermissionModal = ({ isVisible, onClose, onGrant, type }) => {
    const requestPermission = async () => {
      let permissionType = type === 'camera' ? PermissionsAndroid.PERMISSIONS.CAMERA : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      try {
        const granted = await PermissionsAndroid.request(permissionType);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onGrant();
        } else {
          console.log('권한 거부됨');
        }
      } catch (err) {
        console.warn(err);
      }
      onClose();
    };

    // 권한 요청 모달창
    return (
      <Modal
        visible={isVisible}
        transparent
        onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>{`"${type === 'camera' ? '카메라' : '갤러리'}" 접근 권한이 필요합니다.`}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <TouchableOpacity onPress={requestPermission}>
                <Text>허용</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // 갤러리버튼을 눌렀을 때 수행
  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    // 현재 날짜
    const todayDate = getTodayDate();

    // 갤러리에서 이미지 선택
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) { // 이미지 선택을 취소했을 때
        console.log('User cancelled image picker');
      } else if (response.errorCode) { // 이미지 선택 중 에러
        setIsLoading(false);
        console.log('ImagePicker Error: ', response.errorMessage);
      } else { // 그외(성공)

        setIsLoading(true); //로딩중

        // 이미지데이터 생성
        const source = { uri: response.assets[0].uri };
        const image = new FormData();
        image.append('file', {
          uri: source.uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName
        });

        // 최신사진 uri 저장
        await AsyncStorage.setItem('@latest_photo', source.uri);
        console.log(source.uri)

        // 결과 저장
        await processAndSendData(source.uri, response.assets[0].fileName);
        const apiResult = await odApi(source.uri, response.assets[0].fileName);

        // ImageInScreen으로 이동하면서 photoUri 전달
        setIsLoading(false);
        navigation.navigate('ImageIn', { photo: source.uri, apiResult, selectDay: todayDate, image });
      }
    });
  };

  // 토큰을 통해 사용자의 정보를 가져옴
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

  // 서버에서 사용자정보 호출
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
        setUserName(response.data.user.name);
      } else {
        console.log('Failed to fetch user info');
      }
    } catch (error) {
      console.log('Error fetching user info', error);
    }
  };

  // 모달창 토글
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  if (isLoading) {
    // 로딩 중이라면 로딩 화면을 표시
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
        </View>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color="#8E86FA" />
          <Text style={{ marginTop: 20, fontSize: 20 }}>사진을 분석중이에요</Text>
        </View>
      </View>
    );
  }



  return (
    // 프로필 페이지 버튼
    <View style={styles.container}>
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
        <View style={styles.imageContainer}>
          {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
        </View>
        <TouchableOpacity
          style={styles.takePhoto}
          onPress={handleTakePhotoPress}
        >

          <Image source={require('../icons/CameraLineIcon.png')} style={{ width: 30, height: 30 }} />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginTop: '2%' }}>사진촬영</Text>
        </TouchableOpacity>
        <PermissionModal
          isVisible={isPermissionModalVisible}
          onClose={() => setPermissionModalVisible(false)}
          onGrant={() => navigation.navigate('CameraScreen')}
          type="camera"
        />
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={openGallery}
        >
          <Image source={require('../icons/GalleryIcon.png')} style={{ width: 30, height: 30 }} />
          <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginTop: '2%' }}>갤러리</Text>
        </TouchableOpacity>
      </View>

      {/* 챗봇버튼 */}
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

      {/* 챗봇 모달창 */}
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
      {showAnimation && <Animation onFinish={() => setShowAnimation(false)} />}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // 전체화면 조정
  container: {
    flex: 1,
    padding: '10%',
  },

  // 갤러리버튼
  galleryButton: {
    backgroundColor: '#D7D4FF',
    width: width * 0.8,
    height: height * 0.12,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 프로필버튼
  profileButton: {
    marginTop: '-5%',
    alignSelf: 'flex-end',
    borderRadius: 5,
  },

  greetingText1: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black',
  },
  greetingText2: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: '5%',
  },

  //구분선
  divider: {
    height: 2,
    backgroundColor: '#ccc',
    marginVertical: '3%',
  },

  // 이미지 사진 보여주는 부분 스타일
  ImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',

  },

  imageContainer: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 사진촬영버튼
  takePhoto: {
    backgroundColor: '#D7D4FF',
    width: width * 0.8,
    height: height * 0.12,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //챗봇버튼 스타일
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



  //로딩창 스타일 조정
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 50,
    paddingLeft: 20,
  },
  loadingView: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;