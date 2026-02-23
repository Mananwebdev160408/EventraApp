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
  FlatList,
  ActivityIndicator,
  RefreshControl,
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
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import {
  USERS,
  FEATURED_EVENTS,
  UPCOMING_EVENTS,
  STADIUMS,
  MY_REGISTRATIONS,
} from "../../constants/mocks";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import {
  eventService,
  stadiumService,
  bookingService,
} from "../../api/services";
import { getEventImage, getStadiumImage } from "../../constants/assets";

const { width } = Dimensions.get("window");

const formatEventDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(
      dateString.includes(" ") ? dateString.replace(" ", "T") : dateString,
    );
    if (isNaN(date.getTime())) return dateString;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${dayName}, ${monthName} ${day} • ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return dateString;
  }
};

const DiscoverEventsScreen = ({ navigation }) => {
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

      const params =
        activeCategory !== "All" ? { category: activeCategory } : {};

      console.log("Fetching Initial Data - Params:", params);
      console.log("User Info ID:", userInfo?.id);

      try {
        const evData = await eventService.getEvents(params);
        eventsData = evData;

        console.log("Events fetched successfully");
      } catch (err) {
        console.error("Events fetch failed:", err);
      }

      try {
        const stData = await stadiumService.getAllStadiums();
        stadiumsData = stData;
        console.log("Stadiums fetched successfully");
      } catch (err) {
        console.error("Stadiums fetch failed:", err);
      }

      if (userInfo?.id) {
        try {
          bookingsData = await bookingService.getUserBookings(userInfo.id);
          console.log("User bookings fetched successfully");
        } catch (err) {
          console.error("Bookings fetch failed (non-critical):", err);
        }
      }

      setEvents(
        Array.isArray(eventsData.content)
          ? eventsData.content
          : Array.isArray(eventsData)
            ? eventsData
            : eventsData?.events || eventsData?.data || [],
      );
      setStadiums(
        Array.isArray(stadiumsData.content)
          ? stadiumsData.content
          : Array.isArray(stadiumsData)
            ? stadiumsData
            : stadiumsData?.stadiums || stadiumsData?.data || [],
      );

      // Find soonest upcoming event
      const bookings = Array.isArray(bookingsData)
        ? bookingsData
        : bookingsData?.bookings || [];
      const now = new Date();

      const soonest = bookings
        .filter((b) => {
          const eventDate = new Date(b.event?.date || b.date);
          return eventDate > now;
        })
        .sort((a, b) => {
          const dateA = new Date(a.event?.date || a.date);
          const dateB = new Date(b.event?.date || b.date);
          return dateA - dateB;
        })[0];

      if (soonest) {
        setUpcomingBooking({
          ...soonest.event,
          bookingId: soonest.id,
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

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchInitialData(false);
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!upcomingBooking) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate = new Date(upcomingBooking.date || upcomingBooking.time);

    // If invalid date, return
    if (isNaN(targetDate.getTime())) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Optionally refresh to clear the card
        fetchInitialData(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingBooking]);

  const CountdownItem = ({ value, label }) => (
    <View style={styles.countdownItem}>
      <View style={styles.countdownBox}>
        <Text style={styles.countdownValue}>
          {value < 10 ? `0${value}` : value}
        </Text>
      </View>
      <Text style={styles.countdownLabel}>{label}</Text>
    </View>
  );

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
          (event.name || event.title || "")
            .toLowerCase()
            .includes(searchMatchQuery) ||
          (event.venue || (event.stadium && event.stadium.name) || "")
            .toLowerCase()
            .includes(searchMatchQuery),
      );
    }
    return filtered;
  };

  const filteredFeatured = getFilteredEvents().filter(
    (event) => event.isFeatured || event.tag === "FEATURED",
  );

  const filteredUpcoming = getFilteredEvents().filter(
    (event) => !event.isFeatured,
  );

  const filteredStadiums = stadiums.filter(
    (stadium) =>
      (stadium.name || "").toLowerCase().includes(searchMatchQuery) ||
      (stadium.location || "").toLowerCase().includes(searchMatchQuery),
  );

  const FeaturedEventCard = ({ event }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      activeOpacity={0.95}
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
    >
      <Image source={getEventImage(event.id)} style={styles.featuredImage} />
      <LinearGradient
        colors={["transparent", "rgba(29, 53, 87, 0.9)"]}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredTag}>
          <Sparkles size={12} color="#FFFFFF" />
          <Text style={styles.featuredTagText}>{event.tag || "FEATURED"}</Text>
        </View>
        <Text style={styles.featuredTitle}>{event.name || event.title}</Text>
        <View style={styles.featuredMeta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>
              {formatEventDate(event.dateTime || event.datetime || event.date)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{event.venue || "Stadium"}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Dynamic Background Header */}
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={["#f1faee", "#a8dadc"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={styles.avatarBorder}
              >
                <View style={styles.avatarInnerHeader}>
                  <UserCircle size={38} color="#1d3557" strokeWidth={1.5} />
                </View>
              </TouchableOpacity>
              <View>
                <View style={styles.locationRow}>
                  <MapPin size={10} color="#457b9d" />
                  <Text style={styles.greeting}>{city.toUpperCase()}</Text>
                </View>
                <Text style={styles.userName}>
                  {userInfo?.firstname || userInfo?.firstName
                    ? `${userInfo.firstname || userInfo.firstName} ${userInfo.lastname || userInfo.lastName || ""}`.trim()
                    : userInfo?.name || userInfo?.username || "User"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Bell size={22} color="#1d3557" />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={COLORS.gray500} />
              <TextInput
                placeholder="Find matches, concerts..."
                style={styles.searchInput}
                placeholderTextColor={COLORS.gray500}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={COLORS.brandPurple} />
          <Text style={styles.loadingText}>Fetching events...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBody}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {/* Category Chips */}
          <View style={styles.categorySection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setActiveCategory(cat.name)}
                  style={[
                    styles.categoryChip,
                    activeCategory === cat.name && styles.categoryChipActive,
                  ]}
                >
                  {React.cloneElement(cat.icon, {
                    color: activeCategory === cat.name ? "#FFFFFF" : "#1d3557",
                  })}
                  <Text
                    style={[
                      styles.categoryText,
                      activeCategory === cat.name && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Event Countdown */}
          {upcomingBooking && (
            <View style={styles.countdownContainer}>
              <LinearGradient
                colors={["#ffffff", "#f8fafc"]}
                style={styles.countdownCard}
              >
                <View style={styles.countdownHeader}>
                  <Clock size={16} color={COLORS.brandPurple} />
                  <Text style={styles.countdownTitle}>YOUR NEXT EVENT IN</Text>
                </View>
                <View style={styles.countdownRow}>
                  <CountdownItem value={timeLeft.days} label="DAYS" />
                  <Text style={styles.countdownSeparator}>:</Text>
                  <CountdownItem value={timeLeft.hours} label="HOURS" />
                  <Text style={styles.countdownSeparator}>:</Text>
                  <CountdownItem value={timeLeft.minutes} label="MINS" />
                  <Text style={styles.countdownSeparator}>:</Text>
                  <CountdownItem value={timeLeft.seconds} label="SECS" />
                </View>
                <Text style={styles.registeredEventTitle}>
                  {upcomingBooking.title}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Featured Events Carousel */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {filteredFeatured.length > 0 ? (
            <FlatList
              horizontal
              data={filteredFeatured}
              renderItem={({ item }) => <FeaturedEventCard event={item} />}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width * 0.85 + 24}
              decelerationRate="fast"
              contentContainerStyle={styles.featuredList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                There is no featured event available
              </Text>
            </View>
          )}

          {/* Upcoming Events Section (New) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>

          {filteredUpcoming.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {filteredUpcoming.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.upcomingMiniCard}
                  onPress={() =>
                    navigation.navigate("EventDetails", { eventId: event.id })
                  }
                >
                  <Image
                    source={getEventImage(event.id)}
                    style={styles.upcomingImage}
                  />
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle} numberOfLines={1}>
                      {event.name || event.title}
                    </Text>
                    <Text style={styles.upcomingDate}>
                      {formatEventDate(
                        event.dateTime || event.datetime || event.date,
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>There is no event available</Text>
            </View>
          )}

          {/* Stadium Previews */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Stadiums</Text>
          </View>

          {filteredStadiums.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stadiumScroll}
            >
              {filteredStadiums.map((stadium) => (
                <TouchableOpacity
                  key={stadium.id || stadium.name}
                  style={styles.stadiumMini}
                  onPress={() =>
                    navigation.navigate("StadiumDetails", { stadium })
                  }
                >
                  <Image
                    source={getStadiumImage(stadium.id)}
                    style={styles.stadiumImg}
                  />
                  <View style={styles.stadiumInfo}>
                    <Text style={styles.stadiumName} numberOfLines={1}>
                      {stadium.name}
                    </Text>
                    <View style={styles.stadiumMeta}>
                      <MapPin size={10} color={COLORS.gray500} />
                      <Text style={styles.stadiumLoc}>
                        {stadium.location ||
                          `${stadium.city || ""}${stadium.city && stadium.state ? ", " : ""}${stadium.state || ""}${(stadium.city || stadium.state) && stadium.country ? ", " : ""}${stadium.country || ""}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No stadiums available</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerBackground: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerSafeArea: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInnerHeader: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#f1faee",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  greeting: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "600",
  },
  userName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e63946",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  searchContainer: {
    marginTop: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "500",
  },
  scrollBody: {
    paddingBottom: 40,
  },
  categorySection: {
    marginTop: 24,
  },
  categoryScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: "#f1f3f5",
    gap: 10,
  },
  categoryChipActive: {
    backgroundColor: "#1d3557",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 13,
    color: "#457b9d",
    fontWeight: "700",
  },
  featuredList: {
    paddingHorizontal: 24,
    gap: 24,
  },
  featuredCard: {
    width: width * 0.85,
    height: 260,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 28,
    justifyContent: "flex-end",
  },
  featuredTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  featuredTagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  metaText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },

  stadiumScroll: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 24,
  },
  stadiumMini: {
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  stadiumImg: {
    width: "100%",
    height: 110,
  },
  stadiumInfo: {
    padding: 16,
  },
  stadiumName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 6,
  },
  stadiumMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  stadiumLoc: {
    fontSize: 11,
    color: "#457b9d",
    fontWeight: "600",
    marginLeft: 6,
  },
  upcomingMiniCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  upcomingImage: {
    width: "100%",
    height: 130,
    borderRadius: 20,
    marginBottom: 12,
  },
  upcomingInfo: {
    paddingHorizontal: 4,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  upcomingDate: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "700",
    opacity: 0.8,
  },
  countdownContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  countdownCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(123, 44, 191, 0.1)",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  countdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  countdownTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.brandPurple,
    letterSpacing: 1.5,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countdownItem: {
    alignItems: "center",
    width: 60,
  },
  countdownBox: {
    backgroundColor: "#1d3557",
    width: "100%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  countdownValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.gray500,
    letterSpacing: 0.5,
  },
  countdownSeparator: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 20,
  },
  registeredEventTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
    opacity: 0.8,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "rgba(29, 53, 87, 0.03)",
    marginHorizontal: 24,
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "500",
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "600",
  },
});

export default DiscoverEventsScreen;
