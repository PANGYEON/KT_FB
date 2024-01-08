
import React, { useState } from 'react';
import { Button, View, Input, Text, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, ScrollView, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker'


const RegisterInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password } = route.params;
  const [name, setName] = useState(''); //이름


  const [birthdate, setBirthdate] = useState(new Date());
  const [open, setOpen] = useState(false);


  const [personheight, setPersonheight] = useState(""); //키
  const [personweight, setPersonweight] = useState(""); //몸무게
  const [gender, setGender] = useState(null); //성별
  const [selectedButton, setSelectedButton] = useState(null);
  const { width, height } = Dimensions.get('window'); // 화면의 너비와 높이
  const contentContainerStyle = {
    ...styles.contentContainer,
    height: height * 0.75, // 화면 높이의 75%
  };

  const buttonContainerStyle = {
    ...styles.buttonContainer,
    // justifyContent: 'center', // 수평축 중앙 정렬
    alignItems: 'center',     // 수직축 중앙 정렬
    position: 'absolute',
    bottom: height * 0.08,    // 화면 아래쪽에서부터 8% 높이 위치
    // width: '100%',            // 너비를 화면의 100%로 설정
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
  const handleButtonPress = (gender) => {
    setSelectedButton(gender);
    setGender(gender); // 성별 상태를 업데이트

  };
  const navigateToNextPage = () => {
    if (!name || !birthdate || !personheight || !personweight || !gender) {
      Alert.alert("경고", "모든 필드를 채워주세요.");
    } else if (name.length > 10) {
      Alert.alert("경고", "이름은 10자 이내여야 합니다.");
    } else if (personheight <= 0 || personheight > 250) {
      Alert.alert("경고", "키는 0에서 250 사이여야 합니다.");
    } else if (personweight <= 0 || personweight > 250) {
      Alert.alert("경고", "몸무게는 0에서 250 사이여야 합니다.");
    } else {
      navigation.navigate("ActivityLevel", { 
        email, 
        password, 
        name, 
        birthdate: formatDate(birthdate), // Format the date here
        personheight, 
        personweight, 
        gender 
      });
    }
  };
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
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >이름</Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChangeText={(value) => { setName(value) }} />
              </View>
            </View>
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >생년월일</Text></View>
              <TouchableOpacity style={styles.inputContainer} onPress={() => setOpen(true)}>
                <Text style={{ marginTop:'3%', marginBottom:'3%',borderRadius: 50,backgroundColor: 'white',color: 'grey',marginLeft:'4%' }}>
                  {birthdate instanceof Date && birthdate != new Date()
                    ? birthdate.toLocaleDateString()
                    : "생년월일을 선택해주세요"
                  }
                </Text>
              </TouchableOpacity>
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

            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >키</Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="키를 입력해주세요"
                  value={personheight}
                  onChangeText={(value) => { setPersonheight(value) }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >몸무게</Text></View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="몸무게를 입력해주세요"
                  value={personweight}
                  onChangeText={(value) => { setPersonweight(value) }}
                  keyboardType="numeric"
                  />
              </View>
            </View>
            <View style={inputContainerStyle}>
              <View><Text style={{ marginLeft: width * 0.02, fontSize: 16 }} >성별</Text></View>
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


            <View style={buttonContainerStyle}>
              <Button style={prevButtonStyle} onPress={() => navigation.navigate("Register", { email, password })}>
                이전
              </Button>
              <Button style={nextButtonStyle} onPress={navigateToNextPage}>
                다음
              </Button>
            </View>
          </View>
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
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  // },
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
    // borderRadius:20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white', // 기본 배경색
    // 추가된 부분: textStyle을 통한 글자색 설정
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

    // width: '35%', // 너비를 35%로 증가
    // height: '61%', // 높이 설정
  },
  buttonText: {
    color: 'black',
  },

});


export default RegisterInfoScreen;