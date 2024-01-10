import React, { useState } from 'react';

import { Button, View, Input, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Alert, Modal, TouchableOpacity, Image } from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('@user_token', token);
    } catch (e) {
      console.log('eeeeee')
      setAlertMessage(`token error`);
      setAlertModalVisible(true);
    }
  }


  const handleLogin = async () => {
    try {
      let data = JSON.stringify({
        "email": email,
        "password": password
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/login/',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
  
      const response = await axios(config);
  
      if (response.status === 200) {
        // 로그인 성공 처리
        
        const token = response.data.access_token;
        console.log(token)
        storeToken(response.data.access_token);
        // navigation.replace('BottomTabNavigator', { screen: '홈',params: { token: token }, }); // 뒤로가기 누르면 바로 종료
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabNavigator', params: { token: token } }],
        });
        // navigation.navigate('BottomTabNavigator', { token, uuid });
      } else {
        // 서버가 로그인 실패에 대해 다른 상태 코드를 반환하는 경우
        //Alert.alert("로그인 실패", "이메일 또는 비밀번호가 잘못되었습니다.");
        setAlertMessage(`이메일 또는 비밀번호가 잘못되었습니다.`);
        setAlertModalVisible(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("Server Response", error.response);
      }
      if (error.request) {
        console.log("Server No Response", error.request);
      }

      setAlertMessage(`이메일 또는 비밀번호가 잘못되었습니다.`);
      setAlertModalVisible(true);
      //Alert.alert("오류 발생", "로그인 중 문제가 발생했습니다.");
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
            borderWidth: 0, // Set border width to 0 to remove the border
          }}
        >
          <Input
            placeholder="이메일"
            value={email}
            onChangeText={(value) => setEmail(value)}
            borderColor="transparent" // Set the border color to transparent
            underlineColorAndroid="transparent" // Set underline color to transparent for Android
          />
        </View>
        <View
          style={{
            marginBottom: 10,
            borderRadius: 50,
            backgroundColor: 'white',
            borderWidth: 0, // Set border width to 0 to remove the border
          }}
        >
          <Input
            placeholder="비밀번호"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry
            borderColor="transparent" // Set the border color to transparent
            underlineColorAndroid="transparent" // Set underline color to transparent for Android
          />
        </View>
        <Button
          onPress={handleLogin}
          // onPress={() => navigation.navigate('BottomTabNavigator')}
          //////////////////////////////////////////////////////////////////////////////////////////
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

      <Modal 
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
        <View style={styles.alertModalContainer}>
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
    //height: 150,
    //width: 300,
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

