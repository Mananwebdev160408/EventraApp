import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  ShoppingBag,
  Bell,
  Plus,
  Heart,
  ShoppingCart,
  ArrowUpRight,
  Filter,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { merchandiseService } from "../../api/services";
import { useCart } from "../../context/CartContext";
import WebUserSidebar from "../../components/WebUserSidebar";

const StoreScreen = ({ navigation, route }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { eventId, stadiumId } = route.params || {};
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await merchandiseService.getAllMerchandise();
      const formattedProducts = (Array.isArray(data) ? data : []).map(
        (item) => ({
          id: item.id.toString(),
          name: item.name,
          price: item.price,
          image: item.image || "https://images.unsplash.com/photo-1576859958081-27ee54e57f51?w=400&h=400&fit=crop",
          category: item.type || "Other",
        })
      );
      
      // Mock fallback if empty
      if (formattedProducts.length === 0) {
        const mockProducts = [
            { id: "m-prod-1", name: "MI Official Jersey 2026", price: 1999, image: "https://images.unsplash.com/photo-1576859958081-27ee54e57f51?w=400&h=400&fit=crop", category: "Apparel" },
            { id: "m-prod-2", name: "CSK Captain's Cap", price: 499, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop", category: "Headwear" },
            { id: "m-prod-3", name: "Eventra Hoodie (Limited Ed.)", price: 2499, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", category: "Apparel" },
            { id: "m-prod-4", name: "MI Matchday Scarf", price: 349, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop", category: "Accessories" },
            { id: "m-prod-5", name: "CSK Double Wall Bottle", price: 899, image: "https://images.unsplash.com/photo-1602143399827-bd95967c7c40?w=400&h=400&fit=crop", category: "Accessories" },
            { id: "m-prod-6", name: "Wankhede Souvenir Ball", price: 599, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop", category: "Collectibles" },
            { id: "m-prod-7", name: "Team MI Wristband", price: 149, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", category: "Accessories" },
            { id: "m-prod-8", name: "IPL 2026 Commemorative Mug", price: 399, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop", category: "Collectibles" },
        ];
        setProducts(mockProducts);
        setCategories(["All", "Apparel", "Headwear", "Accessories", "Collectibles"]);
      } else {
        setProducts(formattedProducts);
        const uniqueCats = ["All", ...new Set(formattedProducts.map((p) => p.category))];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = products.filter(item => {
    const categoryMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const ProductCard = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity 
        style={styles.imageWrapper}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity style={styles.wishlistBtn}>
           <Heart size={16} color="#1d3557" />
        </TouchableOpacity>
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
           <Text style={styles.productCat}>{item.category.toUpperCase()}</Text>
           <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        </View>
        
        <View style={styles.productFooter}>
           <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
           <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => addToCart(item, "Merchandise")}
           >
              <Plus size={18} color="#fff" />
              <Text style={styles.addBtnText}>Add</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Store" />

      <View style={styles.mainContent}>
        {/* Header Section */}
        <View style={styles.topHeader}>
           <View>
              <Text style={styles.headerTitle}>Stadium Store</Text>
              <Text style={styles.headerSub}>Official merchandise and limited edition collectibles</Text>
           </View>
           
           <View style={styles.headerActions}>
              <View style={styles.searchBox}>
                 <Search size={20} color="#94a3b8" />
                 <TextInput 
                  placeholder="Search products..." 
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                 />
              </View>
              <TouchableOpacity 
                style={styles.cartHeaderBtn}
                onPress={() => navigation.navigate("Cart")}
              >
                 <ShoppingBag size={22} color="#1d3557" />
                 {itemCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{itemCount}</Text></View>}
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
           <View style={styles.contentPadding}>
              {/* Category Filter */}
              <View style={styles.categoryBar}>
                 <View style={styles.categoryList}>
                    {categories.map(cat => (
                      <TouchableOpacity 
                        key={cat} 
                        style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
                        onPress={() => setActiveCategory(cat)}
                      >
                         <Text style={[styles.catTabText, activeCategory === cat && styles.catTabTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>
                 <TouchableOpacity style={styles.filterBtn}>
                    <Filter size={18} color="#1d3557" />
                    <Text style={styles.filterBtnText}>Filters</Text>
                 </TouchableOpacity>
              </View>

              {isLoading ? (
                <View style={styles.loaderContainer}>
                   <ActivityIndicator size="large" color={COLORS.brandPurple} />
                </View>
              ) : (
                <View style={styles.productGrid}>
                   {filteredItems.length > 0 ? (
                      filteredItems.map(item => <ProductCard key={item.id} item={item} />)
                   ) : (
                     <View style={styles.emptyState}>
                        <ShoppingCart size={64} color="#e2e8f0" />
                        <Text style={styles.emptyText}>No products found in this category.</Text>
                     </View>
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
  categoryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  categoryList: {
    flexDirection: "row",
    gap: 12,
  },
  catTab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  catTabActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  catTabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  catTabTextActive: {
    color: "#fff",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -15,
  },
  productCard: {
    width: "25%",
    padding: 15,
    marginBottom: 30,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 32,
    backgroundColor: "#fff",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  wishlistBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  productInfo: {
    paddingTop: 20,
  },
  productHeader: {
    marginBottom: 16,
    height: 60,
  },
  productCat: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.brandPurple,
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    lineHeight: 24,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1d3557",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    paddingVertical: 120,
    alignItems: "center",
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "600",
  }
});

export default StoreScreen;
