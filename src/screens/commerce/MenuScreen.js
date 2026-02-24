import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  ShoppingCart,
  MapPin,
  Plus,
  ShoppingBag,
  Utensils,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { restaurantService } from "../../api/services";
import { useCart } from "../../context/CartContext";

const VENDOR_COLORS = {
  primary: "#e73642",
  backgroundLight: "#f1faee",
  navy: "#1d3557",
  tealLight: "#a8dadc",
  blueMuted: "#457b9d",
  white: "#ffffff",
  slate100: "#f1f5f9",
};

const MenuScreen = ({ navigation, route }) => {
  const { restaurantId, restaurantName } = route.params || {};
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, itemCount, cartTotal } = useCart();

  useEffect(() => {
    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const data = await restaurantService.getRestaurantMenu(restaurantId);
      const formattedItems = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.type || "Delicious stadium snack",
        price: `$${(item.price || 0).toFixed(2)}`,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", // Default placeholder
        category: item.type || "Main",
      }));
      setMenuItems(formattedItems);

      const uniqueCats = [
        "All",
        ...new Set(formattedItems.map((i) => i.category)),
      ];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => addToCart(item, "Food")}
      >
        <Plus size={20} color={VENDOR_COLORS.white} />
      </TouchableOpacity>
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
            <ChevronLeft size={24} color={VENDOR_COLORS.navy} />
          </TouchableOpacity>
          <View style={styles.cartContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("Cart")}
            >
              <ShoppingCart size={24} color={VENDOR_COLORS.navy} />
            </TouchableOpacity>
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Vendor Header */}
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{restaurantName || "Menu"}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={VENDOR_COLORS.blueMuted} />
            <Text style={styles.locationText}>Section 112 • Level 2</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isActive
                      ? styles.categoryChipActive
                      : styles.categoryChipInactive,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive
                        ? styles.categoryTextActive
                        : styles.categoryTextInactive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Menu Items */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={VENDOR_COLORS.navy} />
            <Text style={styles.loadingText}>Fetching menu...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Utensils size={48} color={VENDOR_COLORS.tealLight} />
            <Text style={styles.emptyText}>
              No items available in this category
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            contentContainerStyle={styles.menuList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>

      {/* Floating Bottom Bar */}
      {itemCount > 0 && (
        <View style={styles.floatingBarContainer}>
          <LinearGradient
            colors={[
              VENDOR_COLORS.backgroundLight,
              VENDOR_COLORS.backgroundLight,
              "transparent",
            ]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate("Cart")}
            activeOpacity={0.9}
          >
            <View style={styles.viewCartLeft}>
              <View style={styles.cartIconBox}>
                <ShoppingBag size={20} color={VENDOR_COLORS.white} />
              </View>
              <View>
                <Text style={styles.cartItemCount}>
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </Text>
                <Text style={styles.viewCartText}>View Cart</Text>
              </View>
            </View>
            <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VENDOR_COLORS.backgroundLight,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: VENDOR_COLORS.blueMuted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cartContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: VENDOR_COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: VENDOR_COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  vendorHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  vendorName: {
    fontSize: 28, // text-3xl approx
    fontWeight: "700",
    color: VENDOR_COLORS.navy,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: VENDOR_COLORS.blueMuted,
  },
  categoriesWrapper: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: VENDOR_COLORS.navy,
  },
  categoryChipInactive: {
    backgroundColor: VENDOR_COLORS.tealLight,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: VENDOR_COLORS.white,
  },
  categoryTextInactive: {
    color: VENDOR_COLORS.navy,
  },
  menuList: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for floating bar
    paddingTop: 8,
    gap: 16,
  },
  menuItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: VENDOR_COLORS.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VENDOR_COLORS.tealLight,
    gap: 16,
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: VENDOR_COLORS.slate100,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemContent: {
    flex: 1,
    height: 96,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemTextContainer: {
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: VENDOR_COLORS.navy,
    lineHeight: 20,
  },
  itemDesc: {
    fontSize: 12,
    color: VENDOR_COLORS.blueMuted,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: VENDOR_COLORS.navy,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: VENDOR_COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    top: -40,
  },
  viewCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: VENDOR_COLORS.navy,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  viewCartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cartIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  viewCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: VENDOR_COLORS.white,
  },
  cartTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: VENDOR_COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: VENDOR_COLORS.navy,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: VENDOR_COLORS.blueMuted,
    fontWeight: "500",
  },
});

export default MenuScreen;
