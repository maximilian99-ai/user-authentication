import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
} 

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  authenticate: (token: string) => {},
  logout: () => {}
});

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);

  function authenticate(token: string) {
    setAuthToken(token);
    AsyncStorage.setItem('token', token); // AsyncStorage 에 토큰을 저장
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem('token'); // AsyncStorage 에서 토큰을 제거
  }

  const value: AuthContextType = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
