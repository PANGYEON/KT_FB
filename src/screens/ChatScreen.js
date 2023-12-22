// ChatScreen.js
import React, { useState } from 'react';
import { Button, View, Input, Text, VStack, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add the user's message to chat history
    setChatHistory([...chatHistory, { role: 'user', content: inputText }]);

    // Call your chatGPT function here and get the response
    // For now, we'll just mock a response
    const mockResponse = "This is a mock response from the chatbot.";
    setChatHistory(currentChat => [...currentChat, { role: 'bot', content: mockResponse }]);

    // Clear the input field
    setInputText('');
  };

  return (
    <View flex={1}>
      <ScrollView>
        {chatHistory.map((msg, index) => (
          <Text key={index} bold={msg.role === 'user'}>
            {msg.role === 'user' ? 'You: ' : 'Bot: '}
            {msg.content}
          </Text>
        ))}
      </ScrollView>

      <VStack space={3} marginBottom="5">
        <Input
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
        />
        <Button onPress={handleSendMessage}>Send</Button>
      </VStack>

      <Button onPress={() => navigation.navigate("Home")}>이전</Button>
    </View>
  );
};

export default ChatScreen;