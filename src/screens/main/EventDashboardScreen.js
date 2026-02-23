import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
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
  Settings,
  Sparkles,
  Send,
  MessageSquare,
  TriangleAlert,
  Star,
  History,
  Lock,
  Shield,
  UserCircle,
} from "lucide-react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../api/services";

const { width } = Dimensions.get("window");

const EventDashboardScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [eventRating, setEventRating] = useState(0);
  const [eventComment, setEventComment] = useState("");
  const [activeEvent, setActiveEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkLiveEvent();
  }, []);

  const checkLiveEvent = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      // In a real scenario, we check if there's a booking for today
      const response = await bookingService.getUserBookings(userInfo?.id);
      const bookings = Array.isArray(response)
        ? response
        : response?.bookings || [];

      // Get today's date in YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Find a booking that matches today's date
      const liveBooking = bookings.find((b) => {
        const eventDate = b.event?.date || b.date;
        return eventDate && eventDate.includes(today);
      });

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
        setActiveEvent(null);
      }
    } catch (error) {
      console.error("Error checking live event:", error);
      setActiveEvent(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    checkLiveEvent(false);
  };

  const ActionCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color={COLORS.gray400} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.brandPurple} />
        <Text style={styles.loadingText}>Verifying entry pass...</Text>
      </View>
    );
  }

  if (!activeEvent) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View>
              <Text style={styles.liveLabel}>DASHBOARD STATUS</Text>
              <Text style={styles.eventTitle}>No Live Event</Text>
            </View>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              <UserCircle size={22} color="#1d3557" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.inactiveContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.lockedCard}>
              <View style={styles.lockIllustration}>
                <LinearGradient
                  colors={["#f1faee", "#FFFFFF"]}
                  style={styles.illustrationCircle}
                >
                  <Lock size={42} color="#1d3557" strokeWidth={1.5} />
                </LinearGradient>
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>OFFLINE</Text>
                </View>
              </View>

              <Text style={styles.lockedTitle}>Dashboard Inactive</Text>
              <Text style={styles.lockedSubtitle}>
                Live features like SOS, In-Seat Ordering, and AI Assistance
                activate once you're at the venue for an event.
              </Text>

              <View style={styles.featureBox}>
                <View style={styles.featureRow}>
                  <View style={styles.featureIconBox}>
                    <Utensils size={18} color="#1d3557" />
                  </View>
                  <View>
                    <Text style={styles.featureLabel}>Food & Beverages</Text>
                    <Text style={styles.featureDesc}>
                      Deliver direct to your seat
                    </Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureIconBox}>
                    <TriangleAlert size={18} color="#e63946" />
                  </View>
                  <View>
                    <Text style={styles.featureLabel}>Emergency SOS</Text>
                    <Text style={styles.featureDesc}>
                      Instant security & medical aid
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.mainCheckBtn}
                onPress={onRefresh}
                disabled={isRefreshing}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#1d3557", "#2a4a7a"]}
                  style={styles.mainCheckGradient}
                >
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <History size={20} color="#FFFFFF" />
                      <Text style={styles.mainCheckText}>
                        Check Today's Booking
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => navigation.navigate("Discover")}
              >
                <Text style={styles.browseBtnText}>
                  Explore upcoming events
                </Text>
                <ChevronRight size={16} color="#457b9d" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoNote}>
              <Info size={14} color="#457b9d" />
              <Text style={styles.infoNoteText}>
                Your dashboard will auto-unlock 2 hours before the event start
                time.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.liveLabel}>LIVE EVENT DASHBOARD</Text>
              <Text style={styles.eventTitle}>{activeEvent.title}</Text>
            </View>
            <TouchableOpacity style={styles.headerBtn}>
              <Bell size={22} color="#1d3557" />
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyContainer}>
            <TouchableOpacity
              style={styles.sosBanner}
              onPress={() => navigation.navigate("Emergency")}
            >
              <LinearGradient
                colors={["#e63946", "#d62828"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sosGradient}
              >
                <View style={styles.sosIconBox}>
                  <TriangleAlert size={24} color="#FFFFFF" />
                </View>
                <View style={styles.sosTextContent}>
                  <Text style={styles.sosTitle}>EMERGENCY SOS</Text>
                  <Text style={styles.sosSubtitle}>
                    Medical, Security or Safety assistance
                  </Text>
                </View>
                <ChevronRight size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#1d3557", "#457b9d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.seatCard}
          >
            <View style={styles.seatHeader}>
              <View style={styles.seatTitleRow}>
                <Ticket size={20} color="#FFFFFF" opacity={0.8} />
                <Text style={styles.seatLabel}>DIGITAL ENTRY PASS</Text>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>ACTIVE</Text>
              </View>
            </View>

            <View style={styles.detailedSeatInfo}>
              <View style={styles.seatDetailItem}>
                <Text style={styles.detailLabel}>SECTION</Text>
                <Text style={styles.detailValue}>{activeEvent.section}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.seatDetailItem}>
                <Text style={styles.detailLabel}>ROW</Text>
                <Text style={styles.detailValue}>{activeEvent.row}</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.seatDetailItem}>
                <Text style={styles.detailLabel}>SEAT</Text>
                <Text style={styles.detailValue}>{activeEvent.seat}</Text>
              </View>
            </View>

            <View style={styles.seatFooter}>
              <View style={styles.gateInfo}>
                <Text style={styles.gateLabel}>GATE</Text>
                <Text style={styles.gateValue}>{activeEvent.gate}</Text>
              </View>
              <TouchableOpacity
                style={styles.viewMapBtn}
                onPress={() =>
                  navigation.navigate("SelectSeats", {
                    mode: "view",
                    showUser: true,
                  })
                }
              >
                <Text style={styles.viewMapText}>Visual Map</Text>
                <MapIcon size={16} color="#1d3557" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Event Services</Text>

            <ActionCard
              title="My Ticket"
              subtitle="View your entry QR and details"
              icon={<Ticket size={24} color="#FFFFFF" />}
              color="#1d3557"
              onPress={() => navigation.navigate("Ticket")}
            />

            <ActionCard
              title="Food & Beverages"
              subtitle="Order snacks to your seat"
              icon={<Utensils size={24} color="#FFFFFF" />}
              color="#e63946"
              onPress={() => navigation.navigate("FoodOrdering")}
            />

            <ActionCard
              title="Official Merchandise"
              subtitle="Exclusive event gear"
              icon={<ShoppingBag size={24} color="#FFFFFF" />}
              color="#f4a261"
              onPress={() => navigation.navigate("Store")}
            />

            <ActionCard
              title="Order History"
              subtitle="Track and manage deliveries"
              icon={<History size={24} color="#FFFFFF" />}
              color="#fbbf24"
              onPress={() => navigation.navigate("OrderHistory")}
            />

            <ActionCard
              title="Stadium Map"
              subtitle="Find toilets, exits, and help"
              icon={<MapIcon size={24} color="#FFFFFF" />}
              color="#2a9d8f"
              onPress={() =>
                navigation.navigate("SelectSeats", {
                  mode: "view",
                  showUser: true,
                })
              }
            />

            <ActionCard
              title="Event Info"
              subtitle="Schedule and event details"
              icon={<Info size={24} color="#FFFFFF" />}
              color="#457b9d"
              onPress={() =>
                navigation.navigate("EventDetails", {
                  eventId: activeEvent.id,
                })
              }
            />
          </View>

          <View style={styles.aiContainer}>
            <View style={styles.aiHeader}>
              <View style={styles.aiTitleRow}>
                <View style={styles.aiIconBadge}>
                  <Sparkles size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.sectionTitle}>AI Event Assistant</Text>
              </View>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>

            <View style={styles.chatCard}>
              <View style={styles.messageRow}>
                <View style={styles.botAvatar}>
                  <Text style={styles.botAvatarText}>AI</Text>
                </View>
                <View style={styles.botBubble}>
                  <Text style={styles.botText}>
                    Hi {userInfo?.firstname || "Alex"}! I'm your event
                    assistant. Ask me anything about concessions, toilets, or
                    the event schedule!
                  </Text>
                </View>
              </View>

              <View style={styles.suggestedRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity style={styles.suggestedChip}>
                    <Text style={styles.chipText}>Where's my seat?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.suggestedChip}>
                    <Text style={styles.chipText}>Closest Restroom</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.suggestedChip}>
                    <Text style={styles.chipText}>Food Menu</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <TouchableOpacity style={styles.inputArea} activeOpacity={0.8}>
                <MessageSquare size={18} color={COLORS.gray400} />
                <Text style={styles.placeholderText}>
                  Type your question...
                </Text>
                <View style={styles.sendButton}>
                  <Send size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.updatesContainer}>
            <Text style={styles.sectionTitle}>Live Update</Text>
            <View style={styles.updateCard}>
              <View style={styles.updateHeader}>
                <View style={styles.liveDot} />
                <Text style={styles.updateTime}>82' - Goal!</Text>
              </View>
              <Text style={styles.updateMessage}>
                Home team scores! The crowd is going wild. Noise levels reaching
                110dB.
              </Text>
            </View>
          </View>

          <View style={styles.feedbackContainer}>
            <Text style={styles.sectionTitle}>Help us improve</Text>

            <View style={styles.feedbackCard}>
              <View style={styles.feedbackTypeSection}>
                <View style={styles.feedbackHeaderSmall}>
                  <Sparkles size={18} color="#1d3557" />
                  <Text style={styles.feedbackTypeTitle}>The Event Itself</Text>
                </View>
                <Text style={styles.feedbackTypeSubtitle}>
                  Performance, atmosphere, and overall vibe.
                </Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setEventRating(star)}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={28}
                        color={
                          star <= eventRating ? "#facc15" : "rgba(0,0,0,0.1)"
                        }
                        fill={star <= eventRating ? "#facc15" : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Tell us what you loved or what we can fix..."
                  placeholderTextColor={COLORS.gray400}
                  multiline
                  numberOfLines={3}
                  value={eventComment}
                  onChangeText={setEventComment}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitFeedbackBtn,
                  eventRating === 0 && styles.submitFeedbackBtnDisabled,
                ]}
                disabled={eventRating === 0}
              >
                <Text style={styles.submitFeedbackText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1faee",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "600",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  liveLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#e63946",
    letterSpacing: 2,
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
  },
  headerBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  emergencyContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sosBanner: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  sosGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 18,
  },
  sosIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  sosTextContent: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  sosSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
  },
  seatCard: {
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 28,
    marginBottom: 32,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 12,
  },
  seatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  seatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  seatLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
    opacity: 0.9,
    letterSpacing: 2,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  activeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#10b981",
  },
  detailedSeatInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 24,
    borderRadius: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  seatDetailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 6,
    letterSpacing: 1,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  detailDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  seatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gateInfo: {
    gap: 4,
  },
  gateLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.8,
    letterSpacing: 1,
  },
  gateValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  viewMapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  viewMapText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1d3557",
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionText: {
    flex: 1,
    marginLeft: 18,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    fontWeight: "600",
    opacity: 0.8,
  },
  updatesContainer: {
    paddingHorizontal: 24,
  },
  updateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(69, 123, 157, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
  },
  updateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e63946",
  },
  updateTime: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1d3557",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  updateMessage: {
    fontSize: 15,
    color: "#457b9d",
    lineHeight: 22,
    fontWeight: "600",
  },
  aiContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  aiIconBadge: {
    backgroundColor: "#1d3557",
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#10b981",
    textTransform: "uppercase",
  },
  chatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  messageRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  botAvatarText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1d3557",
  },
  botBubble: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  botText: {
    fontSize: 14,
    color: "#1d3557",
    lineHeight: 20,
    fontWeight: "600",
  },
  suggestedRow: {
    marginBottom: 24,
  },
  suggestedChip: {
    backgroundColor: "rgba(69, 123, 157, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(69, 123, 157, 0.15)",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#457b9d",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(241, 250, 238, 0.8)",
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  placeholderText: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.gray400,
    fontSize: 15,
    fontWeight: "600",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  feedbackContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 40,
  },
  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  feedbackTypeSection: {
    marginBottom: 24,
  },
  feedbackHeaderSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  feedbackTypeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  feedbackTypeSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    justifyContent: "center",
  },
  feedbackInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 18,
    padding: 16,
    color: "#1d3557",
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  submitFeedbackBtn: {
    backgroundColor: "#1d3557",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  submitFeedbackBtnDisabled: {
    backgroundColor: "#e9ecef",
    shadowOpacity: 0,
  },
  submitFeedbackText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  inactiveContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    alignItems: "center",
  },
  lockedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  lockIllustration: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  lockedBadge: {
    position: "absolute",
    bottom: 5,
    backgroundColor: "#457b9d",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lockedBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 10,
    textAlign: "center",
  },
  lockedSubtitle: {
    fontSize: 14,
    color: "#457b9d",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    fontWeight: "500",
  },
  featureBox: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  featureDesc: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "500",
  },
  mainCheckBtn: {
    width: "100%",
    height: 60,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 15,
  },
  mainCheckGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  mainCheckText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  browseBtnText: {
    color: "#457b9d",
    fontSize: 14,
    fontWeight: "700",
  },
  infoNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
    backgroundColor: "rgba(69, 123, 157, 0.05)",
    padding: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "600",
    lineHeight: 18,
  },
});

export default EventDashboardScreen;
