// 활동레벨 선택 화면
import React, { useState } from 'react';
import { View, Button } from 'native-base'; // NativeBase 컴포넌트 사용
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅
import { StyleSheet, Text, Modal, TouchableOpacity } from 'react-native'; // 스타일 및 UI 컴포넌트

// 활동 레벨 화면을 위한 함수형 컴포넌트
const ActivityLevelScreen = ({ route }) => {
  // 상태변수 설정
  const navigation = useNavigation(); // 네비게이션 설정
  const { email, password, name, birthdate, personheight, personweight, gender } = route.params; // route.params객체에서 email, password, name, birthdate, personheight, personweight, gender을 받아옴
  const [alertModalVisible, setAlertModalVisible] = useState(false); // 알림 모달창 상태 설정
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지 상태 설정
  const [selectedActivityLevel, setSelectedActivityLevel] = useState(''); // 선택한 활동 레벨 상태

  // 선택한 활동 레벨 설정 함수
  const handleLevelSelect = (index) => {
    setSelectedActivityLevel(levels[index]);
  };

  // 활동레벨을 배열로 설정 -- levels
  const levels = [
    '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
    '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
    '3레벨 - 주 5회 이하, 운송업 종사자',
    '4레벨 - 주 6회 이상, 인부 혹은 광부',
    '5레벨 - 운동 선수'
  ];

  // 다음 페이지로 이동하는 함수
  const navigateToNextPage = () => {
    // 레벨을 선택하지 않은 경우
    if (selectedActivityLevel === '') {
      setAlertMessage(`활동 레벨을 선택해주세요.`);
      setAlertModalVisible(true);
    } else { // 레벨을 선택한 경우, 필요한 파라미터와 함께 DietGoal페이지로 이동
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
        {/* 각 활동 레벨을 선택할 수 있는 버튼을 매핑하여 표시 */}
        {levels.map((level, index) => (
          <View key={index} style={{ marginVertical: 5 }}>
            {/* 활동 레벨 선택을 위한 버튼 */}
            <Button
              onPress={() => handleLevelSelect(index)}
              style={selectedActivityLevel === level ? styles.activeButton : styles.inactiveButton}
              _text={selectedActivityLevel !== level ? styles.inactiveButtonText : {}}
            >
              {level}
            </Button>
          </View>
        ))}
        {/* 이전버튼 & 다음 버튼 */}
        <View style={styles.buttonContainer}>
          {/* 이전버튼을 눌렀을 때, 활동레벨을 제외한 나머지 파라미터를 이전페이지(RegisterInfo)로 이동 */}
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('RegisterInfo', { email, password, name, birthdate, personheight, personweight, gender })} >이전</Button>
          {/* 다음버튼을 눌렀을 때, navigateToNextPage함수로 */}
          <Button style={styles.MovingButton} onPress={navigateToNextPage}>다음</Button>
        </View>
      </View>

      {/* 알림 메시지 모달창 */}
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
              {/* 모달창 닫기 버튼(OK) */}
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // 활동레벨 버튼 스타일
  levelTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 활동레벨 버튼 텍스트 스타일
  levelTextText: {
    fontSize: 20,
    marginBottom: 10,
  },

  // 이전과 다음 버튼에 해당하는 스타일
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%',
    height: '40%',
  },

  // 이전과 다음 버튼 영역에 해당하는 스타일 설정
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: -15,
  },

  // 활동레벨버튼의 활성화 스타일
  activeButton: {
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#8E86FA', // 선택된 버튼의 배경색
  },

  // 활동레벨버튼의 비활성화 스타일
  inactiveButton: {
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF', // 기본 버튼 배경색
  },
  inactiveButtonText: {
    color: 'black', // 선택되지 않은 버튼의 텍스트 색상
  },

  // 알림 모달창 관련 스타일

  alertModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
  },
  alertModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    margin: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 1,
    width: '80%', // 너비 설정
    height: '20%', // 높이 설정
  },
  modalText: {
    fontSize: 16, // 글자 크기
    textAlign: 'flex-start', // 텍스트 왼쪽 정렬
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 하단 정렬
    alignItems: 'flex-end', // 오른쪽 정렬
    width: '100%', // 너비 설정
  },
  alertButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10, // 버튼 높이 조정
    paddingHorizontal: 20, // 버튼 너비 조정
    alignItems: 'center', // 수직 가운데 정렬
    justifyContent: 'center', // 수평 가운데 정렬
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
});

// 로그인 및 회원가입페이지의 기본설정 스타일
const edm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff', // 배경색 설정
  },
  contentContainer: {
    backgroundColor: '#D7D4FF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 70,
    marginTop: 20,
    padding: 40,
    height: '70%', // 높이 설정
  },
});
export default ActivityLevelScreen;