// // 회원가입 - 이름, 생년월일, 키, 몸무게, 성별
import React, { useState } from 'react';
import { Button, View,Input,Text,Box } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const RegisterInfoScreen = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState(null);

  return (
    <View>
      <Input placeholder="이름" />
      <Input placeholder="생년월일" />
      <Input placeholder="키" />
      <Input placeholder="몸무게" />

      <Box direction="row" mb="2.5" mt="1.5">
        <Button.Group isAttached>
          <Button
            onPress={() => setGender('남자')}
            variant={gender === '남자' ? 'solid' : 'outline'}>
            남자
          </Button>
          <Button
            onPress={() => setGender('여자')}
            variant={gender === '여자' ? 'solid' : 'outline'}>
            여자
          </Button>
        </Button.Group>
      </Box>

      <Button title="이전" onPress={() => navigation.navigate('Register')} >이전</Button>
      <Button title="다음" onPress={() => navigation.navigate('ActivityLevel')} >다음</Button>
      </View>
  );
};

export default RegisterInfoScreen;