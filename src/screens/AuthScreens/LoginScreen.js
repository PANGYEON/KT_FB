// 로그인화면(앱의 첫페이지)
import React, { useState } from 'react';

import { Button, View, Input, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // api통신
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기
import { StyleSheet, Alert, Modal, TouchableOpacity, Image } from 'react-native';

const LoginScreen = () => {
  // React Navigation의 네비게이션을 사용할 수 있도록 useNavigation 훅을 이용하여 navigation 객체 생성
  const navigation = useNavigation();

  // 이메일과 비밀번호를 저장하기 위한 useState 훅 사용
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 실패 시 표시할 알림 모달 상태 및 메시지를 저장하기 위한 useState 훅 사용
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // AsyncStorage를 사용하여 토큰을 저장하는 함수 정의
  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('@user_token', token);
    } catch (e) {
      // 토큰 저장 중 에러가 발생한 경우 알림 모달 표시
      setAlertMessage(`token error`);
      setAlertModalVisible(true);
    }
  }

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleLogin = async () => {
    try {
      // 입력된 이메일과 비밀번호를 JSON 형태로 변환하여 서버로 전송
      let data = JSON.stringify({
        "email": email,
        "password": password
      });

      // 로그인 요청을 위한 설정 객체 생성
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/login/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      // Axios를 사용하여 로그인 요청
      const response = await axios(config);

      // 로그인 요청에 대한 응답이 200일 경우
      if (response.status === 200) {
        // 응답으로 받은 토큰을 저장하고 BottomTabNavigator로 이동
        const token = response.data.access_token;
        storeToken(response.data.access_token);
        // 로그인 성공 후 뒤로가기 눌러도 바텀네비로 고정
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigator', params: { token: token } }],
        });
      } else {
        // 로그인 실패 시 이메일 또는 비밀번호가 잘못되었다는 알림 모달 표시
        setAlertMessage(`이메일 또는 비밀번호가 잘못되었습니다.`);
        setAlertModalVisible(true);
      }
    } catch (error) {
      // 로그인 요청 중 에러 발생 시 에러 메시지 출력 및 알림 모달 표시
      console.log(error);
      if (error.response) {
        console.log("Server Response", error.response);
      }
      if (error.request) {
        console.log("Server No Response", error.request);
      }

      setAlertMessage(`이메일 또는 비밀번호가 잘못되었습니다.`);
      setAlertModalVisible(true);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#fff' }}>
      <View
        style={{
          backgroundColor: '#D7D4FF',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          paddingTop: 70,
          padding: 40,
          height: '70%',
        }}
      >
        <View
          style={{
            marginBottom: 10,
            borderRadius: 50,
            backgroundColor: 'white',
            borderWidth: 0,
          }}
        >
          <Input
            placeholder="이메일"
            value={email}
            onChangeText={(value) => setEmail(value)}
            borderColor="transparent"
            underlineColorAndroid="transparent"
          />
        </View>
        <View
          style={{
            marginBottom: 10,
            borderRadius: 50,
            backgroundColor: 'white',
            borderWidth: 0,
          }}
        >
          <Input
            placeholder="비밀번호"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry
            borderColor="transparent"
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          onPress={handleLogin}
          style={{ marginBottom: 10, borderRadius: 50, backgroundColor: '#8E86FA' }}
        >
          로그인
        </Button>
        <Button style={{ borderRadius: 50, backgroundColor: '#FEE500' }}>
          <Text style={{ color: 'black' }}>카카오로 시작하기</Text>
        </Button>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
          <Text style={{ marginRight: 10 }} onPress={() => navigation.navigate('Register')}>
            회원가입
          </Text>
          <Text onPress={() => navigation.navigate('PwSearch')}>비밀번호 찾기</Text>
        </View>
      </View>

      {/* 알림 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        {/* 알림 모달 내부 구성 */}
        <View style={styles.alertModalView}>
          <View style={styles.alertModalContainer}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            {/* 알림 모달의 OK 버튼 */}
            <View style={styles.alertButtonContainer}>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
};
const styles = StyleSheet.create({
  alertModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    margin: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 1,
    width: '80%',
    height: '20%',
  },
  modalText: {
    fontSize: 16,             // 글자 크기
    textAlign: 'flex-start',      // 텍스트 중앙 정렬
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 버튼을 하단으로 이동
    alignItems: 'flex-end', // 버튼을 오른쪽으로 이동
    width: '100%',
  },
  alertButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10, // 버튼 높이 조절
    paddingHorizontal: 20, // 버튼 너비 조절
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 수평 중앙 정렬
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
});
export default LoginScreen;

