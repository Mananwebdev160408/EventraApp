import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
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
  ChevronRight,
  Shield,
  Settings,
  Bell,
  CreditCard,
  ChevronLeft,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services";
import WebUserSidebar from "../../components/WebUserSidebar";

const ProfileScreen = ({ navigation }) => {
  const { userInfo, setUserInfo, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

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
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  const getUserField = (user, ...keys) => {
    if (!user) return "";
    const source = user.userDetails || user;
    for (const key of keys) {
      if (source[key]) return source[key];
      if (user[key]) return user[key];
    }
    return "";
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIconBox}>
        <Icon size={18} color="#457b9d" />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "Not provided"}</Text>
      </View>
    </View>
  );

  const MenuLink = ({ icon: Icon, label, sub }) => (
    <TouchableOpacity style={styles.menuLink}>
       <View style={styles.menuLinkLeft}>
          <View style={styles.menuIconCircle}>
             <Icon size={20} color="#1d3557" />
          </View>
          <View>
             <Text style={styles.menuLinkLabel}>{label}</Text>
             <Text style={styles.menuLinkSub}>{sub}</Text>
          </View>
       </View>
       <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Profile" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Account Settings</Text>
                 <Text style={styles.headerSub}>Manage your profile and security preferences</Text>
              </View>
           </View>
           
           <TouchableOpacity style={styles.headerEditBtn} onPress={() => navigation.navigate("EditProfile")}>
              <Edit3 size={18} color="#fff" />
              <Text style={styles.headerEditBtnText}>Edit Profile</Text>
           </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              {loading ? (
                <View style={styles.loaderContainer}>
                   <ActivityIndicator size="large" color={COLORS.brandPurple} />
                </View>
              ) : (
                <View style={styles.profileGrid}>
                   {/* Left Col: Info Card */}
                   <View style={styles.infoCol}>
                      <View style={styles.profileCard}>
                         <View style={styles.avatarWrapper}>
                            <View style={styles.avatarCircle}>
                               <UserCircle size={100} color="#1d3557" strokeWidth={1} />
                            </View>
                            <TouchableOpacity style={styles.cameraBtn}>
                               <Edit3 size={16} color="#fff" />
                            </TouchableOpacity>
                         </View>
                         
                         <Text style={styles.userName}>
                            {`${getUserField(userInfo, "firstName", "firstname") || "Eventra"} ${getUserField(userInfo, "lastName", "lastname") || "User"}`}
                         </Text>
                         <Text style={styles.userRole}>Premium Member</Text>
                         
                         <View style={styles.infoDivider} />
                         
                         <View style={styles.detailsList}>
                            <DetailRow icon={Mail} label="Email" value={getUserField(userInfo, "email")} />
                            <DetailRow icon={Phone} label="Phone" value={getUserField(userInfo, "phoneNumber", "phone") || "+91 98XXX XXXXX"} />
                            <DetailRow icon={AtSign} label="Username" value={`@${getUserField(userInfo, "username") || "user"}`} />
                         </View>
                         
                         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <LogOut size={18} color="#ef4444" />
                            <Text style={styles.logoutBtnText}>Sign Out Account</Text>
                         </TouchableOpacity>
                      </View>
                   </View>

                   {/* Right Col: Settings & Links */}
                   <View style={styles.settingsCol}>
                      <View style={styles.settingsSection}>
                         <Text style={styles.sectionTitle}>Account & Security</Text>
                         <View style={styles.menuLinks}>
                            <MenuLink icon={Shield} label="Security" sub="Change password and 2FA" />
                            <MenuLink icon={CreditCard} label="Billing" sub="Manage payment methods" />
                            <MenuLink icon={Bell} label="Notifications" sub="Configure alert preferences" />
                            <MenuLink icon={Settings} label="General" sub="App language and region" />
                         </View>
                      </View>
                      
                      <View style={styles.settingsSection}>
                         <Text style={styles.sectionTitle}>Support & Legal</Text>
                         <View style={styles.menuLinks}>
                            <MenuLink icon={User} label="Help Center" sub="FAQs and support chat" />
                            <MenuLink icon={Shield} label="Privacy Policy" sub="How we handle your data" />
                         </View>
                      </View>
                      
                      <Text style={styles.versionText}>Eventra Web v1.0.0 • Build 2026.04</Text>
                   </View>
                </View>
              )}
           </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  mainContent: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 60,
    paddingVertical: 32,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  headerEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  headerEditBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  profileGrid: {
    flexDirection: "row",
    gap: 48,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  infoCol: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    boxShadow: "0px 10px 40px rgba(0,0,0,0.03)",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 32,
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f1f5f9",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.brandPurple,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 8,
  },
  userRole: {
    fontSize: 16,
    color: COLORS.brandPurple,
    fontWeight: "700",
    marginBottom: 40,
  },
  infoDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 40,
  },
  detailsList: {
    width: "100%",
    gap: 24,
    marginBottom: 48,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  detailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d3557",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: "#fff1f2",
  },
  logoutBtnText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "800",
  },
  settingsCol: {
    flex: 1.5,
    gap: 40,
  },
  settingsSection: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 24,
    paddingLeft: 8,
  },
  menuLinks: {
    gap: 8,
  },
  menuLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  menuLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLinkLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  menuLinkSub: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    fontSize: 13,
    color: "#cbd5e1",
    fontWeight: "600",
    marginTop: 20,
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
  }
});

export default ProfileScreen;
