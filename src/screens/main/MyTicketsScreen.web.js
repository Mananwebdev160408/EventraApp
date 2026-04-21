import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket as TicketIcon,
  ChevronRight,
  Search,
  History,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { bookingService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import WebUserSidebar from "../../components/WebUserSidebar";

const MyTicketsScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const userId = userInfo?.uid || userInfo?.id;
      const data = userId ? await bookingService.getUserBookings(userId) : [];
      setBookings(Array.isArray(data) ? data : data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      // Mock fallback for demonstration
      setBookings((current) => {
        const mockTicket = {
          id: "MOCK-TKT-789",
          ticketType: "VIP GOLD",
          status: "Confirmed",
          event: {
            id: "mock-event-123",
            name: "IPL 2026: MI vs CSK",
            datetime: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
            stadiumName: "Wankhede Stadium",
            location: "Mumbai, India",
          },
          seats: [{ row: "12", seatNumber: "45" }],
        };
        if (!current.find((b) => b.id === mockTicket.id)) return [mockTicket, ...current];
        return current;
      });
      setIsLoading(false);
    }
  };

  const filteredTickets = bookings.filter((t) => {
    const isPast = new Date(t.event?.datetime) < new Date();
    return activeTab === "upcoming" ? !isPast : isPast;
  });

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="MyEvents" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.pageTitle}>My Tickets</Text>
            <Text style={styles.pageSubtitle}>Manage your upcoming events and view past history</Text>
          </View>
          
          <View style={styles.headerActions}>
            <View style={styles.searchBar}>
              <Search size={18} color="#94a3b8" />
              <Text style={styles.searchText}>Search tickets...</Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchBookings}>
              <History size={20} color="#1d3557" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>Upcoming Events</Text>
            {activeTab === "upcoming" && <View style={styles.tabDot} />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "past" && styles.activeTab]}
            onPress={() => setActiveTab("past")}
          >
            <Text style={[styles.tabText, activeTab === "past" && styles.activeTabText]}>Past History</Text>
            {activeTab === "past" && <View style={styles.tabDot} />}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.ticketsGrid} showsVerticalScrollIndicator={false}>
            {filteredTickets.map((ticket) => (
              <TouchableOpacity 
                key={ticket.id} 
                style={styles.ticketCard}
                onPress={() => navigation.navigate("Ticket", { bookingId: ticket.id })}
              >
                <View style={styles.ticketImageArea}>
                  <Image source={{ uri: ticket.event?.image }} style={styles.ticketImage} />
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{ticket.status || "CONFIRMED"}</Text>
                  </View>
                </View>
                
                <div style={styles.ticketInfoArea}>
                  <Text style={styles.ticketType}>{ticket.ticketType}</Text>
                  <Text style={styles.eventTitle}>{ticket.event?.name}</Text>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MapPin size={16} color="#64748b" />
                      <Text style={styles.metaText}>{ticket.event?.stadiumName}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Calendar size={16} color="#64748b" />
                      <Text style={styles.metaText}>{new Date(ticket.event?.datetime).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={16} color="#64748b" />
                      <Text style={styles.metaText}>{new Date(ticket.event?.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.seatInfo}>
                      <Text style={styles.seatLabel}>SEAT</Text>
                      <Text style={styles.seatValue}>{ticket.seats[0]?.row}{ticket.seats[0]?.seatNumber}</Text>
                    </View>
                    <View style={styles.viewAction}>
                      <Text style={styles.viewText}>View Ticket</Text>
                      <ChevronRight size={18} color="#1d3557" />
                    </View>
                  </View>
                </div>
              </TouchableOpacity>
            ))}
            
            {filteredTickets.length === 0 && (
              <View style={styles.emptyState}>
                <TicketIcon size={64} color="#e2e8f0" />
                <Text style={styles.emptyTitle}>No tickets found</Text>
                <Text style={styles.emptySubtitle}>You don't have any tickets in this category yet.</Text>
                <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate("Discover")}>
                  <Text style={styles.browseText}>Browse Events</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
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
    padding: 60,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 48,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: 300,
  },
  searchText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  refreshBtn: {
    width: 52,
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tabContainer: {
    flexDirection: "row",
    gap: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 40,
  },
  tab: {
    paddingBottom: 20,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
  },
  activeTabText: {
    color: "#1d3557",
    fontWeight: "800",
  },
  tabDot: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#1d3557",
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 32,
  },
  ticketCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.03)",
  },
  ticketImageArea: {
    height: 200,
    position: "relative",
  },
  ticketImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#1d3557",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  ticketInfoArea: {
    padding: 32,
  },
  ticketType: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brandPurple,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 20,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  cardFooter: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seatInfo: {
    gap: 4,
  },
  seatLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  seatValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
  },
  viewAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  emptyState: {
    flex: 1,
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    marginTop: 24,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: "#1d3557",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  browseText: {
    color: "#fff",
    fontWeight: "800",
  },
});

export default MyTicketsScreen;
