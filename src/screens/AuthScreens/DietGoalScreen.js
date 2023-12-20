import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const DietGoalScreen = () => {
  const navigation = useNavigation();
  const [goalIndex, setGoalIndex] = useState(-1); // -1 for no selection

  const goals = ['체중 감량', '체중 유지', '체중 증량'];

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
      <Button onPress={() => navigation.navigate('ActivityLevel')}>이전</Button>
      <Button onPress={() => navigation.navigate('Login')}>다음</Button>
    </View>
  );
};

export default DietGoalScreen;