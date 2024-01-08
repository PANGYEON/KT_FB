import React, { useState } from 'react'; // 리액트와 useState 훅을 불러옵니다.
import { Button, View, Input, Text } from 'native-base'; // native-base에서 Button, View, Input, Text를 가져옵니다.
import { useNavigation } from '@react-navigation/native'; // @react-navigation/native에서 useNavigation 훅을 가져옵니다.
import axios from 'axios'; // axios를 가져옵니다.
import AsyncStorage from '@react-native-async-storage/async-storage'; // @react-native-async-storage/async-storage에서 AsyncStorage를 가져옵니다.
import { StyleSheet, Alert, Modal, TouchableOpacity, Image } from 'react-native'; // react-native에서 StyleSheet와 Alert를 가져옵니다.

// LoginScreen 함수형 컴포넌트를 선언합니다.
const LoginScreen = () => {
  const navigation = useNavigation(); // useNavigation 훅을 사용하여 navigation 객체를 가져옵니다.
  const [email, setEmail] = useState(''); // email 상태와 setEmail 함수를 useState 훅을 사용하여 초기화합니다.
  const [password, setPassword] = useState(''); // password 상태와 setPassword 함수를 useState 훅을 사용하여 초기화합니다.
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // AsyncStorage에 토큰을 저장하는 함수를 선언합니다.
  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('@user_token', token); // AsyncStorage에 'user_token' 키로 토큰을 저장합니다.
    } catch (e) {
      console.log('eeeeee'); // 오류 발생 시 'eeeeee'를 콘솔에 출력합니다.
      setAlertMessage(`token error`);
      setAlertModalVisible(true);
    }
  };

  // 로그인 버튼을 눌렀을 때 처리하는 함수를 선언합니다.
  const handleLogin = async () => {
    try {
      let data = JSON.stringify({ // email과 password를 JSON 형태로 변환합니다.
        "email": email,
        "password": password
      });
      
      let config = { // axios 요청 설정 객체를 생성합니다.
        method: 'post', // POST 요청을 설정합니다.
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/login/', // 로그인을 위한 API 엔드포인트 URL입니다.
        headers: { 
          'Content-Type': 'application/json' // 요청 헤더에 JSON 형태의 데이터를 전달함을 명시합니다.
        },
        data : data // 요청 바디에 변환한 JSON 데이터를 포함합니다.
      };
  
      const response = await axios(config); // axios를 사용하여 서버에 요청을 보냅니다.
  
      if (response.status === 200) { // 서버 응답 상태 코드가 200(성공)인 경우
        const token = response.data.access_token; // 응답에서 얻은 액세스 토큰을 가져옵니다.
        console.log(token); // 토큰을 콘솔에 출력합니다.
        storeToken(response.data.access_token); // AsyncStorage에 토큰을 저장합니다.
        navigation.reset({ // 네비게이션을 리셋하여 BottomTabNavigator 스택으로 이동합니다.
          index: 0,
          routes: [{ name: 'BottomTabNavigator', params: { token: token } }],
        });
      } else { // 서버가 다른 상태 코드를 반환한 경우
        setAlertMessage(`이메일 또는 비밀번호가 잘못되었습니다.`);
        setAlertModalVisible(true);
      }
    } catch (error) { // 오류 발생 시
      console.log(error); // 콘솔에 오류를 출력합니다.
      if (error.response) {
        console.log("Server Response", error.response); // 서버 응답 오류가 있는 경우 콘솔에 출력합니다.
      }
      if (error.request) {
        console.log("Server No Response", error.request); // 서버 응답이 없는 경우 콘솔에 출력합니다.
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
          <Text style={{ marginRight: 10 }} 
                onPress={() => navigation.navigate('Register')}
                //onPress={() => navigation.navigate('Privacy')}
          >
            회원가입
          </Text>
          <Text onPress={() => navigation.navigate('PwSearch')}>비밀번호 찾기</Text>
        </View>
      </View>

      {/* 모달창 */}
      <Modal 
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
        <View style={styles.alertModalContainer}>
          <Text style={{fontSize:20, fontWeight:'bold', color:'#000', padding: '1%'}}>오류!</Text>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setAlertModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  alertModalView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
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

export default LoginScreen; // LoginScreen 컴포넌트를 내보냅니다.