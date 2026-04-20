import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  Search,
  Filter,
  MoreVertical,
  Coffee,
  X,
  ShieldCheck,
  LayoutDashboard,
  BarChart3,
  Flame,
  Zap,
  ArrowRight,
  Package,
  TrendingUp,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { foodService, merchandiseService } from "../../api/services";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";

const AdminStoreScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { stadiumLocation } = useUser();
  const { userInfo } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Merchandise");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeTab === "Merchandise") {
        data = await merchandiseService.getAllMerchandise();
      } else {
        data = await foodService.getAllFoods();
      }
      setItems(Array.isArray(data) ? data : (data?.items || []));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDesktop) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc'}}>
        <Text>Please use desktop for store management</Text>
      </View>
    );
  }

  return (
    <View style={styles.desktopWrapper}>
      <StatusBar style="light" />
      
      {/* Sidebar - Consistent with Admin */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <ShieldCheck size={28} color={COLORS.error} />
          </View>
          <View>
            <Text style={styles.logoText}>EVENTRA</Text>
            <Text style={styles.logoSub}>SHIELD ADMIN</Text>
          </View>
        </View>

        <View style={styles.navGroup}>
          <Text style={styles.navSectionLabel}>CORE CONTROL</Text>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminDashboard")}>
            <LayoutDashboard size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Command Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminAnalytics")}>
            <BarChart3 size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Deep Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navGroup}>
          <Text style={styles.navSectionLabel}>STADIUM OPS</Text>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <ShoppingBag size={20} color="#fff" />
            <Text style={[styles.navItemText, styles.navItemTextActive]}>Store Manager</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.userProfile}>
            <Image source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{userInfo?.name || "System Admin"}</Text>
              <Text style={styles.userRole}>Super Admin</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.pageTitle}>Store Management</Text>
            <Text style={styles.pageSubtitle}>Manage inventory, pricing, and availability for {stadiumLocation}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.statsBtn}>
              <TrendingUp size={18} color="#1d3557" />
              <Text style={styles.statsText}>Sales Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn}>
              <Plus size={18} color="#fff" />
              <Text style={styles.addText}>Add New Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentCard}>
          {/* Internal Navigation & Search */}
          <View style={styles.contentHeader}>
            <View style={styles.tabRow}>
              {["Merchandise", "Food & Beverage"].map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.tabBtn, activeTab === tab.split(' ')[0] && styles.tabBtnActive]}
                  onPress={() => setActiveTab(tab.split(' ')[0])}
                >
                  <Text style={[styles.tabBtnText, activeTab === tab.split(' ')[0] && styles.tabBtnTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.searchBar}>
              <Search size={18} color="#94a3b8" />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search inventory..." 
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.filterBtn}>
                <Filter size={18} color="#1e293b" />
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loaderArea}>
              <ActivityIndicator size="large" color="#1d3557" />
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id?.toString()}
              numColumns={4}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item }) => (
                <View style={styles.itemCard}>
                  <View style={styles.imageBox}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                    ) : (
                      <Package size={32} color="#cbd5e1" />
                    )}
                    <View style={styles.stockBadge}>
                      <Text style={styles.stockText}>120 IN STOCK</Text>
                    </View>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <View style={styles.itemActions}>
                      <TouchableOpacity style={styles.miniBtn}>
                        <Edit2 size={14} color="#64748b" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.miniBtn, { backgroundColor: '#fee2e2' }]}>
                        <Trash2 size={14} color="#ef4444" />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <View style={styles.categoryTag}>
                        <Text style={styles.tagText}>{activeTab === "Food" ? "FOOD" : "MERCH"}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: 280,
    backgroundColor: "#0f172a",
    padding: 32,
    justifyContent: "space-between",
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 60,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  logoSub: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  navGroup: {
    marginBottom: 40,
    gap: 8,
  },
  navSectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navItemText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },
  navItemTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  sidebarFooter: {
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  userRole: {
    color: "#64748b",
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
    padding: 60,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1d3557",
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  statsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 16,
  },
  addText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tabRow: {
    flexDirection: "row",
    gap: 12,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tabBtnActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  tabBtnTextActive: {
    color: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    width: 320,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  filterBtn: {
    padding: 6,
  },
  loaderArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    padding: 32,
    gap: 24,
  },
  itemCard: {
    flex: 1,
    maxWidth: '23%',
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.02)",
    marginBottom: 24,
    marginHorizontal: '1%',
  },
  imageBox: {
    height: 180,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  stockBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  itemInfo: {
    padding: 20,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 16,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  miniBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#64748b",
  },
});

export default AdminStoreScreen;
