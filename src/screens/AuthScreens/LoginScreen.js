

import React, { useState } from 'react';

import { Button, View, Input, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ReportScreen from '../ReportScreen';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const axios = require('axios');
  // let data = JSON.stringify({
  //   "email": email,
  //   "password": password
  // });
   
  // let config = {
  //   method: 'post',
  //   maxBodyLength: Infinity,
  //   url: 'http://192.168.10.58:5500/api/login/',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   data : data
  // };
   
  const handleLogin = async () => {
    try {
      let data = JSON.stringify({
        email: email,
        password: password
      });
  
      let config = {
        method: 'post',
        url: 'http://192.168.10.58:5500/api/login/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };
  
      const response = await axios(config);
  
      if (response.status === 200) {
        // 로그인 성공 처리
        console.log(response)
        navigation.navigate('BottomTabNavigator', { screen: 'Home' });
      } else {
        // 서버가 로그인 실패에 대해 다른 상태 코드를 반환하는 경우
        Alert.alert("로그인 실패", "이메일 또는 비밀번호가 잘못되었습니다.");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        console.log("Server Response", error.response);
      }
      if (error.request) {
        console.log("Server No Response", error.request);
      }
  
      Alert.alert("오류 발생", "로그인 중 문제가 발생했습니다.");
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
    </View>
  );
};

export default LoginScreen;

