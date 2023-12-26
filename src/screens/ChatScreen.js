// ChatScreen.js
import React, { useState, useRef} from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent } from 'react-native';
import { ChatIcon } from '../icons/ChatIcon.png';
// import SQLite from 'react-native-sqlite-storage';

const openaiApiKey = 'OPENAI_API_KEY'; 

// function fetchDietDB(date) {
//   return new Promise((resolve, reject) => {
//     const db = SQLite.openDatabase({name: 'user_diet.sqlite3', location: 'default'});
//     db.transaction(tx => {
//       tx.executeSql(
//         "SELECT * FROM user_result WHERE date=?",
//         [date],
//         (tx, results) => {
//           if (results.rows.length > 0) {
//             resolve(results.rows.item(0));
//           } else {
//             resolve(null);
//           }
//         },
//         error => reject(error)
//       );
//     });
//   });
// }

// function createDietPrompt(dietInfo) {
//   if (!dietInfo) {
//     return "해당 날짜에 대한 식단 정보가 없습니다.";
//   }

//   const { date, tan, dan, dang, ji, result } = dietInfo;
//   return `${date}에 드신 탄수화물은 ${tan}, 당류는 ${dang}, 단백질은 ${dan}, 지방은 ${ji} 입니다. 최종 결과는 ${result}~`;
// }


const ChatScreen = () => {
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
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputText }]
        })
        
      });

      const data = await response.json();
      const botMessage = data.choices[0].message.content;

      setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: botMessage }]);
    
    } catch (error) {
      console.error('API 호출 에러:', error);
    }

  };
  //   try {
  //     const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': 'Bearer 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', // 여기에 OpenAI API 키 입력
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         model: 'ft:gpt-3.5-turbo-0613:personal::8ZqK4Bk9',
  //         messages: [
  //           {"role": "system", "content": "너는 식단을 평가해주는 챗봇이야"},
  //           {"role": "user", "content": inputText}]
  //       })
  //     });

  //   const data = await response.json();
  //   const botResponse = data.choices[0].message.content;
    
  //   if (botResponse == "1") {
  //       //사용자 식단 DB 정보
  //       //const date = (new Date()).toISOString().split('T')[0]; // 오늘 날짜로 설정, 필요에 따라 변경
  //       const userDietInfo = await fetchDietDB('2023-12-20');
  //       const dietResponse = createDietPrompt(userDietInfo);
  //       setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: dietResponse }]);
  //   }
  //   else{ 
  //       //식단 평가 대화
  //       response = await fetch('https://api.openai.com/v1/chat/completions', {
  //         method: 'POST',
  //         headers: {
  //           'Authorization': 'Bearer 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',
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           model: 'gpt-3.5-turbo',
  //           messages: [
  //             { role: 'user', content: inputText },
  //             { role: 'assistant', content: botResponse },
  //             { role: 'user', content: inputText } // 재입력 또는 추가 메시지
  //           ]
  //         })
  //       });
        
  //       data = await response.json();
  //       botResponse = data.choices[0].message.content;
  //       setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: botResponse }]);
  //   }
  // } catch (error) {
  //     console.error('API 호출 에러:', error);
  //   }
    // 챗봇 답변오고나서 지워짐
  //   setInputText('');
  // };

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

export default ChatScreen;