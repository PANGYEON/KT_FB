
import React, { useState } from 'react';
import { Button, View, Input, Text } from 'native-base';
import { StyleSheet, Alert, Dimensions, KeyboardAvoidingView, ScrollView,Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

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
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 이메일 중복 확인 함수
  const checkEmailExistence = async (email) => {
    try {
      let config = {
        method: 'post',
        url: 'http://edm.japaneast.cloudapp.azure.com/api/check-email-existence/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email })
      };
      const response = await axios.request(config);
      return response.data; // 서버로부터 받은 응답 반환
    } catch (error) {
      setAlertMessage(`이메일 중복 확인 중 오류 발생: ${error}`);
      setAlertModalVisible(true);
      //console.error("이메일 중복 확인 중 오류 발생:", error);
      return null; // 오류 발생 시 null 반환
    }
  };
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


  const handleNextPage = async () => {
    if (!email || !password || !confirmPassword) {
      setAlertMessage(`이메일과 비밀번호를 모두 입력해주세요.`);
      setAlertModalVisible(true);
      //Alert.alert("오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (isPasswordValid && isPasswordsMatch) {
      // 이메일 중복 확인
      const emailCheckResult = await checkEmailExistence(email);
      if (emailCheckResult && emailCheckResult.message === "이미 사용 중인 이메일입니다.") {
        setAlertMessage(`이메일이 중복입니다. 다시 입력해주세요.`);
        setAlertModalVisible(true);
        //Alert.alert("오류", "이메일이 중복입니다. 다시 입력해주세요.");
        return;
      }
      // 중복이 아닌 경우 다음 페이지로 네비게이션
      navigation.navigate("RegisterInfo", { email, password });
    } else {
      setAlertMessage(`비밀번호 조건을 확인해주세요.`);
      setAlertModalVisible(true);
      //Alert.alert("오류", "비밀번호 조건을 확인해주세요.");
    }
  };

  const emailInputContainerStyle = {
    
    marginTop: height * 0.02, // 화면 높이의 70% 위치에 설정
    // 기타 필요한 스타일 속성 추가
  };
  const passwordInputContainerStyle = {
    marginTop: height * 0.02, // 화면 높이의 55% 위치에 설정
    // 기타 필요한 스타일 속성 추가
  };
  const passwordconfirmInputContainerStyle = {
    marginTop: height * 0.02, // 화면 높이의 40% 위치에 설정
    // 기타 필요한 스타일 속성 추가
  };
  const contentContainerStyle = {
    ...styles.contentContainer,
    height: height * 0.75, // 화면 높이의 75%
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
            <View style={emailInputContainerStyle}>
              {/* <View style={{ marginTop: '6%' }} /> */}
              <Text style={{ marginLeft: 5, fontSize: 16 }} >이메일 </Text>
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
            
            <View style={passwordInputContainerStyle}>
              <Text style={{ marginLeft: 5, fontSize: 16 }}>비밀번호 </Text>
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
            </View>

            <View style={passwordconfirmInputContainerStyle}>
              <Text style={{ marginLeft: 5, fontSize: 16 }}>비밀번호 확인 </Text>
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
            </View>

            <View style={buttonContainerStyle}>
              <Button style={movingButtonStyle} onPress={() => navigation.navigate("Login")}>
                이전
              </Button>

              <Button style={movingButtonStyle} onPress={handleNextPage}>
                다음
              </Button>
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
              <Text style={styles.alertText}>{alertMessage} </Text>
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

export default RegisterScreen;
