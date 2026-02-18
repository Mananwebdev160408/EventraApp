import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MapPin, Ambulance, Shield, TriangleAlert, ChevronRight } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const EmergencyScreen = ({ navigation }) => {
  const [isSosActive, setIsSosActive] = useState(false);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple effect animation
    const createRipple = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createRipple(ripple1, 0);
    createRipple(ripple2, 600);
    createRipple(ripple3, 1200);
  }, []);

  const handleSosPress = () => {
    setIsSosActive(true);
    // Simulate API call
    setTimeout(() => {
      // Alert logic here
    }, 1000);
  };

  const QuickContact = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.contactCard} onPress={onPress}>
      <View style={styles.contactIconContainer}>
        {icon}
      </View>
      <Text style={styles.contactLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#1d3557', '#B91C1C', '#457b9d']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE LOCATION ACTIVE</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => navigation.goBack()}
          >
            <X size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Central SOS Area */}
          <View style={styles.sosContainer}>
             {/* Ripples */}
             {[ripple1, ripple2, ripple3].map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.ripple,
                  {
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0],
                    }),
                  },
                ]}
              />
            ))}

            {/* Main Button */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSosPress}
            >
              <Animated.View style={[
                styles.sosButton,
                { transform: [{ scale: pulseAnim }] }
              ]}>
                <Text style={styles.sosText}>SOS</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Status & Location */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>
              {isSosActive ? "Help is on the way" : "Emergency Assistance"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isSosActive ? "Emergency Services Notified" : "Press for immediate help"}
            </Text>

            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <MapPin size={16} color={COLORS.brandPurple} />
                <Text style={styles.locationLabel}>YOUR CURRENT SEAT</Text>
              </View>
              <Text style={styles.locationValue}>Section 104, Row G, Seat 12</Text>
            </View>

            <Text style={styles.disclaimer}>
              A security team member and onsite medic are being dispatched to your exact location. Please stay where you are.
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <View style={styles.quickContactsHeader}>
            <Text style={styles.sectionHeader}>QUICK CONTACTS</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.contactsGrid}>
            <QuickContact 
              icon={<Ambulance size={24} color={COLORS.white} />}
              label="MEDICAL"
              onPress={() => console.log('Medical')}
            />
            <QuickContact 
              icon={<Shield size={24} color={COLORS.white} />}
              label="SECURITY"
              onPress={() => console.log('Security')}
            />
            <QuickContact 
              icon={<TriangleAlert size={24} color={COLORS.white} />}
              label="POLICE"
              onPress={() => console.log('Police')}
            />
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel Emergency Alert</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3557',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  liveText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  sosButton: {
    width: 176, // ~44 * 4
    height: 176,
    borderRadius: 88,
    backgroundColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 20,
    zIndex: 10,
  },
  sosText: {
    color: COLORS.white,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
  },
  ripple: {
    position: 'absolute',
    width: 176,
    height: 176,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 1,
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  locationCard: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 6,
  },
  locationLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  locationValue: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  disclaimer: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  bottomSection: {
    width: '100%',
    padding: 24,
    paddingBottom: 40,
  },
  quickContactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  contactsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmergencyScreen;
