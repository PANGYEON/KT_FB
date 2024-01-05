
import React, { useRef, useState } from 'react';
import { Button, View,TouchableOpacity, Text, StyleSheet, ActivityIndicator  } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { odApi } from '../ai_model/BP_Food';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CameraScreen() {
  const device = useCameraDevice('back');
  const navigation = useNavigation();
  const cameraRef = useRef(null); // 카메라 참조 생성

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  if (device == null) return <View />;

  
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const file = await cameraRef.current.takePhoto({
          qualityPrioritization: 'speed',
          flash: 'off',
        });

        // CameraRoll을 사용하여 사진 저장
        await CameraRoll.save(`file://${file.path}`, { type: 'photo' });

        setIsLoading(true);
        const apiResult = await odApi(`file://${file.path}`,`${file.name}`);
        await AsyncStorage.setItem('@latest_photo', `file://${file.path}`);

        // processApi 함수를 호출하여 결과를 가져옵니다.
        // 사진 파일을 fetch 하여 blob 데이터로 변환
        // const result = await fetch(`file://${file.path}`);
        // const data = await result.blob();
        // console.log(data)
        // 변환된 blob 데이터를 다음 화면으로 넘김
        // navigation.navigate('홈', { photo: file.path });
        setIsLoading(false);
        navigation.navigate('ImageIn', { photo: `file://${file.path}`, apiResult });
        // navigation.navigate('ImageIn', { photo: file.path });

      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // 로딩 중이라면 로딩 화면을 표시
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{marginTop:20}}>사진을 분석중이에요</Text>
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
  loadingView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default CameraScreen;
