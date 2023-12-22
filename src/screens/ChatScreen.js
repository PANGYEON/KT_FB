// ChatScreen.js
import React, { useState } from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    setChatHistory([...chatHistory, { role: 'user', content: inputText }]);
    const mockResponse = "chatbot 답변";
    setChatHistory(currentChat => [...currentChat, { role: '너는 식단 관리자야.', content: mockResponse }]);
    setInputText('');
  };

  return (
    <View flex={1}>
      <Button onPress={() => navigation.navigate("Home")}>이전</Button>
      <ScrollView>
        {chatHistory.map((msg, index) => (
          <Text
            key={index}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#e1e1e1' : '#d1d1f1',
              borderRadius: 10,
              padding: 10,
              marginVertical: 2,
              maxWidth: '80%'
          }}>
          {msg.content}
        </Text>
        ))}
      </ScrollView>

      <VStack space={3} marginBottom="5">
        <HStack space={2} alignItems="center">
          <Input
            flex={1}
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
          />
          <Button onPress={handleSendMessage}>보내기</Button>
        </HStack>
      </VStack>

    </View>
  );
};

export default ChatScreen;