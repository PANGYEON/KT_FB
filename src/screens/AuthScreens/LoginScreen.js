


import React from 'react';
import { Button, View, Input, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

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
            secureTextEntry
            borderColor="transparent" // Set the border color to transparent
            underlineColorAndroid="transparent" // Set underline color to transparent for Android
          />
        </View>
        <Button
          onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}
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

