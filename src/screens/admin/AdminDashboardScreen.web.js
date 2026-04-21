import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
} from "react-native";
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
  BarChart3,
  ShieldAlert,
  DoorOpen,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Search,
  Bell,
  Settings,
  Plus,
  Radio,
  Clock,
  History,
  ShieldCheck,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { eventService, bookingService, sosService } from "../../api/services";
import AdminSidebar from "../../components/AdminSidebar.web";

const AdminDashboardScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { stadiumLocation, stadiumId } = useUser();
  const { userInfo } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
    liveEvent: null,
    attendance: "0 / 0",
    capacityPercent: 0,
    storeRevenue: "₹0",
    eventsCount: 0,
    activeAlerts: 0,
    recentActivity: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");

  // Mock heatmap blobs
  const [heatBlobs, setHeatBlobs] = useState([
    { id: 0, x: 155, y: 15, size: 42, intensity: 0.85, zone: "Main Gate" },
    { id: 1, x: 220, y: 22, size: 36, intensity: 0.6, zone: "Gate B" },
    { id: 2, x: 18, y: 70, size: 38, intensity: 0.5, zone: "West Stand Lower" },
    { id: 3, x: 22, y: 115, size: 34, intensity: 0.7, zone: "West Stand Upper" },
    { id: 4, x: 320, y: 65, size: 40, intensity: 0.4, zone: "VIP East" },
    { id: 5, x: 315, y: 120, size: 32, intensity: 0.55, zone: "VIP Lounge" },
    { id: 6, x: 130, y: 178, size: 40, intensity: 0.9, zone: "South Stand" },
  ]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(simulateHeatmap, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateHeatmap = () => {
    setHeatBlobs(prev => prev.map(blob => ({
      ...blob,
      intensity: Math.max(0.2, Math.min(1, blob.intensity + (Math.random() - 0.5) * 0.2)),
      size: Math.max(20, Math.min(50, blob.size + (Math.random() - 0.5) * 5))
    })));
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [events, sosAlerts] = await Promise.all([
        eventService.getEvents(),
        sosService.getAllSos(),
      ]);

      const myStadiumEvents = Array.isArray(events) ? events.filter(e => e.stadiumId === stadiumId) : [];
      let liveEvent = myStadiumEvents.find(e => e.live) || myStadiumEvents[0] || {
        title: "IPL 2026: Mumbai Indians vs CSK",
        venue: "Wankhede Stadium",
        totalTicketsSold: 32450,
        capacity: 35000,
      };

      setDashboardData({
        liveEvent,
        attendance: `${liveEvent.totalTicketsSold.toLocaleString()} / ${liveEvent.capacity.toLocaleString()}`,
        capacityPercent: Math.round((liveEvent.totalTicketsSold / liveEvent.capacity) * 100),
        storeRevenue: `₹${(liveEvent.totalTicketsSold * 150).toLocaleString()}`,
        eventsCount: myStadiumEvents.length,
        activeAlerts: Array.isArray(sosAlerts) ? sosAlerts.length : 0,
        recentActivity: (Array.isArray(sosAlerts) ? sosAlerts : []).slice(0, 5).map(a => ({
          id: a.id,
          type: "SOS",
          text: `Emergency alert from Zone B`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBlobColor = (val) => {
    if (val > 0.8) return "#ef4444";
    if (val > 0.5) return "#f59e0b";
    return "#10b981";
  };

  if (!isDesktop) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Switch to Desktop</Text>
        <Text style={{color: '#64748b', marginTop: 8}}>Admin Control Center is optimized for large displays.</Text>
        
      </View>
    );
  }

  return (
    <View style={styles.desktopWrapper}>
      <StatusBar style="light" />
      
      {/* 1. Sidebar Navigation */}
      <AdminSidebar navigation={navigation} activeNav="Dashboard" />

      {/* 2. Main Canvas */}
      <View style={styles.mainCanvas}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.searchBar}>
            <Search size={18} color="#64748b" />
            <Text style={styles.searchText}>Search analytics, zones, or users...</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Bell size={20} color="#1e293b" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Settings size={20} color="#1e293b" />
            </TouchableOpacity>
            <View style={styles.locationBadge}>
              <MapPin size={14} color={COLORS.error} />
              <Text style={styles.locationText}>{stadiumLocation?.toUpperCase() || "WANKHEDE STADIUM"}</Text>
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1d3557" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Top Stats Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Users size={24} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.statValue}>{dashboardData.attendance.split(' / ')[0]}</Text>
                  <Text style={styles.statLabel}>Current Attendance</Text>
                </View>
                <View style={styles.statTrend}>
                  <ArrowUpRight size={14} color="#10b981" />
                  <Text style={styles.trendText}>12%</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <AlertCircle size={24} color="#ef4444" />
                </View>
                <View>
                  <Text style={styles.statValue}>{dashboardData.activeAlerts}</Text>
                  <Text style={styles.statLabel}>Active SOS Alerts</Text>
                </View>
                {dashboardData.activeAlerts > 0 && <View style={styles.alertPulse} />}
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <ShoppingBag size={24} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.statValue}>{dashboardData.storeRevenue}</Text>
                  <Text style={styles.statLabel}>Store Revenue</Text>
                </View>
                <View style={styles.statTrend}>
                  <ArrowUpRight size={14} color="#10b981" />
                  <Text style={styles.trendText}>₹4.2k</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <TrendingUp size={24} color="#8b5cf6" />
                </View>
                <View>
                  <Text style={styles.statValue}>{dashboardData.capacityPercent}%</Text>
                  <Text style={styles.statLabel}>Stadium Load</Text>
                </View>
                <View style={styles.capacityProgress}>
                  <View style={[styles.capacityFill, { width: `${dashboardData.capacityPercent}%` }]} />
                </View>
              </View>
            </View>

            {/* Content Grid */}
            <View style={styles.contentGrid}>
              {/* Left Column: Heatmap & Charts */}
              <View style={styles.gridLeft}>
                <View style={styles.dashboardModule}>
                  <View style={styles.moduleHeader}>
                    <View>
                      <Text style={styles.moduleTitle}>Live Crowd Heatmap</Text>
                      <Text style={styles.moduleSub}>Real-time density distribution across all zones</Text>
                    </View>
                    <View style={styles.liveStatus}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE MONITORING</Text>
                    </View>
                  </View>
                  
                  <View style={styles.heatmapCanvas}>
                    <View style={styles.stadiumOutline}>
                      {heatBlobs.map(blob => (
                        <View key={blob.id} style={[styles.heatBlob, { 
                          left: blob.x * 2.5, 
                          top: blob.y * 2.5, 
                          width: blob.size * 2, 
                          height: blob.size * 2, 
                          backgroundColor: getBlobColor(blob.intensity),
                          opacity: 0.6,
                        }]}>
                          <View style={styles.blobGlow} />
                        </View>
                      ))}
                      <View style={styles.pitchCenter}>
                        <View style={styles.pitchInner} />
                      </View>
                    </View>

                    <View style={styles.heatmapLegend}>
                      <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#10b981' }]} /><Text style={styles.legendText}>Safe</Text></View>
                      <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} /><Text style={styles.legendText}>Moderate</Text></View>
                      <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} /><Text style={styles.legendText}>Critical</Text></View>
                    </View>
                  </View>
                </View>

                <View style={styles.bottomChartsRow}>
                  <View style={styles.smallModule}>
                    <Text style={styles.moduleTitle}>Gate Traffic</Text>
                    <View style={styles.gateList}>
                      {['Gate A (Main)', 'Gate B', 'Gate C', 'Gate D'].map((gate, idx) => (
                        <View key={gate} style={styles.gateItem}>
                          <View style={styles.gateInfo}>
                            <DoorOpen size={16} color="#64748b" />
                            <Text style={styles.gateName}>{gate}</Text>
                          </View>
                          <View style={styles.gateProgressContainer}>
                            <View style={[styles.gateProgress, { width: `${40 + idx * 15}%`, backgroundColor: idx === 1 ? '#ef4444' : '#3b82f6' }]} />
                          </View>
                          <Text style={styles.gateValue}>{40 + idx * 15}%</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.smallModule}>
                    <Text style={styles.moduleTitle}>Crush Risk Trend</Text>
                    <View style={styles.chartPlaceholder}>
                      <BarChart3 size={40} color="#e2e8f0" />
                      <Text style={styles.chartPlaceholderText}>Analytics Engine Active</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Column: Activity & Alerts */}
              <View style={styles.gridRight}>
                <View style={styles.alertModule}>
                  <View style={styles.moduleHeader}>
                    <Text style={styles.moduleTitle}>Real-time Alerts</Text>
                    <View style={styles.badgeCount}>
                      <Text style={styles.badgeText}>{dashboardData.activeAlerts}</Text>
                    </View>
                  </View>
                  <ScrollView style={styles.alertList}>
                    {dashboardData.activeAlerts > 0 ? (
                      [1,2,3].map(i => (
                        <View key={i} style={styles.alertItem}>
                          <View style={styles.alertIconBox}>
                            <ShieldAlert size={18} color="#ef4444" />
                          </View>
                          <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Emergency SOS Signal</Text>
                            <Text style={styles.alertSub}>Zone B, Row 12, Seat 45</Text>
                            <Text style={styles.alertTime}>2 mins ago</Text>
                          </View>
                          <TouchableOpacity style={styles.respondBtn}>
                            <Text style={styles.respondText}>Respond</Text>
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyAlerts}>
                        <ShieldCheck size={40} color="#10b981" />
                        <Text style={styles.emptyText}>All Zones Secure</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>

                <View style={styles.activityModule}>
                  <Text style={styles.moduleTitle}>Operational Logs</Text>
                  <View style={styles.logList}>
                    {[
                      { t: 'Check-in', m: 'Gate B processing speed increased', i: <Users size={14} color="#3b82f6" /> },
                      { t: 'Security', m: 'Patrol assigned to South Stand', i: <ShieldCheck size={14} color="#10b981" /> },
                      { t: 'Store', m: 'Inventory low: Water (Zone A)', i: <ShoppingBag size={14} color="#f59e0b" /> },
                    ].map((log, i) => (
                      <View key={i} style={styles.logItem}>
                        <View style={styles.logDot} />
                        <View style={styles.logContent}>
                          <View style={styles.logHeader}>
                            <Text style={styles.logType}>{log.t}</Text>
                            <Text style={styles.logTime}>12:45 PM</Text>
                          </View>
                          <Text style={styles.logMsg}>{log.m}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
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
  mainCanvas: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  topHeader: {
    height: 80,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
    width: 400,
  },
  searchText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: "#fff",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  locationText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  statIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  statTrend: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "800",
  },
  alertPulse: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
  },
  capacityProgress: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 60,
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
  },
  capacityFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: 2,
  },
  contentGrid: {
    flexDirection: "row",
    gap: 24,
  },
  gridLeft: {
    flex: 2,
    gap: 24,
  },
  gridRight: {
    flex: 1,
    gap: 24,
  },
  dashboardModule: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1e293b",
  },
  moduleSub: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  liveStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ef4444",
  },
  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heatmapCanvas: {
    height: 400,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  stadiumOutline: {
    width: 600,
    height: 350,
    borderWidth: 4,
    borderColor: "#e2e8f0",
    borderRadius: 150,
    position: "relative",
  },
  pitchCenter: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  pitchInner: {
    width: "40%",
    height: "1px",
    backgroundColor: "#e2e8f0",
  },
  heatBlob: {
    position: "absolute",
    borderRadius: 100,
  },
  blobGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "inherit",
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
    borderRadius: 100,
  },
  heatmapLegend: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },
  bottomChartsRow: {
    flexDirection: "row",
    gap: 24,
  },
  smallModule: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  gateList: {
    marginTop: 20,
    gap: 16,
  },
  gateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 120,
  },
  gateName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  gateProgressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
  },
  gateProgress: {
    height: "100%",
    borderRadius: 3,
  },
  gateValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    width: 40,
    textAlign: "right",
  },
  chartPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  chartPlaceholderText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },
  alertModule: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 500,
  },
  badgeCount: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  alertList: {
    marginTop: 12,
  },
  alertItem: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1e293b",
  },
  alertSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  alertTime: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 6,
    fontWeight: "600",
  },
  respondBtn: {
    alignSelf: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  respondText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyAlerts: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  activityModule: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  logList: {
    marginTop: 20,
    gap: 20,
  },
  logItem: {
    flexDirection: "row",
    gap: 16,
  },
  logDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cbd5e1",
    marginTop: 6,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  logType: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e293b",
  },
  logTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
  logMsg: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AdminDashboardScreen;
