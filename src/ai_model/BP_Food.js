import axios from 'axios';

import RNFS from 'react-native-fs'; // React Native File System

async function getSecret(setting) {
    try {
        // Corrected the path to './secrets.json'
        const secretsFile = await RNFS.readFile('./secrets.json', 'utf8');
        const secrets = JSON.parse(secretsFile);
        return secrets[setting];
    } catch (error) {
        console.error(`Error getting the secret ${setting}:`, error);
    }
}

async function odApi(imagePath,imgName) {
    try {
      const formData = new FormData();
      formData.append('food_image', {
        uri: imagePath,
        type: 'image/jpeg', // 또는 해당되는 이미지의 MIME 타입
        name: imgName, // 서버에서 인식할 파일명
      });
   
      const response = await fetch('http://203.241.246.109:10003/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
   
      const responseText = await response.text();
      
      return responseText;
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  }


export { odApi };
