import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  LayoutDashboard,
  BarChart3,
  Flame,
  PlusCircle,
  ShoppingBag,
  Clock,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { COLORS } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = ({ navigation, activeNav }) => {
  const { userInfo, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, label: "Command Center", route: "AdminTabs" },
    { name: "Analytics", icon: BarChart3, label: "Deep Analytics", route: "AdminAnalytics" },
    { name: "Heatmap", icon: Flame, label: "Live Heatmap", route: "LiveHeatmap" },
    { name: "AddEvent", icon: PlusCircle, label: "Create Event", route: "AddEvent" },
    { name: "Inventory", icon: ShoppingBag, label: "Inventory", route: "AdminInventory" },
    { name: "Logs", icon: Clock, label: "System Logs", route: "SystemLogs" },
    { name: "Settings", icon: Settings, label: "Settings", route: "AdminSettings" },
  ];

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to sign out from Admin Panel?")) {
      await logout();
    }
  };

  return (
    <View style={styles.sidebar}>
      <View>
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
          <Text style={styles.navSectionLabel}>ADMINISTRATION</Text>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.navItem,
                activeNav === item.name && styles.navItemActive,
              ]}
              onPress={() => navigation.navigate(item.route)}
            >
              <item.icon
                size={20}
                color={activeNav === item.name ? "#fff" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.navItemText,
                  activeNav === item.name && styles.navItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sidebarFooter}>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.userProfile}
          onPress={() => navigation.navigate("AdminProfile")}
        >
          <Image 
            source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo?.firstName || "Admin"}</Text>
            <Text style={styles.userRole}>Super Admin</Text>
          </View>
          <ChevronRight size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    backgroundColor: "#0f172a",
    padding: 32,
    justifyContent: "space-between",
    height: "100%",
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
    gap: 8,
  },
  navSectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 16,
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
  navItemTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  sidebarFooter: {
    gap: 24,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "700",
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  userRole: {
    color: "#64748b",
    fontSize: 12,
  },
});

export default AdminSidebar;
