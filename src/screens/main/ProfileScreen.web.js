import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  LogOut,
  User,
  Mail,
  Phone,
  Edit3,
  AtSign,
  UserCircle,
  ShieldCheck,
  Settings,
  Bell,
  CreditCard,
  ChevronRight,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { userInfo, setUserInfo, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getCurrentUser();
      if (data && userInfo) {
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to sign out?")) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const SidebarItem = ({ icon: Icon, label, active }) => (
    <TouchableOpacity style={[styles.sidebarItem, active && styles.sidebarItemActive]}>
      <Icon size={20} color={active ? COLORS.brandPurple : "#64748b"} />
      <Text style={[styles.sidebarItemText, active && styles.sidebarItemTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const InfoCard = ({ label, value, icon: Icon }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconBox}>
        <Icon size={20} color={COLORS.brandPurple} />
      </View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "Not set"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      
      {/* Profile Sidebar */}
      <View style={styles.profileSidebar}>
        <View style={styles.sidebarTop}>
          <View style={styles.avatarContainer}>
            <UserCircle size={100} color="#1d3557" strokeWidth={1} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Edit3 size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userInfo?.firstname || "User"} {userInfo?.lastname || ""}</Text>
          <Text style={styles.profileEmail}>{userInfo?.email}</Text>
        </View>

        <View style={styles.sidebarNav}>
          <SidebarItem icon={User} label="Personal Information" active />
          <SidebarItem icon={Bell} label="Notifications" />
          <SidebarItem icon={CreditCard} label="Payment Methods" />
          <SidebarItem icon={Settings} label="Account Settings" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.profileMain} contentContainerStyle={styles.profileMainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
           <Text style={styles.contentTitle}>Personal Information</Text>
           <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate("EditProfile")}>
              <Edit3 size={18} color="#fff" />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <InfoCard label="First Name" value={userInfo?.firstname || userInfo?.firstName} icon={User} />
          <InfoCard label="Last Name" value={userInfo?.lastname || userInfo?.lastName} icon={User} />
          <InfoCard label="Email Address" value={userInfo?.email} icon={Mail} />
          <InfoCard label="Phone Number" value={userInfo?.phoneNumber} icon={Phone} />
          <InfoCard label="Username" value={userInfo?.username} icon={AtSign} />
          <InfoCard label="Account Status" value="Verified Member" icon={ShieldCheck} />
        </View>

        <View style={styles.settingsSection}>
           <Text style={styles.sectionTitle}>Preferences</Text>
           <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingRow}>
                 <View style={styles.settingLabelGroup}>
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Text style={styles.settingSub}>Receive updates about upcoming events</Text>
                 </View>
                 <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
              <View style={styles.settingDivider} />
              <TouchableOpacity style={styles.settingRow}>
                 <View style={styles.settingLabelGroup}>
                    <Text style={styles.settingLabel}>Language</Text>
                    <Text style={styles.settingSub}>English (United States)</Text>
                 </View>
                 <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.dangerZone}>
           <Text style={styles.dangerTitle}>Security</Text>
           <TouchableOpacity style={styles.changePasswordBtn}>
              <Text style={styles.changePasswordText}>Change Password</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  profileSidebar: {
    width: 360,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    padding: 48,
    justifyContent: "space-between",
  },
  sidebarTop: {
    alignItems: "center",
    marginBottom: 60,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 24,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.brandPurple,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  sidebarNav: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  sidebarItemActive: {
    backgroundColor: "rgba(230, 57, 70, 0.05)",
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  sidebarItemTextActive: {
    color: COLORS.brandPurple,
    fontWeight: "700",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef4444",
  },
  profileMain: {
    flex: 1,
  },
  profileMainContent: {
    padding: 80,
    maxWidth: 1200,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  contentTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  editProfileBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -12,
    marginBottom: 60,
  },
  infoCard: {
    width: "33.33%",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#1d3557",
    fontWeight: "700",
  },
  settingsSection: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  settingLabelGroup: {
    gap: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d3557",
  },
  settingSub: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 24,
  },
  dangerZone: {
    marginTop: 40,
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dangerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 20,
  },
  changePasswordBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignSelf: "flex-start",
  },
  changePasswordText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
});

export default ProfileScreen;
