import React from 'react';
import { Button, View,Input,Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
        <Input placeholder="이메일"/>
        <Input placeholder="비밀번호" secureTextEntry/>
        <Button onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'Home' })}>로그인 </Button>
        <Button > 카카오로 시작하기 </Button>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ marginRight: 10 }} onPress={() => navigation.navigate("Register")}>
          회원가입
        </Text>
        <Text onPress={() => navigation.navigate("PwSearch")}>비밀번호 찾기</Text> 
      </View>
    </View>

  );
}
export default LoginScreen;