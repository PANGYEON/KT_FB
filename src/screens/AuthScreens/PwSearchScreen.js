// 비밀번호 찾기
import React from 'react';
import { Button, View,Input,Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
        <Input placeholder="이메일"/>
        <Button onPress={() => navigation.navigate("Login")}>이전</Button>
        <Button> 다음 </Button>
        
    </View>
  );
}

export default RegisterScreen;