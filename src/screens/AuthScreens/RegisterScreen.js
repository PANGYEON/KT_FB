// 회원가입 - 이메일,비밀번호
import React from 'react';
import { Button, View,Input,Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
        <Input placeholder="이메일"/>
        <Input placeholder="비밀번호" secureTextEntry/>
        <Input placeholder="비밀번호 확인" secureTextEntry/>
        <Button onPress={() => navigation.navigate("Login")}>이전</Button>
        <Button onPress={() => navigation.navigate("RegisterInfo")}>다음</Button>
        
    </View>
  );
}

export default RegisterScreen;