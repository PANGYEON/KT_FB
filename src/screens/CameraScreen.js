// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const CameraScreen = () => {
//   const camera = useRef(null);
//   const [selectedDevice, setSelectedDevice] = useState(null);
//   const devices = useCameraDevices('back');

//   useEffect(() => {
//     requestCameraPermission().then(() => {
//       if (devices && Object.keys(devices).length > 0) { //카메라가 있으면 실행
//         // selectCameraDeviceByName("BACK (0)");
//         selectCameraDeviceByName("FRONT (1)");
//       }
//     });
//   }, [devices]);

//   const requestCameraPermission = async () => { //권한 코드
//     const result = await request(PERMISSIONS.ANDROID.CAMERA);
//     if (result === RESULTS.GRANTED) {
//       console.log('granted');
//     } else {
//       console.log('not granted');
//     }
//     return result;
//   };

//   const selectCameraDeviceByName = (cameraName) => {
//     const device = Object.values(devices).find(d => d.name === cameraName);
//     setSelectedDevice(device);
//   };

//   if (!selectedDevice) {
//     return <Text>Loading Camera...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={camera}
//         style={styles.camera}
//         device={devices}
//         isActive={true}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   camera: {
//     flex: 1,
//   }
// });

// export default CameraScreen;
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const CameraScreen = () => {
  const camera = useRef(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const devices = useCameraDevices();

  useEffect(() => {
    requestCameraPermission().then(() => {
      if (devices && Object.keys(devices).length > 0) {
        // selectCameraDeviceByName("FRONT (1)"); // 카메라 이름을 정확히 확인하세요
        selectCameraDeviceByName("BACK (0)");
      }
    });
  }, [devices]);

  const requestCameraPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED) {
      console.log('granted');
    } else {
      console.log('not granted');
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
        device={selectedDevice} // 수정된 부분
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
