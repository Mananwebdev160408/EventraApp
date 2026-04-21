import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Zap,
  Sparkles,
  Bell,
  UserCircle,
  LayoutDashboard,
  ShoppingBag,
  Ticket,
  ShieldAlert,
} from "lucide-react-native";
import { COLORS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const WebUserSidebar = ({ navigation, activeNav }) => {
  const { userInfo } = useAuth();

  const navItems = [
    { name: "Discover", icon: Zap, label: "Discover", route: "Discover" },
    { name: "Explore", icon: Sparkles, label: "Explore", route: "Explore" },
    { name: "Dashboard", icon: LayoutDashboard, label: "Live Hub", route: "Dashboard" },
    { name: "MyEvents", icon: Ticket, label: "My Tickets", route: "MyEvents" },
    { name: "Store", icon: ShoppingBag, label: "Event Store", route: "Store" },
    { name: "Notifications", icon: Bell, label: "Updates", route: "Notifications" },
  ];

  return (
    <View style={styles.sidebar}>
      <View>
        <View style={styles.sidebarBrand}>
          <View style={styles.sidebarLogo}>
            <Zap size={24} color={COLORS.error} />
          </View>
          <Text style={styles.sidebarTitle}>Eventra</Text>
        </View>

        <View style={styles.sidebarNav}>
          <Text style={styles.sidebarSectionTitle}>MENU</Text>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.sidebarLink,
                activeNav === item.name && styles.sidebarLinkActive,
              ]}
              onPress={() => navigation.navigate(item.route)}
            >
              <item.icon
                size={20}
                color={activeNav === item.name ? "#fff" : "#64748b"}
              />
              <Text
                style={[
                  styles.sidebarLinkText,
                  activeNav === item.name && styles.sidebarLinkTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => navigation.navigate("Emergency")}
        >
          <ShieldAlert size={20} color="#fff" />
          <Text style={styles.sosText}>Emergency SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sidebarProfile}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.avatarContainer}>
             <UserCircle size={40} color="#1d3557" />
          </View>
          <View>
            <Text style={styles.profileName}>{userInfo?.firstname || "Fan"}</Text>
            <Text style={styles.profileRole}>Gold Member</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    padding: 32,
    justifyContent: "space-between",
    height: "100%",
  },
  sidebarBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 48,
  },
  sidebarLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  sidebarSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginBottom: 20,
    marginTop: 32,
  },
  sidebarNav: {
    gap: 4,
  },
  sidebarLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sidebarLinkActive: {
    backgroundColor: "#1d3557",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sidebarLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  sidebarLinkTextActive: {
    fontWeight: "700",
    color: "#fff",
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  sosText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  sidebarProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  profileRole: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "600",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  }
});

export default WebUserSidebar;
