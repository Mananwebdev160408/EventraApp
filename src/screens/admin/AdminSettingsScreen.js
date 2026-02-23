import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  User,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  TriangleAlert,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { USERS } from "../../constants/mocks";
import { useAuth } from "../../context/AuthContext";

const AdminSettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const SettingItem = ({
    icon,
    label,
    type,
    value,
    onValueChange,
    onPress,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && type !== "switch"}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {type === "switch" && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.gray300, true: COLORS.brandPurple }}
          thumbColor={COLORS.white}
        />
      )}
      {type === "button" && (
        <ChevronLeft
          size={20}
          color={COLORS.gray400}
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: USERS.currentUser.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{USERS.currentUser.name}</Text>
            <Text style={styles.userRole}>Stadium Administrator</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Groups */}
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Preferences</Text>
            <SettingItem
              icon={<Bell size={20} color={COLORS.brandPurple} />}
              label="Push Notifications"
              type="switch"
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingItem
              icon={<User size={20} color={COLORS.brandPurple} />}
              label="Account Details"
              type="button"
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.groupTitle}>Security</Text>
            <SettingItem
              icon={<Lock size={20} color={COLORS.brandPurple} />}
              label="Change Password"
              type="button"
            />
            <SettingItem
              icon={<TriangleAlert size={20} color={COLORS.error} />}
              label="Emergency SOS"
              type="button"
              onPress={() => navigation.navigate("Emergency")}
            />
            <SettingItem
              icon={<HelpCircle size={20} color={COLORS.brandPurple} />}
              label="Help & Support"
              type="button"
            />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => await logout()}
          >
            <LogOut size={20} color={COLORS.error} />
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
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 32,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.gray600,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editProfileText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },
  group: {
    gap: 16,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.gray600,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    marginTop: 16,
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default AdminSettingsScreen;
