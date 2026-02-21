import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  MoreHorizontal,
  CheckCircle,
  ArrowUpCircle,
  AlertTriangle,
  Info,
  Ticket,
} from "lucide-react-native";

const COLORS = {
  primary: "#2b8cee",
  backgroundLight: "#f1faee",
  backgroundDark: "#101922",
  success: "#22c55e",
  alert: "#ef4444",
  white: "#ffffff",
  slate900: "#0f172a",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
};

const NOTIFICATIONS = [
  {
    id: "1",
    type: "success",
    title: "Order Delivered",
    message: "Your food order from North Stand Grill is here. Enjoy your meal!",
    time: "2m ago",
    icon: <CheckCircle size={24} color={COLORS.success} />,
    color: COLORS.success,
    unread: true,
  },
  {
    id: "2",
    type: "upgrade",
    title: "Seat Upgraded",
    message:
      "Great news! You've been moved to VIP Lounge 4 for the main event.",
    time: "1h ago",
    icon: <ArrowUpCircle size={24} color={COLORS.primary} />,
    color: COLORS.primary,
    unread: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Gate Change",
    message: "Access to Section B is now through Gate 12 due to maintenance.",
    time: "3h ago",
    icon: <AlertTriangle size={24} color={COLORS.alert} />,
    color: COLORS.alert,
    unread: true,
  },
];

const YESTERDAY_NOTIFICATIONS = [
  {
    id: "4",
    type: "info",
    title: "Event Reminder",
    message:
      "The Championships start tomorrow at 10:00 AM. Don't forget your pass.",
    time: "Yesterday, 4:30 PM",
    icon: <Info size={24} color={COLORS.primary} />,
    color: COLORS.primary,
    unread: false,
  },
  {
    id: "5",
    type: "ticket",
    title: "Tickets Purchased",
    message:
      "Your 2x General Admission tickets for Sunday are now in your wallet.",
    time: "Yesterday, 11:20 AM",
    icon: <Ticket size={24} color={COLORS.success} />,
    color: COLORS.success,
    unread: false,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const renderNotificationItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
      {item.unread && <View style={styles.unreadDot} />}
      <View
        style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}
      >
        {item.icon}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <ChevronLeft size={24} color={COLORS.slate900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={24} color={COLORS.slate900} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Today Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY</Text>
            <View style={styles.list}>
              {NOTIFICATIONS.map(renderNotificationItem)}
            </View>
          </View>

          {/* Yesterday Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YESTERDAY</Text>
            <View style={[styles.list, { opacity: 0.8 }]}>
              {YESTERDAY_NOTIFICATIONS.map(renderNotificationItem)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* iOS Blur Spacer (Visual Only as actual blur requires expo-blur) */}
      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(241, 250, 238, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate200,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.slate900,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.slate400,
    letterSpacing: 1.5,
    marginBottom: 16,
    paddingLeft: 4,
    textTransform: "uppercase",
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
    gap: 18,
    shadowColor: COLORS.slate600,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 3,
  },
  unreadDot: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.slate900,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    color: COLORS.slate600,
    lineHeight: 22,
    marginBottom: 10,
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.slate400,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default NotificationsScreen;
