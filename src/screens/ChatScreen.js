// // // ChatScreen.js

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import ChatIcon from '../icons/ChatIcon.png';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ChatScreen = () => {
//   const navigation = useNavigation();
//   const [friends, setFriends] = useState([]); // 친구 목록 상태
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [updateTrigger, setUpdateTrigger] = useState(0); // 업데이트를 트리거하기 위한 상태

//   useEffect(() => {
//     const fetchFriends = async () => {
//       const token = await AsyncStorage.getItem('@user_token');
//       let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: 'http://edm.japaneast.cloudapp.azure.com/api/subscribe/',
//         headers: { 
//           'Authorization': `Bearer ${token}`
//         }
//       };
  
//       try {
//         // 먼저 UUID 배열을 가져옵니다.
//         const uuidResponse = await axios(config);
//         const uuids = uuidResponse.data; // 이 부분은 서버 응답에 따라 조정이 필요할 수 있습니다.
//   console.log(uuids)
//         // 이제 각 UUID에 대한 이름을 가져옵니다.
//         const friendNames = await Promise.all(uuids.map(async (uuid) => {
//           try {
//             const response = await axios.get(`http://edm.japaneast.cloudapp.azure.com/api/subscribe/info/${uuid}/`, {
//               headers: { 
//                 'Authorization': `Bearer ${token}` // 앞서 받은 토큰을 사용합니다.
//               }
//             });
//             console.log(response.data.name)
//             return response.data.name; // 응답에서 이름을 가져옵니다.
//           } catch (error) {
//             console.error('친구 이름 불러오기 실패:', error);
//             return 'Unknown'; // 에러가 발생하면 'Unknown'을 반환합니다.
//           }
//         }));
  
//         setFriends(friendNames); // 친구 이름을 상태로 저장합니다.
//       } catch (error) {
//         console.error('UUID 목록 불러오기 실패:', error);
//       }
//     };
  
//     fetchFriends();
//   }, []);
//   const selectFriend = (friend) => {
//     setSelectedFriend(friend);
//   };

//   return (
//     <View style={{ flex: 1, flexDirection: 'row' }}>
//       {/* 친구 목록 */}
//       <View style={{ 
//         width: '20%', 
//         backgroundColor: '#fff',
//         borderRightWidth: 1,
//         borderRightColor: '#D9D9D9'
//       }}>
//         <ScrollView>
//   {friends.map((friend, index) => (
//       <TouchableOpacity key={index} onPress={() => selectFriend(friend)}>
//         <Text style={{ 
//           padding: 10, 
//           backgroundColor: selectedFriend === friend ? '#DFD8F7' : 'transparent' 
//         }}>{friend}</Text>
//       </TouchableOpacity>
//     ))}
//   </ScrollView>
//       </View>

//       {/* 채팅방 */}
//       <View style={{ flex: 1, backgroundColor: '#fff' }}>
//         {/* 채팅방 내용 */}
//         {selectedFriend && (
//           <View>
//             <Text>{selectedFriend}의 식단 기록</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// export default ChatScreen;
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

  const unsubscribeFriend = async (friendName) => {
    const friend = friends.find(f => f.name === friendName);
    if (!friend) {
      alert('친구 정보를 찾을 수 없습니다.');
      // setAlertMessage('친구 정보를 찾을 수 없습니다.');
      // setAlertModalVisible(true);
      return;
    }
  
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
      alert(`${friendName}와의 구독이 취소되었습니다.`);
      // setAlertMessage(`${friendName}와의 구독이 취소되었습니다.`);
      // setAlertModalVisible(true);
      fetchFriends();
    } catch (error) {
      console.error('구독 취소 실패:', error);
      alert('구독 취소에 실패했습니다.');
      // setAlertMessage('구독 취소 실패:', error);
      // setAlertModalVisible(true);
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

  const selectFriend = (friendName) => {
    setSelectedFriend(friendName);
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
        <View style={{ flex:1 }}>
          {selectedFriend && (
          <HStack justifyContent="space-between" alignItems="center" paddingHorizontal={10}>
            <Text style={styles.unsubscribeText}>{selectedFriend}의 식단 기록</Text>
            <TouchableOpacity onPress={() => unsubscribeFriend(selectedFriend)} style={styles.unsubscribeButton}>
            <Text style={{color:'#FFFFFF'}}>구독 취소</Text>
            </TouchableOpacity>
          </HStack>
          )}
        </View>
      </View>
      ) : (
        // 친구가 없을 때의 화면
        <View style={styles.noFriendsContainer}>
          <Image source={WelcomeIcon} style={styles.emoticon} />
          <Text style={styles.noFriendsText}>친구의 식단을 확인해보세요</Text>
          {/* <TouchableOpacity onPress={() => setSubscribeModalVisible(true)} style={styles.profileButton}>
            <Text>친구 구독하기</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={navigateToProfile} style={styles.profileButton}>
            <Text>친구 구독하기</Text>
          </TouchableOpacity>
        </View>
      )}
        {/* <Modal isOpen={alertModalVisible}>
          <View style={styles.alertModalContainer}>
            <Text style={styles.alertText}>{alertMessage}</Text>
            <View style={styles.alertButtonContainer}>
            <Button style={styles.alertButton} title="OK" onPress={() => setAlertModalVisible(false)}>
              <Text style={{color:'#fff'}}>OK</Text>
            </Button>
            </View>
          </View>
        </Modal> */}
    </View>
);
};


const styles = StyleSheet.create({
  alertModalContainer:{
    backgroundColor:'#fff',
    borderRadius: 10, 
    padding:'5%',
    alignItems:'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize:1,
    height:150,
    width:300,
  },
  modalText: {
    fontSize: 16,             // 글자 크기
    textAlign: 'flex-start',      // 텍스트 중앙 정렬
  },
  alertButtonContainer:{
    flex: 1,
    justifyContent: 'flex-end', // 버튼을 하단으로 이동
    alignItems: 'flex-end', // 버튼을 오른쪽으로 이동
    width:'100%',
  },
  alertButton:{
    backgroundColor: '#8E86FA',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

  unsubscribeText:{
    fontSize: 15,
    fontWeight: 'bold',
  },

  unsubscribeButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    padding:10,
    marginHorizontal:10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatScreen;