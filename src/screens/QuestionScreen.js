
import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, Button, Modal } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import BackIcon from '../icons/BackIcon.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HStack} from 'native-base';

const QuestionScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const navigation = useNavigation();

  // 문의 제목, 내용 확인 Alert
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 삭제하시겠습니까? Alert
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

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
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
        <TouchableOpacity
          onPress={() => setShowModal(false)}  // 입력 필드 초기화
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
            zIndex: 1 // 버튼이 다른 요소 위에 표시되도록 zIndex 설정
          }}>
          <Text>X</Text>
        </TouchableOpacity>
        <View style={styles.questionContainer}>
          <Text style={{fontSize:20}}> 문의 제목 : {selectedQuestion.title} </Text>
          <Text style={{fontSize:17, marginTop:5}}> 문의 내용</Text>
          <Text style={{backgroundColor:'#eee', padding:10, borderRadius:10, marginTop:5}}> {selectedQuestion.content} </Text>
        </View>
          <View style={styles.separator} />
          
          {selectedQuestion.answers.length > 0 ? (
            selectedQuestion.answers.map((answer, index) => (
              <Text key={index}> 답변 : {answer.content} </Text> // 예시로 answer.content를 사용했습니다. 실제 구조에 맞게 조정하세요.
            ))
          ) : (
            <Text> 답변이 아직 안왔습니다.. </Text>
          )}
          <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuestion(selectedQuestion.id)}
        >
          <Text style={{color:'#fff'}}> 삭제 </Text>
        </TouchableOpacity>
        </View>
        </View>
      </Modal>
    );
  };

  const handleCreateQuestion = () => {
    if (!newQuestionTitle && !newQuestionContent){
      setAlertMessage('문의 제목과 내용을 입력해주세요.');
      return;
    }

    if (!newQuestionTitle) {
      setAlertMessage('문의 제목을 입력해주세요');
      return;
    }
    if (!newQuestionContent) {
      setAlertMessage('문의 내용을 입력해주세요');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCreateQuestion = async () => {
    // 기존의 handleCreateQuestion 로직을 여기로 옮깁니다.
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
      const response = await axios(config);
      // 여기서 추가된 문의를 처리하세요. 예를 들어, 문의 목록을 다시 불러올 수 있습니다.
      const newQuestion = response.data; // API 응답에서 새로운 문의 데이터를 받아옵니다.
      setShowQuestionModal(false);
      setQuestions([newQuestion, ...questions]); // 새 문의를 목록의 앞에 추가합니다.
      setShowQuestionModal(false);
      setNewQuestionTitle(''); // 입력 필드 초기화
      setNewQuestionContent(''); // 입력 필드 초기화 
    } catch (error) {
      console.error(error);
      console.log(error.response);
    }

    setShowConfirmModal(false); // 등록 확인 모달 닫기
  };

  const renderAlertModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!alertMessage}
      onRequestClose={() => setAlertMessage('')}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
        <View style={{ alignSelf: 'flex-start' }}> 
          <Text style={{fontSize:16, color:'black'}}>{alertMessage}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setAlertMessage('')}
          >
            <Text style={{color: '#fff'}}>닫기</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showConfirmModal}
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={{ alignSelf: 'flex-start' }}> 
            <Text style={{textAlign:'left', fontSize:16, color:'black'}}>등록하시겠습니까? </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonNo]}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={{ color: '#8E96FA' }}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonYes]}
              onPress={confirmCreateQuestion}
            >
              <Text style={{ color: '#FFF' }}>네</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  

  // 삭제
  const handleDeleteQuestion = (questionId) => {
    setDeleteQuestionId(questionId);
    setShowDeleteConfirmModal(true);
  };

   const confirmDeleteQuestion = async () => {
    if (!deleteQuestionId) return;

    // 삭제 로직
    const token = await AsyncStorage.getItem('@user_token');
    const config = {
      method: 'delete',
      url: `http://edm.japaneast.cloudapp.azure.com/api/asks/${deleteQuestionId}/`,
      headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
      await axios(config);
      const updatedQuestions = questions.filter(question => question.id !== deleteQuestionId);
      setQuestions(updatedQuestions);
      setShowModal(false); // 기존 모달 닫기
    } catch (error) {
      console.error(error);
      // 에러 처리 로직
    }

    setShowDeleteConfirmModal(false); // 삭제 확인 모달 닫기
    setDeleteQuestionId(null); // 삭제할 문의 ID 초기화
  };

  // 삭제 확인 모달
  const renderDeleteConfirmModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showDeleteConfirmModal}
      onRequestClose={() => setShowDeleteConfirmModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={{ alignSelf: 'flex-start' }}> 
            <Text style={{textAlign:'left', fontSize:16, color:'black'}}>삭제하시겠습니까?</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonNo]}
              onPress={() => setShowDeleteConfirmModal(false)}
            >
              <Text style={{ color: '#8E96FA' }}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonYes]}
              onPress={confirmDeleteQuestion}
            >
              <Text style={{ color: '#FFF' }}>네</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // 문의하기 모달창
  const renderQuestionModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showQuestionModal}
      onRequestClose={() => setShowQuestionModal(false)}
    >
      <View style={styles.modalOverlay}>
      <View style={styles.modalView}>
        <TouchableOpacity
          onPress={() => setShowQuestionModal(false)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
            zIndex: 1 // 버튼이 다른 요소 위에 표시되도록 zIndex 설정
          }}>
          <Text>X</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="문의 제목"
          value={newQuestionTitle}
          onChangeText={setNewQuestionTitle}
        />

        <View style={styles.separator} />

        <TextInput
          style={[styles.input, {height: 100}]}
          placeholder="문의 내용"
          value={newQuestionContent}
          onChangeText={setNewQuestionContent}
          multiline
          textAlign="left"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateQuestion}
        >
          <Text style={{color:'#fff'}}>등록</Text>
        </TouchableOpacity>
      </View>
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
          1:1 문의 내역
        </Text>
        {/* '문의하기' 버튼 */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowQuestionModal(true)}
      >
        <Text style={{color:'#fff'}}> 문의하기 </Text>
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
      {renderAlertModal()}
      {renderConfirmModal()}
      {renderDeleteConfirmModal()}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    elevation: 5,
    width:'80%',
  },
  closeButton: {
    marginTop:20,
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButton:{
    marginTop:20,
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButton:{
    marginTop:20,
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginVertical: 10,
  },

  input: {
    width: '100%', // 폭 조정
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee', // 배경색 어둡게 조정
  },

  deleteButton:{
    marginTop:30,
    backgroundColor: 'red',
    borderRadius: 40,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    width:'100%',
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  buttonNo: {
    backgroundColor: '#FFF',
    // 추가적인 스타일링
  },
  buttonYes: {
    backgroundColor: '#8E86FA',
    // 추가적인 스타일링
  },

  questionContainer:{
    justifyContent: 'flex-start',
    marginTop: 20,
    width:'100%',
  }
});

export default QuestionScreen;