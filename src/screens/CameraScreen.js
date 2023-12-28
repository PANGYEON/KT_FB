import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraScreen = () => {
  const camera = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const devices = useCameraDevices('back');

  useEffect(() => {
    requestCameraPermission().then(() => {
      if (devices && Object.keys(devices).length > 0) { //카메라가 있으면 실행
        // selectCameraDeviceByName("BACK (0)");
        //selectCameraDeviceByName("FRONT (1)");
        const device = Object.values(devices).find(d => d.name === 'BACK (0)');
        setSelectedDevice(device);
      }
    });
  }, [devices]);

  const requestCameraPermission = async () => { //권한 코드
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED) {
      console.log('granted');
    } else {
      console.log('not granted');
    }
    return result;
  };

  const selectCameraDeviceByName = (cameraName) => {
    const device = Object.values(devices).find(d => d.name === 'BACK (0)');
    setSelectedDevice(device);
  };

  if (!selectedDevice) {
    return <Text>Loading Camera...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={devices}
        isActive={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  }
});

export default CameraScreen;

