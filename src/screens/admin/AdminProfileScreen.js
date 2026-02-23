import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
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
  TriangleAlert,
  Settings,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services";

const { width } = Dimensions.get("window");

const getUserField = (user, ...keys) => {
  if (!user) return "";
  const source = user.userDetails || user;
  for (const key of keys) {
    if (source[key]) return source[key];
    if (user[key]) return user[key];
  }
  return "";
};

const AdminProfileScreen = ({ navigation }) => {
  const { userInfo, setUserInfo, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getCurrentUser();
      // Guard: don't overwrite state if user has already logged out
      if (data && userInfo) {
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your admin account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <View style={styles.detailItem}>
      <View style={styles.detailIconBox}>
        <Icon size={20} color="#457b9d" />
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "Not provided"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Profile</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate("AdminSettings")}
          >
            <Settings size={24} color="#1d3557" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
            <Text style={styles.loadingText}>Syncing admin profile...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarOuter}>
                <View style={styles.avatarInner}>
                  <UserCircle size={100} color="#1d3557" strokeWidth={1.2} />
                </View>
              </View>
              <Text style={styles.profileName}>
                {`${getUserField(userInfo, "firstName", "firstname") || "Stadium"} ${getUserField(userInfo, "lastName", "lastname") || "Admin"}`}
              </Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>STADIUM ADMINISTRATOR</Text>
              </View>
            </View>

            {/* User Details Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>ACCOUNT DETAILS</Text>

              <DetailItem
                icon={User}
                label="Full Name"
                value={`${getUserField(userInfo, "firstName", "firstname") || ""} ${getUserField(userInfo, "lastName", "lastname") || ""}`}
              />
              <DetailItem
                icon={AtSign}
                label="Username"
                value={`@${getUserField(userInfo, "username") || "admin"}`}
              />
              <DetailItem
                icon={Mail}
                label="Email Address"
                value={getUserField(userInfo, "email")}
              />
              <DetailItem
                icon={Phone}
                label="Phone Number"
                value={
                  getUserField(
                    userInfo,
                    "phoneNumber",
                    "phone",
                    "phonenumber",
                  ) || "+91 98XXX XXXXX"
                }
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              {/* SOS Button for Admin */}
              <TouchableOpacity
                style={styles.sosBtn}
                onPress={() => navigation.navigate("Emergency")}
                activeOpacity={0.8}
              >
                <TriangleAlert size={20} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.sosBtnText}>Emergency SOS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate("EditProfile")}
                activeOpacity={0.8}
              >
                <Edit3 size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <LogOut size={18} color="#e63946" strokeWidth={2.5} />
                <Text style={styles.signOutBtnText}>Sign Out Account</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.versionText}>
              Eventra v1.0.0 (Admin Edition)
            </Text>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -0.5,
  },
  settingsBtn: {
    position: "absolute",
    right: 24,
    top: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  avatarOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  avatarInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#f1faee",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1d3557",
    marginTop: 20,
    letterSpacing: -0.5,
  },
  adminBadge: {
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    color: "#1d3557",
    fontWeight: "800",
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#457b9d",
    letterSpacing: 2,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  detailIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(69, 123, 157, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d3557",
    marginTop: 2,
  },
  actionSection: {
    gap: 16,
  },
  sosBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error,
    height: 60,
    borderRadius: 20,
    gap: 12,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
    marginBottom: 8,
  },
  sosBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1d3557",
    height: 60,
    borderRadius: 20,
    gap: 12,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  editBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    height: 60,
    borderRadius: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.1)",
  },
  signOutBtnText: {
    color: "#e63946",
    fontSize: 16,
    fontWeight: "800",
  },
  versionText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "600",
  },
});

export default AdminProfileScreen;
