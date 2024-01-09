
import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, TextInput, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BackIcon from '../icons/BackIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuestionScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('@user_token');

        let config = {
          method: 'get',
          url: 'http://edm.japaneast.cloudapp.azure.com/api/asks/',
          headers: {
            'Authorization': `Bearer ${token}` },
        };
        const response = await axios(config);
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuestions();
  }, []);

  const handleQuestionPress = (item) => {
    setSelectedQuestion(item);
    setShowModal(true);
  };

  const renderModalContent = () => {
    if (!selectedQuestion) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalView}>
        <Text style={{fontSize:20}}>문의 제목 : {selectedQuestion.title}</Text>
          <Text style={{fontSize:17}}>문의 내용 : {selectedQuestion.content}</Text>
          
          {selectedQuestion.answers.length > 0 ? (
            selectedQuestion.answers.map((answer, index) => (
              <Text key={index}>답변 : {answer.content}</Text> // 예시로 answer.content를 사용했습니다. 실제 구조에 맞게 조정하세요.
            ))
          ) : (
            <Text>답변이 아직 안왔습니다..</Text>
          )}
          <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuestion(selectedQuestion.id)}
        >
          <Text>삭제</Text>
        </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowModal(false)}
          >
            <Text >닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const handleCreateQuestion = async () => {
    const token = await AsyncStorage.getItem('@user_token');
    const data = new FormData();
    data.append('title', newQuestionTitle);
    data.append('content', newQuestionContent);
    const config = {
      method: 'post',
      url: 'http://edm.japaneast.cloudapp.azure.com/api/asks/',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      data: data
    };
  
    try {
       await axios(config);
      // 여기서 추가된 문의를 처리하세요. 예를 들어, 문의 목록을 다시 불러올 수 있습니다.
      setShowQuestionModal(false);
    } catch (error) {
      console.error(error);
      console.log(error.response);
    }
  };
  const handleDeleteQuestion = async (questionId) => {
    const token = await AsyncStorage.getItem('@user_token');
    const config = {
      method: 'delete',
      url: `http://edm.japaneast.cloudapp.azure.com/api/asks/${questionId}/`,
      headers: { 
        'Authorization': `Bearer ${token}`,
      }
    };
  
    try {
      await axios(config);
      // 성공적으로 삭제된 후의 처리. 예를 들어, 문의 목록을 다시 불러올 수 있습니다.
      setShowModal(false);
      // 문의 목록을 다시 불러오는 로직 추가 필요
    } catch (error) {
      console.error(error);
      // 에러 처리 로직
    }
  };
  const renderQuestionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showQuestionModal}
      onRequestClose={() => setShowQuestionModal(false)}
    >
      <View style={styles.modalView}>
        <TextInput
          style={styles.input}
          placeholder="문의 제목"
          value={newQuestionTitle}
          onChangeText={setNewQuestionTitle}
        />
        <TextInput
          style={[styles.input, {height: 100}]}
          placeholder="문의 내용"
          value={newQuestionContent}
          onChangeText={setNewQuestionContent}
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateQuestion}
        >
          <Text>등록</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  return (
    <View style={styles.container}>
      {/* 이전 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image source={BackIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title "내 문의 내역" */}
        <Text style={styles.title}>
          내 문의 내역
        </Text>
        {/* '문의하기' 버튼 */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowQuestionModal(true)}
      >
        <Text>문의하기</Text>
      </TouchableOpacity>

      {renderQuestionModal()}
      </View>

      {/* List of questions */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleQuestionPress(item)}
            style={styles.questionItem}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {renderModalContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  questionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#D7D4FF",
    padding: 10,
    borderRadius: 10,
  },
});

export default QuestionScreen;