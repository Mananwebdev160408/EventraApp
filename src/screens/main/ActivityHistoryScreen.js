import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Ticket, ShoppingBag, Utensils } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { ACTIVITY_HISTORY } from '../../constants/mocks';

const ActivityHistoryScreen = ({ navigation }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'ticket': return <Ticket size={24} color={COLORS.brandPurple} />;
      case 'store': return <ShoppingBag size={24} color={COLORS.secondary} />; // secondary is teal-ish
      case 'food': return <Utensils size={24} color="#fbbf24" />; // amber for food
      default: return <Ticket size={24} color={COLORS.gray600} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity History</Text>
          <View style={{width: 40}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {ACTIVITY_HISTORY.map((item) => (
             <TouchableOpacity key={item.id} style={styles.card}>
                <View style={styles.iconBox}>
                   {getIcon(item.type)}
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
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
     color: COLORS.text,
     fontWeight: '600',
     marginBottom: 4,
     fontSize: 14,
  },
  cardDate: {
     color: COLORS.gray600,
     fontSize: 12,
  },
  cardAmount: {
     color: COLORS.text,
     fontWeight: '700',
     fontSize: 16,
  },
});

export default ActivityHistoryScreen;
