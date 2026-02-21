import React, { useState } from "react";
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
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import {
  USERS,
  FEATURED_EVENTS,
  UPCOMING_EVENTS,
  STADIUMS,
} from "../../constants/mocks";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const DiscoverEventsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { name: "All", icon: <Zap size={18} /> },
    { name: "Sports", icon: <Trophy size={18} /> },
    { name: "Music", icon: <Music size={18} /> },
    { name: "Festival", icon: <Tent size={18} /> },
  ];

  const filteredFeatured = FEATURED_EVENTS.filter(
    (event) => activeCategory === "All" || event.category === activeCategory,
  );

  const filteredUpcoming = UPCOMING_EVENTS.filter(
    (event) => activeCategory === "All" || event.category === activeCategory,
  );

  const FeaturedEventCard = ({ event }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      activeOpacity={0.95}
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
    >
      <Image source={{ uri: event.image }} style={styles.featuredImage} />
      <LinearGradient
        colors={["transparent", "rgba(29, 53, 87, 0.9)"]}
        style={styles.featuredOverlay}
      >
        <View style={styles.featuredTag}>
          <Sparkles size={12} color="#FFFFFF" />
          <Text style={styles.featuredTagText}>{event.tag}</Text>
        </View>
        <Text style={styles.featuredTitle}>{event.title}</Text>
        <View style={styles.featuredMeta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{event.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{event.venue}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ExperienceCard = ({ title, subtitle, image, accent }) => (
    <TouchableOpacity style={styles.expCard} activeOpacity={0.9}>
      <Image source={{ uri: image }} style={styles.expImage} />
      <View style={[styles.expAccent, { backgroundColor: accent }]} />
      <View style={styles.expContent}>
        <Text style={styles.expTitle}>{title}</Text>
        <Text style={styles.expSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.expBtn}>
        <ChevronRight size={20} color="#1d3557" />
      </TouchableOpacity>
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
                <Image
                  source={{ uri: USERS.currentUser.avatar }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.greeting}>Hello, Explorer</Text>
                <Text style={styles.userName}>
                  {USERS.currentUser.name.split(" ")[0]}
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
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
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

        {/* Featured Events Carousel */}
        {filteredFeatured.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Events</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

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
          </>
        )}

        {/* Upcoming Events Section (New) */}
        {filteredUpcoming.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
            </View>
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
                    source={{ uri: event.image }}
                    style={styles.upcomingImage}
                  />
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text style={styles.upcomingDate}>{event.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Explore Experiences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exclusive Experiences</Text>
        </View>

        <View style={styles.expContainer}>
          <ExperienceCard
            title="VIP Luxury"
            subtitle="Premium lounge access"
            image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"
            accent="#e63946"
          />
          <ExperienceCard
            title="Fan Zones"
            subtitle="Vibrant match atmosphere"
            image="https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800"
            accent="#457b9d"
          />
        </View>

        {/* Stadium Previews */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Stadiums</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stadiumScroll}
        >
          {STADIUMS.map((stadium) => (
            <TouchableOpacity
              key={stadium.id}
              style={styles.stadiumMini}
              onPress={() => navigation.navigate("StadiumDetails", { stadium })}
            >
              <Image
                source={{ uri: stadium.image }}
                style={styles.stadiumImg}
              />
              <View style={styles.stadiumInfo}>
                <Text style={styles.stadiumName} numberOfLines={1}>
                  {stadium.name}
                </Text>
                <View style={styles.stadiumMeta}>
                  <MapPin size={10} color={COLORS.gray500} />
                  <Text style={styles.stadiumLoc}>{stadium.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
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
  avatarBorder: {
    padding: 2,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
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
  expContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  expCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  expImage: {
    width: 72,
    height: 72,
    borderRadius: 22,
  },
  expAccent: {
    position: "absolute",
    left: 0,
    top: 24,
    bottom: 24,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  expContent: {
    flex: 1,
    marginLeft: 20,
  },
  expTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  expSubtitle: {
    fontSize: 13,
    color: "#457b9d",
    fontWeight: "600",
    opacity: 0.8,
  },
  expBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f3f5",
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
});

export default DiscoverEventsScreen;
