// ChatScreen.js
import React, { useState, useRef} from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';
import { ChatIcon } from '../icons/ChatIcon.png';


const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history
  const scrollViewRef = useRef();

  const [friends, setFriends] = useState(['친구1', '친구2', '친구3']);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSendMessage = async() => {
    if (inputText.trim() === '') return;
    
    const newUserMessage = { role: 'user', content: inputText };
    setChatHistory(prevChatHistory => [...prevChatHistory, newUserMessage]);
    setInputText('');

    // 친구 식단 받아오기 뭐 그런거
    const friendMessage = { role: 'friend', content: '친구 채팅' };
    setChatHistory(prevChatHistory => [...prevChatHistory, friendMessage]);
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

      {/* 채팅방 */}
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
        {selectedFriend && <Text>{selectedFriend}과의 대화</Text>}
      </HStack>
      <ScrollView
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        ref={scrollViewRef}
      >
        {chatHistory.map((msg, index) => (
          <Text
            key={index}
            style={{
              fontSize:16,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#8E86FA' : '#EBEBEB',
              borderRadius: 22,
              paddingVertical:10,
              paddingHorizontal:15,
              marginHorizontal:20,
              marginVertical: 5,
              maxWidth: '80%',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
          }}>
          {msg.content}
        </Text>
        ))}
      </ScrollView>

      <VStack space={3} marginBottom="5" style={{borderWidth:0}}>
        <HStack space={2} alignItems="center" style={{margin:10, borderWidth:0, borderTopWidth:1, borderTopColor:'#D9D9D9', paddingTop:15}}>
          <Input
            flex={1}
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
            style={{ 
              backgroundColor: '#fff',
              borderRadius: 11,
            }}
          />
          <Button onPress={handleSendMessage} 
                  style={{ 
                    backgroundColor: '#fff',
                    borderRadius: 11,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
          ><Text style={{ color: 'grey' }}>보내기</Text></Button>
        </HStack>
      </VStack>
    </View>
    </View>
    </View>
  );
};

export default ChatScreen;