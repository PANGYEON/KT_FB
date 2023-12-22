// BoardScreen.js
import React, { useState } from 'react';
import { Button, View, Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const BoardScreen = () => {
  const navigation = useNavigation();
  // 텍스트 상태를 관리하기 위한 useState 훅
  const [text, setText] = useState('');

  // 버튼 클릭시 실행될 함수
  const handlePress = () => {
    console.log(text);  // 콘솔에 텍스트 출력
    navigation.navigate("Home");
  }

  return (
    <View>
      <Input 
        value={text}
        onChangeText={setText} // 텍스트가 변경될 때마다 text 상태를 업데이트
        placeholder="여기에 텍스트를 입력하세요"
      />
      <Button onPress={handlePress}>이전</Button>
    </View>
  );
}

export default BoardScreen;

