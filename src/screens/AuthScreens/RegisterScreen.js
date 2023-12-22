// // 회원가입 - 이메일,비밀번호
// import React, { useState } from 'react';
// import { Button, View, Input, Text } from 'native-base';
// import { StyleSheet, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
//  //이메일 및 비밀번호 정규식
//  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/i;
//   const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/


//  const emailCheck = (email) => {
//    return emailRegEx.test(email);
//  }

//  const passwordCheck = (password) => {
//    return passwordRegEx.test(password);
//  }





// const RegisterScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigation = useNavigation();
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const isPasswordsMatch = password === confirmPassword;
//   const [isPasswordValid, setIsPasswordValid] = useState(false); // 초기 상태를 false로 변경
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false); // 포커스 상태 추가


//   const handlePasswordFocus = () => {
//     setIsPasswordFocused(true); // 입력란에 포커스가 있을 때
//   };

//   const handlePasswordBlur = () => {
//     setIsPasswordFocused(false); // 입력란에서 포커스가 벗어났을 때
//   };
//   const handlePasswordChange = (password) => {
//     setPassword(password);
//     setIsPasswordValid(passwordCheck(password));
//   };
//   const renderEmailError = () => {
//     if (email.length > 0 && !emailCheck(email)) {
//       return (
//         <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%',marginTop:'-3%' }}>
//           이메일 형식이 맞지 않습니다.
//         </Text>
//       );
//     }
//     return <View style={{ height: 12 }} />; // 메시지가 없을 때의 공간 예약
//   };
//   const renderPasswordError = () => {
//     if (isPasswordFocused && !isPasswordValid) {
//       return (
//         <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%' }}>
//           영문, 숫자, 특수문자를 포함한 8-20자리
//         </Text>
//       );
//     }
//     return <View style={{ height: 12 }} />; // 메시지가 없을 때의 공간 예약
//   };
//   const handleNextPage = () => {
//     if (isPasswordValid && isPasswordsMatch) {
//       navigation.navigate("RegisterInfo", { email, password });
//     } else {
//       Alert.alert("오류", "비밀번호 조건을 확인해주세요.");
//     }
//   };


//   return (
//     <View style={edm.container}>
//       <View style={edm.contentContainer}>
//         <View style={styles.inputContainer}>
//         <Input
//             placeholder="이메일"
//             value={email}
//             onChangeText={(value) => setEmail(value)}
//             variant="outline"
//             w="100%"
//             borderWidth={2}
//             borderColor={emailCheck(email) || email.length === 0 ? "gray.300" : "red.600"}
//             _focus={{
//               backgroundColor: "none",
//               borderColor: emailCheck(email) ? "transparent" : "red.600"
//             }}
//           />
          
//         </View>

//         {renderEmailError()}
//         <View style={{ height: 2 }} />
//         <View style={styles.inputContainer}>
//   <Input
//     placeholder="비밀번호"
//     secureTextEntry
//     value={password}
//     onChangeText={handlePasswordChange}
//     onFocus={handlePasswordFocus}
//     onBlur={handlePasswordBlur}
//     borderColor={
//       isPasswordValid ? "transparent" : // 유효한 비밀번호일 때 테두리 색상을 없애거나 변경
//       (isPasswordFocused ? "red.600" : "gray.300") // 포커스가 있고 유효하지 않은 경우 빨간색, 그 외에는 회색
//     }
//     borderWidth={2}
//     _focus={{
//       backgroundColor: "none",
//     }}
//   />
// </View>

//   {renderPasswordError()}
//         <View style={styles.inputContainer}>
//           <Input
//             placeholder="비밀번호 확인"
//             secureTextEntry
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//         </View>
//         <View style={{ height: 10 }} />
//         <View style={styles.buttonContainer}>
//           <Button style={styles.MovingButton}
//             onPress={() => navigation.navigate("Login")}>
//             이전
//           </Button>

//           <Button style={styles.MovingButton}
//             // onPress={() => navigation.navigate("RegisterInfo", { email, password })}>
            
//             onPress={handleNextPage}>
//             다음
//           </Button>
//         </View>
//       </View>
//     </View>
//   );
// }

// // 스타일 시트 정의
// const styles = StyleSheet.create({
//   inputContainer: {
//     marginBottom: 10,
//     borderRadius: 50,
//     backgroundColor: 'white',
//   },
//   loginButton: {
//     marginBottom: 10,
//     borderRadius: 50,
//     backgroundColor: '#8E86FA',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   MovingButton: {
//     borderRadius: 50,
//     backgroundColor: '#8E86FA',
//     width: '25%',
//   },
//   buttonText: {
//     color: 'black',
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
//     padding: 40,
//     height: '70%',
//   },
// });

// export default RegisterScreen;
import React, { useState } from 'react';
import { Button, View, Input, Text } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 이메일 및 비밀번호 정규식
const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/i;
const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

const emailCheck = (email) => {
  return emailRegEx.test(email);
}

const passwordCheck = (password) => {
  return passwordRegEx.test(password);
}

const RegisterScreen = ({route}) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [confirmPassword, setConfirmPassword] = useState('');
  const isPasswordsMatch = password === confirmPassword;
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handlePasswordChange = (password) => {
    setPassword(password);
    setIsPasswordValid(passwordCheck(password));
  };

  const renderEmailError = () => {
    if (email.length > 0 && !emailCheck(email)) {
      return (
        <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%', marginTop: '-3%' }}>
          이메일 형식이 맞지 않습니다.
        </Text>
      );
    }
    return <View style={{ height: 12 }} />;
  };

  const renderPasswordError = () => {
    if (password.length > 0 && !passwordCheck(password) ) {
      return (
        <Text fontSize={12} color="red.600" style={{ alignSelf: 'flex-start', marginLeft: '5%' }}>
          영문, 숫자, 특수문자를 포함한 8-20자리
        </Text>
      );
    }
    return <View style={{ height: 12 }} />;
  };

  const handleNextPage = () => {
    if (isPasswordValid && isPasswordsMatch) {
      navigation.navigate("RegisterInfo", { email, password });
    } else {
      Alert.alert("오류", "비밀번호 조건을 확인해주세요.");
    }
  };

  return (
    <View style={edm.container}>
      <View style={edm.contentContainer}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="이메일"
            value={email}
            onChangeText={(value) => setEmail(value)}
            variant="outline"
            w="100%"
            borderWidth={2}
            borderColor={emailCheck(email) || email.length === 0 ? "gray.300" : "red.600"}
            _focus={{
              backgroundColor: "none",
              borderColor: emailCheck(email) ? "transparent" : "red.600"
            }}
          />
        </View>

        {renderEmailError()}
        <View style={{ height: 2 }} />
        <View style={styles.inputContainer}>
          <Input
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            borderWidth={2}
            _focus={{
              backgroundColor: "none",
              borderColor: passwordCheck(password) ? "transparent" : "red.600"
            }}
          />
        </View>

        {renderPasswordError()}
        <View style={styles.inputContainer}>
          <Input
            placeholder="비밀번호 확인"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <View style={{ height: 10 }} />
        <View style={styles.buttonContainer}>
          <Button style={styles.MovingButton}
            onPress={() => navigation.navigate("Login")}>
            이전
          </Button>

          <Button style={styles.MovingButton}
            onPress={handleNextPage}>
            다음
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  MovingButton: {
    borderRadius: 50,
    backgroundColor: '#8E86FA',
    width: '25%',
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
    padding: 40,
    height: '70%',
  },
});

export default RegisterScreen;
