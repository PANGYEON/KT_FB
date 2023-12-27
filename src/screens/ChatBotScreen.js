// ChatScreen.js
import React, { useState, useRef} from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent, TouchableOpacity } from 'react-native';
import { ChatIcon } from '../icons/ChatIcon.png';
// import SQLite from 'react-native-sqlite-storage';

const openaiApiKey = 'OPENAI_API_KEY'; 
const tuningModel = 'TUNING_MODEL';

function fetchDietDB(date) {
  return date;
  // return new Promise((resolve, reject) => {
  //   const db = SQLite.openDatabase({name: 'user_diet.sqlite3', location: 'default'});
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       "SELECT * FROM user_result WHERE date=?",
  //       [date],
  //       (tx, results) => {
  //         if (results.rows.length > 0) {
  //           resolve(results.rows.item(0));
  //         } else {
  //           resolve(null);
  //         }
  //       },
  //       error => reject(error)
  //     );
  //   });
  // });
}

function createDietPrompt(dietInfo) {
  if (!dietInfo) {
    return "해당 날짜에 대한 식단 정보가 없습니다.";
  }
  // 1, 2, 3, 일주일 전까지
  const { date, tan, dan, dang, ji, result } = dietInfo;
  //return '${date}에 드신 탄수화물은 ${tan}, 당류는 ${dang}, 단백질은 ${dan}, 지방은 ${ji} 입니다. 최종 결과는 ${result}~';
  return 'DB 연결 예정';
}

const ChatBotScreen = ({onClose}) => {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState(''); // To store the user input
  const [chatHistory, setChatHistory] = useState([]); // To store the chat history
  const scrollViewRef = useRef();

  const handleSendMessage = async() => {
    if (inputText.trim() === '') return;

    setChatHistory([...chatHistory, { role: 'user', content: inputText }]);
    setInputText('');
    //API 호출
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer KEY', // KEY에 OpenAI API 키 입력-나중에 환경변수
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'MODEL',
          messages: [
            {"role": "system", "content": "너는 식단을 평가해주는 챗봇이야"},
            {"role": "user", "content": inputText}
          ],
          max_tokens:150,
        })
        
      });

      const data = await response.json();
      const result = data.choices[0].message.content;
      //const result="0";

      if (result=="1"){
        userDietInfo = fetchDietDB('2023-12-20');
        dietResponse = createDietPrompt(userDietInfo);
        setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: dietResponse }]);
      }
      else{
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer KEY', // KEY에 OpenAI API 키 입력-나중에 환경변수
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {"role": "system", "content": "너는 max_tokens가 있어도 문장을 뚝 끊지 않고 마무리해주는 챗봇이야"},
                {"role": "user", "content": inputText}
              ],
              max_tokens:150,
            })
          });

          const data = await response.json();
          const botMessage = data.choices[0].message.content;
          setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: botMessage }]);
      } catch (error) {
        console.error('DB 호출 에러', error);
      }}
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
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

export default ChatBotScreen;