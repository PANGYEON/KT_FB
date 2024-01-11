
import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StyleSheet, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper'; // RadioButton 컴포넌트 가져오기
import Animation from '../../animation/Animation';

const PrivacyScreen = ({ route }) => {
  const { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel, goalIndex } = route.params;
  const navigation = useNavigation();
  const [showAnimation, setShowAnimation] = useState(false);

  const [privacyContent, setPrivacyContent] = useState('');
  const [consent, setConsent] = useState(null); // 사용자 동의 관리를 위한 상태 변수

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      try {
        const response = await axios.get('http://edm.japaneast.cloudapp.azure.com/api/privacy-policy/');
        const formattedContent = response.data.content.replace(/\r\n/g, "\n");
        setPrivacyContent(formattedContent);
        //setPrivacyContent(response.data);
        //console.log("Formatted Content:", formattedContent);
      } catch (error) {
        console.error('Error fetching privacy content:', error);
        setPrivacyContent('개인정보 동의서를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPrivacyContent();
  }, []);

  //console.log('privacy:', privacyContent);

  //const stringifiedContent = JSON.stringify(privacyContent);

  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  //const [showOkButton, setShowOkButton] = useState(true); // OK 버튼 표시 여부 상태

  const handleRegister = () => {
    if (consent !== 'agree') {
      // 만약 사용자가 동의하지 않은 경우
      setAlertSuccess(`미동의!`);
      setAlertMessage(`동의해주세요`);
      setAlertModalVisible(true);
      return; // 동의하지 않은 경우 함수 실행 중지
    }
    setShowAnimation(true);
    // if (goalIndex === -1) {
    //   setAlertSuccess(`오류!`);
    //   setAlertMessage(`개인정보동의서확인`);
    //   setAlertModalVisible(true);
    //   //Alert.alert("경고", "목표를 선택해주세요.");
    //   return;
    // }
    // else {
    //   setAlertSuccess(`회원가입성공!`);
    //   setAlertMessage(`3초후 로그인페이지로 돌아갑니다`);
    //   setAlertModalVisible(true);
    // }

    const goals = ['체중 감량', '체중 유지', '체중 증량'];

    const adjustedGoalIndex = goalIndex + 1;
    const data = {
      "email": email,
      "name": name,
      "birthdate": birthdate,
      "active_level": selectedActivityLevel, //levelIndex.toString(),
      "height": parseInt(personheight, 10),
      "weight": parseInt(personweight, 10),
      "diet_purpose": adjustedGoalIndex >= 0 ? goals[adjustedGoalIndex - 1] : null, // 인덱스 1 증가
      "password": password,
      "gender": gender,
      "agreed_to_privacy_policy": consent === 'agree' ? true : false //사용자의 동의 여부에 따라 agreed_to_privacy_policy 업데이트
    };

    console.log("Register data:", data);
    const jsonData = JSON.stringify(data);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://edm.japaneast.cloudapp.azure.com/api/user/',
      headers: {
        'Content-Type': 'application/json'
      },
      data: jsonData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        //navigation.navigate('Login');
        // 성공 메시지 표시
        setAlertSuccess(`회원가입 성공!`);
        setShowAnimation(true);
        setAlertMessage(`5초 후 로그인 페이지로 이동합니다.`);
        setAlertModalVisible(true);
        // setShowAnimation(true);

        // setShowOkButton(false); // OK 버튼 숨김

        // 로그인 페이지로 이동하기 전 3초 대기
        setTimeout(() => {
          setAlertModalVisible(false); // 모달 닫기
          navigation.navigate('Login');
        }, 5000); // 3초 대기 (3000밀리초)
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
              setAlertSuccess(`회원가입 오류`);
              setAlertMessage(error.response.data.display_message);
              setAlertModalVisible(true);
            }
          }
        } else if (error.request) {
          console.log('Error request:', error.request);
        } else {
          console.log('Error message:', error.message);
        }

        Alert.alert('회원가입 실패', '회원가입 중 오류가 발생했습니다.');
        setAlertSuccess(`회원가입 실패`);
        setAlertMessage(`회원가입 중 오류가 발생했습니다.`);
        setAlertModalVisible(true);
      });

  }



  return (
    <View style={edm.container}>
      <View >
        <Text style={{ alignSelf: 'center', marginBottom: '10%', fontSize: 20, color: 'black', fontWeight: '900', padding: '1%' }}>
          개인정보동의서확인
        </Text>
      </View>
      <View style={edm.contentContainer}>
        <View style={styles.goalTextView}>
          <Text style={styles.goalTextText}>개인정보동의서</Text>
        </View>
        <ScrollView style={{ height: 200 }}>
          <Text style={styles.privacypage}>{privacyContent}</Text>
        </ScrollView>

        <View style={styles.radioButtonContainer}>
          <View style={styles.radioButton}>
            <RadioButton
              value="agree"
              status={consent === 'agree' ? 'checked' : 'unchecked'}
              onPress={() => setConsent('agree')}
              color="#8E86FA"
            />
            <Text style={styles.radioText}>동의</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="disagree"
              status={consent === 'disagree' ? 'checked' : 'unchecked'}
              onPress={() => setConsent('disagree')}
              color="#8E86FA"
            />
            <Text style={styles.radioText}>미동의</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            //style={styles.MovingButton}
            onPress={() => navigation.navigate('DietGoal', { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel, goalIndex })}
          >
            <Text style={styles.moveButton}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            //style={styles.MovingButton}
            onPress={handleRegister} 
            >
              
            <Text style={styles.moveButton}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showAnimation && <Animation onFinish={() => setShowAnimation(false)} />}

      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
          <View style={styles.alertModalContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', padding: '1%' }}>{alertSuccess}</Text>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <View style={styles.alertButtonContainer}>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setAlertModalVisible(false)}
              >
                <Text style={styles.alertButtonText}>OK </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showAnimation && <Animation onFinish={() => setShowAnimation(false)} />}

        </View>
      </Modal>
      {showAnimation && <Animation onFinish={() => setShowAnimation(false)} />}

    </View>
  );
};
const styles = StyleSheet.create({
  goalTextView: {
    alignItems: 'center', // 가로축 기준 가운데 정렬
    justifyContent: 'center', // 세로축 기준 가운데 정렬
  },
  goalTextText: {
    fontSize: 20, marginBottom: 10 // 글자 크기 설정
  },
  privacypage: {
    //width: '100%',
    //height: '40%',
    backgroundColor: 'white',
    padding: '5%',
    paddingTop: '10%',
    //marginVertical: 5,
  },
  goalButtonContainer: {
    marginVertical: 5,
  },
  activeGoalButton: {
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색 (보라색)
  },
  inactiveGoalButton: {
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // 기본 배경색 (흰색)
  },
  activeGoalButtonText: {
    color: 'white', // 눌러진 버튼의 글자색 (흰색)
  },
  inactiveGoalButtonText: {

    color: 'black', // 기본 버튼의 글자색 (검은색)
  },
  moveButton: {
    width: '100%',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: '15%',
    backgroundColor: '#8E86FA',
    borderRadius: 50,
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%', // 너비를 35%로 증가
    height: '20%', // 높이 설정
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단에 정렬
    marginBottom: -15, // 하단 여백
  },

  alertModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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

  // 라디오버튼스타일
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '3%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    //marginLeft: '5%',
    fontSize: 16,
  },

});
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
    paddingTop: '5%',
    marginTop: '5%',
    padding: '10%',
    height: '70%',
  },
});

export default PrivacyScreen;