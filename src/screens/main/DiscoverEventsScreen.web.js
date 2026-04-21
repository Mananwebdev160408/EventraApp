import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
  Trophy,
  Music,
  Tent,
  Zap,
  Clock,
  UserCircle,
  Menu as MenuIcon,
  Filter,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import {
  eventService,
  stadiumService,
  bookingService,
} from "../../api/services";
import { getEventImage, getStadiumImage } from "../../constants/assets";
import WebUserSidebar from "../../components/WebUserSidebar";

const DiscoverEventsScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const [activeCategory, setActiveCategory] = useState("All");
  const { userInfo } = useAuth();
  const { city } = useUser();
  const [events, setEvents] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingBooking, setUpcomingBooking] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [activeCategory]);

  const fetchInitialData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      let eventsData = [];
      let stadiumsData = [];
      let bookingsData = [];

      const params = activeCategory !== "All" ? { category: activeCategory } : {};
      const userId = userInfo?.uid || userInfo?.id;

      try {
        const evData = await eventService.getEvents(params);
        eventsData = evData;
      } catch (err) { console.error("Events fetch failed:", err); }

      try {
        const stData = await stadiumService.getAllStadiums();
        stadiumsData = stData;
      } catch (err) { console.error("Stadiums fetch failed:", err); }

      if (userId) {
        try {
          bookingsData = await bookingService.getUserBookings(userId);
        } catch (err) { console.error("Bookings fetch failed:", err); }
      }

      setEvents(Array.isArray(eventsData) ? eventsData : eventsData?.content || []);
      setStadiums(Array.isArray(stadiumsData) ? stadiumsData : stadiumsData?.content || []);

      const bookings = Array.isArray(bookingsData) ? bookingsData : bookingsData?.bookings || [];
      const now = new Date();
      const soonest = bookings
        .filter((b) => new Date(b.event?.datetime) > now)
        .sort((a, b) => new Date(a.event?.datetime) - new Date(b.event?.datetime))[0];

      if (soonest) {
        setUpcomingBooking({
          ...soonest.event,
          bookingId: soonest.id,
          date: soonest.event?.datetime,
        });
      } else {
        setUpcomingBooking(null);
      }
    } catch (error) {
      console.error("Error fetching discover page data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const categories = [
    { name: "All", icon: <Zap size={18} /> },
    { name: "Sports", icon: <Trophy size={18} /> },
    { name: "Music", icon: <Music size={18} /> },
    { name: "Festival", icon: <Tent size={18} /> },
  ];

  const searchMatchQuery = (searchQuery || "").toLowerCase();

  const getFilteredEvents = () => {
    let filtered = Array.isArray(events) ? events : [];
    if (searchMatchQuery) {
      filtered = filtered.filter(
        (event) =>
          (event.name || event.title || "").toLowerCase().includes(searchMatchQuery) ||
          (event.venue || (event.stadium && event.stadium.name) || "").toLowerCase().includes(searchMatchQuery)
      );
    }
    return filtered;
  };

  const filteredFeatured = getFilteredEvents().filter(e => e.isFeatured || e.tag === "FEATURED");
  const filteredUpcoming = getFilteredEvents().filter(e => !e.isFeatured);
  const filteredStadiums = stadiums.filter(
    (st) => (st.name || "").toLowerCase().includes(searchMatchQuery) || (st.location || "").toLowerCase().includes(searchMatchQuery)
  );

  const DesktopEventCard = ({ event, isFeatured }) => (
    <TouchableOpacity
      style={[styles.desktopEventCard, isFeatured && styles.desktopFeaturedCard]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
    >
      <Image source={getEventImage(event.id)} style={styles.desktopEventImage} />
      <LinearGradient
        colors={["transparent", "rgba(29, 53, 87, 0.95)"]}
        style={styles.desktopEventOverlay}
      >
        <View style={styles.desktopEventContent}>
          {isFeatured && (
            <View style={styles.featuredBadge}>
              <Sparkles size={12} color="#fff" />
              <Text style={styles.featuredBadgeText}>FEATURED</Text>
            </View>
          )}
          <Text style={styles.desktopEventTitle} numberOfLines={2}>{event.name || event.title}</Text>
          <View style={styles.desktopEventMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.metaText}>{event.datetime ? new Date(event.datetime).toLocaleDateString() : "TBA"}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.metaText}>{event.stadiumName || "Stadium"}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );



  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      
      {/* Sidebar - Desktop Only */}
      <WebUserSidebar navigation={navigation} activeNav="Discover" />

      {/* Main Content Area */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.desktopHeader}>
          <View style={styles.searchWrapper}>
            <Search size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Search for matches, concerts, or stadiums..." 
              style={styles.desktopSearchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.headerActions}>
            <View style={styles.cityBadge}>
              <MapPin size={14} color={COLORS.brandPurple} />
              <Text style={styles.cityText}>{city}</Text>
            </View>
            <TouchableOpacity style={styles.actionIcon}>
              <Bell size={22} color="#1d3557" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* Hero Banner / Upcoming Highlight */}
          {upcomingBooking ? (
            <LinearGradient colors={["#1d3557", "#457b9d"]} style={styles.desktopHeroBanner}>
              <View style={styles.heroBannerContent}>
                <View style={styles.heroTag}>
                  <Clock size={16} color="#fff" />
                  <Text style={styles.heroTagText}>UPCOMING EVENT</Text>
                </View>
                <Text style={styles.heroTitle}>{upcomingBooking.title}</Text>
                <Text style={styles.heroSubtitle}>Get ready! Your event starts soon at {upcomingBooking.stadiumName}.</Text>
                <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate("Ticket")}>
                  <Text style={styles.heroButtonText}>View Ticket</Text>
                  <ChevronRight size={18} color={COLORS.brandPurple} />
                </TouchableOpacity>
              </View>
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>24</Text>
                  <Text style={styles.heroStatLabel}>HOURS</Text>
                </View>
                <Text style={styles.heroStatDivider}>:</Text>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>45</Text>
                  <Text style={styles.heroStatLabel}>MINS</Text>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <LinearGradient colors={["#e63946", "#f1faee"]} start={{x:0, y:0}} end={{x:1, y:1}} style={styles.promoBanner}>
               <View style={styles.promoContent}>
                 <Text style={styles.promoTitle}>Experience More</Text>
                 <Text style={styles.promoSub}>Get exclusive early bird access to the year's biggest concerts and games.</Text>
                 <TouchableOpacity style={styles.promoBtn}>
                   <Text style={styles.promoBtnText}>Explore Events</Text>
                 </TouchableOpacity>
               </View>
               <Sparkles size={120} color="rgba(255,255,255,0.2)" style={styles.promoIcon} />
            </LinearGradient>
          )}

          {/* Featured Events Grid */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleText}>Featured Events</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
          </View>
          
          <View style={styles.desktopGrid}>
            {filteredFeatured.map(event => (
              <DesktopEventCard key={event.id} event={event} isFeatured />
            ))}
          </View>

          {/* Upcoming Events Grid */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleText}>Upcoming Events</Text>
            <View style={styles.filterRow}>
               <Filter size={16} color="#64748b" />
               <Text style={styles.filterText}>Sort by Date</Text>
            </View>
          </View>
          
          <View style={styles.desktopGrid}>
            {filteredUpcoming.slice(0, 8).map(event => (
              <DesktopEventCard key={event.id} event={event} />
            ))}
          </View>

          {/* Top Stadiums */}
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitleText}>Popular Stadiums</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stadiumDesktopScroll}>
             {filteredStadiums.map(stadium => (
               <TouchableOpacity 
                key={stadium.id} 
                style={styles.stadiumDesktopCard}
                onPress={() => navigation.navigate("StadiumDetails", { stadium })}
               >
                 <Image source={getStadiumImage(stadium.id)} style={styles.stadiumDesktopImg} />
                 <View style={styles.stadiumDesktopInfo}>
                    <Text style={styles.stadiumDesktopName}>{stadium.name}</Text>
                    <View style={styles.stadiumDesktopMeta}>
                      <MapPin size={12} color="#94a3b8" />
                      <Text style={styles.stadiumDesktopLoc}>{stadium.location}</Text>
                    </View>
                 </View>
               </TouchableOpacity>
             ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: 280,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    padding: 32,
    justifyContent: "space-between",
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
    flex: 1,
  },
  sidebarLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  sidebarLinkActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1d3557",
    marginBottom: 4,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  sidebarCategoryActive: {
    backgroundColor: "rgba(230, 57, 70, 0.05)",
  },
  sidebarCategoryTextActive: {
    color: COLORS.brandPurple,
    fontWeight: "700",
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
  mainContent: {
    flex: 1,
  },
  desktopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 48,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 500,
    height: 52,
  },
  desktopSearchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  cityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cityText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  notificationDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: "#fff",
  },
  contentPadding: {
    padding: 48,
  },
  desktopHeroBanner: {
    borderRadius: 32,
    padding: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  heroBannerContent: {
    flex: 1,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heroTagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 500,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: "flex-start",
    gap: 12,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.brandPurple,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 32,
    borderRadius: 24,
  },
  heroStatItem: {
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
  },
  heroStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "800",
    marginTop: 4,
  },
  heroStatDivider: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  sectionTitleText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    color: COLORS.brandPurple,
    fontWeight: "700",
  },
  desktopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -12,
    marginBottom: 40,
  },
  desktopEventCard: {
    width: "25%",
    padding: 12,
    height: 320,
  },
  desktopFeaturedCard: {
    width: "50%",
    height: 320,
  },
  desktopEventImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  desktopEventOverlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    height: "60%",
    borderRadius: 24,
    justifyContent: "flex-end",
    padding: 24,
  },
  desktopEventContent: {
    width: "100%",
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  desktopEventTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    lineHeight: 28,
  },
  desktopEventMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  promoBanner: {
    borderRadius: 32,
    height: 240,
    padding: 48,
    justifyContent: "center",
    marginBottom: 48,
    overflow: "hidden",
  },
  promoContent: {
    zIndex: 2,
  },
  promoTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  promoSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 400,
    marginBottom: 24,
  },
  promoBtn: {
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  promoBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  promoIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  stadiumDesktopScroll: {
    gap: 24,
    paddingBottom: 24,
  },
  stadiumDesktopCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderColor: "#f1f5f9",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
  },
  stadiumDesktopImg: {
    width: "100%",
    height: 160,
  },
  stadiumDesktopInfo: {
    padding: 20,
  },
  stadiumDesktopName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 8,
  },
  stadiumDesktopMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stadiumDesktopLoc: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  filterText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
});

export default DiscoverEventsScreen;
