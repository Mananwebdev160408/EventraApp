import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Utensils,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  ArrowUpRight,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const AdminInventoryScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("Food");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Burger King");

  const restaurants = ["Burger King", "Pizza Hut", "Taco Bell", "Starbucks"];

  const foodSalesData = {
    "Burger King": [
      {
        name: "Whopper Meal",
        sales: "$45,200",
        change: "+12%",
        items: "3,200",
      },
      {
        name: "Chicken Royale",
        sales: "$28,400",
        change: "+8%",
        items: "4,500",
      },
      { name: "French Fries", sales: "$15,100", change: "+5%", items: "6,800" },
    ],
    "Pizza Hut": [
      {
        name: "Pepperoni Feast",
        sales: "$32,500",
        change: "+15%",
        items: "2,100",
      },
      {
        name: "Veggie Supreme",
        sales: "$24,200",
        change: "+10%",
        items: "1,800",
      },
      { name: "Garlic Bread", sales: "$8,400", change: "+2%", items: "3,500" },
    ],
    "Taco Bell": [
      {
        name: "Crunchwrap Supreme",
        sales: "$18,900",
        change: "+20%",
        items: "4,200",
      },
      {
        name: "Soft Taco Party Pack",
        sales: "$42,100",
        change: "+18%",
        items: "2,500",
      },
      {
        name: "Cheesy Fiesta Potatoes",
        sales: "$12,300",
        change: "+4%",
        items: "5,100",
      },
    ],
    Starbucks: [
      {
        name: "Caramel Macchiato",
        sales: "$52,400",
        change: "+25%",
        items: "8,900",
      },
      {
        name: "Java Chip Frappuccino",
        sales: "$38,200",
        change: "+15%",
        items: "6,200",
      },
      {
        name: "Butter Croissant",
        sales: "$14,500",
        change: "+6%",
        items: "4,800",
      },
    ],
  };

  const merchSales = [
    {
      name: "Home Jersey 2024",
      sales: "$125,000",
      change: "+22%",
      items: "1,500",
    },
    { name: "Team Scarf", sales: "$42,300", change: "+10%", items: "2,800" },
    { name: "Snapback Cap", sales: "$35,800", change: "+7%", items: "1,200" },
    {
      name: "Stadium Seat Cushion",
      sales: "$12,400",
      change: "+3%",
      items: "800",
    },
  ];

  const currentData =
    activeCategory === "Food" ? foodSalesData[selectedRestaurant] : merchSales;
  const totalSales =
    activeCategory === "Food"
      ? currentData.reduce(
          (acc, curr) => acc + parseInt(curr.sales.replace(/[\$,]/g, "")),
          0,
        )
      : 215500;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inventory Sales</Text>
          <Text style={styles.headerSubtitle}>Real-time commerce tracking</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeCategory === "Food" && styles.activeTab]}
            onPress={() => setActiveCategory("Food")}
          >
            <Utensils
              size={18}
              color={activeCategory === "Food" ? COLORS.white : COLORS.gray500}
            />
            <Text
              style={[
                styles.tabText,
                activeCategory === "Food" && styles.activeTabText,
              ]}
            >
              FOOD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeCategory === "Merchandise" && styles.activeTab,
            ]}
            onPress={() => setActiveCategory("Merchandise")}
          >
            <ShoppingBag
              size={18}
              color={
                activeCategory === "Merchandise" ? COLORS.white : COLORS.gray500
              }
            />
            <Text
              style={[
                styles.tabText,
                activeCategory === "Merchandise" && styles.activeTabText,
              ]}
            >
              MERCHANDISE
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeCategory === "Food" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.restaurantList}
              contentContainerStyle={styles.restaurantListContent}
            >
              {restaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant}
                  style={[
                    styles.restaurantChip,
                    selectedRestaurant === restaurant &&
                      styles.activeRestaurantChip,
                  ]}
                  onPress={() => setSelectedRestaurant(restaurant)}
                >
                  <Text
                    style={[
                      styles.restaurantText,
                      selectedRestaurant === restaurant &&
                        styles.activeRestaurantText,
                    ]}
                  >
                    {restaurant}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Summary Banner */}
          <LinearGradient
            colors={
              activeCategory === "Food"
                ? ["#e63946", "#d62828"]
                : ["#1d3557", "#457b9d"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.summaryBanner}
          >
            <View>
              <Text style={styles.bannerLabel}>
                {activeCategory === "Food"
                  ? `${selectedRestaurant} Sales`
                  : `Total ${activeCategory} Sales`}
              </Text>
              <Text style={styles.bannerValue}>
                ${totalSales.toLocaleString()}
              </Text>
            </View>
            <View style={styles.bannerIcon}>
              {activeCategory === "Food" ? (
                <Utensils size={32} color="#ffffff66" />
              ) : (
                <ShoppingBag size={32} color="#ffffff66" />
              )}
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Performance by Item</Text>

          {currentData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.itemCard}>
              <View style={styles.itemIconContainer}>
                {activeCategory === "Food" ? (
                  <Utensils size={20} color={COLORS.error} />
                ) : (
                  <Package size={20} color="#1d3557" />
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>{item.items} units sold</Text>
              </View>
              <View style={styles.itemSales}>
                <Text style={styles.salesValue}>{item.sales}</Text>
                <View style={styles.changeBadge}>
                  <ArrowUpRight size={12} color="#059669" />
                  <Text style={styles.changeText}>{item.change}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.footerInfo}>
            <Text style={styles.footerText}>Updated as of today, 10:55 AM</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gray500,
  },
  activeTabText: {
    color: COLORS.white,
  },
  content: {
    padding: 24,
    paddingTop: 8,
  },
  summaryBanner: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  bannerLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  bannerValue: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: "500",
  },
  itemSales: {
    alignItems: "flex-end",
  },
  salesValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
  },
  footerInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray400,
    fontStyle: "italic",
  },
  restaurantList: {
    marginBottom: 20,
  },
  restaurantListContent: {
    gap: 10,
    paddingRight: 24,
  },
  restaurantChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeRestaurantChip: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  restaurantText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.gray600,
  },
  activeRestaurantText: {
    color: COLORS.white,
  },
});

export default AdminInventoryScreen;
