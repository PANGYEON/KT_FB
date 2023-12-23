// // 회원가입 - 활동 레벨
import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, Alert } from 'react-native';

const ActivityLevelScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password, name, birthdate, personheight, personweight, gender } = route.params;
  const [levelIndex, setLevelIndex] = useState(-1);
  const handleLevelSelect = (index) => {
    setLevelIndex(index + 1); // 인덱스에 1을 더함
  };
  const levels = [
    '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
    '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
    '3레벨 - 주 5회 이하, 운송업 종사자',
    '4레벨 - 주 6회 이상, 인부 혹은 광부',
    '5레벨 - 운동 선수'
  ];
  const navigateToNextPage = () => {
    if (levelIndex === -1) {
      Alert.alert("경고", "활동 레벨을 선택해주세요.");
    } else {
      navigation.navigate('DietGoal', { email, password, name, birthdate, personheight, personweight, gender, levelIndex });
    }
  };
  return (
    <View style={edm.container}>
      <View style={edm.contentContainer}>
        <View style={styles.levelTextView}>
          <Text style={styles.levelTextText}>활동 레벨</Text>
        </View>
        {levels.map((level, index) => (
          <View key={index} style={{ marginVertical: 5 }}>
            <Button
              onPress={() => handleLevelSelect(index)}
              style={levelIndex === index + 1 ? styles.activeButton : styles.inactiveButton}
              _text={levelIndex !== index + 1 ? styles.inactiveButtonText : {}}
            >
              {level}
            </Button>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('RegisterInfo', { email, password, name, birthdate, personheight, personweight, gender, levelIndex })} >이전</Button>
          <Button style={styles.MovingButton} onPress={navigateToNextPage}>다음</Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  levelTextView: {
    alignItems: 'center', // 가로축 기준 가운데 정렬
    justifyContent: 'center', // 세로축 기준 가운데 정렬
  },
  levelTextText: {
    fontSize: 20, marginBottom: 10 // 글자 크기 설정
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%', // 너비를 35%로 증가
    height: '40%', // 높이 설정
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단에 정렬
    marginBottom: -15, // 하단 여백
  },
  activeButton: {
    marginBottom:10,
    borderRadius:20,
    backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색
  },
  inactiveButton: {
    marginBottom:10,
    borderRadius:20,
    backgroundColor: '#FFFFFF', // 기본 배경색

  },
  inactiveButtonText: {
    color: 'black', // 선택되지 않은 버튼의 폰트 색상
  },
})
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
  // defaultButton: {
  //   backgroundColor: 'white', // 기본 배경색을 흰색으로 설정
  //   borderColor: '#8E86FA',   // 테두리 색상
  //   borderWidth: 2,          // 테두리 두께
  // },
  // selectedButton: {
  //   backgroundColor: '#8E86FA', // 선택된 버튼의 배경색을 보라색으로 설정
  //   borderColor: '#8E86FA',     // 테두리 색상
  // },
});
export default ActivityLevelScreen;