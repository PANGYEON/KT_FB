
import React, { useState } from 'react';
import { Button, View, Input, Text, Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';


const RegisterInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password } = route.params;
  //const [gender, setGender] = useState(null);
  const [name, setName] = useState(''); //이름
  const [birthdate, setBirthdate] = useState(""); //생년월일
  const [personheight, setPersonheight] = useState(""); //키
  const [personweight, setPersonweight] = useState(""); //몸무게
  const [gender, setGender] = useState(null); //성별
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonPress = (gender) => {
    setSelectedButton(gender);
    setGender(gender); // 성별 상태를 업데이트

  };

  return (
    <View style={edm.container}>
      <View style={edm.contentContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="이름"
            value={name}
            onChangeText={(value) => { setName(value) }} />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="생년월일"
            value={birthdate}
            onChangeText={(value) => { setBirthdate(value) }} />
        </View>

        <View style={styles.inputContainer}>
          <Input
            placeholder="키"
            value={personheight}
            onChangeText={(value) => { setPersonheight(value) }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Input
            placeholder="몸무게"
            value={personweight}
            onChangeText={(value) => { setPersonweight(value) }} />
        </View>

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


        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton} onPress={() => navigation.navigate("Register", { email, password })}>
            이전
          </Button>

          <Button style={styles.MovingButton} onPress={() => navigation.navigate("ActivityLevel", { email, password, name, birthdate, personheight, personweight, gender })}>
            다음
          </Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderRadius: 0,
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
    width: '25%',
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