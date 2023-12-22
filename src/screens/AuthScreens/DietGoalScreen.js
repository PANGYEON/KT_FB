import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const DietGoalScreen = ({route}) => {
  const { email, password, name, birthdate, personheight, personweight, gender,levelIndex } = route.params;
  const navigation = useNavigation();
  const [goalIndex, setGoalIndex] = useState(-1); // -1 for no selection

  const goals = ['체중 감량', '체중 유지', '체중 증량'];

  const handleRegister = () => {
    const data = {
      "email": email,
      "name": name,
      "birthdate": birthdate,
      "active_level": levelIndex.toString(),
      "height": parseInt(personheight, 10),
    "weight": parseInt(personweight, 10),
      "diet_purpose": goalIndex >= 0 ? goals[goalIndex] : null,
      "password": password,
      "gender": gender
    };

    console.log("Register data:", data);
    const jsonData = JSON.stringify(data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://192.168.10.58:5500/api/user/',
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
    <View style={{ marginTop: 20 }}>
      {goals.map((goal, index) => (
        <View key={index} style={{ marginVertical: 5 }}>
          <Button
            onPress={() => setGoalIndex(index)}
            variant={index === goalIndex ? 'solid' : 'outline'}
            colorScheme={index === goalIndex ? 'blue' : 'gray'}>
            {goal}
          </Button>
        </View>
      ))}
      <Button onPress={() => navigation.navigate('ActivityLevel', { email, password, name, birthdate, personheight, personweight, gender,levelIndex })}>이전</Button>
      <Button onPress={(handleRegister)}>완료</Button>
    </View>
  );
};

export default DietGoalScreen;