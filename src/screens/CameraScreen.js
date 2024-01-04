
import React, { useRef } from 'react';
import { Button, View  } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { odApi } from '../ai_model/BP_Food';
function CameraScreen() {
  const device = useCameraDevice('back');
  const navigation = useNavigation();
  const cameraRef = useRef(null); // 카메라 참조 생성
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
        const apiResult = await odApi(`file://${file.path}`,`${file.name}`);
        // processApi 함수를 호출하여 결과를 가져옵니다.
        // 사진 파일을 fetch 하여 blob 데이터로 변환
        const result = await fetch(`file://${file.path}`);
        const data = await result.blob();
        console.log(data)
        // 변환된 blob 데이터를 다음 화면으로 넘김
        // navigation.navigate('홈', { photo: file.path });
        navigation.navigate('ImageIn', { photo: file.path, apiResult });
        // navigation.navigate('ImageIn', { photo: file.path });

      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef} // 카메라 참조 할당
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />
      <Button title="사진 찍기" onPress={takePhoto} />
    </View>
  );
}

export default CameraScreen;
