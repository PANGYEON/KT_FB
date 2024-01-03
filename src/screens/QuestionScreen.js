import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackIcon from '../icons/BackIcon.png';

const QuestionScreen = () => {
  // Sample list of questions (replace with your actual data)
  const navigation = useNavigation();

  const questions = [
    { id: '1', text: 'Question 1' },
    { id: '2', text: 'Question 2' },
    { id: '3', text: 'Question 3' },
    // Add more questions as needed
  ];

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
      </View>

      {/* List of questions */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // Handle when a question is pressed (you can navigate to a details screen or do something else)
            }}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}
          >
            <Text>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
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
});

export default QuestionScreen;
