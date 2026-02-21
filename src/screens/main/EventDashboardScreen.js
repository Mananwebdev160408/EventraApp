import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
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
  Heart,
} from "lucide-react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { MY_REGISTRATIONS } from "../../constants/mocks";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const EventDashboardScreen = ({ navigation }) => {
  const [stadiumRating, setStadiumRating] = React.useState(0);
  const [eventRating, setEventRating] = React.useState(0);
  const [eventComment, setEventComment] = React.useState("");
  const currentEvent = MY_REGISTRATIONS[0]; // Mocking the "active" event

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Active Event Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.liveLabel}>LIVE EVENT DASHBOARD</Text>
              <Text style={styles.eventTitle}>{currentEvent.title}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn}>
                <Bell size={22} color="#1d3557" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Quick Access */}
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

          {/* Seat Info Card */}
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
                <Text style={styles.detailValue}>A</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.seatDetailItem}>
                <Text style={styles.detailLabel}>ROW</Text>
                <Text style={styles.detailValue}>05</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.seatDetailItem}>
                <Text style={styles.detailLabel}>SEAT</Text>
                <Text style={styles.detailValue}>12</Text>
              </View>
            </View>

            <View style={styles.seatFooter}>
              <View style={styles.gateInfo}>
                <Text style={styles.gateLabel}>GATE</Text>
                <Text style={styles.gateValue}>
                  {currentEvent.gate || "A2"}
                </Text>
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

          {/* Commerce and Info Actions */}
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
                  eventId: currentEvent.eventId,
                })
              }
            />
          </View>

          {/* AI Assistant Section */}
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
                    Hi Alex! I'm your event assistant. Ask me anything about
                    concessions, toilets, or the event schedule!
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

          {/* Stats / Live Updates */}
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

          {/* Feedback Section */}
          <View style={styles.feedbackContainer}>
            <Text style={styles.sectionTitle}>Help us improve</Text>

            <View style={styles.feedbackCard}>
              {/* Stadium Feedback */}
              <View style={styles.feedbackTypeSection}>
                <View style={styles.feedbackHeaderSmall}>
                  <MapIcon size={18} color="#1d3557" />
                  <Text style={styles.feedbackTypeTitle}>
                    Stadium Experience
                  </Text>
                </View>
                <Text style={styles.feedbackTypeSubtitle}>
                  Facilities, crowd management, and safety.
                </Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setStadiumRating(star)}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={28}
                        color={
                          star <= stadiumRating ? "#facc15" : "rgba(0,0,0,0.1)"
                        }
                        fill={star <= stadiumRating ? "#facc15" : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.feedbackDivider} />

              {/* Event Feedback */}
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
                  (stadiumRating === 0 || eventRating === 0) &&
                    styles.submitFeedbackBtnDisabled,
                ]}
                disabled={stadiumRating === 0 || eventRating === 0}
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
  headerActions: {
    flexDirection: "row",
    gap: 12,
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  feedbackHeaderSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  feedbackTypeSection: {
    width: "100%",
  },
  feedbackTypeTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  feedbackTypeSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    fontWeight: "500",
    marginBottom: 12,
  },
  feedbackDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 24,
    width: "100%",
  },
  ratingRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  feedbackInput: {
    backgroundColor: "rgba(241, 250, 238, 0.5)",
    borderRadius: 16,
    padding: 16,
    color: "#1d3557",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  submitFeedbackBtn: {
    backgroundColor: "#1d3557",
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    borderRadius: 18,
    marginTop: 24,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  submitFeedbackBtnDisabled: {
    backgroundColor: COLORS.gray300,
    shadowOpacity: 0,
  },
  submitFeedbackText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default EventDashboardScreen;
