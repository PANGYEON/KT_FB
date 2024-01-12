// 카메라기능
import React, { useRef, useState } from 'react';
import { Button, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { odApi } from '../ai_model/BP_Food'; // AI모델에서 가져온 odApi함수
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기

function CameraScreen() {
  const device = useCameraDevice('back'); // 후면카메라 디바이스
  const navigation = useNavigation();
  const cameraRef = useRef(null); // 카메라 참조 생성

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  if (device == null) return <View />;

  //오늘의 날짜를 가져옴
  const getTodayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // 사진 찍는 동작을 하는 함수
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const file = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed', // 사진 품질 우선순위 설정
          flash: 'off', // 플래시 off 설정
        });

        // CameraRoll을 사용하여 사진 저장
        // apk로 추출하려면 아래 한 줄 주석처리 후 추출
        // await CameraRoll.save(`file://${file.path}`, { type: 'photo' });

        setIsLoading(true); // 로딩상태 활성화
        const apiResult = await odApi(`file://${file.path}`, `${file.name}`); // AI모델을 사용하여 이미지 분석
        await AsyncStorage.setItem('@latest_photo', `file://${file.path}`); // AsyncStorage를 사용하여 최신 사진 저장
        const todayDate = getTodayDate();
        setIsLoading(false); // 로딩상태 비활성화
        navigation.navigate('ImageIn', { photo: `file://${file.path}`, apiResult, selectDay: todayDate }); // ImageIn 화면으로 이동하여 분석 결과 전달
      } catch (error) {
        console.error(error);
        setIsLoading(false); // 에러 발생 시 로딩 상태 비활성화
      }
    } else {
      setIsLoading(false); // 카메라 참조가 없을 때 로딩 상태 비활성화
    }
  };

  if (isLoading) {
    // 로딩 중이라면 로딩 화면을 표시
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
        </View>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color="#8E86FA" />
          <Text style={{ marginTop: 20, fontSize: 20 }}>사진을 분석중이에요 </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef} // 카메라 참조 할당
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.text}>사진 찍기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  // ... 기존 스타일 ...
  button: {
    backgroundColor: '#D7D4FF',
    width: 130, // 원의 크기
    height: 130, // 원의 크기
    borderRadius: 65, // 반원의 크기 (width / 2)
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // 화면 하단 중앙에 위치
    bottom: 20, // 하단에서의 간격
    alignSelf: 'center' // 가운데 정렬
  },
  text: {
    color: 'white',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 30,
    paddingLeft: 20,
  },
  loadingView: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CameraScreen;
