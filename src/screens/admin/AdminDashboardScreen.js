import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MoreHorizontal, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { USERS } from '../../constants/mocks';

const AdminDashboardScreen = ({ navigation }) => {
  const StatCard = ({ label, value, subvalue, icon, color, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconBox, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subvalue && <Text style={[styles.statSub, { color }]}>{subvalue}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{USERS.currentUser.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('AdminSettings')}>
            <Image source={{ uri: USERS.currentUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section - Live Event Status */}
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
              <TouchableOpacity>
                <MoreHorizontal size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroTitle}>Champions League Final</Text>
            <Text style={styles.heroSubtitle}>Wembley Stadium • 45,000 / 50,000 Attending</Text>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: '90%' }]} />
            </View>
            <Text style={styles.progressText}>90% Capacity Reached</Text>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard 
              label="Store Revenue" 
              value="$1.2M" 
              subvalue="+12.5%" 
              color={COLORS.success}
              icon={<TrendingUp size={20} color={COLORS.success} />}
              onPress={() => navigation.navigate('Store')}
            />
            <StatCard 
              label="Active Users" 
              value="12.4k" 
              subvalue="+5.2%" 
              color={COLORS.brandPurple}
              icon={<Users size={20} color={COLORS.brandPurple} />}
            />
            <StatCard 
              label="Events" 
              value="8" 
              subvalue="This Month" 
              color={COLORS.secondary} // Use secondary color/teal
              icon={<Calendar size={20} color={COLORS.secondary} />}
            />
            <StatCard 
              label="Issues" 
              value="3" 
              subvalue="Requires Attention" 
              color={COLORS.error}
              icon={<AlertCircle size={20} color={COLORS.error} />}
            />
          </View>

          {/* Recent Activity / Notifications */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#e0f2fe' }]}>
                <Users size={16} color="#0284c7" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New VIP booking for <Text style={{fontWeight: '700'}}>Summer Concert</Text></Text>
                <Text style={styles.activityTime}>2 mins ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#fef3c7' }]}>
                <AlertCircle size={16} color="#d97706" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Maintenance alert: <Text style={{fontWeight: '700'}}>South Gate Turnstile</Text></Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: '#dcfce7' }]}>
                <TrendingUp size={16} color={COLORS.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Revenue milestone reached: <Text style={{fontWeight: '700'}}>$1M</Text></Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
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
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: COLORS.brandPurple,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  liveText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 24,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },
  progressText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  statSub: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.gray400,
  },
});

export default AdminDashboardScreen;
