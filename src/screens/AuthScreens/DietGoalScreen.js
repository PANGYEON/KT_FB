// import React, { useState } from 'react';
// import { View, Button } from 'native-base';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { StyleSheet, Text, Alert } from 'react-native';

// const DietGoalScreen = ({ route }) => {
//   const { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel } = route.params;
//   const navigation = useNavigation();
//   const [goalIndex, setGoalIndex] = useState(-1); // -1 for no selection

//   const goals = ['체중 감량', '체중 유지', '체중 증량'];
//   // const handleLevelSelect = (index) => {
//   //   setGoalIndex(index + 1); // 인덱스에 1을 더함
//   // };
//   const handleRegister = () => {
//     if (goalIndex === -1) {
//       Alert.alert("경고", "목표를 선택해주세요.");
//       return;
//     }

//     const adjustedGoalIndex = goalIndex + 1;
//     const data = {
//       "email": email,
//       "name": name,
//       "birthdate": birthdate,
//       "active_level": selectedActivityLevel, //levelIndex.toString(),
//       "height": parseInt(personheight, 10),
//       "weight": parseInt(personweight, 10),
//       "diet_purpose": adjustedGoalIndex >= 0 ? goals[adjustedGoalIndex - 1] : null, // 인덱스 1 증가
//       "password": password,
//       "gender": gender,
//       "agreed_to_privacy_policy": true
//     };

//     console.log("Register data:", data);
//     const jsonData = JSON.stringify(data);

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'http://edm.japaneast.cloudapp.azure.com/api/user/',
//       headers: { 
//         'Content-Type': 'application/json'
//       },
//       data : jsonData
//     };

//     axios.request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         navigation.navigate('Login');
//       })
//       .catch((error) => {
//         // 에러 메시지 자세히 출력
//         console.log('Error object:', error);

//         if (error.response) {
//           console.log('Error response:', error.response);
//           if (error.response.data) {
//             console.log('Error response data:', error.response.data);
//             if (error.response.data.display_message) {
//               console.log('Display message:', error.response.data.display_message);
//               Alert.alert('회원가입 오류', error.response.data.display_message);
//             }
//           }
//         } else if (error.request) {
//           console.log('Error request:', error.request);
//         } else {
//           console.log('Error message:', error.message);
//         }

//         Alert.alert('회원가입 실패', '회원가입 중 오류가 발생했습니다.');
//       });

//   }

//   return (
//     <View style={edm.container}>
//       <View style={edm.contentContainer}>
//       <View style={styles.goalTextView}>
//           <Text style={styles.goalTextText}>목적</Text>
//         </View>
//         {goals.map((goal, index) => (
//           <View key={index} style={styles.goalButtonContainer}>
//             <Button
//               onPress={() => setGoalIndex(index)}
//               style={goalIndex === index ? styles.activeGoalButton : styles.inactiveGoalButton}>
//               <Text style={goalIndex === index ? styles.activeGoalButtonText : styles.inactiveGoalButtonText}>
//                 {goal}
//               </Text>
//             </Button>
//           </View>
//         ))}
//         <View style={styles.buttonContainer}>
//           <Button style={styles.MovingButton} onPress={() => navigation.navigate('ActivityLevel', { email, password, name, birthdate, personheight, personweight, gender, levelIndex })}>
//             이전
//           </Button>
//           <Button style={styles.MovingButton} onPress={handleRegister}>
//             완료
//           </Button>
//         </View>
//       </View>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   goalTextView: {
//     alignItems: 'center', // 가로축 기준 가운데 정렬
//     justifyContent: 'center', // 세로축 기준 가운데 정렬
//   },
//   goalTextText: {
//     fontSize: 20, marginBottom: 10 // 글자 크기 설정
//   },
//   goalButtonContainer: {
//     marginVertical: 5,
//   },
//   activeGoalButton: {
//     borderRadius:20,
//     marginBottom:10,
//     backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색 (보라색)
//   },
//   inactiveGoalButton: {
//     borderRadius:20,
//     marginBottom:10,
//     backgroundColor: '#FFFFFF', // 기본 배경색 (흰색)
//   },
//   activeGoalButtonText: {
//     color: 'white', // 눌러진 버튼의 글자색 (흰색)
//   },
//   inactiveGoalButtonText: {
    
//     color: 'black', // 기본 버튼의 글자색 (검은색)
//   },
//   MovingButton: {
//     borderRadius: 50,
//     backgroundColor: '#8E86FA',
//     width: '35%', // 너비를 35%로 증가
//     height: '20%', // 높이 설정
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end', // 하단에 정렬
//     marginBottom: -15, // 하단 여백
//   },
  
// });
// const edm = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     backgroundColor: '#D7D4FF',
//     borderTopLeftRadius: 50,
//     borderTopRightRadius: 50,
//     paddingTop: 70,
//     marginTop: 20,
//     padding: 40,
//     height: '70%',
//   },
// });

// export default DietGoalScreen;
import React, { useState } from 'react';
import { View, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
//import axios from 'axios';
import { StyleSheet, Text, Alert, Modal, TouchableOpacity } from 'react-native';
 
const DietGoalScreen = ({ route }) => {
  const { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel } = route.params;
  const navigation = useNavigation();
  const [goalIndex, setGoalIndex] = useState(-1); // -1 for no selection
 
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  //const [alertSuccess, setAlertSuccess] = useState(''); // 삭제예정
 
  //const [showOkButton, setShowOkButton] = useState(true); // OK 버튼 표시 여부 상태
 
  const goals = ['체중 감량', '체중 유지', '체중 증량'];
  // const handleLevelSelect = (index) => {
  //   setGoalIndex(index + 1); // 인덱스에 1을 더함
  // };
  const handleRegister = () => {
    if (goalIndex === -1) {
      setAlertMessage(`목표를 선택해주세요.`);
      setAlertModalVisible(true);
      //Alert.alert("경고", "목표를 선택해주세요.");
    } else {
      navigation.navigate('Privacy', {
        email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel, goalIndex
      });
    }
  };
 
  return (
    <View style={edm.container}>
      <View >
        <Text style={{alignSelf: 'center', marginBottom: '10%', fontSize: 20, color: 'black', fontWeight: '900', padding: '1%'}}>
          식단목적을 선택해주세요
        </Text>
      </View>
      <View style={edm.contentContainer}>
      <View style={styles.goalTextView}>
          <Text style={styles.goalTextText}>목적</Text>
        </View>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalButtonContainer}>
            <Button
              onPress={() => setGoalIndex(index)}
              style={goalIndex === index ? styles.activeGoalButton : styles.inactiveGoalButton}>
              <Text style={goalIndex === index ? styles.activeGoalButtonText : styles.inactiveGoalButtonText}>
                {goal}
              </Text>
            </Button>
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton} onPress={() => navigation.navigate('ActivityLevel', { email, password, name, birthdate, personheight, personweight, gender, selectedActivityLevel })}>
            이전
          </Button>
          <Button style={styles.MovingButton} onPress={handleRegister}>
            다음
          </Button>
        </View>
      </View>
 
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => {
          setAlertModalVisible(!alertModalVisible);
        }}>
        <View style={styles.alertModalView}>
        <View style={styles.alertModalContainer}>
          <Text style={{fontSize:20, fontWeight:'bold', color:'#000', padding: '1%'}}>오류!</Text>
          <Text style={styles.alertText}>{alertMessage}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setAlertModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  goalTextView: {
    alignItems: 'center', // 가로축 기준 가운데 정렬
    justifyContent: 'center', // 세로축 기준 가운데 정렬
  },
  goalTextText: {
    fontSize: 20, marginBottom: 10 // 글자 크기 설정
  },
  goalButtonContainer: {
    marginVertical: 5,
  },
  activeGoalButton: {
    borderRadius:20,
    marginBottom:10,
    backgroundColor: '#8E86FA', // 눌러진 버튼의 배경색 (보라색)
  },
  inactiveGoalButton: {
    borderRadius:20,
    marginBottom:10,
    backgroundColor: '#FFFFFF', // 기본 배경색 (흰색)
  },
  activeGoalButtonText: {
    color: 'white', // 눌러진 버튼의 글자색 (흰색)
  },
  inactiveGoalButtonText: {
   
    color: 'black', // 기본 버튼의 글자색 (검은색)
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '35%', // 너비를 35%로 증가
    height: '20%', // 높이 설정
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // 하단에 정렬
    marginBottom: -15, // 하단 여백
  },
 
  alertModalView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  alertModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: '5%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    margin: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontSize: 1,
    //height: 150,
    //width: 300,
    width: '80%',
    height: '20%',
  },
  modalText: {
    fontSize: 16,             // 글자 크기
    textAlign: 'flex-start',      // 텍스트 중앙 정렬
  },
  alertButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end', // 버튼을 하단으로 이동
    alignItems: 'flex-end', // 버튼을 오른쪽으로 이동
    width: '100%',
  },
  alertButton: {
    backgroundColor: '#8E86FA',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 10, // 버튼 높이 조절
    paddingHorizontal: 20, // 버튼 너비 조절
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 수평 중앙 정렬
  },
  alertButtonText: {
    color: '#fff',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
 
});
const edm = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  contentContainer: {
    backgroundColor: '#D7D4FF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: 70,
    marginTop: 20,
    padding: 40,
    height: '70%',
  },
});
 
export default DietGoalScreen;