import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, Users, Ticket, Activity } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { ADMIN_ANALYTICS_DATA } from '../../constants/mocks';

const { width } = Dimensions.get('window');

const AdminAnalyticsScreen = ({ navigation }) => {
  const { overview, revenueByMonth, ticketSales } = ADMIN_ANALYTICS_DATA;
  const maxRevenue = Math.max(...revenueByMonth.map(d => d.value));

  const StatCard = ({ label, value, change, type, icon }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: type === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
           {icon}
        </View>
        <View style={[styles.changeBadge, { backgroundColor: type === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
          {type === 'up' ? <TrendingUp size={12} color={COLORS.success} /> : <TrendingDown size={12} color={COLORS.error} />}
          <Text style={[styles.changeText, { color: type === 'up' ? COLORS.success : COLORS.error }]}>{change}</Text>
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stadium Analytics</Text>
          <View style={{width: 40}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Overview Grid */}
          <View style={styles.grid}>
            <StatCard 
              label={overview[0].label} 
              value={overview[0].value} 
              change={overview[0].change} 
              type={overview[0].type} 
              icon={<DollarSign size={20} color={COLORS.success} />}
            />
            <StatCard 
              label={overview[1].label} 
              value={overview[1].value} 
              change={overview[1].change} 
              type={overview[1].type} 
              icon={<Ticket size={20} color={COLORS.brandPurple} />}
            />
            <StatCard 
              label={overview[2].label} 
              value={overview[2].value} 
              change={overview[2].change} 
              type={overview[2].type} 
              icon={<Activity size={20} color={COLORS.brandPurple} />}
            />
            <StatCard 
              label={overview[3].label} 
              value={overview[3].value} 
              change={overview[3].change} 
              type={overview[3].type} 
              icon={<Users size={20} color={COLORS.secondary} />}
            />
          </View>

          {/* Revenue Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Revenue Trend</Text>
            <View style={styles.chartContainer}>
              {revenueByMonth.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={[styles.bar, { height: (item.value / maxRevenue) * 150 }]} />
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ticket Breakdown */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Ticket Sales by Category</Text>
            {ticketSales.map((item, index) => (
              <View key={index} style={styles.progressRow}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>{item.category}</Text>
                  <Text style={styles.progressValue}>{item.count}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${(item.count / 5000) * 100}%` }]} />
                </View>
              </View>
            ))}
          </View>
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
    paddingTop: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2, // 48 margins + 12 gap
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
    gap: 4,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: 30,
    backgroundColor: COLORS.brandPurple,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brandPurple,
    borderRadius: 4,
  },
});

export default AdminAnalyticsScreen;
