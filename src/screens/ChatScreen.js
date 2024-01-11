// 네비게이션 -- 친구
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Button, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import WelcomeIcon from '../icons/WelcomeIcon.png';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '../../SubscriptionContext';
 
const ChatScreen = () => {
  // 상태변수 설정
  const [friends, setFriends] = useState([]); // 친구목록 상태
  const [selectedFriend, setSelectedFriend] = useState(null); // 선택한 친구 상태
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태
  const navigation = useNavigation(); // 네비게이션 상태
  const { subscriptionList } = useSubscription(); // 구독 컨텍스트 데이터 상태
  const [alertModalVisible, setAlertModalVisible] = useState(false); // 모달창 상태
  const [alertMessage, setAlertMessage] = useState(''); // Alert창 메세지 상태
  const [selectedDate, setSelectedDate] = useState(null); // 날짜선택 상태
  const [dietDetails, setDietDetails] = useState(null); // 식단의 상세정보 상태
  const [dietData, setDietData] = useState(null); // 식단데이터 상태
  const [expandedDate, setExpandedDate] = useState(null); // 날짜선택의 배경색 상태

  //구독 취소 확인 상태 관리
  const [showUnsubscribeConfirmModal, setShowUnsubscribeConfirmModal] = useState(false);
  const [friendToUnsubscribe, setFriendToUnsubscribe] = useState(null); 
  
  // 날짜 선택 함수
  const onSelectDate = (date) => {
    // 선택된 날짜 업데이트
    setSelectedDate(date);

    // 배경색을 변경하기 위한 상태 설정
    setExpandedDate(date);

    // 변경된 데이터 구조에 따라 해당 날짜의 식단 상세 정보 설정
    const details = dietData.user_meals_evaluation.find(d => d.meal_date === date);
    setDietDetails(details);
  };

  // 다른 날짜를 선택할 때 토글 함수
  const toggleDate = (date) => {
    if (expandedDate === date) {
      setExpandedDate(null); // 이미 확장된 항목이면 접기
      setSelectedDate(null); // 선택한 날짜 초기화하여 색깔을 원래대로 변경
    } else {
      setExpandedDate(date); // 선택한 날짜 설정
      setSelectedDate(date); // 선택한 날짜에 대한 배경색 변경
      onSelectDate(date); // onSelectDate로 업데이트
    }
  };

  // 이미지 URL이 상대 경로인지 확인해주는 함수
  const getFullImageUrl = (imageLink) => {
    // imageLink가 '/media/http%3A/'으로 시작하면  부분을 'http://'로 변경
    if (imageLink.startsWith('/media/http%3A/')) {
      return 'http://' + imageLink.substring('/media/http%3A/'.length);
    }
    // 이미 전체 URL이면 그대로 반환
    return imageUrl;
  };

  // mealDate와 그에 해당하는 meals를 받아서 이미지를 렌더링해주는 함수
  const renderMealImages = (mealDate, meals) => {
    const dailyMeals = meals.filter(meal => meal.mealdate === mealDate); // meal에서 mealDate에 해당하는 식사로 필터링
    const mealTypes = ['아침', '점심', '저녁', '간식']; // 식사시간대 배열
    const availableMeals = mealTypes.map(type => dailyMeals.find(m => m.mealType === type)).filter(Boolean); // dailyMeals에서 선택한 mealTypes에 해당하는 식사를 배열로 정리, null아닌 요소만 필터링
    console.log(availableMeals)
    // 이미지를 2x2 격자에 배치
    const grid = Array(2).fill(null).map(() => Array(2).fill(null));
 
    // 이용 가능한 식사를 격자에 할당
    availableMeals.forEach((meal, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      grid[row][col] = meal;
    });
 
    return (
      // 날짜를 선택했을 때 나오는 창의 음식사진영역
      <View style={{ alignItems: 'center' }}>
        {/* 매핑을 통해 사진들을 정렬 */}
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {row.map((meal, colIndex) => (
              meal ? (
                <View key={colIndex} style={{ alignItems: 'center', margin: 5 }}>
                  <Text>{meal.mealType}</Text>
                  <Image
                    source={{ uri: getFullImageUrl(meal.imagelink )}}
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              ) : <View key={colIndex} style={{ width: 100, height: 100, margin: 5 }} />  // 빈 공간을 위한 뷰
            ))}
          </View>
        ))}
      </View>
    );
  };

  //구독 취소 함수
  const unsubscribeFriend = (friendName) => {
    setFriendToUnsubscribe(friendName);
    setShowUnsubscribeConfirmModal(true);
  };

  // 구독 취소 확인 함수
  const confirmUnsubscribe = async () => {
    if (!friendToUnsubscribe) return;

    const friend = friends.find(f => f.name === friendToUnsubscribe);
    const token = await AsyncStorage.getItem('@user_token');
    let config = {
      method: 'delete',
      url: `http://edm.japaneast.cloudapp.azure.com/api/unsubscribe/${friend.uuid}/`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
 
 
    try {
      await axios(config);
      setAlertMessage(`${friendToUnsubscribe} 님과의 구독이 취소되었습니다.`);
      setAlertModalVisible(true);
      fetchFriends();
    } catch (error) {
      console.error('구독 취소 실패:', error);
      setAlertMessage('구독 취소에 실패했습니다.');
      setAlertModalVisible(true);
    } finally {
      setShowUnsubscribeConfirmModal(false);
      setFriendToUnsubscribe(null);
    }
  };

  // 취소확인 Modal
  const renderUnsubscribeConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showUnsubscribeConfirmModal}
      onRequestClose={() => setShowUnsubscribeConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
        <View style={{ alignSelf: 'flex-start' }}> 
            <Text style={{textAlign:'left', fontSize:16, color:'black'}}> 정말 취소하시겠습니까? </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonNo]}
              onPress={() => setShowUnsubscribeConfirmModal(false)}
            >
              <Text style={{ color: '#8E96FA' }}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonYes]}
              onPress={confirmUnsubscribe}
            >
              <Text style={{ color: '#FFF' }}>네</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );  

  // 구독한 친구의 식단을 가져오는 함수
  const fetchDietData = async (uuid) => {
    const token = await AsyncStorage.getItem('@user_token');
    let config = {
      method: 'get',
      url: `http://edm-diet.japaneast.cloudapp.azure.com/user_meal/subscribe/?uuid=${uuid}`,
      headers: { 'Authorization': `Bearer ${token}` }
    };
 
    try {
      const response = await axios(config);
      setDietData(response.data); // 식단 데이터 상태 업데이트
    } catch (error) {
      console.error('식단 데이터 불러오기 실패:', error);
    }
  };

  // 구독한 친구목록을 확인하는 함수
  const fetchFriends = async () => {
    setRefreshing(true); // 새로고침 시작
    const token = await AsyncStorage.getItem('@user_token');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://edm.japaneast.cloudapp.azure.com/api/subscribe/',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
 
    try {
      const uuidResponse = await axios(config);
      const uuids = uuidResponse.data;
      const friendInfo = await Promise.all(uuids.map(async (uuid) => {
        try {
          const response = await axios.get(`http://edm.japaneast.cloudapp.azure.com/api/subscribe/info/${uuid}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return { name: response.data.name, uuid: uuid };
        } catch (error) {
          console.error('친구 이름 불러오기 실패:', error);
          return 'Unknown';
        }
      }));
 
      setFriends(friendInfo);
    } catch (error) {
      console.error('UUID 목록 불러오기 실패:', error);
    }
    setRefreshing(false); // 새로고침 종료
  };
 
  useEffect(() => {
    fetchFriends();
  }, [subscriptionList]);
 
  // 친구목록에 친구존재여부
  useEffect(() => {
    if (friends.length > 0) {
      selectFriend(friends[0].name);
    }
  }, [friends]);
 
  const onRefresh = useCallback(() => {
    fetchFriends();
  }, [subscriptionList]);

  // 선택한 친구의 식단데이터를 가져오기 위한 선택한 친구 확인 함수
  const selectFriend = async (friendName) => {
    const friend = friends.find(f => f.name === friendName);
    if (friend) {
      setSelectedFriend(friendName);
      await fetchDietData(friend.uuid); // 선택된 친구의 UUID로 식단 데이터 가져오기
    }
  };
 
  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  // 식단평가별로 색상을 지정
  const getBackgroundColor = () => {
    switch (dietDetails.meal_evaluation) {
      case 'Bad':
        return '#FA6565';
      case 'Not Bad':
        return 'FA9B65';
      case 'Good':
        return '#EEE064';
      case 'Very Good':
        return '#96CCF3';
      case 'Perfect':
        return '#2FFF9B';
      default:
        return 'lightgray';
    }
  };
 
  return (
    <View style={{ flex: 1 }}>
      {/* 헤드라인 -- 제목 */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>친구 식단</Text>
      </View>
      {/* 친구목록표시부분 */}
      {friends.length > 0 ? (
        // 친구가 있을 때
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* 친구 목록 */}
          <View style={{
            width: '30%',
            borderRightWidth: 1,
            borderRightColor: '#D9D9D9'
          }}>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {/* 매핑을 통한 친구목록 출력 */}
              {friends.map((friend, index) => (
                <TouchableOpacity key={index} onPress={() => selectFriend(friend.name)}>
                  <Text style={{
                    padding: 10,
                    backgroundColor: selectedFriend === friend.name ? '#DFD8F7' : 'transparent'
                  }}>
                    {friend.name} {/* 객체가 아닌, 친구의 이름을 렌더링 */}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* 선택한 친구의 식단을 확인할 수 있는 부분 */}
          <View style={{ flex: 1 }}>
            {selectedFriend && (
              <View style={{ flex: 1, 
                             paddingHorizontal: '5%',
                            }}>
                <View style={{ 
                        flexDirection: 'row', 
                        paddingBottom: 10,
                        alignItems: 'center',
                        justifyContent: 'space-between' 
                }}>
                  <Text style={styles.unsubscribeText}>{selectedFriend}님의 식단 기록</Text>
                  <TouchableOpacity onPress={() => unsubscribeFriend(selectedFriend)} style={styles.unsubscribeButton}>
                    <Text style={{ color: '#FFFFFF' }}>구독 취소</Text>
                  </TouchableOpacity>
                </View>
 
                <ScrollView style={{ flex: 1 }}>
                  {dietData ? (
                    dietData.user_meals_evaluation
                    .filter(item => item.sum_carb !== 0 || item.sum_protein !== 0) // 탄수화물과 단백질이 모두 0이 아닌 항목만 필터링

                    .map((item, index) => (
                      <View key={index}>
                        {/* 식단을 기록한 날짜들을 확인 */}
                        <TouchableOpacity onPress={() => 
                                                    toggleDate(item.meal_date)
                                                    }
                                          style={styles.DateButton}
                        >
                          <Text 
                            style={{...styles.DateText, 
                                    backgroundColor: selectedDate === item.meal_date ? '#8E86FA' : '#fff',
                                    color: selectedDate === item.meal_date ? 'white' : '#8E86FA',
                                  }}>
                              {item.meal_date}
                          </Text>
                        </TouchableOpacity>
                        {expandedDate === item.meal_date && (
                          <View style={styles.DateAll}>
                          <View>
                            {/* 해당 날짜의 식단 세부 정보 표시 */}
                              <View style={{...styles.DateContent, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{color: 'black', fontSize: 20, marginRight: '5%'}}>식단결과</Text>
                                <Text style={{paddingVertical: '3%', paddingHorizontal: '5%', backgroundColor: getBackgroundColor(), textAlign: 'center', borderRadius: 10}}>{dietDetails.meal_evaluation}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>탄수화물</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_carb.toFixed(1)}g </Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>당류</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_sugar.toFixed(1)}g </Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>단백질</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_protein.toFixed(1)}g </Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>지방</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_fat.toFixed(1)}g </Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>나트륨</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_fat.toFixed(1)}mg </Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>콜레스테롤</Text>
                                <Text style={{paddingRight: '1%'}}>{dietDetails.sum_col.toFixed(1)}mg </Text>
                              </View> 
                            {/* 아침 저녁 간식 점심*/}  
                          </View>

                          {/* 해당 날짜의 식단 이미지 표시 */}
                          {renderMealImages(item.meal_date, dietData.user_meals.user_meals)}
                          </View>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text>아직 친구의 데이터가 없습니다.</Text>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
 
        </View>
      ) : (
        // 친구가 없을 때의 화면
        <View style={styles.noFriendsContainer}>
          <Image source={WelcomeIcon} style={styles.emoticon} />
          <Text style={styles.noFriendsText}>친구의 식단을 확인해보세요</Text>
          <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
            <Text>친구 구독하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 구독 취소할 때의 모달창 */}
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
              <Text style={styles.alertButtonText}>OK </Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>
      {renderUnsubscribeConfirmModal()}
    </View>
  );
};
 
 
const styles = StyleSheet.create({
  // 모달창 스타일
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
    width: '80%',
    height: '20%',
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
  alertText:{
    fontSize:16,
    color:'black',
    marginTop:10,
  },

  // 제목에 해당하는 친구 식단 스타일
  titleBar: {
    padding: '4%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // 친구가 없을 때의 화면 스타일
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emoticon: {
    width: 50,
    height: 50,
    marginBottom: 10
  },
  noFriendsText: {
    fontSize: 16,
    marginBottom: 20
  },
  profileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#D7D4FF',
    borderRadius: 40
  },
 
  friendDietRecord: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
  },
 
  unsubscribeText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
 
  unsubscribeButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  DateButton: {
    marginBottom: '5%',
  },

  // 날짜버튼 스타일
  DateText: {
    textAlign: 'center',
    width: '100%',
    fontWeight: '900',
    paddingVertical: '5%',
    borderRadius: 10,
  },

  DateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },

  //날짜안의 식단상세정보를 출력해주는 영역
  DateAll: {
    backgroundColor: '#ccc',
    padding: '5%',
    borderRadius: 20,
    marginBottom: '5%'
  },
 // 모달창 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width:'80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    width:'100%',
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  buttonNo: {
    backgroundColor: '#FFF',
  },
  buttonYes: {
    backgroundColor: '#8E86FA',
  },
});
 
export default ChatScreen;