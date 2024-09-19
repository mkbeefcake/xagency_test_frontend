import { createContext, useContext, useState } from 'react';

export const TracingContext = createContext();
export const TracingProvider = ({ children }) => {
  const [sharePath, setSharePath] = useState("");

  return (
    <TracingContext.Provider value={{ sharePath, setSharePath }}>
      {children}
    </TracingContext.Provider>
  );
};
