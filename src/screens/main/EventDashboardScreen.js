import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
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
} from "lucide-react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { MY_REGISTRATIONS } from "../../constants/mocks";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const EventDashboardScreen = ({ navigation }) => {
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
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  sosGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  sosIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosTextContent: {
    flex: 1,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  sosSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  seatCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  seatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  seatTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  seatLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.8,
    letterSpacing: 1.5,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  activeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
  },
  detailedSeatInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  seatDetailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    opacity: 0.6,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  seatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  gateInfo: {
    gap: 2,
  },
  gateLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    opacity: 0.7,
  },
  gateValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  viewMapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewMapText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: "500",
  },
  updatesContainer: {
    paddingHorizontal: 24,
  },
  updateCard: {
    backgroundColor: "rgba(29, 53, 87, 0.03)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#457b9d",
  },
  updateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e63946",
  },
  updateTime: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  updateMessage: {
    fontSize: 14,
    color: "#457b9d",
    lineHeight: 20,
    fontWeight: "500",
  },
  aiContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aiIconBadge: {
    backgroundColor: "#1d3557",
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10b981",
  },
  chatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  messageRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  botAvatarText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d3557",
  },
  botBubble: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  botText: {
    fontSize: 13,
    color: "#1d3557",
    lineHeight: 18,
    fontWeight: "500",
  },
  suggestedRow: {
    marginBottom: 20,
  },
  suggestedChip: {
    backgroundColor: "rgba(69, 123, 157, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(69, 123, 157, 0.1)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#457b9d",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1faee",
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  placeholderText: {
    flex: 1,
    marginLeft: 10,
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: "500",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EventDashboardScreen;
