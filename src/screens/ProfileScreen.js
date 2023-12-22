import React, { useState } from 'react';
import { Button, View, Text, Divider, HStack, Box, Modal, Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';
// import {Pressable}  from 'react-native';
// import {Modal}  from 'react-native-modal';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [dietGoalModalVisible, setDietGoalModalVisible] = useState(false);
  const [activityLevelModalVisible, setactivityLevelModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const logout = () => {
    // 로그아웃 로직
    navigation.navigate('Login');
  };
  // 예시 유저 정보 (실제 앱에서는 API나 상태 관리로부터 가져옵니다)
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    birthDate: '1990-01-01',
    height: '180cm',
    weight: '70kg',
    gender: '남성',
    dietgoal: '유지',
    activitylevel: '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
  });

  const [updatedName, setUpdatedName] = useState(userInfo.name);
  const [updatedBirthDate, setUpdatedBirthDate] = useState(userInfo.birthDate);
  const [updatedHeight, setUpdatedHeight] = useState(userInfo.height);
  const [updatedWeight, setUpdatedWeight] = useState(userInfo.weight);
  const [updatedGender, setUpdatedGender] = useState(userInfo.gender);
  // 다이어트 목표 변경 함수
  const changeDietGoal = (newGoal) => {
    setUserInfo({ ...userInfo, dietgoal: newGoal });
    setDietGoalModalVisible(false);
  };
  // 활동 레벨 변경 함수
  const changeactivityLevel = (newLevel) => {
    setUserInfo({ ...userInfo, activitylevel: newLevel });
    setactivityLevelModalVisible(false);
  };

  // 이전 버튼 눌렀을 때 처리
  const goBack = () => {
    // 변경된 활동 레벨과 식단 목표를 파라미터로 전달하여 이전 화면으로 돌아감
    navigation.navigate('BottomTabNavigator', {
      updatedActivityLevel : userInfo.activitylevel,
      updatedDietGoal : userInfo.dietgoal,
    });
  };

  // // '수정하기' 버튼을 눌렀을 때 모달을 열기 위한 함수
  // const openEditModal = () => {
  //   setUpdatedName(userInfo.name);
  //   setEditModalVisible(true);
  // };

  // // 모달을 닫기 위한 함수
  // const closeEditModal = () => {
  //   setEditModalVisible(false);
  // };

  // 수정된 사용자 정보를 저장하는 함수
  // const saveUserInfo = (updatedInfo) => {
  //   setUserInfo({ ...userInfo, ...updatedInfo });
  //   closeEditModal();
  // };

  // const activateNameEdit = () => {
  //   setIsEditingName(true);
  // };

  // const deactivateNameEdit = () => {
  //   setIsEditingName(false);
  //   setUpdatedName(userInfo.name);
  // };

  // 이름 저장을 위한 함수
  // const saveUserInfo = () => {
  //   setUserInfo({ ...userInfo, name : updatedName }); // 이름 업데이트
  //   setUserInfo({ ...userInfo, birthDate : updatedBirthDate }); // 생년월일 업데이트
  //   setUserInfo({ ...userInfo, height : updatedHeight }); // 키 업데이트
  //   setUserInfo({ ...userInfo, weight : updatedWeight }); // 몸무게 업데이트
  //   setUserInfo({ ...userInfo, gender : updatedGender }); // 성별 업데이트
  //   setIsEditing(false); // 수정모드 종료
  // }

  const saveUserInfo = () => {
    setUserInfo({
      ...userInfo,
      name: updatedName,
      birthDate: updatedBirthDate,
      height: updatedHeight,
      weight: updatedWeight,
      gender: updatedGender,
    });
    setIsEditing(false); // 수정모드 종료
  };

  return (
    <View>
      {/* 이전 버튼 */}
      <Button onPress={goBack} position="absolute" top={4} left={4}>
        이전
      </Button>

      {/* 친구링크 및 공유하기 버튼 */}
      <HStack space={2} alignItems="center" mt={12}>
        <Text>친구링크</Text>
        <Button size="sm">공유하기</Button>
      </HStack>
      <Divider my={4} />

      {/* 계정 정보 및 수정 버튼 */}
      <HStack space={2} alignItems="center">
        <Text>계정 정보</Text>
        {/* <Button size="sm" onPress = {() => setIsEditingName(true)}>수정하기</Button> */}
        {!isEditing ? (
          <Button size="sm" onPress={() => setIsEditing(true)}>수정하기</Button>
          ) : 
          (<>
            <Button onPress={saveUserInfo}>저장</Button>
            <Button onPress={() => setIsEditing(false)}>취소</Button>
          </>)
        }
      </HStack>
      <Divider my={4} />

      {!isEditing ? (
        <Box>
          <Text>이름: {userInfo.name}</Text>
          <Text>생년월일: {userInfo.birthDate}</Text>
          <Text>키: {userInfo.height}cm</Text>
          <Text>몸무게: {userInfo.weight}kg</Text>
          <Text>성별: {userInfo.gender}</Text>
        </Box>
      ) : (
        <Box>
          <Input
            placeholder="이름"
            onChangeText={(text) => setUpdatedName(text)}
            value={updatedName}
          />

          <Input
            placeholder="생년월일"
            onChangeText={(text) => setUpdatedBirthDate(text)}
            value={updatedBirthDate}
          />

          <Input
            placeholder="키"
            onChangeText={(text) => setUpdatedHeight(text)}
            value={updatedHeight}
          />

          <Input
            placeholder="몸무게"
            onChangeText={(text) => setUpdatedWeight(text)}
            value={updatedWeight}
          />

          <Input
            placeholder="성별"
            onChangeText={(text) => setUpdatedGender(text)}
            value={updatedGender}
          />
          {/* 다른 수정 가능한 사용자 정보 입력 필드 추가 */}
        </Box>
      )}

      {/* 건강 정보 및 수정 안내 */}
      <HStack space={2} alignItems="center" mt={4}>
        <Text>건강 정보</Text>
        <Text>클릭해서 수정하세요</Text>
      </HStack>
      <Divider my={4} />

      {/* 기타 버튼들 */}

      <Button mt={4} onPress={() => setactivityLevelModalVisible(true)}>
        {userInfo.activitylevel}
      </Button>
      {/* 활동 레벨 변경 모달 */}
      <Modal
        isOpen={activityLevelModalVisible}
        onClose={() => setactivityLevelModalVisible(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            {[
    '1레벨 - 주 2회 미만, 움직임 거의 없는 사무직',
    '2레벨 - 주 3~4회 이하, 움직임 조금 있는 직종',
    '3레벨 - 주 5회 이하, 운송업 종사자',
    '4레벨 - 주 6회 이상, 인부 혹은 광부',
    '5레벨 - 운동 선수'
  ].map((level, index) => (
              <Button key={index} onPress={() => changeactivityLevel(level)}>
                <Text>{level}</Text> {/* 여기에 Text 컴포넌트를 추가 */}
              </Button>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Button mt={4} onPress={() => setDietGoalModalVisible(true)}>
        {userInfo.dietgoal}
      </Button>

      {/* 다이어트 목표 변경 모달 */}
      <Modal
        isOpen={dietGoalModalVisible}
        onClose={() => setDietGoalModalVisible(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Body>
            {['체중 감량', '체중 유지', '체중 증량'].map((goal, index) => (
              <Button key={index} onPress={() => changeDietGoal(goal)}>
                <Text>{goal}</Text> {/* 여기에 Text 컴포넌트를 추가 */}
              </Button>
            ))}
          </Modal.Body>
        </Modal.Content>
      </Modal>


      {/* 설정 및 로그아웃/회원탈퇴 버튼 */}
      <Text mt={6}>설정</Text>
      <Divider my={4} />
      <Button onPress={() => setLogoutModalVisible(true)}>로그아웃</Button>
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
      <Button>회원탈퇴</Button>
    </View>
  );
};

export default ProfileScreen;