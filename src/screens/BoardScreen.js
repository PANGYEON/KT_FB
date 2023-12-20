// BoardScreen.js
import React from 'react';
import { Button, View,Input,Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const BoardScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button onPress={() => navigation.navigate("Home")}>이전</Button>
    </View>
  );
}
export default BoardScreen;

