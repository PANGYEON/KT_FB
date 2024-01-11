// 회원정보-기본정보작성페이지
import React, { useState } from 'react';
import { Button, View, Input, Text, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, ScrollView, Dimensions, KeyboardAvoidingView, TouchableOpacity, Modal } from 'react-native';
import DatePicker from 'react-native-date-picker'
 
 
// 사용자 정보 등록 화면 컴포넌트
const RegisterInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password } = route.params;
 
  // 사용자 정보 상태 관리
  const [name, setName] = useState(''); // 이름
  const [birthdate, setBirthdate] = useState(new Date()); // 생년월일
  const [open, setOpen] = useState(false); // DatePicker 모달 열기 여부
  const [personheight, setPersonheight] = useState(''); // 키
  const [personweight, setPersonweight] = useState(''); // 몸무게
  const [gender, setGender] = useState(null); // 성별
  const [selectedButton, setSelectedButton] = useState(null); // 선택된 성별 버튼
  const { width, height } = Dimensions.get('window'); // 화면 크기
 
  // 경고 모달 상태 및 스타일
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
 
  const contentContainerStyle = {
    ...styles.contentContainer,
    height: height * 0.75, // 화면 높이의 75%
  };
 
  const buttonContainerStyle = {
    ...styles.buttonContainer,
    alignItems: 'center',     // 수직축 중앙 정렬
    position: 'absolute',
    bottom: height * 0.08,    // 화면 아래쪽에서부터 8% 높이 위치
  };
 
  const prevButtonStyle = {
    ...styles.MovingButton,
    position: 'absolute',
    bottom: height * 0.002,    // 화면 아래쪽에서부터 8% 높이 위치
    left: width * 0.1,       // 왼쪽에서부터 너비의 3% 위치
    width: width * 0.35,      // 버튼 너비
    height: height * 0.075,   // 버튼 높이
  };
 
  const nextButtonStyle = {
    ...styles.MovingButton,
    position: 'absolute',
    bottom: height * 0.002,    // 화면 아래쪽에서부터 8% 높이 위치
    left: width * 0.55,      // 오른쪽에서부터 너비의 3% 위치
    width: width * 0.35,      // 버튼 너비
    height: height * 0.075,   // 버튼 높이
  };
  const inputContainerStyle = {
    marginTop: height * 0.001, // 각 입력 필드 상단 여백 동적 조정
    // 기타 스타일 속성
  };
  // 성별 버튼을 처리하는 함수
  const handleButtonPress = (gender) => {
    setSelectedButton(gender);
    setGender(gender);
  };
 
  // 다음 화면으로 이동하는 함수
  const navigateToNextPage = () => {
    // 필수 입력 필드 및 데이터 유효성 검사
    if (!name || !birthdate || !personheight || !personweight || !gender) {
      setAlertMessage('모든 필드를 채워주세요.');
      setAlertModalVisible(true);
    } else if (name.length > 10) {
      setAlertMessage('이름은 10자 이내여야 합니다.');
      setAlertModalVisible(true);
    } else if (personheight <= 0 || personheight > 250) {
      setAlertMessage('키는 0에서 250 사이여야 합니다.');
      setAlertModalVisible(true);
    } else if (personweight <= 0 || personweight > 250) {
      setAlertMessage('몸무게는 0에서 250 사이여야 합니다.');
      setAlertModalVisible(true);
    } else {
      // 사용자 정보를 다음 화면으로 전달하며 이동
      navigation.navigate('ActivityLevel', {
        email,
        password,
        name,
        birthdate: formatDate(birthdate),
        personheight,
        personweight,
        gender,
      });
    }
  };
 
  // 날짜 포맷 변경 함수
  const formatDate = (date) => {
    let formattedDate = date.getFullYear() + "-"
                       + String(date.getMonth() + 1).padStart(2, '0') + "-"
                       + String(date.getDate()).padStart(2, '0');
    return formattedDate;
  };
 
 
  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={contentContainerStyle}>
            {/* 사용자 정보 입력 필드 */}
            {/* 이름 */}
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >이름 </Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChangeText={(value) => { setName(value) }} />
              </View>
            </View>
            {/* 생년월일 */}
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >생년월일 </Text></View>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setOpen(true)}>
                <Text style={{ marginTop:'3%', marginBottom:'3%',borderRadius: 50,backgroundColor: 'white',color: 'grey',marginLeft:'4%' }}>
                  {birthdate instanceof Date && birthdate != new Date()
                    ? birthdate.toLocaleDateString()
                    : "생년월일을 선택해주세요"
                  }
                </Text>
              </TouchableOpacity>
 
              {/* DatePicker 모달 */}
              <DatePicker
                modal
                open={open}
                date={birthdate}
                mode="date"
                locale="ko"
                onConfirm={(date) => {
                  setOpen(false);
                  setBirthdate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                confirmText="확인"
                cancelText="취소"
              />
            </View>
 
            {/* 키 */}
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >키 </Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="키를 입력해주세요"
                  value={personheight}
                  onChangeText={(value) => { setPersonheight(value) }}
                  keyboardType="numeric"
                />
              </View>
            </View>
 
            {/* 몸무게 */}
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >몸무게 </Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="몸무게를 입력해주세요"
                  value={personweight}
                  onChangeText={(value) => { setPersonweight(value) }}
                  keyboardType="numeric"
                  />
              </View>
            </View>
 
            {/* 성별 */}
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >성별 </Text></View>
              <Box direction="row" mb="2.5" mt="1.5">
                <Button.Group isAttached>
                  <Button style={[styles.sexButton, selectedButton === '남자' ? styles.sexButtonSelected : {}]}
                    onPress={() => handleButtonPress('남자')}>
                    <Text style={selectedButton === '남자' ? styles.buttonTextSelected : styles.buttonText}>남자</Text>
                  </Button>
                  <Button style={[styles.sexButton, selectedButton === '여자' ? styles.sexButtonSelected : {}]}
                    onPress={() => handleButtonPress('여자')}>
                    <Text style={selectedButton === '여자' ? styles.buttonTextSelected : styles.buttonText}>여자</Text>
                  </Button>
                </Button.Group>
              </Box>
            </View>
 
            {/* 다음과 이전 화면으로 이동하는 버튼 */}
            <View style={buttonContainerStyle}>
              <Button style={prevButtonStyle} onPress={() => navigation.navigate("Register", { email, password })}>
                이전
              </Button>
              <Button style={nextButtonStyle} onPress={navigateToNextPage}>
                다음
              </Button>
            </View>
          </View>
 
          {/* 유효성 검사 및 에러메세지를 표시하는 알림 모달 */}
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
};
const styles = StyleSheet.create({
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
  },
  loginButton: {
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: '#8E86FA',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단에 정렬
    marginBottom: -15, // 하단 여백
  },
  buttonText: {
    color: 'black', // 기본 글자색
  },
 
  buttonTextSelected: {
    color: 'white', // 선택된 버튼의 글자색
  },
  sexButton: {
    flex: 1,
    marginHorizontal: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white', // 기본 배경색
    textStyle: {
      color: 'black' // 기본 글자색
    }
  },
 
  sexButtonSelected: {
    backgroundColor: '#8E86FA', // 선택된 버튼의 배경색 (보라색)
    color: 'white', // 선택된 버튼의 글자색 (흰색)
  },
 
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
  },
  buttonText: {
    color: 'black',
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
 
 
export default RegisterInfoScreen;