import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  MoreHorizontal,
  CheckCircle,
  ArrowUpCircle,
  AlertTriangle,
  Info,
  Ticket,
  Bell,
  Check,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import WebUserSidebar from "../../components/WebUserSidebar";

const NOTIFICATIONS = [
  { id: "1", title: "Order Delivered", message: "Your food order from North Stand Grill is here. Enjoy your meal!", time: "2m ago", icon: <CheckCircle size={22} color="#10b981" />, color: "#10b981", unread: true },
  { id: "2", title: "Seat Upgraded", message: "Great news! You've been moved to VIP Lounge 4 for the main event.", time: "1h ago", icon: <ArrowUpCircle size={22} color="#3b82f6" />, color: "#3b82f6", unread: false },
  { id: "3", title: "Gate Change", message: "Access to Section B is now through Gate 12 due to maintenance.", time: "3h ago", icon: <AlertTriangle size={22} color="#ef4444" />, color: "#ef4444", unread: true },
  { id: "4", title: "Event Reminder", message: "The Championships start tomorrow at 10:00 AM. Don't forget your pass.", time: "Yesterday, 4:30 PM", icon: <Info size={22} color="#3b82f6" />, color: "#3b82f6", unread: false },
  { id: "5", title: "Tickets Purchased", message: "Your 2x General Admission tickets for Sunday are now in your wallet.", time: "Yesterday, 11:20 AM", icon: <Ticket size={22} color="#10b981" />, color: "#10b981", unread: false },
];

const NotificationsScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();

  const NotificationItem = ({ item }) => (
    <TouchableOpacity style={[styles.notiCard, item.unread && styles.notiCardUnread]}>
      <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
         {item.icon}
      </View>
      <View style={styles.notiContent}>
         <View style={styles.notiHeader}>
            <Text style={styles.notiTitle}>{item.title}</Text>
            <Text style={styles.notiTime}>{item.time}</Text>
         </View>
         <Text style={styles.notiMessage}>{item.message}</Text>
         {item.unread && (
           <View style={styles.unreadRow}>
              <View style={styles.unreadBadge}><Text style={styles.unreadText}>New</Text></View>
              <TouchableOpacity><Text style={styles.markReadText}>Mark as read</Text></TouchableOpacity>
           </View>
         )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Notifications" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Notifications</Text>
                 <Text style={styles.headerSub}>Stay updated with your event status and orders</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.markAllBtn}>
                 <Check size={18} color="#1d3557" />
                 <Text style={styles.markAllText}>Mark all as read</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsBtn}>
                 <MoreHorizontal size={20} color="#1d3557" />
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              <View style={styles.notiListContainer}>
                 <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Recent Updates</Text>
                    <View style={styles.notiCount}>
                       <Text style={styles.notiCountText}>2 Unread</Text>
                    </View>
                 </View>

                 <View style={styles.list}>
                    {NOTIFICATIONS.map(item => <NotificationItem key={item.id} item={item} />)}
                 </View>
                 
                 <TouchableOpacity style={styles.loadMoreBtn}>
                    <Text style={styles.loadMoreText}>View Older Notifications</Text>
                 </TouchableOpacity>
              </View>
              
              <View style={styles.emptyPrompt}>
                 <Bell size={48} color="#e2e8f0" />
                 <Text style={styles.emptyPromptText}>You're all caught up!</Text>
              </View>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1d3557",
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
    alignItems: "center",
  },
  notiListContainer: {
    maxWidth: 800,
    width: "100%",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
  },
  notiCount: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  notiCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  list: {
    gap: 16,
    marginBottom: 40,
  },
  notiCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 20,
  },
  notiCardUnread: {
    borderColor: "rgba(124, 58, 237, 0.2)",
    backgroundColor: "rgba(124, 58, 237, 0.02)",
    boxShadow: "0px 10px 30px rgba(124, 58, 237, 0.05)",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notiContent: {
    flex: 1,
  },
  notiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notiTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1d3557",
  },
  notiTime: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  notiMessage: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 16,
  },
  unreadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  unreadBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  markReadText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  loadMoreBtn: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  emptyPrompt: {
    marginTop: 80,
    alignItems: "center",
    opacity: 0.5,
  },
  emptyPromptText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 16,
  }
});

export default NotificationsScreen;
