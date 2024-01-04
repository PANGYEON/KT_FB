import React, { useState, useEffect } from 'react';
import { Button, View, Text, Divider, HStack, Box, Modal, Input, Center } from 'native-base';
import { StyleSheet, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../icons/BackIcon.png';
import AIcon from '../icons/A.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);


  const [dietGoalModalVisible, setDietGoalModalVisible] = useState(false);
  const [activityLevelModalVisible, setactivityLevelModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(false)

  //구독 관련
  const [subscribeModalVisible, setSubscribeModalVisible] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');

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
          // Use fetch or axios to make the API call
          const response = await axios(config);
          console.log(response.data.user)
          setUserInfo(response.data.user); // Assuming the response contains user info
        }
      } catch (e) {
        console.error('Error fetching user info', e);
      }
    };

    fetchUserInfo();
  }, []);

  // useEffect(() => {
  //   if (userInfo) {
  //     setUpdatedHeight(userInfo.height || ''); // 현재 userInfo의 값을 사용
  //     setUpdatedWeight(userInfo.weight || '');
  //     setUpdatedActivityLevel(userInfo.active_level || '');
  //     setUpdatedDietGoal(userInfo.diet_purpose || '');
  //   }
  // }, [userInfo]);
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
        alert('구독 정보가 성공적으로 전송되었습니다.');
      } else {
        alert('구독 정보 전송에 실패했습니다: ' + response.status);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.display_message) {
        alert(error.response.data.display_message);
      } else {
        console.error('구독 정보 전송 중 오류 발생', error);
        alert('구독 정보 전송 중 오류가 발생했습니다.');
      }
    }
  };
  const [password, setPassword] = useState('');

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
        alert('비밀번호가 틀렸습니다.');
      } else {
        console.error('회원 탈퇴 에러', e);
        alert('탈퇴 처리 중 오류가 발생했습니다.');
      }
    }
  };
  const logout = async () => {
    // 토큰을 AsyncStorage에서 제거합니다.
    try {
      await AsyncStorage.removeItem('@user_token');
      navigation.navigate('Login'); // 로그인 화면으로 이동
    } catch (e) {
      // 토큰 제거 중 에러 처리
      console.error('로그아웃 에러', e);
    }
  };

  const [updatedHeight, setUpdatedHeight] = useState(userInfo.height);
  const [updatedWeight, setUpdatedWeight] = useState(userInfo.weight);
  const [updatedActivityLevel, setUpdatedActivityLevel] = useState(userInfo.active_level);
  const [updatedDietGoal, setUpdatedDietGoal] = useState(userInfo.diet_purpose);

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

  const cancelEdit = () => {
    setUpdatedHeight(userInfo.height);
    setUpdatedWeight(userInfo.weight);
    setUpdatedActivityLevel(userInfo.active_level); // 원래 값으로 재설정
    setUpdatedDietGoal(userInfo.diet_purpose); // 원래 값으로 재설정
    setIsEditing(false);
  };

  const saveEdit = async () => {
    // Update local state
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
        'Authorization': `Bearer ${token}` // Replace YOUR_TOKEN with actual token
      },
      data: data
    };

    // API call to update user information
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

      <View style={styles.content1}>
        <Text style={styles.titleText}>구독하기</Text>
        <TouchableOpacity
  style={styles.shareButton}
  onPress={() => setSubscribeModalVisible(true)} // 이 부분을 추가
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
          {/* <View style={styles.userText}>
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
                />
              )}
              <Text>kg</Text>
            </View>
          </View> */}
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
          // style = {styles.shareButton}
          onPress={() => navigation.navigate('Question')}
        >
          <Text style={styles.settingText}>1:1 문의하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          // style = {styles.shareButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.settingText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <Text style={styles.settingText}>회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 건강 정보 및 수정 안내 */}

      {/* 기타 버튼들 */}

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
                아니요
              </Button>
              <Button onPress={logout}>
                네
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

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
            // 필요한 스타일을 여기에 적용하세요
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={() => setDeleteModalVisible(false)}>
                아니요
              </Button>
              <Button onPress={deleteuser}>
                네
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
    {/* <Modal.Content>
      <Modal.Body>
        <TextInput
          placeholder="이메일을 입력하세요"
          value={subscribeEmail}
          onChangeText={setSubscribeEmail}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={handleSubscribe}>구독하기</Button>
      </Modal.Footer>
    </Modal.Content> */}
    <Modal.Content>
      <Modal.Body>
        <TextInput
          placeholder="이메일을 입력하세요"
          value={subscribeEmail}
          onChangeText={setSubscribeEmail}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={handleSubscribe}>구독하기</Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal>



    </View>
  );
};

const styles = StyleSheet.create({
  // 정적 스타일 정의
  container: {
    // flex: 1,
    // justifyContent: 'flex-end',
    // backgroundColor: '#fff',
    // width: '100%',
    // height: '100%',
    padding: '5%',
    fontSize: 1,
  },
  content1: {
    flexDirection: 'row', // 수평 방향으로 요소들을 배치합니다.
    alignItems: 'center', // 요소들을 수직 방향으로 가운데 정렬합니다.
    justifyContent: 'space-between',
    marginTop: '2%', // 상단 여백을 퍼센트로 지정합니다.
    //paddingHorizontal: '2%', // 좌우 여백을 퍼센트로 지정합니다.
    paddingVertical: '1%', // 상하 여백을 퍼센트로 지정합니다.
    //backgroundColor: 'lightgray',
    //borderRadius: 8,
  },
  titleText: {
    color: '#8E86FA',
    fontSize: 16,
  },
  buttonText: {
    marginLeft: '2%', // 텍스트와 버튼 사이의 여백을 퍼센트로 조정합니다.
    //fontSize: 16 * FontScale,
    color: 'white',
    // fontSize: 1,
  },
  shareButton: {
    //alignItems: 'center',
    backgroundColor: '#8E86FA',
    paddingHorizontal: '4%', // 버튼의 좌우 여백을 퍼센트로 조정합니다.
    paddingVertical: '2%', // 버튼의 상하 여백을 퍼센트로 조정합니다.
    borderRadius: 20,
  },
  divider: {
    height: 1, // 구분선의 세로 길이를 지정합니다.
    backgroundColor: '#ccc', // 구분선의 색상을 지정합니다.
    marginVertical: '1%', // 구분선의 상하 여백을 퍼센트로 조정합니다.
  },

  // 저장, 취소 버튼 파트
  saveSpace: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: '#ccc',
    paddingTop: '3%',
    width: '20%',
  },
  saveButton: {
    //backgroundColor: 'yellow',
    borderRadius: 20,

  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalButton: {
    width: '100%', // 버튼의 너비를 모달의 너비와 동일하게 설정
    marginVertical: 5, // 버튼 사이의 수직 간격 설정
    justifyContent: 'center', // 컨텐츠를 세로 방향으로 중앙에 위치시킵니다.
    alignItems: 'center',
    backgroundColor: '#8E86FA',
  },
  modalButton1: {
    width: '100%', // 버튼의 너비를 모달의 너비와 동일하게 설정
    height: '28%',
    marginVertical: 5, // 버튼 사이의 수직 간격 설정
    justifyContent: 'center', // 컨텐츠를 세로 방향으로 중앙에 위치시킵니다.
    backgroundColor: '#8E86FA',

    alignItems: 'center',
  },
  // 계정정보 파트
  modalButton1Text: {

    justifyContent: 'center', // 컨텐츠를 세로 방향으로 중앙에 위치시킵니다.
    alignItems: 'center',
  },
  ImgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '3%',
    // backgroundColor: 'orange',
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
    paddingHorizontal: '4%', // 버튼의 좌우 여백을 퍼센트로 조정합니다.
    paddingVertical: '2%', // 버튼의 상하 여백을 퍼센트로 조정합니다.
    borderRadius: 20,
    marginVertical: '3%', // 구분선의 상하 여백을 퍼센트로 조정합니다.
    color: 'white',
  },
  settingText: {
    fontSize: 17,
    marginVertical: '3%', // 구분선의 상하 여백을 퍼센트로 조정합니다.
    fontWeight: '900'
  },
  ex: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});
export default ProfileScreen;
