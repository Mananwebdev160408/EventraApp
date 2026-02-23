import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  QRCode,
  Ticket as TicketIcon,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { bookingService } from "../../api/services";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const MyTicketsScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getUserBookings(userInfo?.id);
      setBookings(Array.isArray(data) ? data : data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = bookings.filter((t) => {
    const isPast = new Date(t.eventDate || t.event?.date) < new Date();
    return activeTab === "upcoming" ? !isPast : isPast;
  });

  const TicketCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Ticket", { bookingId: item.id })}
      style={styles.ticketCard}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.event?.image ||
              "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80&w=800",
          }}
          style={styles.eventImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.imageOverlay}
        />
        <View style={styles.ticketTypeBadge}>
          <Text style={styles.ticketType}>{item.ticketType || "STANDARD"}</Text>
        </View>
        <View style={styles.cardHeaderContent}>
          <Text style={styles.eventTitle}>
            {item.event?.title || item.eventTitle}
          </Text>
          <View style={styles.venueRow}>
            <MapPin size={14} color={COLORS.gray300} />
            <Text style={styles.venueText}>
              {item.event?.venue || item.venue}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.ticketBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar
              size={16}
              color={COLORS.brandPurple}
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {item.event?.date || item.date}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Clock
              size={16}
              color={COLORS.brandPurple}
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {item.event?.time || item.time || "20:00"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.seatContainer}>
          <Text style={styles.seatLabel}>Seat Location</Text>
          <Text style={styles.seatValue}>
            {item.seatNumber || item.seat || "Assigned at entry"}
          </Text>
        </View>

        <View style={styles.actionsFooter}>
          <TouchableOpacity
            style={styles.viewTicketBtn}
            onPress={() =>
              navigation.navigate("Ticket", { bookingId: item.id })
            }
          >
            <Text style={styles.viewTicketText}>View Ticket</Text>
            <ChevronRight size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Visual rip effect using dashed line */}
      <View style={styles.ripLineContainer}>
        <View style={styles.ripCircleLeft} />
        <View style={styles.ripLine} />
        <View style={styles.ripCircleRight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <TouchableOpacity style={styles.calendarBtn} onPress={fetchBookings}>
            <Calendar size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "past" && styles.activeTab]}
            onPress={() => setActiveTab("past")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "past" && styles.activeTabText,
              ]}
            >
              Past Events
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
          </View>
        ) : (
          <FlatList
            data={filteredTickets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TicketCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <TicketIcon size={48} color={COLORS.gray300} />
                <Text style={styles.emptyTitle}>No tickets found</Text>
                <Text style={styles.emptyText}>
                  {activeTab === "upcoming"
                    ? "You haven't booked any upcoming events yet. Explore events to get started!"
                    : "You haven't attended any past events yet."}
                </Text>
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => navigation.navigate("Discover")}
                >
                  <Text style={styles.exploreBtnText}>Explore Events</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

// Helper for chevron in button
const ChevronRight = ({ size, color }) => (
  <View style={{ transform: [{ rotate: "0deg" }] }}>
    {/* reusing existing import but icon is simple to simulate if needed, or stick to import from library */}
    {/* Actually I imported it but let's just use Text > for simplicity or fix import if it errors. I imported ChevronLeft, let's change to use rotate */}
    <ChevronLeft
      size={size}
      color={color}
      style={{ transform: [{ rotate: "180deg" }] }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1faee",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28, // text-3xl
    fontWeight: "800",
    color: COLORS.text,
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#1d3557", // Navy
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray500,
  },
  activeTabText: {
    color: "#1d3557",
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    gap: 24,
  },
  ticketCard: {
    backgroundColor: COLORS.card,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  imageContainer: {
    height: 180,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ticketTypeBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  ticketType: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  cardHeaderContent: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  eventTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  venueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  venueText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "700",
  },
  ticketBody: {
    padding: 24,
    paddingTop: 32,
  },
  infoRow: {
    flexDirection: "row",
    gap: 32,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    flex: 1,
  },
  infoIcon: {
    marginTop: 0,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "800",
    marginTop: 2,
  },
  separator: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  seatContainer: {
    backgroundColor: "rgba(158, 79, 222, 0.05)",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(158, 79, 222, 0.1)",
  },
  seatLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 1,
  },
  seatValue: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  actionsFooter: {
    marginTop: 4,
  },
  viewTicketBtn: {
    backgroundColor: COLORS.brandPurple,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  viewTicketText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ripLineContainer: {
    position: "absolute",
    top: 180 - 12,
    left: 0,
    right: 0,
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  ripCircleLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f1faee",
    marginLeft: -12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  ripCircleRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f1faee",
    marginRight: -12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  ripLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
    marginHorizontal: 10,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.gray600,
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
  },
  exploreBtnText: {
    color: COLORS.brandPurple,
    fontWeight: "600",
  },
});

export default MyTicketsScreen;
