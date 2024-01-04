import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionList, setSubscriptionList] = useState([]);

  const updateSubscriptionList = async () => {
    // 서버에서 최신 구독 목록을 가져오는 로직
    const token = await AsyncStorage.getItem('@user_token');
    let config = {
      method: 'get',
      url:  'http://edm.japaneast.cloudapp.azure.com/api/subscribe/',
      headers: { 'Authorization': `Bearer ${token}` }
    };
    try {
      const response = await axios(config);
      // 서버로부터 받은 데이터를 subscriptionList 상태에 저장
      setSubscriptionList(response.data.map(item => item.uuid));
    } catch (error) {
      console.error('구독 목록 업데이트 실패:', error);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptionList, updateSubscriptionList }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
