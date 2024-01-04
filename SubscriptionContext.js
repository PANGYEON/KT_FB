import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  return (
    <SubscriptionContext.Provider value={{ needsRefresh, setNeedsRefresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
