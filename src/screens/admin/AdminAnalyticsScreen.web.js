import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
  Image,
} from "react-native";
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
  Zap,
  LayoutDashboard,
  Search,
  Bell,
  Settings,
  Calendar,
  Filter,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  UserCircle,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import {
  eventService,
  bookingService,
  foodOrderService,
} from "../../api/services";

const AdminAnalyticsScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { stadiumLocation, stadiumId } = useUser();
  const { userInfo } = useAuth();
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeEvents: 0,
    revenueChange: "+12.4%",
    ticketsByCat: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [eventsResponse, bookingsResponse, foodOrdersResponse] = await Promise.all([
        eventService.getEvents(),
        bookingService.getAllBookings(),
        foodOrderService.getAllFoodOrders(),
      ]);

      const events = Array.isArray(eventsResponse.content) ? eventsResponse.content : [];
      const bookings = Array.isArray(bookingsResponse) ? bookingsResponse : [];
      const foodOrders = Array.isArray(foodOrdersResponse) ? foodOrdersResponse : [];

      const bookingRevenue = bookings.reduce((acc, b) => acc + (b.seats?.reduce((sum, s) => sum + (s.price || 0), 0) || 0), 0);
      const foodRevenue = foodOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

      setStats({
        totalRevenue: bookingRevenue + foodRevenue || 1245000, // Mock fallback
        totalBookings: bookings.length || 8540,
        activeEvents: events.length || 12,
        revenueChange: "+15.2%",
        ticketsByCat: [
          { category: "VIP Platinum", count: 420, total: 500, color: '#ef4444' },
          { category: "Standard East", count: 3200, total: 4000, color: '#3b82f6' },
          { category: "Economy West", count: 5800, total: 6500, color: '#10b981' },
        ],
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const revenueByMonth = [
    { month: "JAN", value: 450, trend: 'up' },
    { month: "FEB", value: 520, trend: 'up' },
    { month: "MAR", value: 480, trend: 'down' },
    { month: "APR", value: 610, trend: 'up' },
    { month: "MAY", value: 590, trend: 'down' },
    { month: "JUN", value: 720, trend: 'up' },
  ];

  if (!isDesktop) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc'}}>
        <Text>Please use desktop for analytics insights</Text>
      </View>
    );
  }

  return (
    <View style={styles.desktopWrapper}>
      <StatusBar style="light" />
      
      {/* Sidebar - Same as Dashboard */}
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
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <BarChart3 size={20} color="#fff" />
            <Text style={[styles.navItemText, styles.navItemTextActive]}>Deep Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("LiveHeatmap")}>
            <Flame size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Live Heatmap</Text>
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

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.pageTitle}>Stadium Insights</Text>
            <Text style={styles.pageSubtitle}>Historical data and financial performance analytics</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterBtn}>
              <Calendar size={18} color="#1e293b" />
              <Text style={styles.filterText}>Last 6 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadBtn}>
              <Download size={18} color="#fff" />
              <Text style={styles.downloadText}>Export CSV</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1d3557" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* KPI Cards */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Total Revenue</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiValue}>₹{(stats.totalRevenue / 100000).toFixed(1)}L</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={14} color="#10b981" />
                    <Text style={styles.trendText}>+15%</Text>
                  </View>
                </View>
                <View style={styles.kpiFooter}>
                  <Text style={styles.kpiFooterText}>vs ₹9.2L last period</Text>
                </View>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Avg. Ticket Price</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiValue}>₹1,450</Text>
                  <View style={[styles.trendBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                    <TrendingDown size={14} color="#ef4444" />
                    <Text style={[styles.trendText, { color: '#ef4444' }]}>-2%</Text>
                  </View>
                </View>
                <View style={styles.kpiFooter}>
                  <Text style={styles.kpiFooterText}>Market avg: ₹1,200</Text>
                </View>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Occupancy Rate</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiValue}>84.2%</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={14} color="#10b981" />
                    <Text style={styles.trendText}>+4%</Text>
                  </View>
                </View>
                <View style={styles.kpiFooter}>
                  <View style={styles.miniProgress}><View style={[styles.miniFill, { width: '84%' }]} /></View>
                </View>
              </View>

              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Ancillary Revenue</Text>
                <View style={styles.kpiValueRow}>
                  <Text style={styles.kpiValue}>₹2.4L</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={14} color="#10b981" />
                    <Text style={styles.trendText}>+22%</Text>
                  </View>
                </View>
                <View style={styles.kpiFooter}>
                  <Text style={styles.kpiFooterText}>Food & Merch sales</Text>
                </View>
              </View>
            </View>

            {/* Main Analytics Grid */}
            <View style={styles.analyticsGrid}>
              {/* Revenue Chart */}
              <View style={styles.chartModule}>
                <View style={styles.moduleHeader}>
                  <Text style={styles.moduleTitle}>Revenue Growth Trend</Text>
                  <MoreVertical size={20} color="#94a3b8" />
                </View>
                <View style={styles.chartCanvas}>
                  {revenueByMonth.map((d, i) => (
                    <View key={i} style={styles.barGroup}>
                      <View style={styles.barValueLabel}>₹{d.value}k</View>
                      <View style={[styles.bar, { height: (d.value / 800) * 200, backgroundColor: d.trend === 'up' ? '#1d3557' : '#ef4444' }]} />
                      <Text style={styles.barXLabel}>{d.month}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Categorical Distribution */}
              <View style={styles.distModule}>
                <View style={styles.moduleHeader}>
                  <Text style={styles.moduleTitle}>Sales by Category</Text>
                </View>
                <View style={styles.distContent}>
                  {stats.ticketsByCat.map((cat, i) => (
                    <View key={i} style={styles.distItem}>
                      <View style={styles.distHeader}>
                        <Text style={styles.distName}>{cat.category}</Text>
                        <Text style={styles.distStats}>{cat.count} / {cat.total}</Text>
                      </View>
                      <View style={styles.distProgressBg}>
                        <View style={[styles.distProgressFill, { width: `${(cat.count/cat.total)*100}%`, backgroundColor: cat.color }]} />
                      </View>
                      <Text style={styles.distPercent}>{Math.round((cat.count/cat.total)*100)}% Capacity Sold</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Recent Transactions Table */}
            <View style={styles.tableModule}>
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleTitle}>Recent High-Value Bookings</Text>
                <TouchableOpacity style={styles.viewMore}>
                  <Text style={styles.viewMoreText}>View All</Text>
                  <ArrowRight size={14} color="#1d3557" />
                </TouchableOpacity>
              </View>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHCell, { flex: 2 }]}>CUSTOMER</Text>
                  <Text style={styles.tableHCell}>CATEGORY</Text>
                  <Text style={styles.tableHCell}>SEATS</Text>
                  <Text style={styles.tableHCell}>AMOUNT</Text>
                  <Text style={styles.tableHCell}>STATUS</Text>
                </View>
                {[1,2,3,4,5].map(i => (
                  <View key={i} style={styles.tableRow}>
                    <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                      <View style={styles.userInitial}><Text style={styles.initialText}>JD</Text></View>
                      <Text style={styles.customerName}>John Doe</Text>
                    </View>
                    <Text style={styles.tableCell}>VIP Gold</Text>
                    <Text style={styles.tableCell}>R12-S{40+i}</Text>
                    <Text style={[styles.tableCell, { fontWeight: '800' }]}>₹4,500</Text>
                    <View style={styles.tableCell}>
                      <View style={styles.statusBadge}><Text style={styles.statusText}>SUCCESS</Text></View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
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
  filterBtn: {
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
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    height: 52,
    borderRadius: 16,
  },
  downloadText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  scrollArea: {
    gap: 32,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 24,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 16,
  },
  kpiValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1e293b",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#10b981",
  },
  kpiFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  kpiFooterText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  miniProgress: {
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  analyticsGrid: {
    flexDirection: "row",
    gap: 24,
  },
  chartModule: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  distModule: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1e293b",
  },
  chartCanvas: {
    height: 300,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  barGroup: {
    alignItems: "center",
    gap: 12,
  },
  bar: {
    width: 48,
    borderRadius: 12,
    minHeight: 20,
  },
  barValueLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
  },
  barXLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  distContent: {
    gap: 32,
  },
  distItem: {
    gap: 12,
  },
  distHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  distName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1e293b",
  },
  distStats: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  distProgressBg: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  distProgressFill: {
    height: "100%",
  },
  distPercent: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
  },
  tableModule: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  viewMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableHCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  userInitial: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  statusBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AdminAnalyticsScreen;
