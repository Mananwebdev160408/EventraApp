import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/onboarding/SplashScreen';

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  return <AppNavigator />;
}
