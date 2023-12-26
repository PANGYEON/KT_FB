// ChatScreen.js
import React, { useState } from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent } from 'react-native';
import { ChatIcon } from '../icons/ChatIcon.png';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    setChatHistory([...chatHistory, { role: 'user', content: inputText }]);
    //chatGPT 답변 받아와야함
    const botResponse = "chatbot 답변";
    setChatHistory(currentChat => [...currentChat, { role: 'bot', content: botResponse }]);
    setInputText('');
  };

  return (
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
        <Text>ㅇㅇㅇ님과의 대화</Text>
      </HStack>
      <ScrollView>
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
  );
};

export default ChatScreen;