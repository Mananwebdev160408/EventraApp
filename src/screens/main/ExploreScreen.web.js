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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  MapPin,
  Users,
  Filter,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Music,
  Trophy,
  Tent,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
import { getEventImage, getStadiumImage } from "../../constants/assets";
import WebUserSidebar from "../../components/WebUserSidebar";

const ExploreScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const [activeTab, setActiveTab] = useState("Stadiums");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState([]);
  const [allStadiums, setAllStadiums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { name: "All", icon: Zap },
    { name: "Sports", icon: Trophy },
    { name: "Music", icon: Music },
    { name: "Festival", icon: Tent },
  ];

  useEffect(() => {
    fetchData();
  }, [activeCategory]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const eventParams = activeCategory !== "All" ? { category: activeCategory } : {};
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
          : eventsData?.events || eventsData?.data || []
      );
      setAllStadiums(
        Array.isArray(stadiumsData.content)
          ? stadiumsData.content
          : Array.isArray(stadiumsData)
          ? stadiumsData
          : stadiumsData?.stadiums || stadiumsData?.data || []
      );
    } catch (error) {
      console.error("Error fetching explore data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const query = (searchQuery || "").toLowerCase();

  const filteredEvents = allEvents.filter((event) => {
    const searchMatch = (event.name || event.title || "").toLowerCase().includes(query);
    return searchMatch;
  });

  const filteredStadiums = allStadiums.filter(
    (stadium) =>
      (stadium.name || "").toLowerCase().includes(query) ||
      (stadium.location || "").toLowerCase().includes(query)
  );

  const StadiumCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("StadiumDetails", { stadium: item })}
    >
      <Image source={getStadiumImage(item.id)} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <MapPin size={14} color="#64748b" />
          <Text style={styles.cardMetaText}>{item.location || item.city}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Users size={14} color="#64748b" />
          <Text style={styles.cardMetaText}>{item.capacity.toLocaleString()} Capacity</Text>
        </View>
        <TouchableOpacity style={styles.cardActionBtn}>
           <Text style={styles.cardActionText}>View Details</Text>
           <ChevronRight size={16} color={COLORS.brandPurple} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
    >
      <Image source={getEventImage(item.id)} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name || item.title}</Text>
        <View style={styles.cardMeta}>
          <MapPin size={14} color="#64748b" />
          <Text style={styles.cardMetaText}>{item.stadiumName || "Venue"}</Text>
        </View>
        <View style={styles.cardFooter}>
           <Text style={styles.cardPrice}>Starting ₹{item.minPrice || 499}</Text>
           <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category || "General"}</Text>
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Explore" />

      <View style={styles.mainContent}>
        {/* Header Section */}
        <View style={styles.topHeader}>
           <View>
              <Text style={styles.headerTitle}>Global Exploration</Text>
              <Text style={styles.headerSub}>Discover venues and events across the country</Text>
           </View>
           
           <View style={styles.headerActions}>
              <View style={styles.searchBox}>
                 <Search size={20} color="#94a3b8" />
                 <TextInput 
                  placeholder="Search for stadiums, cities, or events..." 
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                 />
              </View>
           </View>
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
           <View style={styles.contentPadding}>
              {/* Category & Tab Row */}
              <View style={styles.filterRow}>
                 <View style={styles.tabSwitcher}>
                    {["Stadiums", "Events"].map(tab => (
                      <TouchableOpacity 
                        key={tab} 
                        style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
                        onPress={() => setActiveTab(tab)}
                      >
                         <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{tab}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>

                 <View style={styles.categoryRow}>
                    {categories.map(cat => (
                      <TouchableOpacity 
                        key={cat.name} 
                        style={[styles.catChip, activeCategory === cat.name && styles.catChipActive]}
                        onPress={() => setActiveCategory(cat.name)}
                      >
                         <cat.icon size={16} color={activeCategory === cat.name ? "#fff" : "#64748b"} />
                         <Text style={[styles.catChipText, activeCategory === cat.name && styles.catChipTextActive]}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>
              </View>

              {isLoading ? (
                <View style={styles.loaderContainer}>
                   <ActivityIndicator size="large" color={COLORS.brandPurple} />
                   <Text style={styles.loaderText}>Syncing Global Database...</Text>
                </View>
              ) : (
                <View style={styles.grid}>
                   {activeTab === "Stadiums" ? (
                     filteredStadiums.length > 0 ? (
                        filteredStadiums.map(st => <StadiumCard key={st.id} item={st} />)
                     ) : (
                       <View style={styles.emptyState}>
                          <Text style={styles.emptyText}>No stadiums found matching "{searchQuery}"</Text>
                       </View>
                     )
                   ) : (
                     filteredEvents.length > 0 ? (
                        filteredEvents.map(ev => <EventCard key={ev.id} item={ev} />)
                     ) : (
                        <View style={styles.emptyState}>
                           <Text style={styles.emptyText}>No events found matching "{searchQuery}"</Text>
                        </View>
                     )
                   )}
                </View>
              )}
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
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    width: 400,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "500",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  tabBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: "#1d3557",
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  tabBtnTextActive: {
    color: "#fff",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 12,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  catChipActive: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
  },
  catChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  catChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -15,
  },
  gridCard: {
    width: "25%",
    padding: 15,
    marginBottom: 20,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
  },
  cardInfo: {
    paddingTop: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  cardMetaText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  cardActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#e63946",
  },
  categoryBadge: {
    backgroundColor: "rgba(29, 53, 87, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d3557",
    letterSpacing: 0.5,
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
    gap: 20,
  },
  loaderText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    paddingVertical: 100,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "600",
  }
});

export default ExploreScreen;
