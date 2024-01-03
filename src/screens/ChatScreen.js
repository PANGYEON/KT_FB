// ChatScreen.js
import React, { useState, useRef} from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';
import { ChatIcon } from '../icons/ChatIcon.png';


const ChatScreen = () => {
  const navigation = useNavigation();

  const [friends, setFriends] = useState(['친구1', '친구2', '친구3']);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* 친구 목록 */}
      <View style={{ 
        width: '20%', 
        backgroundColor: '#fff',
        borderRightWidth:1,
        borderRightColor:'#D9D9D9' }}>
        <ScrollView>
          {friends.map((friend, index) => (
            <TouchableOpacity key={index} onPress={() => selectFriend(friend)}>
              <Text style={{ padding: 10, backgroundColor: selectedFriend === friend ? '#DFD8F7' : 'transparent' }}>{friend}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 구독 친구 식단 */}
      <View style={{ flex: 1 , backgroundColor:'#fff'}}>
      <View flex={1}>
      <HStack 
        space={2} 
        alignItems="start" 
        style={{
          marginVertical:12, 
          marginHorizontal:10, 
          paddingVertical:10,
          fontsize:12, 
          borderBottomWidth:1, 
          borderBottomColor:'#D9D9D9'}}>
        <View>
          <Image source={ChatIcon} style={{width:25, height:25}} />
        </View>
        {selectedFriend && <Text>{selectedFriend}의 식단</Text>}
      </HStack>
      
    </View>
    </View>
    </View>
  );
};

export default ChatScreen;