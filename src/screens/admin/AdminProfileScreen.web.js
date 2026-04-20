import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  LogOut,
  User,
  Mail,
  Phone,
  Edit3,
  AtSign,
  UserCircle,
  TriangleAlert,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  BarChart3,
  Flame,
  Plus,
  MapPin,
  Calendar,
  Zap,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { authService } from "../../api/services";

const AdminProfileScreen = ({ navigation }) => {
  const { userInfo, logout } = useAuth();
  const { stadiumLocation } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <View style={styles.desktopWrapper}>
      <StatusBar style="light" />
      
      {/* Sidebar - Consistent with Admin */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <ShieldCheck size={28} color={COLORS.error} />
          </View>
          <View>
            <Text style={styles.logoText}>EVENTRA</Text>
            <Text style={styles.logoSub}>SHIELD ADMIN</Text>
          </View>
        </View>

        <View style={styles.navGroup}>
          <Text style={styles.navSectionLabel}>CORE CONTROL</Text>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminDashboard")}>
            <LayoutDashboard size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Command Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminAnalytics")}>
            <BarChart3 size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Deep Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={[styles.userProfile, styles.navItemActive]}>
            <Image source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} style={styles.avatar} />
            <View>
              <Text style={[styles.userName, { color: '#fff' }]}>{userInfo?.name || "System Admin"}</Text>
              <Text style={styles.userRole}>Super Admin</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
          <Text style={styles.pageTitle}>Admin Settings</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("EditProfile")}>
              <Edit3 size={18} color="#fff" />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color="#ef4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHero}>
            <Image source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} style={styles.heroAvatar} />
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>{userInfo?.name || "Stadium Administrator"}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>SUPER ADMIN</Text></View>
                <View style={styles.locationBadge}>
                  <MapPin size={12} color="#457b9d" />
                  <Text style={styles.locationText}>{stadiumLocation}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.grid}>
            {/* Account Details */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Details</Text>
              <View style={styles.detailList}>
                <View style={styles.detailItem}>
                  <AtSign size={18} color="#94a3b8" />
                  <View>
                    <Text style={styles.detailLabel}>USERNAME</Text>
                    <Text style={styles.detailValue}>@{userInfo?.username || "admin_eventra"}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Mail size={18} color="#94a3b8" />
                  <View>
                    <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
                    <Text style={styles.detailValue}>{userInfo?.email || "admin@eventra.app"}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Phone size={18} color="#94a3b8" />
                  <View>
                    <Text style={styles.detailLabel}>PHONE NUMBER</Text>
                    <Text style={styles.detailValue}>+91 98765 43210</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Stadium Performance */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Stadium Authority</Text>
              <View style={styles.statsGrid}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>Managed Events</Text>
                  <Text style={styles.miniStatValue}>24</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>Security Score</Text>
                  <Text style={[styles.miniStatValue, { color: '#10b981' }]}>98%</Text>
                </View>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatLabel}>Total Revenue</Text>
                  <Text style={styles.miniStatValue}>₹12.4L</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.sosAction} onPress={() => navigation.navigate("Emergency")}>
                <TriangleAlert size={20} color="#fff" />
                <Text style={styles.sosActionText}>Activate Emergency Protocol</Text>
              </TouchableOpacity>
            </View>

            {/* System Config */}
            <View style={[styles.card, { flex: 2 }]}>
              <Text style={styles.cardTitle}>Platform Preferences</Text>
              <View style={styles.prefList}>
                {[
                  { title: 'Push Notifications', sub: 'Receive alerts for SOS and critical density', icon: <Bell size={20} color="#3b82f6" /> },
                  { title: 'Automated Reports', sub: 'Daily revenue and attendance emails', icon: <Calendar size={20} color="#8b5cf6" /> },
                  { title: 'Security Auth', sub: 'Two-factor authentication is active', icon: <ShieldCheck size={20} color="#10b981" /> },
                ].map((pref, i) => (
                  <View key={i} style={styles.prefItem}>
                    <View style={styles.prefIcon}>{pref.icon}</View>
                    <View style={styles.prefContent}>
                      <Text style={styles.prefTitle}>{pref.title}</Text>
                      <Text style={styles.prefSub}>{pref.sub}</Text>
                    </View>
                    <View style={styles.toggle}><View style={styles.toggleCircle} /></View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: 280,
    backgroundColor: "#0f172a",
    padding: 32,
    justifyContent: "space-between",
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 60,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  logoSub: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  navGroup: {
    marginBottom: 40,
    gap: 8,
  },
  navSectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navItemText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },
  sidebarFooter: {
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
  },
  userRole: {
    color: "#64748b",
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
    padding: 60,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1d3557",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 16,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "800",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "800",
  },
  scrollArea: {
    gap: 40,
  },
  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  heroAvatar: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
  },
  heroInfo: {
    gap: 12,
  },
  heroName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1d3557",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 16,
  },
  adminBadge: {
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    color: "#1d3557",
    fontWeight: "900",
    letterSpacing: 1,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  card: {
    flex: 1,
    minWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1e293b",
  },
  detailList: {
    gap: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    padding: 24,
    borderRadius: 20,
  },
  miniStat: {
    gap: 6,
    alignItems: 'center',
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
  },
  sosAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    borderRadius: 16,
  },
  sosActionText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  prefList: {
    gap: 20,
  },
  prefItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  prefIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  prefContent: {
    flex: 1,
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  prefSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10b981",
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: 'flex-end',
  },
});

export default AdminProfileScreen;
