import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/theme';
import * as SplashScreen from 'expo-splash-screen'; // we don't need this imported here if we pass from parent

const { width, height } = Dimensions.get('window');

const CustomSplashScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // After animations are done, wait a bit then finish
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Elements */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/icon.png')} 
              style={styles.logoImage}
            />
        </View>
        <Text style={styles.title}>EVENTRA</Text>
        <Text style={styles.subtitle}>Premium Event Management</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1d3557', // navy-custom
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray600,
    marginTop: 8,
    fontWeight: '500',
  },
  circle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(230, 57, 70, 0.08)', // primary red with low opacity
  },
  circle2: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(29, 53, 87, 0.05)', // navy with low opacity
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  version: {
    color: COLORS.gray400,
    fontSize: 12,
  },
});

export default CustomSplashScreen;
