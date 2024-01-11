// 식단목적선택화면
import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, Alert, Modal, TouchableOpacity } from 'react-native';
 
const DietGoalScreen = ({ route }) => {
  // route.params로부터 전달된 정보 추출
  const { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel } = route.params;
  const navigation = useNavigation();
 
  // 목표 선택 상태를 useState를 통해 관리 (-1은 선택되지 않았음을 나타냄)
  const [goalIndex, setGoalIndex] = useState(-1);
 
  // 알림 모달을 위한 상태들
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
 
  // 가능한 목표들 배열
  const goals = ['체중 감량', '체중 유지', '체중 증량'];
 
  // '다음' 버튼 클릭 시 처리하는 함수
  const handleRegister = () => {
    if (goalIndex === -1) { // 목표를 선택하지 않은 경우 알림 표시
      setAlertMessage(`목표를 선택해주세요.`);
      setAlertModalVisible(true);
    } else { // 목표를 선택한 경우, 다음 페이지('Privacy')로 이동하며 필요한 파라미터들을 전달
      navigation.navigate('Privacy', {
        email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel, goalIndex
      });
    }
  };
 
  return (
    <View style={edm.container}>
      <View>
        {/* 화면 상단의 제목 */}
        <Text style={{ alignSelf: 'center', marginBottom: '10%', fontSize: 20, color: 'black', fontWeight: '900', padding: '1%' }}>
          식단목적을 선택해주세요
        </Text>
      </View>
      <View style={edm.contentContainer}>
        <View style={styles.goalTextView}>
          <Text style={styles.goalTextText}>목적</Text>
        </View>
        {/* 각 목표들에 대한 버튼들을 매핑하여 표시 */}
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalButtonContainer}>
            <Button
              onPress={() => setGoalIndex(index)} // 목표 선택 시 goalIndex 업데이트
              style={goalIndex === index ? styles.activeGoalButton : styles.inactiveGoalButton}>
              <Text style={goalIndex === index ? styles.activeGoalButtonText : styles.inactiveGoalButtonText}>
                {goal}
              </Text>
            </Button>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          {/* '이전' 버튼 */}
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('ActivityLevel', { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel })}>
            이전
          </Button>
          {/* '다음' 버튼 */}
          <Button style={styles.MovingButton} onPress={handleRegister}>
            다음
          </Button>
        </View>
      </View>
 
      {/* 알림 모달 */}
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
              {/* 알림 모달 안의 닫기 버튼 */}
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
 
// DietGoalScreen 컴포넌트 내부의 스타일 정의
const styles = StyleSheet.create({
  goalTextView: {
    alignItems: 'center', // 버튼 가로 정렬
    justifyContent: 'center', // 버튼 세로 정렬
  },
  goalTextText: {
    fontSize: 20, // 텍스트 크기
    marginBottom: 10, // 아래 여백
  },
  goalButtonContainer: {
    marginVertical: 5,
  },
  activeGoalButton: {
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색
  },
  inactiveGoalButton: {
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // 기본 배경색
  },
  activeGoalButtonText: {
    color: 'white', // 눌러진 버튼의 텍스트 색상
  },
  inactiveGoalButtonText: {
    color: 'black', // 기본 버튼의 텍스트 색상
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%', // 너비 설정
    height: '20%', // 높이 설정
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단 정렬
    marginBottom: -15, // 하단 여백 제거
  },
  alertModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // 알림 모달 배경색
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
    fontSize: 16, // 텍스트 크기
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
    paddingVertical: 10, // 버튼 높이 조절
    paddingHorizontal: 20, // 버튼 너비 조절
    alignItems: 'center', // 수직 가운데 정렬
    justifyContent: 'center', // 수평 가운데 정렬
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
});
 
// 화면 레이아웃 스타일 정의
const edm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff', // 배경색
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
 
export default DietGoalScreen;