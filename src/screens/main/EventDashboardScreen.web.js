import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Utensils,
  ShoppingBag,
  Map as MapIcon,
  Info,
  ChevronRight,
  Ticket,
  Bell,
  Sparkles,
  Send,
  MessageSquare,
  TriangleAlert,
  Star,
  History,
  Lock,
  UserCircle,
  LayoutDashboard,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../api/services";
import WebUserSidebar from "../../components/WebUserSidebar";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const EventDashboardScreen = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { userInfo } = useAuth();
  const [activeEvent, setActiveEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventRating, setEventRating] = useState(0);

  useEffect(() => {
    checkLiveEvent();
  }, []);

  const checkLiveEvent = async () => {
    setIsLoading(true);
    try {
      const userId = userInfo?.uid || userInfo?.id;
      if (!userId) {
        setActiveEvent(null);
        return;
      }
      const response = await bookingService.getUserBookings(userId);
      const bookings = Array.isArray(response) ? response : response?.bookings || [];
      const today = new Date().toISOString().split("T")[0];
      const liveBooking = bookings.find((b) => (b.event?.date || b.date)?.includes(today));

      if (liveBooking) {
        setActiveEvent({
          id: liveBooking.event?.id || liveBooking.eventId,
          title: liveBooking.event?.title || "Active Event",
          gate: liveBooking.event?.gate || "A2",
          section: liveBooking.event?.section || "A",
          row: liveBooking.event?.row || "05",
          seat: liveBooking.seatNumber || liveBooking.seat,
        });
      } else {
        // Mock fallback
        setActiveEvent({
          id: "mock-event-123",
          title: "IPL 2026: MI vs CSK",
          gate: "B3",
          section: "Level 1 - East",
          row: "12",
          seat: "45",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setActiveEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const ServiceCard = ({ title, subtitle, icon: Icon, color, onPress }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
      <View style={[styles.serviceIconBox, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceSubtitle}>{subtitle}</Text>
      </View>
      <ArrowUpRight size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.brandPurple} />
      </View>
    );
  }

  return (
    <View style={styles.desktopLayout}>
      {/* Left Sidebar for Desktop Context */}
      <WebUserSidebar navigation={navigation} activeNav="Dashboard" />

      {/* Main Content Area */}
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.mainContentInner} showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardHeader}>
           <View>
              <Text style={styles.headerLabel}>CONNECTED TO VENUE</Text>
              <Text style={styles.headerTitle}>{activeEvent?.title || "No Live Event"}</Text>
           </View>
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconBtn}><Bell size={22} color="#1d3557" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Info size={22} color="#1d3557" /></TouchableOpacity>
           </View>
        </View>

        <View style={styles.dashboardGrid}>
          {/* Main Control Panel: Digital Pass */}
          <View style={styles.gridSectionLarge}>
            <LinearGradient colors={["#1d3557", "#457b9d"]} style={styles.passCard}>
               <View style={styles.passHeader}>
                  <Ticket size={24} color="#fff" />
                  <Text style={styles.passLabel}>DIGITAL ENTRY PASS</Text>
                  <View style={styles.liveBadge}>
                     <View style={styles.liveDot} />
                     <Text style={styles.liveText}>LIVE</Text>
                  </View>
               </View>

               <View style={styles.passInfoGrid}>
                  <View style={styles.passInfoItem}>
                     <Text style={styles.passInfoLabel}>SECTION</Text>
                     <Text style={styles.passInfoValue}>{activeEvent?.section}</Text>
                  </View>
                  <View style={styles.passInfoItem}>
                     <Text style={styles.passInfoLabel}>ROW</Text>
                     <Text style={styles.passInfoValue}>{activeEvent?.row}</Text>
                  </View>
                  <View style={styles.passInfoItem}>
                     <Text style={styles.passInfoLabel}>SEAT</Text>
                     <Text style={styles.passInfoValue}>{activeEvent?.seat}</Text>
                  </View>
                  <View style={styles.passInfoItem}>
                     <Text style={styles.passInfoLabel}>GATE</Text>
                     <Text style={styles.passInfoValue}>{activeEvent?.gate}</Text>
                  </View>
               </View>

               <TouchableOpacity style={styles.viewMapLargeBtn}>
                  <Text style={styles.viewMapLargeText}>View Stadium Map</Text>
                  <MapIcon size={20} color="#1d3557" />
               </TouchableOpacity>
            </LinearGradient>

            <View style={styles.servicesGrid}>
               <ServiceCard title="Food Ordering" subtitle="Deliver to seat" icon={Utensils} color="#ef4444" onPress={() => navigation.navigate("FoodOrdering")} />
               <ServiceCard title="Event Shop" subtitle="Official merch" icon={ShoppingBag} color="#f59e0b" onPress={() => navigation.navigate("Store")} />
               <ServiceCard title="Order History" subtitle="Recent deliveries" icon={History} color="#10b981" onPress={() => navigation.navigate("OrderHistory")} />
               <ServiceCard title="Event Details" subtitle="Full schedule" icon={Info} color="#3b82f6" onPress={() => navigation.navigate("EventDetails", { eventId: activeEvent?.id })} />
            </View>
          </View>

          {/* Right Column: AI Assistant & Live Updates */}
          <View style={styles.gridSectionSmall}>
            <View style={styles.aiPanel}>
               <View style={styles.aiHeader}>
                  <Sparkles size={20} color={COLORS.brandPurple} />
                  <Text style={styles.aiTitle}>AI Event Assistant</Text>
                  <View style={styles.onlineStatus}>
                     <View style={styles.onlineDot} />
                     <Text style={styles.onlineText}>Active</Text>
                  </View>
               </View>
               
               <View style={styles.aiChatBox}>
                  <View style={styles.aiMessage}>
                     <Text style={styles.aiMessageText}>
                        Welcome, {userInfo?.firstname || "User"}! I'm your digital concierge. 
                        I can help you find amenities or order food. What do you need?
                     </Text>
                  </View>
                  
                  <View style={styles.aiSuggestions}>
                     {["Where's my seat?", "Food menu", "Safety info"].map(s => (
                        <TouchableOpacity key={s} style={styles.suggestionChip}>
                           <Text style={styles.suggestionText}>{s}</Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>

               <View style={styles.aiInputArea}>
                  <TextInput style={styles.aiInput} placeholder="Ask anything..." />
                  <TouchableOpacity style={styles.aiSendBtn}>
                     <Send size={18} color="#fff" />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.updatesPanel}>
               <Text style={styles.sectionTitleSmall}>Live Venue Updates</Text>
               <View style={styles.updateItem}>
                  <View style={styles.updateDot} />
                  <View>
                     <Text style={styles.updateTitle}>Wicket! - 15.4 Overs</Text>
                     <Text style={styles.updateText}>Bumrah clean bowls the batter! Crowd noise: 114dB.</Text>
                  </View>
               </View>
               <View style={styles.updateItem}>
                  <View style={[styles.updateDot, { backgroundColor: '#94a3b8' }]} />
                  <View>
                     <Text style={styles.updateTitle}>Boundary! - 12.2 Overs</Text>
                     <Text style={styles.updateText}>Beautiful cover drive for 4 runs.</Text>
                  </View>
               </View>
            </View>
          </View>
        </View>

        {/* Bottom Section: Feedback */}
        <View style={styles.feedbackSection}>
           <Text style={styles.sectionTitle}>Enjoying the experience?</Text>
           <View style={styles.feedbackCard}>
              <Text style={styles.feedbackSubtitle}>Rate the event organization and atmosphere</Text>
              <View style={styles.starsRow}>
                 {[1,2,3,4,5].map(s => (
                    <TouchableOpacity key={s} onPress={() => setEventRating(s)}>
                       <Star size={40} color={s <= eventRating ? "#facc15" : "#e2e8f0"} fill={s <= eventRating ? "#facc15" : "transparent"} />
                    </TouchableOpacity>
                 ))}
              </View>
              <TextInput style={styles.feedbackInput} placeholder="Any comments or suggestions for us?" multiline />
              <TouchableOpacity style={styles.submitFeedbackBtn}>
                 <Text style={styles.submitFeedbackText}>Submit Feedback</Text>
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopLayout: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  desktopSideMenu: {
    width: 320,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    padding: 40,
    justifyContent: "space-between",
  },
  brandBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 60,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  navGroup: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: "rgba(230, 57, 70, 0.05)",
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  navTextActive: {
    color: COLORS.brandPurple,
    fontWeight: "700",
  },
  sosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ef4444",
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  sosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  mainContent: {
    flex: 1,
  },
  mainContentInner: {
    padding: 60,
    maxWidth: 1400,
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ef4444",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  dashboardGrid: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 60,
  },
  gridSectionLarge: {
    flex: 2,
    gap: 40,
  },
  gridSectionSmall: {
    flex: 1,
    gap: 40,
  },
  passCard: {
    borderRadius: 32,
    padding: 40,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
  },
  passHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  passLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
    flex: 1,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  liveText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "900",
  },
  passInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 32,
    borderRadius: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  passInfoItem: {
    alignItems: "center",
  },
  passInfoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 8,
    letterSpacing: 1,
  },
  passInfoValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  viewMapLargeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 20,
  },
  viewMapLargeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -10,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    margin: "1%",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  serviceIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  aiPanel: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    flex: 1,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
    flex: 1,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "700",
  },
  aiChatBox: {
    flex: 1,
    marginBottom: 24,
  },
  aiMessage: {
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    padding: 20,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginBottom: 20,
  },
  aiMessageText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    fontWeight: "500",
  },
  aiSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  aiInputArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 8,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  aiInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1d3557",
  },
  aiSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  updatesPanel: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionTitleSmall: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 24,
  },
  updateItem: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  updateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    marginTop: 6,
  },
  updateTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: 4,
  },
  updateText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    fontWeight: "500",
  },
  feedbackSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 24,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 48,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
  },
  feedbackSubtitle: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 32,
  },
  starsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  feedbackInput: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 24,
    fontSize: 16,
    fontWeight: "500",
    color: "#1d3557",
    height: 120,
    textAlignVertical: "top",
    marginBottom: 32,
  },
  submitFeedbackBtn: {
    backgroundColor: "#1d3557",
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 16,
  },
  submitFeedbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default EventDashboardScreen;
