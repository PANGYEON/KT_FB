// 비밀번호 찾기
import React, { useState } from 'react';
import { Button, View,Input,Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios';


const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/i;
 
const emailCheck = (email) => {
  return emailRegEx.test(email);
}
 
const { width, height } = Dimensions.get('window');
 
const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  
  const requestPasswordReset = async (email) => {
    try {
      const data = JSON.stringify({ "email": email });
      const config = {
        method: 'post',
        url: 'http://edm.japaneast.cloudapp.azure.com/api/password-reset/',
        headers: { 'Content-Type': 'application/json' },
        data: data
      };
  
      const response = await axios(config);
      console.log(response.data); // 응답 데이터 확인
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error("Error in password reset request: ", error);
      return null; // 에러 발생 시 null 반환
    }
  };
  const renderEmailError = () => {
    if (email.length > 0 && !emailCheck(email)) {
      return (
        <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%', marginTop: '-3%' }}>
          이메일 형식이 맞지 않습니다.
        </Text>
      );
    }
    return <View style={{ height: 8 }} />;
  };
 
  const handleNextPage = async () => {
    if (email.length === 0 || !emailCheck(email)) {
      Alert.alert("오류", "올바른 이메일을 입력해주세요.");
      return;
    }
  
    // 비밀번호 재설정 요청
    const resetResponse = await requestPasswordReset(email);
    if (resetResponse) {
      Alert.alert("성공", "비밀번호 재설정 이메일이 발송되었습니다.");
      navigation.navigate("Login");
    } else {
      Alert.alert("오류", "비밀번호 재설정 요청에 실패했습니다.");
    }
  };
 
  const emailInputContainerStyle = {
   
    marginTop: height * 0.02, // 화면 높이의 70% 위치에 설정
    // 기타 필요한 스타일 속성 추가
  };
 
  const contentContainerStyle = {
    ...styles.contentContainer,
    height: height * 0.75, // 화면 높이의 75%
  };
 
  const buttonContainerStyle = {
    ...styles.buttonContainer,
    position: 'absolute',  // 절대 위치 사용
    bottom: height * 0.4, // 화면 아래쪽에서부터 5% 높이 위치
    width: '100%',         // 컨테이너의 너비를 전체 화면 너비로 설정
  };
  const movingButtonStyle = {
    ...styles.MovingButton,
    width: width * 0.35, // 화면 너비의 %
    height: height * 0.075, // 화면 높이의 %
    marginHorizontal: width * 0.08,   // 좌우 마진 추가
 
  };
 
 
  return (
    <KeyboardAvoidingView
      behavior="height"  // 안드로이드에 적합한 behavior 설정
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
 
        <View style={styles.container}>
          <View style={contentContainerStyle}>
            <View style={emailInputContainerStyle}>
              <Text style={{ marginLeft: 5, fontSize: 16 }} >가입하신 이메일을 입력해주세요</Text>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChangeText={(value) => setEmail(value)}
                  variant="outline"
                  w="100%"
                  borderWidth={2}
                  borderColor={emailCheck(email) || email.length === 0 ? "gray.300" : "red.600"}
                  _focus={{
                    backgroundColor: "none",
                    borderColor: emailCheck(email) ? "transparent" : "red.600"
                  }}
                />
              </View>
              {renderEmailError()}
            </View>
           
            <View style={buttonContainerStyle}>
              <Button style={movingButtonStyle} onPress={() => navigation.navigate("Login")}>
                이전
              </Button>
 
              <Button
                style={movingButtonStyle}
                onPress={handleNextPage}
              >
                다음
              </Button>
            </View>
          </View>
 
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
 
 
const styles = StyleSheet.create({
  // 정적 스타일 정의
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    backgroundColor: '#D7D4FF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 70,
    padding: 40,
  },
  inputContainer: {
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: 'white',
    width: '100%', // 전체 너비의 80%
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
  },
});
 
export default RegisterScreen;
