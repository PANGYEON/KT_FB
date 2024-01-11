import axios from 'axios'; // api 통신 관련

const odApi = async (imagePath, imgName) => {
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
       console.log(responseText)
      return responseText;
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
};


const sendFoodData = async (foodData) => {
  try {
      const config = {
          method: 'post',
          url: 'http://edm-diet.japaneast.cloudapp.azure.com/save_food/api/save_new_food/',
          headers: { 
              'Content-Type': 'application/json'
          },
          data: JSON.stringify(foodData)
      };
      await axios(config);
      // const response = await axios(config);
      // console.log(response.data); // 응답 데이터 로깅
  } catch (error) {
      console.error("Error in sending food data: ", error);
  }
};

const processAndSendData = async (imagePath, imgName) => {
  try {
      const responseText = await odApi(imagePath, imgName);
      // console.log(responseText)
      const parsedData = JSON.parse(responseText);
      console.log(JSON.stringify(parsedData, null, 2))      // 필요한 경우 데이터를 추가 가공합니다.

      // 변환된 데이터를 sendFoodData 함수에 전달합니다.
      await sendFoodData(parsedData);
  } catch (error) {
      console.error("Error in processing and sending data: ", error);
  }
};

export { odApi, sendFoodData, processAndSendData };