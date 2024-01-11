// 챗봇기능
import React, { useState, useRef, useEffect } from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import  ChatBotIcon  from '../icons/ChatBotIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatBotScreen = ({onClose}) => {
  // 상태변수 설정
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // 입력창 상태
  const [chatHistory, setChatHistory] = useState([]); // 채팅기록 상태
  const scrollViewRef = useRef(); //
  const [isLoading, setIsLoading] = useState(false); // 챗봇 로딩 상태
 
  // 채팅기록 저장 함수
  const saveChatHistory = async (chatHistory) => {
    try {
      const jsonValue = JSON.stringify(chatHistory);
      await AsyncStorage.setItem('@chat_history', jsonValue);
    } catch (e) {
      // 저장 에러 처리
    }
  };

  // 채팅기록 초기화 함수
  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem('@chat_history'); // AsyncStorage에서 대화 기록 삭제
      setChatHistory([]); // 상태 업데이트
    } catch (e) {
      console.error('대화 기록 삭제 에러', e);
    }
  };

  // 채팅기록 불러오는 함수
  const loadChatHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@chat_history');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch(e) {
      // 불러오기 에러 처리
      return [];
    }
  };

  // 컴포넌트가 마운트되면 채팅 기록 불러오기
  useEffect(() => {
    const fetchChatHistory = async () => {
      const loadedChatHistory = await loadChatHistory();
      setChatHistory(loadedChatHistory);
    };
 
    fetchChatHistory();
  }, []);
 
  // 로딩 중일 경우 로딩 화면 표시
  const renderLoadingOverlay = () => {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#8E86FA" />
        <Text style={styles.loadingText}>답변을 기다리는 중입니다...</Text>
      </View>
    );
  };
 
  // 메세지보내기를 눌렀을 때 실행되는 함수
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
 
    // 사용자 메세지를 채팅 기록에 추가
    const userMessage = { role: 'user', content: inputText };
    setChatHistory(prevChatHistory => [...prevChatHistory, userMessage]);
 
    try {
      setIsLoading(true); // 로딩 시작
      // 서버에 메시지 전송
      const token = await AsyncStorage.getItem('@user_token');
      const jsonData = JSON.stringify({"message": inputText});
      setInputText('');
 
      let config = {
        method: 'post',
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

      // 서버에서 받은 메세지를 채팅기록에 추가하고 AsyncStorage에 저장
      axios.request(config)
      .then(async (response) => {
        console.log(JSON.stringify(response.data));
 
        const assistantMessage = { role: 'assistant', content: response.data.message };
        setChatHistory(prevChatHistory => [...prevChatHistory, assistantMessage]);
        await saveChatHistory([...chatHistory, userMessage, assistantMessage]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error sending message to backend:', error);
        setIsLoading(false); // 로딩 종료 
      });
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false); // 에러 발생 시 로딩 종료
    }
  };

  return (
    <View flex={1}>
      {/* 헤드라인 */}
      <View style={ styles.chatContainer}>

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

      {/* 초기화버튼 */}
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

      {/* chatBot과의 대화 (제목표시부분) */}
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
        <Text>chatBot과의 대화 </Text>
      </HStack>

      {/* 채팅창라인 */}
      <View style={styles.chatAreaContainer}>
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
      </View>

      {/* 메세지입력라인 */}
      <VStack space={3} marginBottom="5" style={{borderWidth:0}}>
        <HStack space={2} alignItems="center" style={{margin:10, borderWidth:0, borderTopWidth:1, borderTopColor:'#D9D9D9', paddingTop:15}}>
          {/* 메세지 입력 칸 */}
          <Input
            flex={1}
            placeholder={isLoading ? "답변을 기다리는 중입니다.." : "메시지를 입력하세요..."}
            value={inputText}
            onChangeText={(value)=>setInputText(value)}
            editable={!isLoading} // 로딩 중에는 입력 비활성화
            onSubmitEditing={handleSendMessage}
            style={{
              backgroundColor: '#fff',
              borderRadius: 11,
            }}
          />
          {/* 보내기버튼 */}
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
                  disabled={isLoading} // 로딩 중에는 버튼 비활성화
          >{isLoading ? (
              <ActivityIndicator color="#8E86FA" />
            ) : (
              <Text style={{ color: 'grey' }}>보내기</Text>
            )}
          </Button>
        </HStack>
      </VStack>
      </View>
    </View> 
  );
};
 
const styles = StyleSheet.create({
  // 채팅창 영역
  chatAreaContainer: {
    flex: 1,
    borderBottomLeftRadius:40,
    borderBottomRightRadius:40,
  },

  // 헤드라인
  chatContainer: {
    flex: 1,
  },

  // 로딩중일 때 메세지 입력창 스타일
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // 로딩 중일 때 입력창 텍스트 스타일
  loadingText: {
    marginTop: 20,
    color: '#FFF',
  },
});

export default ChatBotScreen;