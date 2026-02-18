import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, CreditCard, Bell, LogOut, ChevronRight, User, Shield, TriangleAlert, Star } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { USERS } from '../../constants/mocks';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const user = USERS.currentUser;

  const MenuItem = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, { backgroundColor: color || 'rgba(29, 53, 87, 0.05)' }]}>
          {React.cloneElement(icon, { size: 20, color: color ? '#ffffff' : '#1d3557' })}
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={18} color="rgba(29, 53, 87, 0.3)" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerSubtitle}>MEMBER PROFILE</Text>
                <Text style={styles.headerTitle}>Account</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn}>
                <Settings size={22} color="#1d3557" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.editBadge}>
                    <Star size={10} color="#ffffff" fill="#ffffff" />
                </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>alex.johnson@eventra.io</Text>
              <View style={styles.roleBadge}>
                <Shield size={12} color="#ffffff" fill="#ffffff" />
                <Text style={styles.roleText}>Elite Fan Member</Text>
              </View>
            </View>
          </View>

          {/* Stats Summary */}
          <View style={styles.statsRow}>
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>4</Text>
                  <Text style={styles.statLabel}>Badges</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>2.4k</Text>
                  <Text style={styles.statLabel}>Points</Text>
              </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>
            <View style={styles.menuGroup}>
              <MenuItem 
                icon={<User />} 
                label="Personal Information" 
              />
              <MenuItem 
                icon={<CreditCard />} 
                label="Payment Methods" 
              />
              <MenuItem 
                icon={<Bell />} 
                label="Notifications" 
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SAFETY & PRIVACY</Text>
            <View style={styles.menuGroup}>
              <MenuItem 
                icon={<Shield />} 
                label="Security & Privacy"
                onPress={() => console.log('Privacy')} 
              />
              <MenuItem 
                icon={<TriangleAlert />} 
                label="Emergency Assistance" 
                color={COLORS.error}
                onPress={() => navigation.navigate('Emergency')}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>SIGN OUT</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Eventra v1.0.0 (Production)</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerSubtitle: {
      fontSize: 10,
      fontWeight: '800',
      color: '#457b9d',
      letterSpacing: 2,
      marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1d3557',
  },
  settingsBtn: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(29, 53, 87, 0.05)',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1d3557',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarWrapper: {
      position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    marginRight: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editBadge: {
      position: 'absolute',
      bottom: -4,
      right: 12,
      backgroundColor: COLORS.error,
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#1d3557',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    fontWeight: '500',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  roleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statsRow: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderRadius: 20,
      paddingVertical: 20,
      marginBottom: 32,
      shadowColor: '#1d3557',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 4,
  },
  statItem: {
      flex: 1,
      alignItems: 'center',
  },
  statDivider: {
      width: 1,
      height: '60%',
      backgroundColor: 'rgba(29, 53, 157, 0.05)',
      alignSelf: 'center',
  },
  statValue: {
      fontSize: 20,
      fontWeight: '800',
      color: '#1d3557',
      marginBottom: 2,
  },
  statLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(29, 53, 87, 0.5)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#457b9d',
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 1.5,
  },
  menuGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: 'rgba(29, 53, 87, 0.03)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 15,
    color: '#1d3557',
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(230, 57, 70, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.1)',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  versionText: {
      textAlign: 'center',
      marginTop: 32,
      fontSize: 12,
      color: 'rgba(29, 53, 87, 0.3)',
      fontWeight: '600',
  }
});

export default ProfileScreen;
