/**
 * AuthContext — manages the Firebase Auth session state globally.
 *
 * Uses Firebase's onAuthStateChanged observer instead of reading a JWT from
 * AsyncStorage on startup. This means the session is always in sync with
 * Firebase, automatically handling token refresh and persistence.
 */
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { AuthRepository } from "../repositories/AuthRepository";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Subscribe to Firebase Auth state changes.
   * This fires immediately on mount with the persisted session (if any),
   * replacing the old AsyncStorage read pattern.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in — fetch their Firestore profile
          const profile = await AuthRepository.getUserProfile(firebaseUser.uid);
          setUserToken(firebaseUser.uid); // Use Firebase UID as the token
          setUserInfo(profile || { uid: firebaseUser.uid, email: firebaseUser.email });
        } else {
          // User is signed out
          setUserToken(null);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("AuthContext: Failed to load user profile", error);
        setUserToken(null);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * login — called after a successful AuthRepository.login() call.
   * Updates the context with the returned user profile.
   * Firebase Auth state observer will also fire, but this provides immediate UI feedback.
   */
  const login = async (_token, userData) => {
    setUserToken(userData?.uid || _token);
    setUserInfo(userData);
  };

  /**
   * logout — signs the user out of Firebase Auth.
   * The onAuthStateChanged observer will automatically clear state.
   */
  const logout = async () => {
    try {
      await AuthRepository.logout();
    } catch (error) {
      console.error("AuthContext: Logout failed", error);
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
