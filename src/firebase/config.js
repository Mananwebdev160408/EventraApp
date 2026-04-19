/**
 * Firebase configuration and initialization.
 * Single source of truth for all Firebase services used in the app.
 *
 * Platform-aware auth initialization:
 *  - Web   → getAuth()  (uses browser IndexedDB persistence automatically)
 *  - Native → initializeAuth() with AsyncStorage persistence
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { Platform } from "react-native";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCplYt7wlhNlCh-fiH6nmCynszl06GZNS0",
  authDomain: "eventra-3d1ff.firebaseapp.com",
  projectId: "eventra-3d1ff",
  storageBucket: "eventra-3d1ff.firebasestorage.app",
  messagingSenderId: "873161731526",
  appId: "1:873161731526:web:0817942e69fae3de83d6c7",
};

// Prevent re-initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Auth instance — initialized differently per platform to avoid the
 * "getReactNativePersistence is not a function" error on web.
 */
let auth;
if (Platform.OS === "web") {
  // Web: getAuth uses browser IndexedDB persistence by default
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
} else {
  // Native: persist sessions in AsyncStorage so users stay logged in
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

/** Firestore database instance */
const db = getFirestore(app);

export { auth, db };
export default app;
