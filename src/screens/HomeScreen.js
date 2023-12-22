
import React from 'react';
import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  // 사진 불러오기 공간을 위한 임시 이미지 URL (나중에 실제 이미지로 교체)
  const tempImageUrl = 'https://via.placeholder.com/150';

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
        <Text style={styles.greetingText}>안녕하세요!</Text>
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