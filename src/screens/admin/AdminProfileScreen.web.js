import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  User,
  Mail,
  Phone,
  Edit3,
  AtSign,
  UserCircle,
  TriangleAlert,
  Settings,
  ShieldCheck,
  Calendar,
  MapPin,
  Camera,
  CheckCircle,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services";
import AdminSidebar from "../../components/AdminSidebar.web";

const AdminProfileScreen = ({ navigation }) => {
  const { userInfo, setUserInfo } = useAuth();
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

  const getUserField = (user, ...keys) => {
    if (!user) return "";
    const source = user.userDetails || user;
    for (const key of keys) {
      if (source[key]) return source[key];
      if (user[key]) return user[key];
    }
    return "";
  };

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <AdminSidebar navigation={navigation} activeNav="Profile" />

      <View style={styles.mainContent}>
        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#1d3557" />
            <Text style={styles.loaderText}>Loading Administrative Profile...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollArea}>
            <View style={styles.profileHeader}>
               <View style={styles.banner}>
                  <Image 
                    source={{ uri: "https://images.unsplash.com/photo-1577416414929-7a4c9f1a0b3f?q=80&w=2000&auto=format&fit=crop" }} 
                    style={styles.bannerImage} 
                  />
                  <View style={styles.bannerOverlay} />
               </View>
               
               <View style={styles.profileMetaRow}>
                  <View style={styles.avatarWrapper}>
                     <View style={styles.avatarCircle}>
                        <Image 
                           source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} 
                           style={styles.avatarImage} 
                        />
                        <TouchableOpacity style={styles.cameraBtn}>
                           <Camera size={18} color="#fff" />
                        </TouchableOpacity>
                     </View>
                  </View>
                  
                  <View style={styles.profileInfoMain}>
                     <View style={styles.nameRow}>
                        <Text style={styles.profileName}>
                           {getUserField(userInfo, "firstName") || "Stadium"} {getUserField(userInfo, "lastName") || "Admin"}
                        </Text>
                        <View style={styles.verifiedBadge}>
                           <CheckCircle size={16} color="#10b981" />
                           <Text style={styles.verifiedText}>Verified Administrator</Text>
                        </View>
                     </View>
                     <View style={styles.roleRow}>
                        <ShieldCheck size={16} color="#457b9d" />
                        <Text style={styles.roleText}>Super Admin • Wankhede Stadium Control</Text>
                     </View>
                  </View>
                  
                  <View style={styles.profileActions}>
                     <TouchableOpacity 
                        style={styles.editBtn}
                        onPress={() => navigation.navigate("EditProfile")}
                     >
                        <Edit3 size={18} color="#fff" />
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.settingsBtn}>
                        <Settings size={18} color="#1d3557" />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>

            <View style={styles.profileGrid}>
               <View style={styles.gridLeft}>
                  <View style={styles.infoCard}>
                     <Text style={styles.cardTitle}>Identity & Contact</Text>
                     <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                           <AtSign size={20} color="#94a3b8" />
                           <View>
                              <Text style={styles.infoLabel}>Username</Text>
                              <Text style={styles.infoValue}>@{getUserField(userInfo, "username") || "admin_01"}</Text>
                           </View>
                        </View>
                        <View style={styles.infoItem}>
                           <Mail size={20} color="#94a3b8" />
                           <View>
                              <Text style={styles.infoLabel}>Email Address</Text>
                              <Text style={styles.infoValue}>{getUserField(userInfo, "email")}</Text>
                           </View>
                        </View>
                        <View style={styles.infoItem}>
                           <Phone size={20} color="#94a3b8" />
                           <View>
                              <Text style={styles.infoLabel}>Phone Number</Text>
                              <Text style={styles.infoValue}>{getUserField(userInfo, "phoneNumber") || "+91 98XXX XXXXX"}</Text>
                           </View>
                        </View>
                        <View style={styles.infoItem}>
                           <MapPin size={20} color="#94a3b8" />
                           <View>
                              <Text style={styles.infoLabel}>Station Location</Text>
                              <Text style={styles.infoValue}>Mumbai, Maharashtra (HQ)</Text>
                           </View>
                        </View>
                     </View>
                  </View>
                  
                  <View style={styles.infoCard}>
                     <Text style={styles.cardTitle}>Emergency Response Access</Text>
                     <Text style={styles.cardDesc}>As an admin, you have direct access to trigger stadium-wide SOS alerts and coordinate with security units.</Text>
                     <TouchableOpacity 
                        style={styles.sosTriggerBtn}
                        onPress={() => navigation.navigate("Emergency")}
                     >
                        <TriangleAlert size={20} color="#fff" />
                        <Text style={styles.sosTriggerText}>Open Emergency Command</Text>
                     </TouchableOpacity>
                  </View>
               </View>

               <View style={styles.gridRight}>
                  <View style={styles.statsCard}>
                     <Text style={styles.cardTitle}>Management Statistics</Text>
                     <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                           <Text style={styles.statNum}>124</Text>
                           <Text style={styles.statLabel}>Events Managed</Text>
                        </View>
                        <View style={styles.statBox}>
                           <Text style={styles.statNum}>12</Text>
                           <Text style={styles.statLabel}>SOS Resolved</Text>
                        </View>
                        <View style={styles.statBox}>
                           <Text style={styles.statNum}>4.9/5</Text>
                           <Text style={styles.statLabel}>Safety Score</Text>
                        </View>
                        <View style={styles.statBox}>
                           <Text style={styles.statNum}>1.2k</Text>
                           <Text style={styles.statLabel}>Logs Generated</Text>
                        </View>
                     </View>
                  </View>
                  
                  <View style={styles.infoCard}>
                     <Text style={styles.cardTitle}>Account Security</Text>
                     <View style={styles.securityItem}>
                        <View style={styles.securityIcon}>
                           <ShieldCheck size={20} color="#10b981" />
                        </View>
                        <View style={{ flex: 1 }}>
                           <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                           <Text style={styles.securityDesc}>Enabled via registered mobile device</Text>
                        </View>
                        <TouchableOpacity><Text style={styles.securityLink}>Manage</Text></TouchableOpacity>
                     </View>
                     <View style={styles.securityItem}>
                        <View style={styles.securityIcon}>
                           <Calendar size={20} color="#3b82f6" />
                        </View>
                        <View style={{ flex: 1 }}>
                           <Text style={styles.securityTitle}>Last Login</Text>
                           <Text style={styles.securityDesc}>Today at 10:45 AM from Mumbai, IN</Text>
                        </View>
                     </View>
                  </View>
               </View>
            </View>
            
            <Text style={styles.versionText}>Eventra Shield Admin v1.0.0 • Production Build 2026.4.21</Text>
          </ScrollView>
        )}
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
  scrollArea: {
    flexGrow: 1,
  },
  profileHeader: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 40,
  },
  banner: {
    height: 240,
    width: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  profileMetaRow: {
    paddingHorizontal: 60,
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: -60,
    gap: 32,
  },
  avatarWrapper: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 90,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
  },
  avatarCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f1f5f9",
    position: "relative",
    overflow: 'visible',
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  cameraBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  profileInfoMain: {
    flex: 1,
    paddingBottom: 10,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1e293b",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#10b981",
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  profileActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 10,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 12,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  settingsBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  profileGrid: {
    padding: 60,
    flexDirection: "row",
    gap: 32,
  },
  gridLeft: {
    flex: 1,
    gap: 32,
  },
  gridRight: {
    flex: 1,
    gap: 32,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 24,
  },
  infoList: {
    gap: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 24,
  },
  sosTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ef4444",
    height: 56,
    borderRadius: 14,
  },
  sosTriggerText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
  statsCard: {
    backgroundColor: "#0f172a",
    borderRadius: 32,
    padding: 32,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  statBox: {
    width: "calc(50% - 10px)",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  statNum: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  securityDesc: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  securityLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3b82f6",
  },
  versionText: {
    textAlign: "center",
    paddingBottom: 40,
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  loaderBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  }
});

export default AdminProfileScreen;
