import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StyleSheet, Text, Alert } from 'react-native';

const DietGoalScreen = ({ route }) => {
  const { email, password, name, birthdate, personheight, personweight, gender, levelIndex } = route.params;
  const navigation = useNavigation();
  const [goalIndex, setGoalIndex] = useState(-1); // -1 for no selection

  const goals = ['체중 감량', '체중 유지', '체중 증량'];
  const handleLevelSelect = (index) => {
    setGoalIndex(index + 1); // 인덱스에 1을 더함
  };
  const handleRegister = () => {
    if (goalIndex === -1) {
      Alert.alert("경고", "목표를 선택해주세요.");
      return;
    }

    const adjustedGoalIndex = goalIndex + 1;
    const data = {
      "email": email,
      "name": name,
      "birthdate": birthdate,
      "active_level": levelIndex.toString(),
      "height": parseInt(personheight, 10),
      "weight": parseInt(personweight, 10),
      "diet_purpose": adjustedGoalIndex >= 0 ? goals[adjustedGoalIndex - 1] : null, // 인덱스 1 증가
      "password": password,
      "gender": gender
    };

    console.log("Register data:", data);
    const jsonData = JSON.stringify(data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://192.168.10.53:5500/api/user/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: jsonData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigation.navigate('Login');
      })
      .catch((error) => {
        // 에러 메시지 자세히 출력
        console.log('Error object:', error);

        if (error.response) {
          console.log('Error response:', error.response);
          if (error.response.data) {
            console.log('Error response data:', error.response.data);
            if (error.response.data.display_message) {
              console.log('Display message:', error.response.data.display_message);
              Alert.alert('회원가입 오류', error.response.data.display_message);
            }
          }
        } else if (error.request) {
          console.log('Error request:', error.request);
        } else {
          console.log('Error message:', error.message);
        }

        Alert.alert('회원가입 실패', '회원가입 중 오류가 발생했습니다.');
      });

  }

  return (
    <View style={edm.container}>
      <View style={edm.contentContainer}>
      <View style={styles.goalTextView}>
          <Text style={styles.goalTextText}>목적</Text>
        </View>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalButtonContainer}>
            <Button
              onPress={() => setGoalIndex(index)}
              style={goalIndex === index ? styles.activeGoalButton : styles.inactiveGoalButton}>
              <Text style={goalIndex === index ? styles.activeGoalButtonText : styles.inactiveGoalButtonText}>
                {goal}
              </Text>
            </Button>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('ActivityLevel', { email, password, name, birthdate, personheight, personweight, gender, levelIndex })}>
            이전
          </Button>
          <Button style={styles.MovingButton} onPress={handleRegister}>
            완료
          </Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  goalTextView: {
    alignItems: 'center', // 가로축 기준 가운데 정렬
    justifyContent: 'center', // 세로축 기준 가운데 정렬
  },
  goalTextText: {
    fontSize: 20, marginBottom: 10 // 글자 크기 설정
  },
  goalButtonContainer: {
    marginVertical: 5,
  },
  activeGoalButton: {
    borderRadius:20,
    marginBottom:10,
    backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색 (보라색)
  },
  inactiveGoalButton: {
    borderRadius:20,
    marginBottom:10,
    backgroundColor: '#FFFFFF', // 기본 배경색 (흰색)
  },
  activeGoalButtonText: {
    color: 'white', // 눌러진 버튼의 글자색 (흰색)
  },
  inactiveGoalButtonText: {
    
    color: 'black', // 기본 버튼의 글자색 (검은색)
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%', // 너비를 35%로 증가
    height: '20%', // 높이 설정
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단에 정렬
    marginBottom: -15, // 하단 여백
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
    marginTop: 20,
    padding: 40,
    height: '70%',
  },
});

export default DietGoalScreen;