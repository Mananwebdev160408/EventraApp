import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  ShoppingBag,
  Bell,
  Plus,
  Heart,
  ShoppingCart,
} from "lucide-react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { merchandiseService } from "../../api/services";
import { useCart } from "../../context/CartContext";

const StoreScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await merchandiseService.getAllMerchandise();
      const formattedProducts = (Array.isArray(data) ? data : []).map(
        (item) => ({
          id: item.id.toString(),
          name: item.name,
          price: `$${(item.price || 0).toFixed(2)}`,
          image:
            "https://images.unsplash.com/photo-1576859958081-27ee54e57f51?w=400&h=400&fit=crop", // Default placeholder
          category: item.type || "Other",
        }),
      );
      setProducts(formattedProducts);

      const uniqueCats = [
        "All",
        ...new Set(formattedProducts.map((p) => p.category)),
      ];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProducts(false);
  };

  const filteredItems =
    activeCategory === "All"
      ? products
      : products.filter((item) => item.category === activeCategory);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={14} color={COLORS.text} />
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.productInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item, "Merchandise")}
        >
          <Plus size={16} color={COLORS.white} />
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
          <Text style={styles.headerTitle}>Stadium Store</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color={COLORS.brandPurple} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray400} style={styles.searchIcon} />
          <TextInput
            placeholder="Search merchandise..."
            placeholderTextColor={COLORS.gray500}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View>
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

        {/* Product Grid */}
        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ShoppingCart size={48} color={COLORS.gray200} />
                <Text style={styles.emptyText}>
                  No items found in this category
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Cart Button */}
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate("Cart")}
        >
          <ShoppingBag size={24} color={COLORS.white} />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // background-dark
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  iconButton: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: COLORS.card,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandPurple,
  },
  categoryText: {
    color: COLORS.gray600,
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for floating button
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    maxWidth: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  productImage: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E2E8F0",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.brandPurple,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingCart: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.brandPurple,
    fontSize: 10,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray500,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.gray500,
    fontWeight: "500",
  },
});

export default StoreScreen;
