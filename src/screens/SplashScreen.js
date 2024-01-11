import React from 'react'
import { Center, Image, View } from 'native-base';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

function SplashScreen() {
   // 화면의 너비와 높이를 가져옵니다.
   const screenWidth = Dimensions.get('window').width;
   const screenHeight = Dimensions.get('window').height;
   return (
      <>
         <SafeAreaProvider>
            <SafeAreaView flex={1} >
               <View flex={1} justifyContent="center" alignItems="center">
                  <Center>
                     <Image
                        source={require("../animation/splash.png")}
                        alt="splash"
                        width={screenWidth} // 화면 너비로 설정
                        height={screenHeight} // 화면 높이로 설정                      
                     />
                  </Center>
               </View>
            </SafeAreaView>
         </SafeAreaProvider>
      </>
   )
}

export default SplashScreen