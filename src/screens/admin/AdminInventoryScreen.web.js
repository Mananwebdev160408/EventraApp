import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Utensils,
  ShoppingBag,
  TrendingUp,
  Package,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import AdminSidebar from "../../components/AdminSidebar.web";

const AdminInventoryScreen = ({ navigation }) => {
  const { stadiumLocation } = useUser();
  const [activeCategory, setActiveCategory] = useState("Food");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Burger King");
  const { width: windowWidth } = useWindowDimensions();

  const restaurants = ["Burger King", "Pizza Hut", "Taco Bell", "Starbucks"];

  const foodSalesData = {
    "Burger King": [
      { name: "Whopper Meal", sales: "₹45,200", change: "+12%", items: "3,200", stock: 85 },
      { name: "Chicken Royale", sales: "₹28,400", change: "+8%", items: "4,500", stock: 42 },
      { name: "French Fries", sales: "₹15,100", change: "+5%", items: "6,800", stock: 120 },
    ],
    "Pizza Hut": [
      { name: "Pepperoni Feast", sales: "₹32,500", change: "+15%", items: "2,100", stock: 65 },
      { name: "Veggie Supreme", sales: "₹24,200", change: "+10%", items: "1,800", stock: 30 },
      { name: "Garlic Bread", sales: "₹8,400", change: "+2%", items: "3,500", stock: 200 },
    ],
    "Taco Bell": [
      { name: "Crunchwrap Supreme", sales: "₹18,900", change: "+20%", items: "4,200", stock: 95 },
      { name: "Soft Taco Party Pack", sales: "₹42,100", change: "+18%", items: "2,500", stock: 15 },
      { name: "Cheesy Fiesta Potatoes", sales: "₹12,300", change: "+4%", items: "5,100", stock: 110 },
    ],
    Starbucks: [
      { name: "Caramel Macchiato", sales: "₹52,400", change: "+25%", items: "8,900", stock: 300 },
      { name: "Java Chip Frappuccino", sales: "₹38,200", change: "+15%", items: "6,200", stock: 250 },
      { name: "Butter Croissant", sales: "₹14,500", change: "+6%", items: "4,800", stock: 45 },
    ],
  };

  const merchSales = [
    { name: "Home Jersey 2024", sales: "₹1,25,000", change: "+22%", items: "1,500", stock: 120 },
    { name: "Team Scarf", sales: "₹42,300", change: "+10%", items: "2,800", stock: 450 },
    { name: "Snapback Cap", sales: "₹35,800", change: "+7%", items: "1,200", stock: 85 },
    { name: "Stadium Seat Cushion", sales: "₹12,400", change: "+3%", items: "800", stock: 30 },
  ];

  const currentData = activeCategory === "Food" ? foodSalesData[selectedRestaurant] : merchSales;
  const totalSalesValue = activeCategory === "Food"
      ? currentData.reduce((acc, curr) => acc + parseInt(curr.sales.replace(/[₹,]/g, "")), 0)
      : 215500;

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <AdminSidebar navigation={navigation} activeNav="Inventory" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View>
              <Text style={styles.headerTitle}>Inventory & Commerce</Text>
              <Text style={styles.headerSub}>{stadiumLocation} • Revenue Management</Text>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.exportBtn}>
                 <Download size={18} color="#1d3557" />
                 <Text style={styles.exportText}>Download Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addBtn}>
                 <TrendingUp size={18} color="#fff" />
                 <Text style={styles.addText}>Sales Analytics</Text>
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              
              {/* Category Tabs */}
              <View style={styles.tabBar}>
                 <View style={styles.tabs}>
                    <TouchableOpacity 
                       style={[styles.tab, activeCategory === "Food" && styles.activeTab]}
                       onPress={() => setActiveCategory("Food")}
                    >
                       <Utensils size={18} color={activeCategory === "Food" ? "#fff" : "#64748b"} />
                       <Text style={[styles.tabText, activeCategory === "Food" && styles.activeTabText]}>Dining & Refreshments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                       style={[styles.tab, activeCategory === "Merchandise" && styles.activeTab]}
                       onPress={() => setActiveCategory("Merchandise")}
                    >
                       <ShoppingBag size={18} color={activeCategory === "Merchandise" ? "#fff" : "#64748b"} />
                       <Text style={[styles.tabText, activeCategory === "Merchandise" && styles.activeTabText]}>Official Merchandise</Text>
                    </TouchableOpacity>
                 </View>
                 
                 <View style={styles.searchBox}>
                    <Search size={18} color="#94a3b8" />
                    <Text style={styles.searchPlaceholder}>Search items...</Text>
                 </View>
              </View>

              {activeCategory === "Food" && (
                 <View style={styles.restaurantSection}>
                    {restaurants.map((restaurant) => (
                       <TouchableOpacity 
                          key={restaurant}
                          style={[styles.restaurantChip, selectedRestaurant === restaurant && styles.activeRestaurantChip]}
                          onPress={() => setSelectedRestaurant(restaurant)}
                       >
                          <Text style={[styles.restaurantText, selectedRestaurant === restaurant && styles.activeRestaurantText]}>{restaurant}</Text>
                       </TouchableOpacity>
                    ))}
                 </View>
              )}

              {/* High Level Stats */}
              <View style={styles.statsRow}>
                 <LinearGradient 
                    colors={activeCategory === "Food" ? ["#1d3557", "#1d3557"] : ["#8b5cf6", "#7c3aed"]} 
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                    style={styles.mainStatCard}
                 >
                    <View>
                       <Text style={styles.statLabel}>{activeCategory === "Food" ? `${selectedRestaurant} Session Revenue` : "Total Merch Sales"}</Text>
                       <Text style={styles.statValue}>₹{totalSalesValue.toLocaleString()}</Text>
                       <View style={styles.statTrend}>
                          <ArrowUpRight size={14} color="#10b981" />
                          <Text style={styles.trendText}>+18.4% from last event</Text>
                       </View>
                    </View>
                    <View style={styles.statIconCircle}>
                       {activeCategory === "Food" ? <Utensils size={32} color="#fff" /> : <ShoppingBag size={32} color="#fff" />}
                    </View>
                 </LinearGradient>

                 <View style={styles.secondaryStatCard}>
                    <Text style={styles.smallStatLabel}>Low Stock Alerts</Text>
                    <Text style={[styles.smallStatValue, { color: '#ef4444' }]}>04 Items</Text>
                    <View style={styles.progressBar}><View style={[styles.progressFill, { width: '80%', backgroundColor: '#ef4444' }]} /></View>
                    <Text style={styles.smallStatSub}>Action required in South Stand stores</Text>
                 </View>

                 <View style={styles.secondaryStatCard}>
                    <Text style={styles.smallStatLabel}>Conversion Rate</Text>
                    <Text style={styles.smallStatValue}>64.2%</Text>
                    <View style={styles.progressBar}><View style={[styles.progressFill, { width: '64%', backgroundColor: '#10b981' }]} /></View>
                    <Text style={styles.smallStatSub}>Avg. ₹840 spend per attendee</Text>
                 </View>
              </View>

              {/* Inventory Grid */}
              <Text style={styles.sectionTitle}>Itemized Performance & Stock</Text>
              <View style={styles.inventoryGrid}>
                 {currentData.map((item, index) => (
                    <View key={index} style={styles.inventoryCard}>
                       <View style={styles.cardTop}>
                          <View style={styles.itemIconBox}>
                             {activeCategory === "Food" ? <Utensils size={24} color="#1d3557" /> : <Package size={24} color="#8b5cf6" />}
                          </View>
                          <TouchableOpacity>
                             <MoreVertical size={20} color="#94a3b8" />
                          </TouchableOpacity>
                       </View>
                       
                       <View style={styles.cardBody}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemSalesInfo}>{item.items} units • {item.sales}</Text>
                          
                          <View style={styles.stockInfo}>
                             <View style={styles.stockTextRow}>
                                <Text style={styles.stockLabel}>Available Stock</Text>
                                <Text style={[styles.stockValue, item.stock < 50 && { color: '#ef4444' }]}>{item.stock} units</Text>
                             </View>
                             <View style={styles.stockBarBg}>
                                <View style={[styles.stockBarFill, { 
                                   width: `${Math.min(100, (item.stock / 200) * 100)}%`,
                                   backgroundColor: item.stock < 50 ? '#ef4444' : '#10b981'
                                }]} />
                             </View>
                          </View>
                       </View>
                       
                       <View style={styles.cardFooter}>
                          <View style={styles.changeBadge}>
                             <ArrowUpRight size={12} color="#10b981" />
                             <Text style={styles.changeText}>{item.change}</Text>
                          </View>
                          <TouchableOpacity style={styles.restockBtn}>
                             <Text style={styles.restockText}>Restock</Text>
                          </TouchableOpacity>
                       </View>
                    </View>
                 ))}
              </View>
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
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1e293b",
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  exportText: {
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
    paddingVertical: 12,
    borderRadius: 12,
  },
  addText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    gap: 32,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderRadius: 16,
    gap: 4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#1d3557",
    boxShadow: "0px 4px 12px rgba(29, 53, 87, 0.2)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  activeTabText: {
    color: "#fff",
  },
  searchBox: {
    flex: 1,
    maxWidth: 400,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchPlaceholder: {
    color: "#94a3b8",
    fontSize: 14,
  },
  restaurantSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
    flexWrap: 'wrap',
  },
  restaurantChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeRestaurantChip: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  restaurantText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  activeRestaurantText: {
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 48,
  },
  mainStatCard: {
    flex: 2,
    padding: 32,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  statValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 12,
  },
  statTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trendText: {
    color: "#10b981",
    fontSize: 13,
    fontWeight: "700",
  },
  statIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryStatCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  smallStatLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 8,
  },
  smallStatValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  smallStatSub: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 24,
  },
  inventoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  inventoryCard: {
    width: 'calc(33.33% - 16px)',
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  itemIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    marginBottom: 24,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  itemSalesInfo: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 20,
  },
  stockInfo: {
    gap: 8,
  },
  stockTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stockLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
  },
  stockValue: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "800",
  },
  stockBarBg: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    overflow: "hidden",
  },
  stockBarFill: {
    height: "100%",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#10b981",
  },
  restockBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  restockText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1d3557",
  }
});

export default AdminInventoryScreen;
