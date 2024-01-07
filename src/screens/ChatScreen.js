import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Button, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import WelcomeIcon from '../icons/WelcomeIcon.png';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '../../SubscriptionContext';
import { HStack } from 'native-base';
 
const ChatScreen = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { subscriptionList } = useSubscription();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dietDetails, setDietDetails] = useState(null);
  const [dietData, setDietData] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);
 
  const onSelectDate = (date) => {
    // 선택된 날짜 업데이트
    setSelectedDate(date);
    // 변경된 데이터 구조에 따라 해당 날짜의 식단 상세 정보 설정

    // 배경색을 변경하기 위한 새로운 상태 설정
    setExpandedDate(date);
    const details = dietData.user_meals_evaluation.find(d => d.meal_date === date);
    setDietDetails(details);
  };
  const toggleDate = (date) => {
    if (expandedDate === date) {
      setExpandedDate(null); // 이미 확장된 항목이면 접기
      setSelectedDate(null); // 선택한 날짜 초기화하여 색깔을 원래대로 변경
    } else {
      setExpandedDate(date); // 새로운 항목 확장
      setSelectedDate(date); // 선택한 날짜 설정하여 배경색 변경
      onSelectDate(date);
    }
  };
  const renderMealImages = (mealDate, meals) => {
    const dailyMeals = meals.filter(meal => meal.mealdate === mealDate);
    const mealTypes = ['아침', '점심', '저녁', '간식'];
    const availableMeals = mealTypes.map(type => dailyMeals.find(m => m.mealType === type)).filter(Boolean);
 
    // 이미지를 2x2 격자에 배치
    const grid = Array(2).fill(null).map(() => Array(2).fill(null));
 
    // 이용 가능한 식사를 격자에 할당
    availableMeals.forEach((meal, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      grid[row][col] = meal;
    });
 
    return (
      <View style={{ alignItems: 'center' }}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {row.map((meal, colIndex) => (
              meal ? (
                <View key={colIndex} style={{ alignItems: 'center', margin: 5 }}>
                  <Text>{meal.mealType}</Text>
                  <Image
                    source={{ uri: `http://edm-diet.japaneast.cloudapp.azure.com/${meal.imagelink}` }}
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
  const unsubscribeFriend = async (friendName) => {
    const friend = friends.find(f => f.name === friendName);
    // 유정님 코드 기준 이부분은 주석처리
    // if (!friend) {
    //   alert('친구 정보를 찾을 수 없습니다.');
    //   return;
    // }
 
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
      //alert(`${friendName}와의 구독이 취소되었습니다.`);
      setAlertMessage(`${friendName} 님과의 구독이 취소되었습니다.`);
      setAlertModalVisible(true);
      fetchFriends();
    } catch (error) {
      console.error('구독 취소 실패:', error);
      //alert('구독 취소에 실패했습니다.');
      setAlertMessage('구독 취소에 실패했습니다.');
      setAlertModalVisible(true);
    }
  };
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
 
  useEffect(() => {
    if (friends.length > 0) {
      selectFriend(friends[0].name);
    }
  }, [friends]);
 
  const onRefresh = useCallback(() => {
    fetchFriends();
  }, [subscriptionList]);
 
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
 
  return (
    <View style={{ flex: 1 }}>
      {/* 상단바 */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>친구 식단</Text>
      </View>
 
      {friends.length > 0 ? (
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
 
 
 
          {/* 채팅방 */}
          {/* 채팅방 */}
          <View style={{ flex: 1 }}>
            {selectedFriend && (
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
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
                    dietData.user_meals_evaluation.map((item, index) => (
                      <View key={index}>
                        <TouchableOpacity onPress={() => 
                                                    toggleDate(item.meal_date)
                                                    //onSelectDate(item.meal_date)
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
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black', fontSize: 20}}>식단결과</Text>
                                <Text>{dietDetails.meal_evaluation}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>탄수화물</Text>
                                <Text>{dietDetails.sum_carb.toFixed(1)}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>당류</Text>
                                <Text>{dietDetails.sum_sugar.toFixed(1)}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>단백질</Text>
                                <Text>{dietDetails.sum_protein.toFixed(1)}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>지방</Text>
                                <Text>{dietDetails.sum_fat.toFixed(1)}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>나트륨</Text>
                                <Text>{dietDetails.sum_fat.toFixed(1)}</Text>
                              </View>
                              <View style={styles.DateContent}>
                                <Text style={{color: 'black'}}>콜레스테롤</Text>
                                <Text>{dietDetails.sum_col.toFixed(1)}</Text>
                              </View> 
                            {/* 아침 저녁 간식 점심*/}  
                          </View>

                          {/* 해당 날짜의 식단 이미지 표시 */}
                          {renderMealImages(item.meal_date, dietData.user_meals.user_meals)}
                          </View>
                        )}
                        {/* <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} /> */}
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

      <Modal 
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
        <View style={styles.alertModalContainer}>
          {/* <Text style={{fontSize:20, fontWeight:'bold', color:'#000'}}>Alert</Text> */}
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
    //alignItems: 'center',
    //justifyContent: 'center',
    marginBottom: '5%',
    alignSelf:'stretch',
    flex:1,
  },

  DateText: {
    //backgroundColor: '#8E86FA',
    textAlign: 'center',
    width: '100%',
    //color: 'white',
    fontSize: 15,
    fontWeight: '900',
    margin: '1%',
    padding: '5%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  DateContent: {
    //backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    width: '50%'
  },

  DateAll: {
    backgroundColor: '#ccc',
    padding: '5%',
    borderRadius: 20,
  }
});
 
export default ChatScreen;