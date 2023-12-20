// // 회원가입 - 활동 레벨
import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const ActivityLevelScreen = () => {
  const navigation = useNavigation();
  const [levelIndex, setLevelIndex] = useState(-1);
  const levels = [
    '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
    '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
    '3레벨 - 주 5회 이하, 운송업 종사자',
    '4레벨 - 주 6회 이상, 인부 혹은 광부',
    '5레벨 - 운동 선수'
  ];

  return (
    <View style={{ marginTop: 20 }}>
      {levels.map((level, index) => (
        <View key={index} style={{ marginVertical: 5 }}>
          <Button
            onPress={() => setLevelIndex(index)}
            variant={index === levelIndex ? 'solid' : 'outline'}
            colorScheme={index === levelIndex ? 'blue' : 'gray'}>
            {level}
          </Button>
        </View>
      ))}
      <Button onPress={() => navigation.navigate('RegisterInfo')} >이전</Button>
      <Button onPress={() => navigation.navigate('DietGoal')} >다음</Button>
    </View>
  );
};

export default ActivityLevelScreen;