import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Calendar, Ticket, CreditCard } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const ActivityHistoryScreen = ({ navigation }) => {
  const activities = [
    { type: 'ticket', title: 'Champions Cup 2024', date: 'Oct 24, 2024', amount: '$85.00' },
    { type: 'purchase', title: 'Stadium Store Order', date: 'Oct 24, 2024', amount: '$45.50' },
    { type: 'ticket', title: 'Neon Pulse Festival', date: 'Sep 15, 2024', amount: '$120.00' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity History</Text>
          <View style={{width: 40}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {activities.map((item, index) => (
             <TouchableOpacity key={index} style={styles.card}>
                <View style={styles.iconBox}>
                   {item.type === 'ticket' ? (
                      <Ticket size={24} color={COLORS.brandPurple} />
                   ) : (
                      <CreditCard size={24} color="#10b981" />
                   )}
                </View>
                <View style={styles.cardInfo}>
                   <Text style={styles.cardTitle}>{item.title}</Text>
                   <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                <Text style={styles.cardAmount}>{item.amount}</Text>
             </TouchableOpacity>
          ))}
        </ScrollView>
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
    padding: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
     color: COLORS.white,
     fontWeight: '600',
     marginBottom: 4,
  },
  cardDate: {
     color: COLORS.gray500,
     fontSize: 12,
  },
  cardAmount: {
     color: COLORS.white,
     fontWeight: '700',
     fontSize: 16,
  },
});

export default ActivityHistoryScreen;
