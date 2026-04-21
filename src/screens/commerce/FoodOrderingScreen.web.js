import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  ShoppingBag,
  Search,
  Star,
  Clock,
  Utensils,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { restaurantService } from "../../api/services";
import WebUserSidebar from "../../components/WebUserSidebar";

const FoodOrderingScreen = ({ navigation, route }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { eventId, stadiumId } = route.params || {};
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categories = ["All Items", "Snacks", "Drinks", "Meals", "Desserts"];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantService.getAllRestaurants();
      const formattedVendors = (Array.isArray(data) ? data : []).map((v) => ({
        id: v.id,
        name: v.name,
        rating: v.rating || "4.5",
        time: "15-20 min",
        description: v.description || "Fresh stadium food at your seat",
        image: v.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      }));
      
      if (formattedVendors.length === 0) {
        setVendors([
          { id: "m-food-1", name: "Wankhede Snacks Corner", rating: "4.8", time: "10-15 min", description: "Classic Vada Pav, Samosas and Chai", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
          { id: "m-food-2", name: "Pizza Arena", rating: "4.2", time: "20-25 min", description: "Hot wood-fired pizzas delivered to seat", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
          { id: "m-food-3", name: "Cool sips & More", rating: "4.5", time: "5-10 min", description: "Chilled beverages and soft drinks", image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?w=400&h=300&fit=crop" },
          { id: "m-food-4", name: "Stadium Grill", rating: "4.6", time: "15-20 min", description: "Premium burgers and grilled wraps", image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=400&h=300&fit=crop" },
        ]);
      } else {
        setVendors(formattedVendors);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const VendorCard = ({ item }) => (
    <TouchableOpacity 
        style={styles.vendorCard}
        onPress={() => navigation.navigate("Menu", { restaurantId: item.id, restaurantName: item.name })}
    >
      <View style={styles.vendorImgWrapper}>
        <Image source={{ uri: item.image }} style={styles.vendorImg} />
        <View style={styles.vendorRatingBadge}>
           <Star size={12} color="#fff" fill="#fff" />
           <Text style={styles.vendorRatingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.vendorInfo}>
         <Text style={styles.vendorName}>{item.name}</Text>
         <Text style={styles.vendorDesc} numberOfLines={2}>{item.description}</Text>
         <View style={styles.vendorMeta}>
            <View style={styles.metaBadge}>
               <Clock size={14} color="#64748b" />
               <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
               <Text style={styles.menuBtnText}>View Menu</Text>
               <ChevronRight size={16} color={COLORS.brandPurple} />
            </TouchableOpacity>
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Dashboard" />

      <View style={styles.mainContent}>
        {/* Header Section */}
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>In-Seat Dining</Text>
                 <Text style={styles.headerSub}>Order from top vendors, we'll deliver to your seat</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <View style={styles.searchBox}>
                 <Search size={20} color="#94a3b8" />
                 <TextInput placeholder="Search for food or vendors..." style={styles.searchInput} />
              </View>
              <TouchableOpacity style={styles.cartHeaderBtn} onPress={() => navigation.navigate("Cart")}>
                 <ShoppingBag size={22} color="#1d3557" />
                 <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>2</Text></View>
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
           <View style={styles.contentPadding}>
              {/* Promo Banner */}
              <View style={styles.promoBanner}>
                 <View style={styles.promoContent}>
                    <View style={styles.promoTag}>
                       <Sparkles size={16} color="#fff" />
                       <Text style={styles.promoTagText}>PREMIUM OFFER</Text>
                    </View>
                    <Text style={styles.promoTitle}>20% Off All Orders</Text>
                    <Text style={styles.promoSub}>Valid for all vendors today. Use code: STADIUM20 at checkout.</Text>
                 </View>
                 <Utensils size={120} color="rgba(255,255,255,0.15)" style={styles.promoIcon} />
              </View>

              {/* Category Bar */}
              <View style={styles.categoryBar}>
                 {categories.map(cat => (
                   <TouchableOpacity 
                    key={cat} 
                    style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                    onPress={() => setActiveCategory(cat)}
                   >
                      <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                   </TouchableOpacity>
                 ))}
              </View>

              {/* Vendors Grid */}
              <View style={styles.sectionHeader}>
                 <Text style={styles.sectionTitle}>Featured Restaurants</Text>
              </View>

              {isLoading ? (
                <View style={styles.loaderContainer}>
                   <ActivityIndicator size="large" color={COLORS.brandPurple} />
                </View>
              ) : (
                <View style={styles.vendorGrid}>
                   {vendors.map(vendor => <VendorCard key={vendor.id} item={vendor} />)}
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    width: 350,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1d3557",
  },
  cartHeaderBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.brandPurple,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  promoBanner: {
    backgroundColor: "#e63946",
    borderRadius: 32,
    padding: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
    overflow: "hidden",
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  promoTagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  promoTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  promoSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 500,
  },
  promoIcon: {
    position: "absolute",
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  categoryBar: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 48,
  },
  catChip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  catChipActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  catChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  catChipTextActive: {
    color: "#fff",
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
  },
  vendorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -15,
  },
  vendorCard: {
    width: "50%",
    padding: 15,
    marginBottom: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  vendorImgWrapper: {
    width: 200,
    height: 180,
    position: "relative",
  },
  vendorImg: {
    width: "100%",
    height: "100%",
  },
  vendorRatingBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  vendorRatingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  vendorInfo: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  vendorName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 6,
  },
  vendorDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: "500",
  },
  vendorMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  menuBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
  }
});

export default FoodOrderingScreen;
