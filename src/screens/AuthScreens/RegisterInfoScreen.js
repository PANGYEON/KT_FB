
import React, { useState } from 'react';
import { Button, View, Input, Text, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Alert, ScrollView, Dimensions,KeyboardAvoidingView } from 'react-native';


const RegisterInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password } = route.params;
  const [name, setName] = useState(''); //이름
  const [birthdate, setBirthdate] = useState(""); //생년월일
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
    position: 'absolute',
    bottom: height * 0.08, // 화면 아래쪽에서부터 8% 높이 위치
    width: '100%',
  };
  const movingButtonStyle = {
    ...styles.MovingButton,
    width: width * 0.35, // 화면 너비의 35%
    height: height * 0.075, // 화면 높이의 7.5%
    marginHorizontal: width * 0.08, // 좌우 마진
  };
  const handleButtonPress = (gender) => {
    setSelectedButton(gender);
    setGender(gender); // 성별 상태를 업데이트

  };
  const navigateToNextPage = () => {
    if (!name || !birthdate || !personheight || !personweight || !gender) {
      Alert.alert("경고", "모두 입력해주세요");
    } else {
      navigation.navigate("ActivityLevel", { email, password, name, birthdate, personheight, personweight, gender });
    }
  };
  return (
    <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={contentContainerStyle}>
      <View><Text style={{ marginLeft:5,fontSize : 16 }} >이름</Text></View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="이름을 입력해주세요"
            value={name}
            onChangeText={(value) => { setName(value) }} />
        </View>
        <View><Text style={{ marginLeft:5,fontSize : 16 }} >생년월일</Text></View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="생년월일을 입력해주세요"
            value={birthdate}
            onChangeText={(value) => { setBirthdate(value) }} />
        </View>
        <View><Text style={{ marginLeft:5,fontSize : 16 }} >키</Text></View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="키를 입력해주세요"
            value={personheight}
            onChangeText={(value) => { setPersonheight(value) }}
          />
        </View>
        <View><Text style={{ marginLeft:5,fontSize : 16 }} >몸무게</Text></View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="몸무게를 입력해주세요"
            value={personweight}
            onChangeText={(value) => { setPersonweight(value) }} />
        </View>
        <View><Text style={{ marginLeft:5,fontSize : 16 }} >성별</Text></View>
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


        <View style={buttonContainerStyle}>
                  <Button style={movingButtonStyle} onPress={() => navigation.navigate("Register", { email, password })}>
                이전
              </Button>
              <Button style={movingButtonStyle} onPress={navigateToNextPage}>
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
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
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
    width: '35%', // 너비를 35%로 증가
    height: '61%', // 높이 설정
  },
  buttonText: {
    color: 'black',
  },

});

const edm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  contentContainer: {
    backgroundColor: '#D7D4FF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 70,
    padding: 40,
    height: '70%',
  },
});
export default RegisterInfoScreen;