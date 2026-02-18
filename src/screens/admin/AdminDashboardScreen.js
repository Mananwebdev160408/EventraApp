import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MoreHorizontal, TrendingUp, Users, Calendar, AlertCircle, ShoppingBag, LayoutDashboard, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { USERS } from '../../constants/mocks';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const StatCard = ({ label, value, subvalue, icon, color, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
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
            <Text style={styles.greeting}>Operational Control</Text>
            <Text style={styles.userName}>{USERS.currentUser.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('AdminSettings')}>
            <Image source={{ uri: USERS.currentUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Section - Live Event Status */}
          <LinearGradient
            colors={['#1d3557', '#0f172a']}
            style={styles.heroCard}
          >
            <View style={styles.heroHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE MONITORING</Text>
              </View>
              <TouchableOpacity>
                <MoreHorizontal size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.heroTitle}>Champions League Final</Text>
            <Text style={styles.heroSubtitle}>Wembley Stadium • Final Match Day</Text>
            
            <View style={styles.attendanceContainer}>
                <View style={styles.attendanceInfo}>
                    <Text style={styles.attendanceLabel}>Attendance</Text>
                    <Text style={styles.attendanceValue}>45,000 / 50,000</Text>
                </View>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: '90%', backgroundColor: COLORS.error }]} />
                </View>
                <View style={styles.attendanceFooter}>
                    <Text style={styles.progressText}>90% Capacity</Text>
                    <Text style={[styles.progressText, { color: COLORS.error }]}>High Traffic</Text>
                </View>
            </View>
          </LinearGradient>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard 
              label="Store Revenue" 
              value="$1.2M" 
              subvalue="+12.5%" 
              color="#059669" // Emerald 600
              icon={<ShoppingBag size={20} color="#059669" />}
              onPress={() => navigation.navigate('Store')}
            />
            <StatCard 
              label="Active Audience" 
              value="12.4k" 
              subvalue="+5.2%" 
              color="#457b9d" // Link Blue
              icon={<Users size={20} color="#457b9d" />}
            />
            <StatCard 
              label="Events Slated" 
              value="8" 
              subvalue="This Month" 
              color="#1d3557" // Navy
              icon={<Calendar size={20} color="#1d3557" />}
              onPress={() => navigation.navigate('Events')}
            />
            <StatCard 
              label="System Alerts" 
              value="3" 
              subvalue="Critical" 
              color={COLORS.error}
              icon={<AlertCircle size={20} color={COLORS.error} />}
            />
          </View>

          {/* Recent Activity / Notifications */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Operational Log</Text>
            <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(69, 123, 157, 0.1)' }]}>
                <Users size={16} color="#457b9d" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New VIP booking for <Text style={{fontWeight: '700'}}>Summer Concert</Text></Text>
                <Text style={styles.activityTime}>2 mins ago</Text>
              </View>
              <ChevronRight size={16} color={COLORS.gray300} />
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(230, 57, 70, 0.1)' }]}>
                <AlertCircle size={16} color={COLORS.error} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Maintenance alert: <Text style={{fontWeight: '700'}}>South Gate Turnstile</Text></Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
              <ChevronRight size={16} color={COLORS.gray300} />
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: 'rgba(5, 150, 105, 0.1)' }]}>
                <TrendingUp size={16} color="#059669" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Revenue milestone reached: <Text style={{fontWeight: '700'}}>$1M</Text></Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
              <ChevronRight size={16} color={COLORS.gray300} />
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
    backgroundColor: '#f1faee',
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
    fontSize: 12,
    color: '#457b9d',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1d3557',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 57, 70, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  liveText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 32,
  },
  attendanceContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  attendanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  attendanceLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  attendanceValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  attendanceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  progressText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 48 - 16) / 2, // 2 columns with gap
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1d3557',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(29, 53, 87, 0.6)',
    fontWeight: '600',
  },
  statSub: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 6,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1d3557',
  },
  viewAllText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#457b9d',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 16,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1d3557',
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(29, 53, 87, 0.4)',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;
