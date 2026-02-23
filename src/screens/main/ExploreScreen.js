import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Star,
  Users,
} from "lucide-react-native";
import { COLORS, SIZES } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
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

const ExploreScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Stadiums");
  const [eventFilter, setEventFilter] = useState("upcoming"); // 'upcoming' or 'ongoing'
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [allStadiums, setAllStadiums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Sports", "Music", "Festival"];

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const eventParams =
        activeCategory !== "All" ? { category: activeCategory } : {};
      let eventsData = [];
      let stadiumsData = [];

      try {
        eventsData = await eventService.getEvents(eventParams);
      } catch (err) {
        console.error("Explore - Events fetch failed:", err);
      }

      try {
        stadiumsData = await stadiumService.getAllStadiums();
      } catch (err) {
        console.error("Explore - Stadiums fetch failed:", err);
      }

      setAllEvents(
        Array.isArray(eventsData.content)
          ? eventsData.content
          : Array.isArray(eventsData)
            ? eventsData
            : eventsData?.events || eventsData?.data || [],
      );
      setAllStadiums(
        Array.isArray(stadiumsData.content)
          ? stadiumsData.content
          : Array.isArray(stadiumsData)
            ? stadiumsData
            : stadiumsData?.stadiums || stadiumsData?.data || [],
      );
    } catch (error) {
      console.error("Error fetching explore data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const query = (searchQuery || "").toLowerCase();

  const filteredEvents = allEvents.filter((event) => {
    const statusMatch =
      eventFilter === "ongoing"
        ? event.status === "ongoing"
        : event.status !== "ongoing";
    const searchMatch = (event.name || event.title || "")
      .toLowerCase()
      .includes(query);
    return statusMatch && searchMatch;
  });

  const filteredStadiums = allStadiums.filter(
    (stadium) =>
      (stadium.name || "").toLowerCase().includes(query) ||
      (stadium.location || "").toLowerCase().includes(query),
  );

  const renderStadiumItem = ({ item }) => (
    <TouchableOpacity
      style={styles.stadiumCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("StadiumDetails", { stadium: item })}
    >
      <Image source={getStadiumImage(item.id)} style={styles.stadiumImage} />
      <View style={styles.stadiumInfo}>
        <View style={styles.stadiumHeader}>
          <Text style={styles.stadiumName}>{item.name}</Text>
        </View>
        <View style={styles.stadiumMeta}>
          <View style={styles.metaItem}>
            <MapPin size={14} color={COLORS.gray500} />
            <Text style={styles.metaText}>
              {item.location ||
                `${item.city || ""}${item.city && item.state ? ", " : ""}${item.state || ""}${(item.city || item.state) && item.country ? ", " : ""}${item.country || ""}`}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={COLORS.gray500} />
            <Text style={styles.metaText}>{item.capacity}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
    >
      <Image source={getEventImage(item.id)} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.name || item.title}</Text>
        <Text style={styles.eventTime}>
          {formatEventDate(item.dateTime || item.time || item.date)}
        </Text>
        <View style={styles.eventFooter}>
          <Text style={styles.eventPrice}>
            {item.minPrice ? `₹${item.minPrice}` : item.price}
          </Text>
          {item.status === "ongoing" && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.gray500} />
            <TextInput
              placeholder="Search stadiums or events..."
              style={styles.searchInput}
              placeholderTextColor={COLORS.gray500}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.tabContainer}>
          {["Stadiums", "Events"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "Events" && (
          <View>
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  eventFilter === "upcoming" && styles.activeFilter,
                ]}
                onPress={() => setEventFilter("upcoming")}
              >
                <Text
                  style={[
                    styles.filterText,
                    eventFilter === "upcoming" && styles.activeFilterText,
                  ]}
                >
                  Upcoming
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  eventFilter === "ongoing" && styles.activeFilter,
                ]}
                onPress={() => setEventFilter("ongoing")}
              >
                <Text
                  style={[
                    styles.filterText,
                    eventFilter === "ongoing" && styles.activeFilterText,
                  ]}
                >
                  Ongoing
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    activeCategory === cat && styles.activeCategoryChip,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      activeCategory === cat && styles.activeCategoryChipText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === "Stadiums" ? (
              filteredStadiums.length > 0 ? (
                filteredStadiums.map((stadium) => (
                  <View
                    key={stadium.id || stadium.name}
                    style={styles.listItem}
                  >
                    {renderStadiumItem({ item: stadium })}
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No stadiums found matching your search.
                  </Text>
                </View>
              )
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <View key={event.id} style={styles.listItem}>
                  {renderEventItem({ item: event })}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No events found matching your filter.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1d3557",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E9ECEF",
  },
  activeTab: {
    backgroundColor: "#1d3557",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#495057",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  activeFilter: {
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    borderColor: "#1d3557",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C757D",
  },
  activeFilterText: {
    color: "#1d3557",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listItem: {
    marginBottom: 20,
  },
  stadiumCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  stadiumImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F3F5",
  },
  stadiumInfo: {
    padding: 20,
  },
  stadiumHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stadiumName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  stadiumMeta: {
    flexDirection: "row",
    gap: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: "#457b9d",
    fontWeight: "600",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  eventImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: "#F1F3F5",
  },
  eventInfo: {
    flex: 1,
    marginLeft: 18,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 6,
  },
  eventTime: {
    fontSize: 13,
    color: "#457b9d",
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.8,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#e63946",
  },
  liveBadge: {
    backgroundColor: "#e63946",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
  },
  activeCategoryChip: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C757D",
  },
  activeCategoryChipText: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default ExploreScreen;
