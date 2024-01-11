// 게시판페이지
import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Modal, Image, ScrollView, Dimensions,Linking  } from 'react-native';
import ChatBotScreen from './ChatBotScreen';
import axios from 'axios';

// 디바이스의 너비와 높이를 가져와서 설정
const { width, height } = Dimensions.get('window');
 
const BoardScreen = () => {
  // 상태변수 설정
  const navigation = useNavigation(); // 네비게이션
  const [isModalVisible, setModalVisible] = useState(false); // 모달상태
  const [selectedCategory, setSelectedCategory] = useState('FAQ'); // 카테고리상태 -- FAQ를 기본 선택
  const [titles, setTitles] = useState([]); // 카테고리의 제목상태
  const categories = ['FAQ', '공지사항']; // 카테고리배열
  
  // 이미지의 너비와 높이 설정
  const imageHeight = height * 0.22;
  const imageWidth = height * 0.22;
 
  // 상태변수 설정
  const [faqData, setFaqData] = useState([]); // FAQ 데이터상태
  const [noticesData, setNoticesData] = useState([]); // 공지사항 데이터상태
  const [cardNewsData, setCardNewsData] = useState([]); // 카드 뉴스 데이터상태
 
  // FAQ 데이터를 로드하는 함수
  const loadFaqData = async () => {
    try {
      let config = {
        method: 'get',
        url: 'http://edm.japaneast.cloudapp.azure.com/api/faqs/',
        headers: {}
      };
      const response = await axios.request(config);
      setFaqData(response.data); // 데이터를 상태 변수에 저장
    } catch (error) {
      console.error("FAQ 데이터 로드 중 오류 발생:", error);
    }
  };
  // 공지사항 데이터를 로드하는 함수
  const loadNoticesData = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://edm.japaneast.cloudapp.azure.com/api/notices/',
        headers: {}
      };
      const response = await axios.request(config);
      setNoticesData(response.data); // 데이터를 상태 변수에 저장
    } catch (error) {
      console.error("공지 데이터 로드 중 오류 발생:", error);
    }
  };
  const loadCardNewsData = async () => {
    try {
      let config = {
        method: 'get',
        url: 'http://edm.japaneast.cloudapp.azure.com/api/cardnews/',
        headers: {}
      };
      const response = await axios.request(config);
      setCardNewsData(response.data); // 데이터를 상태 변수에 저장
    } catch (error) {
      console.error("카드 뉴스 데이터 로드 중 오류 발생:", error);
    }
  };

  // 선택된 카테고리에 따른 버튼 스타일
  const getButtonStyle = (category) => ({
    width: '45%',
    backgroundColor: selectedCategory === category ? '#8E86FA' : 'transparent',
    borderColor: selectedCategory === category ? '#8E86FA' : 'transparent',
    borderRadius: 10
  });
 
  //선택된 카테고리에 따른 버튼텍스트 스타일
  const getButtonTextStyle = (category) => ({
    color: selectedCategory === category ? 'white' : 'black',
    fontSize: 20,
  });
 
  // 모달을 토글하는 함수
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
 
  //선택된 카테고리에 따른 콘텐츠 렌더링 함수
  const renderContent = () => {
    if (selectedCategory === 'FAQ') {
      return (
        <ScrollView>
          {faqData.map((faq, index) => (
            <TouchableOpacity key={index} onPress={() => toggleContent(index, 'FAQ')}>
              <View style={{ paddingVertical: 10 }}>
                <Text>{faq.title}</Text>
                {titles[index] === 'FAQ' && <Text>- {faq.content}</Text>}
              </View>
              {index < faqData.length - 1 && <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    } else if (selectedCategory === '공지사항') {
      return (
        <ScrollView>
          {noticesData.map((notice, index) => (
            <TouchableOpacity key={index} onPress={() => toggleContent(index, '공지사항')}>
              <View style={{ paddingVertical: 10 }}>
                <Text>{notice.title}</Text>
                {titles[index] === '공지사항' && <Text>- {notice.content}</Text>}
              </View>
              {index < noticesData.length - 1 && <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray' }} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    } else {
      return null;
    }
  };

  // 카테고리 아이템의 콘텐츠 토글 
  const toggleContent = (index, category) => {
    const newTitles = [...titles];
    newTitles[index] = newTitles[index] === category ? null : category;
    setTitles(newTitles);
  };
 
  // 초기 데이터 설정
  useEffect(() => {
    loadFaqData();
    loadNoticesData();
    loadCardNewsData();
 
  }, []);
 
  return (
    // 카드뉴스부분
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginTop: '3%', height: height * 0.06 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', paddingTop: '4%' }}>카드 뉴스</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: 10 }}
      >
        {/* 매핑을 통한 카드뉴스데이터 출력 */}
        {cardNewsData.map((cardNews, index) => (
          <TouchableOpacity 
            key={index} 
            style={{ marginRight: 15 }}
            onPress={() => Linking.openURL(cardNews.link)} // Add this line
          >
            <View style={{ width: imageWidth, height: imageHeight, overflow: 'hidden', borderRadius: 10 }}>
              <Image
                source={{ uri: cardNews.image }}
                style={{ flex: 1, width: undefined, height: undefined }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>{cardNews.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 영역구분 */}
      <View style={{ borderTopWidth: 1, borderTopColor: 'gray', marginVertical: height * 0.013 }} />

      {/* 버튼영역 */}
      <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-around', 
                padding: 10, 
                }}>
                  {/* 매핑을 통한 카테고리 출력 */}
        {categories.map(category => (
          <Button
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={getButtonStyle(category)}
          >
            <Text style={getButtonTextStyle(category)}>{category}</Text>
          </Button>
        ))}
      </View>

      {/* 카테고리에 따른 내용을 보여주는 부분 */}
      <View style={{ backgroundColor: '#ebebeb', padding: 10, borderRadius: 10, margin: 10, height: height * 0.45 }}>
        {renderContent()}
      </View>

      {/* 챗봇버튼 */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          backgroundColor: '#D7D4FF',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5
        }}
        onPress={toggleModal}>
        <Image source={require('../icons/ChatBotIcon.png')} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>

      {/* 챗봇 모달창 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            flex: 1,
            minWidth: '80%',
            maxHeight: '80%',
            backgroundColor: '#fff',
            borderRadius: 30,
          }}>
            <ChatBotScreen onClose={toggleModal} />
          </View>
        </View>
      </Modal>
    </View>
 
  );
}
 
export default BoardScreen;