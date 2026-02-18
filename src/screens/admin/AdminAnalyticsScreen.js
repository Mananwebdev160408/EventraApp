import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const AdminAnalyticsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stadium Analytics</Text>
          <View style={{width: 40}} /> 
        </View>

        <View style={styles.content}>
           <Text style={styles.placeholderText}>Analytics Dashboard Placeholder</Text>
           <Text style={styles.subText}>Charts and graphs go here.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1121',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  subText: {
    color: COLORS.gray500,
    marginTop: 8,
  },
});

export default AdminAnalyticsScreen;
