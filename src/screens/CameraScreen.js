import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraScreen = () => {
  const camera = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState(Object.values(useCameraDevices()).find(d => d.name === "FRONT (1)"));
  const devices = useCameraDevices();

  useEffect(() => {

    requestCameraPermission().then(() => {
      if (devices && Object.keys(devices).length > 0) {
        // selectCameraDeviceByName("BACK (0)");
        selectCameraDeviceByName("FRONT (1)");
      }
    });
  }, [devices]);

  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED) {
      console.log('Camera permission granted');
    } else {
      console.log('Camera permission not granted');
    }
    return result;
  };

  const selectCameraDeviceByName = (cameraName) => {
    const device = Object.values(devices).find(d => d.name === cameraName);
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
        device={selectedDevice}
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
