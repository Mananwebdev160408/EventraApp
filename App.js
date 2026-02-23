import React, { useState, useEffect } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import CustomSplashScreen from "./src/screens/onboarding/SplashScreen";
import { UserProvider } from "./src/context/UserContext";
import { AuthProvider } from "./src/context/AuthContext";

// Keep the native splash screen visible while we fetch resources or do setup
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after `setAppIsReady`, then we may see a blank screen while the app is rendering its initial state and rendering its first view. From this moment onwards, the native splash screen is gone.
      // But we still want to show OUR custom splash screen.
      // So we hidenative splash here.
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady) {
    return null;
  }

  if (showCustomSplash) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </AuthProvider>
  );
}
