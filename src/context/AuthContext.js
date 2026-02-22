import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const info = await AsyncStorage.getItem("userInfo");

        if (token) {
          setUserToken(token);
        }
        if (info) {
          setUserInfo(JSON.parse(info));
        }
      } catch (e) {
        console.error("Failed to load auth data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (token, userData) => {
    try {
      setUserToken(token);
      setUserInfo(userData);
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save login data", e);
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
    } catch (e) {
      console.error("Failed to clear auth data", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        isLoading,
        login,
        logout,
        setUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
