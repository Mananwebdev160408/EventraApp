import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, CreditCard, Bell, LogOut, ChevronRight, User, Shield, TriangleAlert } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { USERS } from '../../constants/mocks';

const ProfileScreen = ({ navigation }) => {
  const user = USERS.currentUser;

  const MenuItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconBox}>
          {icon}
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.gray500} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Settings size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>alex.johnson@example.com</Text>
              <View style={styles.roleBadge}>
                <Shield size={12} color={COLORS.brandPurple} />
                <Text style={styles.roleText}>Fan Member</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuGroup}>
              <MenuItem 
                icon={<User size={20} color={COLORS.white} />} 
                label="Personal Information" 
              />
              <MenuItem 
                icon={<CreditCard size={20} color={COLORS.white} />} 
                label="Payment Methods" 
              />
              <MenuItem 
                icon={<Bell size={20} color={COLORS.white} />} 
                label="Notifications" 
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.menuGroup}>
              <MenuItem 
                icon={<Shield size={20} color={COLORS.white} />} 
                label="Privacy & Security"
                onPress={() => console.log('Privacy')} 
              />
              <MenuItem 
                icon={<TriangleAlert size={20} color="#ef4444" />} 
                label="Emergency Assistance" 
                onPress={() => navigation.navigate('Emergency')}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandDark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.white10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray400,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(123, 44, 191, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 6,
  },
  roleText: {
    color: COLORS.brandPurple,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray400,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white05,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
