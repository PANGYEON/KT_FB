// ChatScreen.js Test github
import React, { useState, useRef, useEffect } from 'react';
import { Button, View, Input, Text, VStack,HStack, ScrollView} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Image, ImageComponent, TouchableOpacity } from 'react-native';
import  ChatBotIcon  from '../icons/ChatBotIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

//function createDietPrompt(dietInfo) {
  // if (!dietInfo) {
  //   return "해당 날짜에 대한 식단 정보가 없습니다.";
  // }
//   // 1, 2, 3, 일주일 전까지
//   const { date, tan, dan, dang, ji, result } = dietInfo;
//   //return '${date}에 드신 탄수화물은 ${tan}, 당류는 ${dang}, 단백질은 ${dan}, 지방은 ${ji} 입니다. 최종 결과는 ${result}~';
//   return 'DB 연결 예정';
// }

// function createDietPrompt(inputText){
// }

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
  const handleSendMessage = async() => {
    if (inputText.trim() === '') return;

    const updatedChatHistory = [...chatHistory, { role: 'user', content: inputText }];
    setChatHistory(updatedChatHistory);
    setInputText('');

    // 채팅 기록을 AsyncStorage에 저장
    try {
      await saveChatHistory(updatedChatHistory);
    } catch (error) {
      console.error('채팅 기록 저장 중 오류 발생:', error);
    }

    //API 호출
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ', // KEY에 OpenAI API 키 입력-나중에 환경변수
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'ft:gpt-3.5-turbo-0613:personal::8Y472aHg',
          messages: [
            {"role": "system", "content": "너는 식단을 평가해주는 챗봇이야"},
            {"role": "user", "content": inputText}
          ],
          max_tokens:150,
        })
        
      });

      const data = await response.json();
      const result = data.choices[0].message.content;
      let example = `date	carbs	protein	fat	sugar	result
      2023-12-27  100 80 48 88 bad
      2023-12-26	100	10	450	20	good
      2023-12-25	300	100	100	10	normal
      2023-12-20	300	100	400	50	not bad
      2023-12-22	40	100	124	123	perfect
      2023-12-03	120	300	40	25	perfect
      2023-12-15	90	800	400	50	bad
      `;
      if (result=="1"){
        //userDietInfo = fetchDietDB();
        //dietResponse = createDietPrompt(inputText);
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ', // KEY에 OpenAI API 키 입력-나중에 환경변수
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                {"role": "system", "content": "너는 max_tokens가 있어도 문장을 뚝 끊지 않고 마무리해주는 식단 평가 결과 분석 챗봇이야."},
                {"role": "user", "content": inputText},
                {"role":"assistant", 
                "content": `너는 식단 평가 결과를 궁금해 하는 사용자와 대화하는 친절한 결과 분석 챗봇이야. 사용자의 DB가 너한테 투입될 예정이야. 일단  ${example} 이거 참고해줘. 오늘은 2023-12-27 이다.  사용자 입력 문장에서 (어제, 하루 전, 1일전, 하루전, 이틀 전, 이틀전, 2일전, 2일 전, 그저께, 엊그제, 엊그저께, 3일전, 3일 전, 일주일전, 일주일 전, 저번 주) 등을 포착해서 사용자가 요구하는 날짜가 언제인지 출력해줘. 사용자의 다른 요구사항은 무시하고, 문장 속에서 찾을 수 있는 날짜만 'yyyy-mm-dd' 형식으로 출력해줘. 문장 속에서 날짜를 찾을 수 없다면 '구체적인 날짜를 입력해주세요' 출력하고, 특정 날짜의 정보가 존재하지 않으면 ''특정 날짜'의 식단 정보가 존재하지 않습니다'라고 출력해줘.`}
              ],
              max_tokens: 300,
            })
          });
          const data = await response.json();
          const dietResponse = data.choices[0].message.content;
          setChatHistory(currentChat => [...currentChat, { role: 'assistant', content: dietResponse }]);
        } catch (error) {
        console.error('날짜 추출 API 에러', error);
        }  
      }
      else{
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ', // KEY에 OpenAI API 키 입력-나중에 환경변수
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
        console.error('chatAPI 호출 에러', error);
      }}
    } catch (error) {
      console.error('chatAPI 호출 에러:', error);
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