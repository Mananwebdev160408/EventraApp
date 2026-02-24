import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  ShoppingBag,
  Search,
  Star,
  Clock,
  Utensils,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { restaurantService } from "../../api/services";

const FoodOrderingScreen = ({ navigation, route }) => {
  const { eventId, stadiumId } = route.params || {};
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const categories = ["All Items", "Snacks", "Drinks", "Meals", "Desserts"];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await restaurantService.getAllRestaurants();
      // Map backend data to UI format
      const formattedVendors = (Array.isArray(data) ? data : []).map((v) => ({
        id: v.id,
        name: v.name,
        rating: v.rating || "4.5",
        time: "15-20 min",
        description: "Fresh stadium food at your seat",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", // Default placeholder
      }));
      setVendors(formattedVendors);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchVendors(false);
  };

  const renderVendor = ({ item }) => (
    <View style={styles.vendorCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.vendorImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Star size={12} color="#facc15" fill="#facc15" />
            <Text style={styles.badgeText}>{item.rating}</Text>
          </View>
          <View style={styles.badge}>
            <Clock size={12} color={COLORS.white} />
            <Text style={styles.badgeText}>{item.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.vendorInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <Text style={styles.vendorDesc}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewMenuButton}
          onPress={() =>
            navigation.navigate("Menu", {
              restaurantId: item.id,
              restaurantName: item.name,
              eventId: eventId,
              stadiumId: stadiumId,
            })
          }
        >
          <Text style={styles.viewMenuText}>View Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Food & Drinks</Text>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("Cart")}
            >
              <ShoppingBag size={20} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search
              size={20}
              color="rgba(159, 67, 234, 0.6)"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search vendors or menu items..."
              placeholderTextColor="rgba(159, 67, 234, 0.4)"
              style={styles.searchInput}
            />
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    activeCategory === item && styles.categoryChipActive,
                  ]}
                  onPress={() => setActiveCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      activeCategory === item && styles.categoryTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.categoryList}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmH2K0hrsOfz81y1Ywtei0NbmHMhzYJUFbsewUaB5rFT-Hc4MUUNWej68r0_97l-mtKkjvasf5EDveil_RBwU0bYF6ZgxlXxODFMziaO8NrV_hEzEJtvmzCVTgByGWezNw7-Q5Uo574wpGneyf6gzZjrm3Z_k371jO8fIA4mPgFCUKAgasEi7S2Jq83z9MDzAgjAAYrfQqSiNgOBsmA1C6XJwNNQTeenxd0SwhsYq0ji9mZDW1eQvkl0FAqiTe8Bp4TNv3zYKCSDQ",
              }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTag}>MATCH DAY SPECIAL</Text>
              <Text style={styles.bannerTitle}>
                20% Off All{"\n"}Family Platters
              </Text>
            </View>
          </View>

          {/* Popular Vendors */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Vendors</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={styles.seeAllText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {isLoading && !isRefreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.brandPurple} />
              <Text style={styles.loadingText}>
                Finding best food for you...
              </Text>
            </View>
          ) : (
            <View style={styles.vendorsList}>
              {vendors.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Utensils size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={styles.emptyText}>
                    No vendors available right now
                  </Text>
                </View>
              ) : (
                vendors.map((vendor) => (
                  <View key={vendor.id}>{renderVendor({ item: vendor })}</View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // stadium-purple
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandPurple,
    borderWidth: 2,
    borderColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  categoryList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    color: "#a8dadc", // primary-200
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  banner: {
    height: 128,
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 32,
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "linear-gradient(to right, #9e4fde, transparent)", // Simplified for RN: just background color with opacity or gradient component required. Using semi-transparent fill for now.
    backgroundColor: "rgba(230, 57, 70, 0.6)",
  },
  bannerContent: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: "600",
  },
  vendorsList: {
    paddingHorizontal: 24,
    gap: 24,
  },
  vendorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  imageContainer: {
    height: 220,
    position: "relative",
  },
  vendorImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  badgesContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(30, 30, 30, 0.75)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },
  vendorInfo: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vendorName: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  vendorDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  viewMenuButton: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  viewMenuText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 16,
    color: COLORS.white,
    fontSize: 14,
    textAlign: "center",
  },
});

export default FoodOrderingScreen;
