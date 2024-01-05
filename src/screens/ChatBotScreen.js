import React, { useState, useRef, useEffect } from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent, TouchableOpacity } from 'react-native';
import  ChatBotIcon  from '../icons/ChatBotIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
 
const ChatBotScreen = ({onClose}) => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history
  const scrollViewRef = useRef();
 
  const saveChatHistory = async (chatHistory) => {
    try {
      const jsonValue = JSON.stringify(chatHistory);
      await AsyncStorage.setItem('@chat_history', jsonValue);
    } catch (e) {
      // 저장 에러 처리
    }
  };
  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem('@chat_history'); // AsyncStorage에서 대화 기록 삭제
      setChatHistory([]); // 상태 업데이트
    } catch (e) {
      console.error('대화 기록 삭제 에러', e);
    }
  };
  const loadChatHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@chat_history');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch(e) {
      // 불러오기 에러 처리
      return [];
    }
  };
 
  useEffect(() => {
    const fetchChatHistory = async () => {
      const loadedChatHistory = await loadChatHistory();
      setChatHistory(loadedChatHistory);
    };
 
    fetchChatHistory();
  }, []);
 
 
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
 
    // 사용자 메시지를 채팅 기록에 추가
    const userMessage = { role: 'user', content: inputText };
    setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);
 
    try {
      // 서버에 메시지 전송
      const token = await AsyncStorage.getItem('@user_token');
 
      // const data = { "message": inputText };
      const jsonData = JSON.stringify({"message": inputText});
     
      // console.log(data);
 
      let config = {
        method: 'post',
        // ip주소 : ipconfig ipv4, port 5500
        url: 'http://edm-diet.japaneast.cloudapp.azure.com/chat_test/chatAPI/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: jsonData
      };
      console.log(token);
      const response = await axios(config);
      console.log(response)
      axios.request(config)
      .then(async (response) => {
        console.log(JSON.stringify(response.data));
 
        const assistantMessage = { role: 'assistant', content: response.data.message };
        setChatHistory(prevChatHistory => [...prevChatHistory, assistantMessage]);
 
        // 채팅 기록을 AsyncStorage에 저장
        await saveChatHistory([...chatHistory, userMessage, assistantMessage]);
      })
      .catch((error) => {
        console.error('Error sending message to backend:', error);
        // 에러 처리 로직 추가
      });
 
    } catch (error) {
      console.error('Error:', error);
    }
 
    // 입력창 초기화
    setInputText('');
  };
  return (
    <View flex={1}>
      {/*닫기 버튼*/}
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: 10,
          zIndex: 1 // 버튼이 다른 요소 위에 표시되도록 zIndex 설정
        }}>
        <Text>X</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={clearChatHistory}
        style={{
          position: 'absolute',
          top: 10,
          right: 50, // '닫기' 버튼 옆에 위치
          padding: 10,
          zIndex: 1
        }}>
        <Text>초기화</Text>
      </TouchableOpacity>
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
          <Image source={ChatBotIcon} style={{width:25, height:25}} />
        </View>
        <Text>chatBot과의 대화</Text>
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
            onChangeText={(value)=>setInputText(value)}
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
  );
};
 
export default ChatBotScreen;