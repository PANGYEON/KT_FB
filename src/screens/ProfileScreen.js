// 홈화면 - 프로필페이지
import React, { useState, useEffect } from 'react';
import { Button, View, Text, Divider, HStack, Box, Modal, Input, Center } from 'native-base';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../icons/BackIcon.png';
import AIcon from '../icons/A.png';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 디바이스에 정보 저장 및 불러오기
import axios from 'axios'; // api통신

// 디바이스의 높이 / 너비 받아오기
const { width, height } = Dimensions.get('window');
import { useSubscription } from '../../SubscriptionContext';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // 로그아웃상태 관리
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // 삭제모달창 관리
  const [alertModalVisible, setAlertModalVisible] = useState(false); // alert모달창 관리
  const [alertMessage, setAlertMessage] = useState(''); // alert메세지 관리


  const [dietGoalModalVisible, setDietGoalModalVisible] = useState(false); // 식단목적 상태 관리
  const [activityLevelModalVisible, setactivityLevelModalVisible] = useState(false); // 활동레벨 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  //구독 관련
  const [subscribeModalVisible, setSubscribeModalVisible] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const { updateSubscriptionList } = useSubscription();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');
        if (token) {
          let config = {
            method: 'get',
            url: 'http://edm.japaneast.cloudapp.azure.com/api/user/info/',
            headers: {
              'Authorization': `Bearer ${token}`
            },
          };
          const response = await axios(config);
          console.log(response.data.user)
          setUserInfo(response.data.user);
        }
      } catch (e) {
        console.error('Error fetching user info', e);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setUpdatedHeight(userInfo.height ? userInfo.height.toString() : ''); // 숫자를 문자열로 변환
      setUpdatedWeight(userInfo.weight ? userInfo.weight.toString() : '');
      setUpdatedActivityLevel(userInfo.active_level ? userInfo.active_level.toString() : '');
      setUpdatedDietGoal(userInfo.diet_purpose ? userInfo.diet_purpose.toString() : '');
    }
  }, [userInfo]);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      return token;
    } catch (e) {
      console.error('Failed to fetch the token from storage', e);
    }
  };

  // 구독하기 버튼을 눌렀을 때
  const handleSubscribe = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      let data = JSON.stringify({
        email: subscribeEmail
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/subscribe/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: data
      };

      const response = await axios(config);

      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);

      if (response.status === 200) {
        console.log('구독 정보가 성공적으로 전송되었습니다.');
        setAlertMessage('구독 정보가 성공적으로 전송되었습니다.');
        setAlertModalVisible(true);
      } else {
        setAlertMessage('구독 정보 전송에 실패했습니다: ' + response.status);
        setAlertModalVisible(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.display_message) {
        setAlertMessage(error.response.data.display_message);
        setAlertModalVisible(true);
      } else {
        console.error('구독 정보 전송 중 오류 발생', error);
        setAlertMessage('구독 정보 전송 중 오류가 발생했습니다.');
        setAlertModalVisible(true);
      }
    }
    await updateSubscriptionList();
    setSubscribeModalVisible(false);
    setSubscribeEmail('');
  };

  const [password, setPassword] = useState(''); // 비밀번호 상태 관리

  // 회원탈퇴에 관한 함수
  const deleteuser = async () => {
    try {
      const token = await AsyncStorage.getItem('@user_token');
      // 이메일과 비밀번호를 사용하여 탈퇴 요청
      console.log(password)
      let data = JSON.stringify({
        email: userInfo.email,
        password: password
      });

      let config = {
        method: 'post',
        url: 'http://edm.japaneast.cloudapp.azure.com/api/user/info/', // 회원 탈퇴 API 엔드포인트
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: data
      };

      const response = await axios(config);
      if (response.status === 200) {
        console.log('탈퇴가 완료되었습니다');
        await AsyncStorage.removeItem('@user_token');
        navigation.navigate('Login');
      }
    } catch (e) {
      // 오류 발생 시 알림 표시
      if (e.response && e.response.status === 404) {
        setAlertMessage('비밀번호가 틀렸습니다.');
        setAlertModalVisible(true);
      } else {
        console.error('회원 탈퇴 에러', e);
        setAlertMessage('탈퇴 처리 중 오류가 발생했습니다.');
        setAlertModalVisible(true);
      }
    }
  };

  // 로그아웃에 관한 함수
  const logout = async () => {
    // 토큰을 디바이스에 저장된 AsyncStorage에서 제거합니다.
    try {
      await AsyncStorage.removeItem('@user_token');
      navigation.navigate('Login'); // 로그인 화면으로 이동
    } catch (e) {
      // 토큰 제거 중 에러 처리
      console.error('로그아웃 에러', e);
    }
  };

  // 수정할 때의 상태변수들 관리
  const [updatedHeight, setUpdatedHeight] = useState(userInfo.height);
  const [updatedWeight, setUpdatedWeight] = useState(userInfo.weight);
  const [updatedActivityLevel, setUpdatedActivityLevel] = useState(userInfo.active_level);
  const [updatedDietGoal, setUpdatedDietGoal] = useState(userInfo.diet_purpose);

  // 활동레벨 변경 함수
  const changeActivityLevel = (newLevel) => {
    if (isEditing) { // 수정 모드일 때만 상태를 업데이트
      setUpdatedActivityLevel(newLevel);
    }
    setactivityLevelModalVisible(false);
  };

  // 다이어트 목표 변경 함수
  const changeDietGoal = (newGoal) => {
    if (isEditing) { // 수정 모드일 때만 상태를 업데이트
      setUpdatedDietGoal(newGoal);
    }
    setDietGoalModalVisible(false);
  };

  // 이전 버튼 눌렀을 때 처리
  const goBack = () => {
    // 변경된 활동 레벨과 식단 목표를 파라미터로 전달하여 이전 화면으로 돌아감
    navigation.navigate('BottomTabNavigator', {
      updatedActivityLevel: userInfo.active_level,
      updatedDietGoal: userInfo.diet_purpose,
    });
  };

  // 수정하기를 취소했을 때
  const cancelEdit = () => {
    setUpdatedHeight(userInfo.height);
    setUpdatedWeight(userInfo.weight);
    setUpdatedActivityLevel(userInfo.active_level); // 원래 값으로 재설정
    setUpdatedDietGoal(userInfo.diet_purpose); // 원래 값으로 재설정
    setIsEditing(false);
  };

  // 수정했을 때
  const saveEdit = async () => {
    const token = await getToken();
    const newHeight = updatedHeight !== '' ? updatedHeight : userInfo.height;
    const newWeight = updatedWeight !== '' ? updatedWeight : userInfo.weight;
    const newActivityLevel = updatedActivityLevel !== '' ? updatedActivityLevel : userInfo.active_level;
    const newDietGoal = updatedDietGoal !== '' ? updatedDietGoal : userInfo.diet_purpose;
    setUserInfo({
      ...userInfo,
      height: newHeight,
      weight: newWeight,
      active_level: newActivityLevel,
      diet_purpose: newDietGoal,
    });

    let data = JSON.stringify({
      height: newHeight,
      weight: newWeight,
      diet_purpose: newDietGoal,
      active_level: newActivityLevel,
    });

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'http://edm.japaneast.cloudapp.azure.com/api/user/info/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data
    };

    try {
      const response = await axios(config);
      if (response.status === 200) {
        console.log('User info updated successfully');
      } else {
        console.log('Failed to update user info');
      }
    } catch (error) {
      console.log('Error updating user info', error);
    }

    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* 이전 버튼 */}
      <TouchableOpacity onPress={goBack}>
        <Image source={BackIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      {/* 구독관련 부분 */}
      <View style={styles.content1}>
        <Text style={styles.titleText}>구독하기</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => setSubscribeModalVisible(true)}
        >
          <Text style={styles.buttonText}>구독 정보 입력</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* 계정 정보 및 수정 버튼 */}
      <View style={styles.content1}>
        <Text style={{ ...styles.titleText, paddingTop: '3%' }}>계정정보</Text>
      </View>
      <View style={styles.divider} />

      <View>
        <View style={styles.userText}>
          <Text>이름</Text>
          <Text>{userInfo.name}</Text>
        </View>
        <View style={styles.userText}>
          <Text>이메일</Text>
          <Text>{userInfo.email} </Text>
        </View>
        <View style={styles.userText}>
          <Text>생년월일</Text>
          <Text>{userInfo.birthdate}</Text>
        </View>
        <View style={styles.userText}>
          <Text>성별</Text>
          <Text>{userInfo.gender}</Text>
        </View>

        <View style={styles.content1}>
          <Text style={{ ...styles.titleText, paddingTop: '3%' }}>수정가능정보</Text>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.ImgButton}
              onPress={() => setIsEditing(true)}
            >
              <Image source={AIcon} style={{ width: 20, height: 20 }} />
              <Text>수정하기</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.saveSpace}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveEdit}>
                <Text>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={cancelEdit}>
                <Text>취소</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.divider} />

      <View>
        <Box>
          <View style={styles.userText}>
            <Text>키</Text>
            <View style={styles.ex}>
              {!isEditing ? (
                <TextInput
                  placeholder={userInfo.height ? userInfo.height.toString() : ''}
                  editable={false}
                />
              ) : (
                <TextInput
                  placeholder={userInfo.height ? userInfo.height.toString() : ''}
                  onChangeText={(text) => setUpdatedHeight(text)}
                  value={updatedHeight}
                  keyboardType="numeric"
                />
              )}
              <Text>cm</Text>
            </View>
          </View>

          <View style={styles.userText}>
            <Text>몸무게</Text>
            <View style={styles.ex}>
              {!isEditing ? (
                <TextInput
                  placeholder={userInfo.weight ? userInfo.weight.toString() : ''}
                  editable={false}
                />
              ) : (
                <TextInput
                  placeholder={userInfo.weight ? userInfo.weight.toString() : ''}
                  onChangeText={(text) => setUpdatedWeight(text)}
                  value={updatedWeight}
                  keyboardType="numeric"
                />
              )}
              <Text>kg</Text>
            </View>
          </View>
        </Box>
        <View>


          <View style={styles.userText}>
            <Text>활동레벨</Text>
            <TouchableOpacity
              onPress={() => isEditing && setactivityLevelModalVisible(true)} // 수정 모드일 때만 모달 활성화
              style={styles.healthbutton}
            >
              <Text style={styles.buttonText}>
                {!isEditing ? userInfo.active_level : updatedActivityLevel}
              </Text>
            </TouchableOpacity>
          </View>



          <View style={styles.userText}>
            <Text>식단목적</Text>
            <TouchableOpacity
              style={styles.healthbutton}
              onPress={() => isEditing && setDietGoalModalVisible(true)} // 수정 모드일 때만 모달 활성화
            >
              <Text style={styles.buttonText}>
                {!isEditing ? userInfo.diet_purpose : updatedDietGoal}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.titleText}>설정</Text>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => navigation.navigate('Question')}
        >
          <Text style={styles.settingText}>1:1 문의하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.settingText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <Text style={styles.settingText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 건강 정보 및 수정 안내 */}


      {/* 활동 레벨 변경 모달 */}
      <Modal
        isOpen={activityLevelModalVisible}
        onClose={() => setactivityLevelModalVisible(false)}
      >
        <Modal.Content style={{ width: width * 0.9 }}>
          <Modal.Body>
            {[
              '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
              '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
              '3레벨 - 주 5회 이하, 운송업 종사자',
              '4레벨 - 주 6회 이상, 인부 혹은 광부',
              '5레벨 - 운동 선수'
            ].map((level, index) => (
              <Button
                key={index}
                onPress={() => changeActivityLevel(level)}
                style={styles.modalButton}
              >
                <Text style={{
                  flex: 1, justifyContent: 'center', alignItems: 'center', color:
                    'white'
                }}>{level}</Text>
              </Button>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>


      {/* 다이어트 목표 변경 모달 */}
      <Modal
        isOpen={dietGoalModalVisible}
        onClose={() => setDietGoalModalVisible(false)}
      >
        <Modal.Content style={{ width: width * 0.9 }}>
          <Modal.Body>
            {['체중 감량', '체중 유지', '체중 증량'].map((goal, index) => (
              <Button key={index} onPress={() => changeDietGoal(goal)} style={styles.modalButton1}>
                <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                  {goal}
                </Text>
              </Button>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>


      {/* 설정 및 로그아웃/회원탈퇴 버튼 */}
      {/* 로그아웃 모달창 */}
      <Modal
        isOpen={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Text>로그아웃하시겠습니까?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setLogoutModalVisible(false)}>
                <Text style={{ color: '#8E96FA' }}>아니요</Text>
              </Button>
              <Button backgroundColor='#8E86FA' borderRadius='15' onPress={logout}>
                네
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* 회월탈퇴 모달창 */}
      <Modal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            <Text>탈퇴하시려면 비밀번호를 입력해주세요:</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}
              placeholder="비밀번호"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setDeleteModalVisible(false)}>
                <Text style={{ color: '#8E96FA' }}>취소</Text>
              </Button>
              <Button backgroundColor='#8E86FA' borderRadius='15' onPress={deleteuser}>
                확인
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/* // 구독 모달 렌더링 */}
      <Modal
        isOpen={subscribeModalVisible}
        onClose={() => setSubscribeModalVisible(false)}
      >
        <Modal.Content>
          <Modal.Body>
            <TextInput
              placeholder="친구의 이메일을 입력하세요"
              value={subscribeEmail}
              onChangeText={setSubscribeEmail}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={handleSubscribe} style={styles.subscribeButton}>구독하기</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* alert모달창 */}
      <Modal isOpen={alertModalVisible}>
        <View style={styles.alertModalContainer}>
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
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // alert모달창 스타일 조정
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 1,
    height: '18%',
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'flex-start',
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center',
  },

  // 전체 스타일 조정
  container: {
    padding: '5%',
    fontSize: 1,
  },
  content1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2%',
    paddingVertical: '1%',
  },
  titleText: {
    color: '#8E86FA',
    fontSize: 16,
  },
  buttonText: {
    marginLeft: '2%',
    color: 'white',
  },
  shareButton: {
    backgroundColor: '#8E86FA',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: '1%',
  },

  // 저장, 취소 버튼 파트
  saveSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '3%',
    width: '20%',
  },
  saveButton: {
    borderRadius: 20,

  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButton: {
    width: '100%',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8E86FA',
  },
  modalButton1: {
    width: '100%',
    height: '28%',
    marginVertical: 5,
    justifyContent: 'center',
    backgroundColor: '#8E86FA',
    alignItems: 'center',
  },
  // 계정정보 파트
  modalButton1Text: {

    justifyContent: 'center',
    alignItems: 'center',
  },
  ImgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '3%',
  },
  //구독하기 버튼
  subscribeButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
  },

  // 계정정보 - 유저각각의 정보들의 스타일
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '1%',
  },

  // 수정정보 - 건강정보
  healthbutton: {
    alignItems: 'center',
    backgroundColor: '#8E86FA',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 20,
    marginVertical: '3%',
    color: 'white',
  },
  settingText: {
    fontSize: 17,
    marginVertical: '3%',
    fontWeight: '900'
  },
  ex: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});
export default ProfileScreen;
