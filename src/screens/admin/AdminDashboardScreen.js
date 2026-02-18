import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants/theme';

const AdminDashboardScreen = ({ navigation }) => {
  const StatCard = ({ label, value, color }) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: color || COLORS.white }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
             <LogOut size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsGrid}>
            <StatCard label="Active Users" value="12.5k" color="#10b981" />
            <StatCard label="Tickets Sold" value="85%" color={COLORS.brandPurple} />
            <StatCard label="Revenue" value="$1.2M" />
            <StatCard label="Next Event" value="2d" />
          </View>

          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AdminEventSchedule')}>
              <View style={styles.actionIcon}>
                <Calendar size={24} color={COLORS.brandPurple} />
              </View>
              <Text style={styles.actionTitle}>Manage Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AdminAnalytics')}>
              <View style={styles.actionIcon}>
                <Users size={24} color={COLORS.brandPurple} />
              </View>
              <Text style={styles.actionTitle}>User Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <LayoutDashboard size={24} color={COLORS.brandPurple} />
              </View>
              <Text style={styles.actionTitle}>Stadium Layout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Settings size={24} color={COLORS.brandPurple} />
              </View>
              <Text style={styles.actionTitle}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>System Maintenance</Text>
            <Text style={styles.alertText}>Scheduled for Oct 25, 02:00 AM</Text>
          </View>
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
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white10,
  },
  statLabel: {
    color: COLORS.gray400,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#1a1121',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white10,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(123, 44, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  alertCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },
  alertTitle: {
    color: '#fbbf24',
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    color: COLORS.gray300,
    fontSize: 12,
  },
});

export default AdminDashboardScreen;
