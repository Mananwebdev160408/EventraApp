import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  MoreHorizontal,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  ShoppingBag,
  LayoutDashboard,
  ChevronRight,
  Flame,
  MapPin,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { eventService, bookingService, sosService } from "../../api/services";

const { width } = Dimensions.get("window");

const AdminDashboardScreen = ({ navigation }) => {
  const { stadiumLocation } = useUser();
  const { userInfo } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    liveEvent: null,
    attendance: "0 / 0",
    capacityPercent: 0,
    storeRevenue: "$0",
    eventsCount: 0,
    activeAlerts: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [events, sosAlerts] = await Promise.all([
        eventService.getEvents(),
        sosService.getAllSos(),
      ]);

      const liveEvent = Array.isArray(events) ? events[0] : null; // Assume first event is upcoming/live
      const alertsCount = Array.isArray(sosAlerts) ? sosAlerts.length : 0;
      const recentSos = Array.isArray(sosAlerts) ? sosAlerts.slice(0, 3) : [];

      setDashboardData({
        liveEvent,
        attendance: liveEvent ? "42,000 / 50,000" : "0 / 0",
        capacityPercent: liveEvent ? 84 : 0,
        storeRevenue: "$1.2M",
        eventsCount: Array.isArray(events) ? events.length : 0,
        activeAlerts: alertsCount,
        recentActivity: recentSos.map((alert) => ({
          id: alert.id,
          type: "SOS",
          text: `Emergency alert from User ${alert.userId}`,
          time: new Date(alert.timestamp).toLocaleTimeString(),
          icon: <AlertCircle size={16} color={COLORS.error} />,
          iconBg: "rgba(230, 57, 70, 0.1)",
        })),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData(false);
  };

  const StatCard = ({
    label,
    value,
    subvalue,
    icon,
    color,
    onPress,
    fullWidth,
  }) => (
    <TouchableOpacity
      style={[styles.statCard, fullWidth && { width: "100%" }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        {subvalue && (
          <Text style={[styles.statSub, { color }]}>{subvalue}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <MapPin size={10} color="#457b9d" />
              <Text style={styles.greeting}>
                {stadiumLocation.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>
              {userInfo?.name || userInfo?.username || "Admin"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("AdminSettings")}
          >
            <Image
              source={{
                uri:
                  userInfo?.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.brandPurple} />
            </View>
          ) : (
            <>
              {/* Hero Section - Live Event Status */}
              <LinearGradient
                colors={["#1d3557", "#0f172a"]}
                style={styles.heroCard}
              >
                <View style={styles.heroHeader}>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE MONITORING</Text>
                  </View>
                  <TouchableOpacity>
                    <MoreHorizontal size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.heroTitle}>
                  {dashboardData.liveEvent?.title || "No Live Event"}
                </Text>
                <Text style={styles.heroSubtitle}>
                  {stadiumLocation} •{" "}
                  {dashboardData.liveEvent?.venue || "Monitoring Active"}
                </Text>

                {dashboardData.liveEvent && (
                  <View style={styles.attendanceContainer}>
                    <View style={styles.attendanceInfo}>
                      <Text style={styles.attendanceLabel}>Attendance</Text>
                      <Text style={styles.attendanceValue}>
                        {dashboardData.attendance}
                      </Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${dashboardData.capacityPercent}%`,
                            backgroundColor: COLORS.error,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.attendanceFooter}>
                      <Text style={styles.progressText}>
                        {dashboardData.capacityPercent}% Capacity
                      </Text>
                      <Text
                        style={[styles.progressText, { color: COLORS.error }]}
                      >
                        High Traffic
                      </Text>
                    </View>
                  </View>
                )}
              </LinearGradient>

              {/* Stadium Heatmap Section */}
              <View style={styles.heatmapContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.aiTitleRow}>
                    <View style={styles.heatmapBadge}>
                      <Flame size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>Real-time Heatmap</Text>
                  </View>
                  <Text style={styles.updatedText}>Auto-updates: 1s</Text>
                </View>

                <View style={styles.heatmapCard}>
                  <View style={styles.stadiumMock}>
                    <View style={styles.stadiumOval}>
                      <View
                        style={[
                          styles.sector,
                          styles.northSector,
                          { backgroundColor: "#ef4444" },
                        ]}
                      />
                      <View
                        style={[
                          styles.sector,
                          styles.southSector,
                          { backgroundColor: "#b91c1c" },
                        ]}
                      />
                      <View
                        style={[
                          styles.sector,
                          styles.eastSector,
                          { backgroundColor: "#10b981" },
                        ]}
                      />
                      <View
                        style={[
                          styles.sector,
                          styles.westSector,
                          { backgroundColor: "#f59e0b" },
                        ]}
                      />
                      <View style={styles.centerPitch}>
                        <View style={styles.pitchLines} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.heatmapLegend}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#10b981" },
                        ]}
                      />
                      <Text style={styles.legendText}>Low</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#f59e0b" },
                        ]}
                      />
                      <Text style={styles.legendText}>Moderate</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#ef4444" },
                        ]}
                      />
                      <Text style={styles.legendText}>High</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: "#b91c1c" },
                        ]}
                      />
                      <Text style={styles.legendText}>Critical</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Quick Stats Grid */}
              <View style={styles.statsGrid}>
                <StatCard
                  label="Store Revenue"
                  value={dashboardData.storeRevenue}
                  subvalue="+12.5%"
                  color="#059669" // Emerald 600
                  icon={<ShoppingBag size={20} color="#059669" />}
                  onPress={() => navigation.navigate("Store")}
                  fullWidth
                />

                <StatCard
                  label="Events Slated"
                  value={dashboardData.eventsCount.toString()}
                  subvalue="This Month"
                  color="#1d3557" // Navy
                  icon={<Calendar size={20} color="#1d3557" />}
                  onPress={() => navigation.navigate("Events")}
                />
                <StatCard
                  label="System Alerts"
                  value={dashboardData.activeAlerts.toString()}
                  subvalue="Critical"
                  color={COLORS.error}
                  icon={<AlertCircle size={20} color={COLORS.error} />}
                  onPress={() => navigation.navigate("SystemLogs")}
                />
              </View>

              {/* Recent Activity / Notifications */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Operational Log</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SystemLogs")}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.activityList}>
                {dashboardData.recentActivity.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.activityItem}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      {item.icon}
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{item.text}</Text>
                      <Text style={styles.activityTime}>{item.time}</Text>
                    </View>
                    <ChevronRight size={16} color={COLORS.gray300} />
                  </TouchableOpacity>
                ))}

                {dashboardData.recentActivity.length === 0 && (
                  <View style={styles.emptyActivity}>
                    <Text style={styles.emptyText}>No recent activity</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
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
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(230, 57, 70, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
  },
  liveText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 32,
  },
  attendanceContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  attendanceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  attendanceLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "600",
  },
  attendanceValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  attendanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 48 - 16) / 2, // 2 columns with gap
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(29, 53, 87, 0.6)",
    fontWeight: "600",
  },
  statSub: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#457b9d",
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    gap: 16,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#1d3557",
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: "rgba(29, 53, 87, 0.4)",
    marginTop: 2,
    fontWeight: "500",
  },
  heatmapContainer: {
    marginBottom: 32,
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heatmapBadge: {
    backgroundColor: COLORS.error,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  updatedText: {
    fontSize: 10,
    color: "#457b9d",
    fontWeight: "700",
  },
  heatmapCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  stadiumMock: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stadiumOval: {
    width: 280,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    position: "relative",
  },
  sector: {
    position: "absolute",
    opacity: 0.7,
  },
  northSector: {
    top: 0,
    left: 40,
    right: 40,
    height: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  southSector: {
    bottom: 0,
    left: 40,
    right: 40,
    height: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  eastSector: {
    top: 35,
    right: 0,
    bottom: 35,
    width: 30,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
  },
  westSector: {
    top: 35,
    left: 0,
    bottom: 35,
    width: 30,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
  },
  centerPitch: {
    position: "absolute",
    top: 45,
    left: 55,
    right: 55,
    bottom: 45,
    backgroundColor: "#059669",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  pitchLines: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  heatmapLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
  },
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyActivity: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AdminDashboardScreen;
