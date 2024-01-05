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
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const unsubscribeFriend = async (friendName) => {
    const friend = friends.find(f => f.name === friendName);
    if (!friend) {
      alert('친구 정보를 찾을 수 없습니다.');
      return;
    }
    if (selectedFriend === friendName) {
      setSelectedFriend(null); // 구독 취소한 친구가 현재 선택된 친구일 경우, 선택 해제
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
      fetchFriends();
    } catch (error) {
      console.error('구독 취소 실패:', error);
      alert('구독 취소에 실패했습니다.');
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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFriends(); // 페이지에 진입할 때마다 친구 목록을 새로고침
    });
  
    return unsubscribe; // 페이지를 벗어날 때 리스너를 해제
  }, [navigation]);

  const onRefresh = useCallback(() => {
    fetchFriends();
  }, []);

  const selectFriend = (friendName) => {
    setSelectedFriend(friendName);
  };
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* 친구 목록 */}
      <View style={{ 
        width: '30%', 
        backgroundColor: '#fff',
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
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
  {selectedFriend && (
    <View>
      <Text>{selectedFriend}의 식단 기록</Text>
      <TouchableOpacity onPress={() => unsubscribeFriend(selectedFriend)}>
        <Text>구독 취소</Text>
      </TouchableOpacity>
    </View>
  )}
</View>
    </View>
  );
};

export default ChatScreen;
