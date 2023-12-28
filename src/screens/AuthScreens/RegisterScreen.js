
import React, { useState } from 'react';
import { Button, View, Input, Text } from 'native-base';
import { StyleSheet, Alert, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 이메일 및 비밀번호 정규식
const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/i;
const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

const emailCheck = (email) => {
  return emailRegEx.test(email);
}

const passwordCheck = (password) => {
  return passwordRegEx.test(password);
}

const RegisterScreen = ({ route }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [confirmPassword, setConfirmPassword] = useState('');
  const isPasswordsMatch = password === confirmPassword;
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { width, height } = Dimensions.get('window');

  const handlePasswordChange = (password) => {
    setPassword(password);
    setIsPasswordValid(passwordCheck(password));
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

  const renderPasswordError = () => {
    if (password.length > 0 && !passwordCheck(password)) {
      return (
        <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%', marginTop: '-3%' }}>
          영문, 숫자, 특수문자를 포함한 8-20자리
        </Text>
      );
    }
    return <View style={{ height: 8 }} />;
  };
  const renderConfirmPasswordError = () => {
    if (confirmPassword.length > 0 && !isPasswordsMatch) {
      return (
        <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%', marginTop: '-3%' }}>
          비밀번호가 일치하지 않습니다.
        </Text>
      );
    }
    return <View style={{ height: 8 }} />;
  };
  const handleNextPage = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (isPasswordValid && isPasswordsMatch) {
      navigation.navigate("RegisterInfo", { email, password });
    } else {
      Alert.alert("오류", "비밀번호 조건을 확인해주세요.");
    }
  };
  const contentContainerStyle = {
    ...styles.contentContainer,
    height: height * 0.75, // 화면 높이의 70%
  };
  const buttonContainerStyle = {
    ...styles.buttonContainer,
    position: 'absolute',  // 절대 위치 사용
    bottom: height * 0.08, // 화면 아래쪽에서부터 5% 높이 위치
    width: '100%',         // 컨테이너의 너비를 전체 화면 너비로 설정
    // paddingHorizontal: 20, // 좌우 패딩 추가 (필요에 따라 조절)
    // justifyContent: 'center' // 버튼들을 수평 방향으로 가운데 정렬

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
            <View style={{ marginTop: '6%' }} />
            <Text style={{ marginLeft: 5, fontSize: 16 }} >이메일</Text>
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
            <View style={{ marginTop: '6%' }} />
            {/* <View style={{ height: 2 }} /> */}
            <Text style={{ marginLeft: 5, fontSize: 16 }}>비밀번호</Text>
            <View style={styles.inputContainer}>
              <Input
                placeholder="비밀번호를 입력해주세요"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
                borderWidth={2}
                _focus={{
                  backgroundColor: "none",
                  borderColor: passwordCheck(password) ? "transparent" : "red.600"
                }}
              />
            </View>

            {renderPasswordError()}
            <View style={{ marginTop: '6%' }} />
            <Text style={{ marginLeft: 5, fontSize: 16 }}>비밀번호 확인</Text>
            <View style={styles.inputContainer}>
              <Input
                placeholder="비밀번호를 다시 입력해주세요"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                borderWidth={2}
                borderColor={isPasswordsMatch || confirmPassword.length === 0 ? "gray.300" : "red.600"}
                _focus={{
                  backgroundColor: "none",
                  borderColor: isPasswordsMatch ? "transparent" : "red.600"
                }}
              />
            </View>
            {renderConfirmPasswordError()}
            <View style={buttonContainerStyle}>
              <Button style={movingButtonStyle} onPress={() => navigation.navigate("Login")}>
                이전
              </Button>

              <Button style={movingButtonStyle} onPress={handleNextPage}>
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
