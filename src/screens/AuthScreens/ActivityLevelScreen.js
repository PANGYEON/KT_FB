// // 회원가입 - 활동 레벨
import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, Alert, Modal, TouchableOpacity } from 'react-native';

const ActivityLevelScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email, password, name, birthdate, personheight, personweight, gender } = route.params;
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // const [levelIndex, setLevelIndex] = useState(-1);
  const handleLevelSelect = (index) => {
    setSelectedActivityLevel(levels[index]);
  };
  const [selectedActivityLevel, setSelectedActivityLevel] = useState('');

  const levels = [
    '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
    '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
    '3레벨 - 주 5회 이하, 운송업 종사자',
    '4레벨 - 주 6회 이상, 인부 혹은 광부',
    '5레벨 - 운동 선수'
  ];
  const navigateToNextPage = () => {
    if (selectedActivityLevel === '') {
      //Alert.alert("경고", "활동 레벨을 선택해주세요.");
      setAlertMessage(`활동 레벨을 선택해주세요.`);
      setAlertModalVisible(true);
    } else {
      navigation.navigate('DietGoal', { 
        email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel 
      });
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
      style={selectedActivityLevel === level ? styles.activeButton : styles.inactiveButton}
      _text={selectedActivityLevel !== level ? styles.inactiveButtonText : {}}
    >
      {level}
    </Button>
  </View>
))}
        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('RegisterInfo', { email, password, name, birthdate, personheight, personweight, gender })} >이전</Button>
          <Button style={styles.MovingButton} onPress={navigateToNextPage}>다음</Button>
        </View>
      </View>

      <Modal 
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
        <View style={styles.alertModalContainer}>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setAlertModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>

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

  alertModalView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  alertModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    margin: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 1,
    //height: 150,
    //width: 300,
    width: '80%',
    height: '20%',
  },
  modalText: {
    fontSize: 16,             // 글자 크기
    textAlign: 'flex-start',      // 텍스트 중앙 정렬
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 버튼을 하단으로 이동
    alignItems: 'flex-end', // 버튼을 오른쪽으로 이동
    width: '100%',
  },
  alertButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10, // 버튼 높이 조절
    paddingHorizontal: 20, // 버튼 너비 조절
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 수평 중앙 정렬
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center', // 텍스트 중앙 정렬
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