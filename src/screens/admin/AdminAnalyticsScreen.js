import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Ticket,
  Activity,
  Download,
  Flame,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import {
  eventService,
  bookingService,
  foodService,
  merchandiseService,
} from "../../api/services";

const { width } = Dimensions.get("window");

const AdminAnalyticsScreen = ({ navigation }) => {
  const { stadiumLocation } = useUser();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeEvents: 0,
    revenueChange: "+12.4%",
    ticketsByCat: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [events, bookings, foodOrders] = await Promise.all([
        eventService.getEvents(),
        bookingService.getUserBookings("all"), // Assuming "all" or similar exists for admins
        foodService.getAllFoodOrders(),
      ]);

      const totalEvents = Array.isArray(events) ? events.length : 0;
      const totalBookings = Array.isArray(bookings) ? bookings.length : 0;

      // Calculate revenue from food orders as an example
      const foodRevenue = Array.isArray(foodOrders)
        ? foodOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0)
        : 0;

      setStats({
        totalRevenue: foodRevenue + 2500000, // Partial hardcode for demonstration
        totalBookings,
        activeEvents: totalEvents,
        revenueChange: "+15.2%",
        ticketsByCat: [
          { category: "VIP", count: Math.floor(totalBookings * 0.2) },
          { category: "Standard", count: Math.floor(totalBookings * 0.5) },
          { category: "Early Bird", count: Math.floor(totalBookings * 0.3) },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAnalytics(false);
  };

  const revenueByMonth = [
    { month: "Jan", value: 450000 },
    { month: "Feb", value: 520000 },
    { month: "Mar", value: 480000 },
    { month: "Apr", value: 610000 },
    { month: "May", value: 590000 },
    { month: "Jun", value: 720000 },
  ];
  const maxRevenue = Math.max(...revenueByMonth.map((d) => d.value));

  const StatCard = ({
    label,
    value,
    change,
    type,
    icon,
    iconBg,
    fullWidth,
  }) => (
    <View style={[styles.statCard, fullWidth && { width: "100%" }]}>
      <View style={styles.statHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconBg || "rgba(29, 53, 87, 0.05)" },
          ]}
        >
          {icon}
        </View>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor:
                type === "up"
                  ? "rgba(5, 150, 105, 0.1)"
                  : "rgba(230, 57, 70, 0.1)",
            },
          ]}
        >
          {type === "up" ? (
            <TrendingUp size={12} color="#059669" />
          ) : (
            <TrendingDown size={12} color={COLORS.error} />
          )}
          <Text
            style={[
              styles.changeText,
              { color: type === "up" ? "#059669" : COLORS.error },
            ]}
          >
            {change}
          </Text>
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>Stadium Insights</Text>
            <Text style={styles.stadiumSubtitle}>{stadiumLocation}</Text>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#1d3557" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
            <Text style={styles.loaderText}>Compiling Stadium Data...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {/* Performance Highlight */}
            <LinearGradient
              colors={["#1d3557", "#457b9d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.performanceBanner}
            >
              <View>
                <Text style={styles.bannerTitle}>Total Revenue</Text>
                <Text style={styles.bannerValue}>
                  ${stats.totalRevenue.toLocaleString()}
                </Text>
              </View>
              <View style={styles.bannerBadge}>
                <TrendingUp size={16} color="#ffffff" />
                <Text style={styles.bannerBadgeText}>
                  {stats.revenueChange}
                </Text>
              </View>
            </LinearGradient>

            {/* Live Heatmap Entry */}
            <TouchableOpacity
              style={styles.heatmapCard}
              onPress={() => navigation.navigate("LiveHeatmap")}
            >
              <LinearGradient
                colors={["#e63946", "#d62828"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.heatmapGradient}
              >
                <View style={styles.heatmapInfo}>
                  <View style={styles.heatmapIconContainer}>
                    <Flame size={24} color="#e63946" />
                  </View>
                  <View>
                    <Text style={styles.heatmapTitle}>Live Density Map</Text>
                    <Text style={styles.heatmapSubtitle}>
                      Monitor stadium hotspots in real-time
                    </Text>
                  </View>
                </View>
                <Activity size={24} color="rgba(255,255,255,0.4)" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Overview Grid */}
            <View style={styles.grid}>
              <StatCard
                label="Tickets Sold"
                value={stats.totalBookings.toLocaleString()}
                change="+8.2%"
                type="up"
                icon={<DollarSign size={20} color="#059669" />}
                iconBg="rgba(5, 150, 105, 0.1)"
                fullWidth
              />
              <StatCard
                label="Registered Staff"
                value="142"
                change="+5.1%"
                type="up"
                icon={<Ticket size={20} color={COLORS.error} />}
                iconBg="rgba(230, 57, 70, 0.1)"
              />
              <StatCard
                label="Active Events"
                value={stats.activeEvents}
                change="+2"
                type="up"
                icon={<Activity size={20} color="#1d3557" />}
                iconBg="rgba(29, 53, 87, 0.1)"
              />
            </View>

            {/* Revenue Chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Revenue Trend</Text>
                <TouchableOpacity>
                  <Text style={styles.chartFilter}>Last 6 Months</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chartContainer}>
                {revenueByMonth.map((item, index) => (
                  <View key={index} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: (item.value / maxRevenue) * 150,
                          backgroundColor:
                            index % 2 === 0 ? "#1d3557" : COLORS.error,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{item.month}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Ticket Breakdown */}
            <View style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Categorical Distribution</Text>
              <View style={{ marginTop: 20 }}>
                {stats.ticketsByCat.map((item, index) => (
                  <View key={index} style={styles.progressRow}>
                    <View style={styles.progressLabelRow}>
                      <Text style={styles.progressLabel}>{item.category}</Text>
                      <Text style={styles.progressValue}>{item.count}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${stats.totalBookings > 0 ? (item.count / stats.totalBookings) * 100 : 0}%`,
                            backgroundColor:
                              index === 0 ? COLORS.error : "#1d3557",
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1faee",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
  },
  stadiumSubtitle: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: "#1d3557",
    fontWeight: "700",
  },
  performanceBanner: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bannerTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  bannerValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  bannerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(29, 53, 87, 0.5)",
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  chartFilter: {
    fontSize: 13,
    fontWeight: "700",
    color: "#457b9d",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
  },
  barContainer: {
    alignItems: "center",
    gap: 12,
  },
  bar: {
    width: 30,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: "rgba(29, 53, 87, 0.4)",
    fontWeight: "700",
  },
  progressRow: {
    marginBottom: 20,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: "#1d3557",
    fontWeight: "700",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(29, 53, 87, 0.05)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  heatmapCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heatmapGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heatmapInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heatmapIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  heatmapSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AdminAnalyticsScreen;
