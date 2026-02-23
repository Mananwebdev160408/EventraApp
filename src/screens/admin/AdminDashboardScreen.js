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
  RefreshControl,
  Animated,
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
  BarChart3,
  ShieldAlert,
  DoorOpen,
  ArrowUpRight,
  ArrowDownRight,
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

  // Dynamic heatmap heat blobs — zone names + scaled positions for larger oval
  const INITIAL_BLOBS = [
    { id: 0, x: 155, y: 15, size: 42, intensity: 0.85, zone: "Main Gate" },
    { id: 1, x: 220, y: 22, size: 36, intensity: 0.6, zone: "Gate B" },
    { id: 2, x: 18, y: 70, size: 38, intensity: 0.5, zone: "West Stand Lower" },
    {
      id: 3,
      x: 22,
      y: 115,
      size: 34,
      intensity: 0.7,
      zone: "West Stand Upper",
    },
    { id: 4, x: 320, y: 65, size: 40, intensity: 0.4, zone: "VIP East" },
    { id: 5, x: 315, y: 120, size: 32, intensity: 0.55, zone: "VIP Lounge" },
    { id: 6, x: 130, y: 178, size: 40, intensity: 0.9, zone: "South Stand" },
    { id: 7, x: 210, y: 182, size: 34, intensity: 0.65, zone: "South Gate" },
    { id: 8, x: 100, y: 242, size: 30, intensity: 0.45, zone: "Food Court A" },
    { id: 9, x: 295, y: 40, size: 28, intensity: 0.35, zone: "Food Court B" },
    {
      id: 10,
      x: 170,
      y: 30,
      size: 26,
      intensity: 0.3,
      zone: "North Concourse",
    },
    { id: 11, x: 55, y: 160, size: 32, intensity: 0.75, zone: "Merch Zone" },
    { id: 12, x: 290, y: 162, size: 28, intensity: 0.6, zone: "East Corridor" },
    { id: 13, x: 65, y: 38, size: 24, intensity: 0.4, zone: "NW Corner" },
    { id: 14, x: 275, y: 32, size: 26, intensity: 0.5, zone: "NE Corner" },
    { id: 15, x: 70, y: 160, size: 28, intensity: 0.55, zone: "SW Corner" },
    { id: 16, x: 280, y: 168, size: 24, intensity: 0.45, zone: "SE Corner" },
    {
      id: 17,
      x: 170,
      y: 175,
      size: 20,
      intensity: 0.25,
      zone: "South Concourse",
    },
  ];

  const [heatBlobs, setHeatBlobs] = useState(INITIAL_BLOBS);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [densityTimeline, setDensityTimeline] = useState([]);
  const [crushRisk, setCrushRisk] = useState({
    score: 0,
    label: "Safe",
    color: "#10b981",
  });
  const [gateFlows, setGateFlows] = useState([
    { name: "Gate A", rate: 280, trend: "up" },
    { name: "Gate B", rate: 560, trend: "up" },
    { name: "Gate C", rate: 120, trend: "down" },
    { name: "Gate D", rate: 340, trend: "up" },
  ]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sectorTimer = useRef(null);
  const prevCriticalRef = useRef(new Set());
  const timelineScrollRef = useRef(null);

  // Map intensity → color
  const getBlobColor = (val) => {
    if (val > 0.8) return "rgba(185, 28, 28, 0.85)"; // Critical red
    if (val > 0.6) return "rgba(239, 68, 68, 0.75)"; // Red
    if (val > 0.4) return "rgba(245, 158, 11, 0.65)"; // Orange/yellow
    if (val > 0.2) return "rgba(16, 185, 129, 0.55)"; // Green
    return "rgba(59, 130, 246, 0.4)"; // Cool blue
  };

  // Dynamic heatmap interval — random walk each blob
  useEffect(() => {
    sectorTimer.current = setInterval(() => {
      setHeatBlobs((prev) => {
        const updated = prev.map((blob) => {
          const drift = (Math.random() - 0.5) * 0.18;
          const spike = Math.random() < 0.08 ? (Math.random() - 0.3) * 0.4 : 0;
          const newIntensity = Math.max(
            0.05,
            Math.min(1, blob.intensity + drift + spike),
          );
          const baseSize = INITIAL_BLOBS[blob.id].size;
          const newSize = baseSize + (newIntensity - 0.5) * 14;
          return {
            ...blob,
            intensity: newIntensity,
            size: Math.max(16, newSize),
          };
        });

        // Detect NEW critical zones (just crossed above 0.8)
        const newCriticals = [];
        updated.forEach((blob) => {
          if (blob.intensity > 0.8 && !prevCriticalRef.current.has(blob.id)) {
            newCriticals.push(blob);
          }
        });

        // Update the critical tracking set
        const currentCriticalIds = new Set(
          updated.filter((b) => b.intensity > 0.8).map((b) => b.id),
        );
        prevCriticalRef.current = currentCriticalIds;

        // Add critical zone alerts to operational log
        if (newCriticals.length > 0) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const newAlerts = newCriticals.map((blob) => ({
            id: `critical-${blob.id}-${Date.now()}`,
            type: "HEATMAP",
            text: `⚠️ Critical crowd density at ${blob.zone}`,
            time: timeStr,
            icon: <Flame size={16} color="#b91c1c" />,
            iconBg: "rgba(185, 28, 28, 0.1)",
          }));
          setCriticalAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
        }

        // Calculate shared stats
        const avgDensity =
          updated.reduce((a, b) => a + b.intensity, 0) / updated.length;
        const criticalCount = updated.filter((b) => b.intensity > 0.8).length;
        const peakBlob = updated.reduce(
          (a, b) => (b.intensity > a.intensity ? b : a),
          updated[0],
        );

        // Push to density timeline
        const now = new Date();
        setDensityTimeline((prev) => {
          const mm = String(now.getMinutes()).padStart(2, "0");
          const ss = String(now.getSeconds()).padStart(2, "0");
          return [
            ...prev,
            {
              time: `${mm}:${ss}`,
              avg: avgDensity,
              peak: peakBlob.zone,
              peakVal: peakBlob.intensity,
              criticals: criticalCount,
            },
          ].slice(-20);
        });

        // Stampede Risk Score
        const rawScore = Math.round(
          criticalCount * 25 + avgDensity * 50 + peakBlob.intensity * 25,
        );
        const score = Math.min(100, Math.max(0, rawScore));
        const riskLabel =
          score > 80
            ? "DANGER"
            : score > 60
              ? "High Risk"
              : score > 30
                ? "Elevated"
                : "Safe";
        const riskColor =
          score > 80
            ? "#b91c1c"
            : score > 60
              ? "#ef4444"
              : score > 30
                ? "#f59e0b"
                : "#10b981";
        setCrushRisk({ score, label: riskLabel, color: riskColor });

        // Gate Flow simulation
        setGateFlows((prev) =>
          prev.map((gate) => {
            const drift = Math.round((Math.random() - 0.5) * 80);
            const newRate = Math.max(50, Math.min(1200, gate.rate + drift));
            return { ...gate, rate: newRate, trend: drift > 0 ? "up" : "down" };
          }),
        );

        return updated;
      });
    }, 2000);
    return () => clearInterval(sectorTimer.current);
  }, []);

  // Auto-scroll timeline to the right when new data arrives
  useEffect(() => {
    if (timelineScrollRef.current && densityTimeline.length > 8) {
      setTimeout(() => {
        timelineScrollRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  }, [densityTimeline.length]);

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
            onPress={() => navigation.navigate("AdminProfile")}
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
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => navigation.navigate("AdminAnalytics")}
                >
                  <View style={styles.aiTitleRow}>
                    <View style={styles.heatmapBadge}>
                      <Flame size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>Real-time Heatmap</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text style={styles.viewAllText}>Full Analytics</Text>
                    <ChevronRight size={14} color={COLORS.brandPurple} />
                  </View>
                </TouchableOpacity>

                <View style={styles.heatmapCard}>
                  <View style={styles.stadiumMock}>
                    <View style={styles.stadiumOval}>
                      {/* Heat blobs */}
                      {heatBlobs.map((blob) => (
                        <View
                          key={blob.id}
                          style={[
                            styles.heatBlob,
                            {
                              left: blob.x - blob.size / 2,
                              top: blob.y - blob.size / 2,
                              width: blob.size,
                              height: blob.size,
                              borderRadius: blob.size / 2,
                              backgroundColor: getBlobColor(blob.intensity),
                            },
                          ]}
                        />
                      ))}
                      {/* Outer glow rings for high-intensity blobs */}
                      {heatBlobs
                        .filter((b) => b.intensity > 0.6)
                        .map((blob) => (
                          <View
                            key={`glow-${blob.id}`}
                            style={[
                              styles.heatBlob,
                              {
                                left: blob.x - blob.size * 0.8,
                                top: blob.y - blob.size * 0.8,
                                width: blob.size * 1.6,
                                height: blob.size * 1.6,
                                borderRadius: blob.size * 0.8,
                                backgroundColor: getBlobColor(blob.intensity),
                                opacity: 0.25,
                              },
                            ]}
                          />
                        ))}
                      {/* Center pitch */}
                      <View style={styles.centerPitch}>
                        <View style={styles.pitchLines} />
                      </View>

                      {/* Zone labels */}
                      {heatBlobs
                        .filter(
                          (b) =>
                            !b.zone.includes("Corner") &&
                            b.zone !== "Center Field",
                        )
                        .map((blob) => {
                          const shortName = blob.zone
                            .replace("West Stand Lower", "W-Lower")
                            .replace("West Stand Upper", "W-Upper")
                            .replace("North Concourse", "N-Concse")
                            .replace("East Corridor", "E-Corridor")
                            .replace("Food Court A", "🍔 Food A")
                            .replace("Food Court B", "🍔 Food B")
                            .replace("Main Gate", "🚪 Gate A")
                            .replace("Gate B", "🚪 Gate B")
                            .replace("South Stand", "S-Stand")
                            .replace("South Gate", "🚪 S-Gate")
                            .replace("VIP East", "⭐ VIP E")
                            .replace("VIP Lounge", "⭐ VIP")
                            .replace("Merch Zone", "🛍 Merch");
                          return (
                            <View
                              key={`label-${blob.id}`}
                              style={[
                                styles.zoneLabel,
                                {
                                  left: blob.x - 20,
                                  top: blob.y + blob.size / 2 + 1,
                                },
                              ]}
                            >
                              <Text style={styles.zoneLabelText}>
                                {shortName}
                              </Text>
                            </View>
                          );
                        })}
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

              {/* Stampede Risk Gauge */}
              <View style={styles.gaugeContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.aiTitleRow}>
                    <View
                      style={[
                        styles.heatmapBadge,
                        { backgroundColor: crushRisk.color },
                      ]}
                    >
                      <ShieldAlert size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>Crush Risk Score</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: crushRisk.color,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: crushRisk.color,
                        fontWeight: "800",
                      }}
                    >
                      {crushRisk.label.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.gaugeCard}>
                  {/* Semicircular gauge */}
                  <View style={styles.gaugeArc}>
                    {/* Background arc */}
                    <View style={styles.gaugeBg} />
                    {/* Fill arc - rotate based on score */}
                    <View
                      style={[
                        styles.gaugeFill,
                        {
                          borderTopColor: crushRisk.color,
                          borderRightColor: crushRisk.color,
                          transform: [
                            {
                              rotate: `${Math.min(180, crushRisk.score * 1.8)}deg`,
                            },
                          ],
                        },
                      ]}
                    />
                    {/* Cover bottom half */}
                    <View style={styles.gaugeBottom} />
                    {/* Score text */}
                    <View style={styles.gaugeCenter}>
                      <Animated.Text
                        style={[
                          styles.gaugeScore,
                          {
                            color: crushRisk.color,
                            transform: [
                              { scale: crushRisk.score > 80 ? pulseAnim : 1 },
                            ],
                          },
                        ]}
                      >
                        {crushRisk.score}
                      </Animated.Text>
                      <Text style={styles.gaugeLabel}>/ 100</Text>
                    </View>
                  </View>

                  {/* Gauge scale */}
                  <View style={styles.gaugeScale}>
                    <Text style={[styles.gaugeScaleText, { color: "#10b981" }]}>
                      Safe
                    </Text>
                    <Text style={[styles.gaugeScaleText, { color: "#f59e0b" }]}>
                      Elevated
                    </Text>
                    <Text style={[styles.gaugeScaleText, { color: "#ef4444" }]}>
                      High
                    </Text>
                    <Text style={[styles.gaugeScaleText, { color: "#b91c1c" }]}>
                      Danger
                    </Text>
                  </View>

                  {/* Risk details */}
                  <View style={styles.riskDetails}>
                    <View style={styles.riskDetail}>
                      <Text style={styles.riskDetailLabel}>Critical Zones</Text>
                      <Text
                        style={[
                          styles.riskDetailValue,
                          {
                            color: crushRisk.score > 60 ? "#ef4444" : "#1d3557",
                          },
                        ]}
                      >
                        {densityTimeline.length > 0
                          ? densityTimeline[densityTimeline.length - 1]
                              ?.criticals
                          : 0}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.riskDetail,
                        {
                          borderLeftWidth: 1,
                          borderRightWidth: 1,
                          borderColor: "#f1f5f9",
                        },
                      ]}
                    >
                      <Text style={styles.riskDetailLabel}>Avg Density</Text>
                      <Text style={styles.riskDetailValue}>
                        {densityTimeline.length > 0
                          ? (
                              densityTimeline[densityTimeline.length - 1]?.avg *
                              100
                            ).toFixed(0)
                          : 0}
                        %
                      </Text>
                    </View>
                    <View style={styles.riskDetail}>
                      <Text style={styles.riskDetailLabel}>Peak Zone</Text>
                      <Text style={styles.riskDetailValue} numberOfLines={1}>
                        {densityTimeline.length > 0
                          ? densityTimeline[densityTimeline.length - 1]?.peak
                          : "—"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Crowd Density Timeline */}
              <View style={styles.timelineContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.aiTitleRow}>
                    <View
                      style={[
                        styles.heatmapBadge,
                        { backgroundColor: "#1d3557" },
                      ]}
                    >
                      <BarChart3 size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>
                      Crowd Density Timeline
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#2a9d8f",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#2a9d8f",
                        fontWeight: "800",
                      }}
                    >
                      LIVE
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineCard}>
                  {/* Y-axis labels */}
                  <View style={styles.timelineYAxis}>
                    <Text style={styles.yAxisLabel}>Critical</Text>
                    <Text style={styles.yAxisLabel}>High</Text>
                    <Text style={styles.yAxisLabel}>Med</Text>
                    <Text style={styles.yAxisLabel}>Low</Text>
                  </View>

                  {/* Chart area */}
                  <View style={styles.timelineChartArea}>
                    {/* Threshold grid lines */}
                    <View style={[styles.gridLine, { bottom: "80%" }]} />
                    <View style={[styles.gridLine, { bottom: "60%" }]} />
                    <View style={[styles.gridLine, { bottom: "35%" }]} />

                    {/* Bars */}
                    <ScrollView
                      ref={timelineScrollRef}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.timelineBarsContainer}
                    >
                      {densityTimeline.map((point, i) => {
                        const barHeight = Math.max(8, point.avg * 100);
                        const barColor =
                          point.avg > 0.8
                            ? "#b91c1c"
                            : point.avg > 0.6
                              ? "#ef4444"
                              : point.avg > 0.4
                                ? "#f59e0b"
                                : point.avg > 0.2
                                  ? "#10b981"
                                  : "#3b82f6";
                        const isLatest = i === densityTimeline.length - 1;
                        return (
                          <View key={i} style={styles.timelineBarGroup}>
                            <View style={styles.timelineBarWrapper}>
                              <View
                                style={[
                                  styles.timelineBar,
                                  {
                                    height: `${barHeight}%`,
                                    backgroundColor: barColor,
                                    opacity: isLatest ? 1 : 0.7,
                                    borderWidth: isLatest ? 2 : 0,
                                    borderColor: isLatest
                                      ? "#1d3557"
                                      : "transparent",
                                  },
                                ]}
                              />
                              {/* Peak dot for critical bars */}
                              {point.avg > 0.7 && (
                                <View style={styles.peakDot} />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.timelineTime,
                                isLatest && {
                                  color: "#1d3557",
                                  fontWeight: "900",
                                },
                              ]}
                            >
                              {point.time}
                            </Text>
                          </View>
                        );
                      })}

                      {densityTimeline.length === 0 && (
                        <View style={styles.timelineEmpty}>
                          <Text style={styles.timelineEmptyText}>
                            Collecting data...
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>

                {/* Timeline summary stats */}
                {densityTimeline.length > 0 && (
                  <View style={styles.timelineSummary}>
                    <View style={styles.timelineStat}>
                      <Text style={styles.timelineStatLabel}>Current Avg</Text>
                      <Text
                        style={[
                          styles.timelineStatValue,
                          {
                            color:
                              densityTimeline[densityTimeline.length - 1]?.avg >
                              0.6
                                ? "#ef4444"
                                : "#1d3557",
                          },
                        ]}
                      >
                        {(
                          densityTimeline[densityTimeline.length - 1]?.avg * 100
                        ).toFixed(0)}
                        %
                      </Text>
                    </View>
                    <View style={styles.timelineStat}>
                      <Text style={styles.timelineStatLabel}>Peak Zone</Text>
                      <Text style={styles.timelineStatValue} numberOfLines={1}>
                        {densityTimeline[densityTimeline.length - 1]?.peak}
                      </Text>
                    </View>
                    <View style={styles.timelineStat}>
                      <Text style={styles.timelineStatLabel}>
                        Critical Zones
                      </Text>
                      <Text
                        style={[
                          styles.timelineStatValue,
                          {
                            color:
                              densityTimeline[densityTimeline.length - 1]
                                ?.criticals > 0
                                ? "#b91c1c"
                                : "#10b981",
                          },
                        ]}
                      >
                        {densityTimeline[densityTimeline.length - 1]?.criticals}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Gate Flow Monitor */}
              <View style={styles.gateFlowContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.aiTitleRow}>
                    <View
                      style={[
                        styles.heatmapBadge,
                        { backgroundColor: "#457b9d" },
                      ]}
                    >
                      <DoorOpen size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>Gate Flow Monitor</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#2a9d8f",
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#2a9d8f",
                        fontWeight: "800",
                      }}
                    >
                      LIVE
                    </Text>
                  </View>
                </View>

                <View style={styles.gateFlowCard}>
                  {gateFlows.map((gate, i) => {
                    const status =
                      gate.rate > 700
                        ? "Congested"
                        : gate.rate > 400
                          ? "Busy"
                          : "Normal";
                    const statusColor =
                      gate.rate > 700
                        ? "#b91c1c"
                        : gate.rate > 400
                          ? "#f59e0b"
                          : "#10b981";
                    const fillPct = Math.min(100, (gate.rate / 1200) * 100);
                    return (
                      <View
                        key={i}
                        style={[
                          styles.gateRow,
                          i < gateFlows.length - 1 && {
                            borderBottomWidth: 1,
                            borderBottomColor: "#f1f5f9",
                          },
                        ]}
                      >
                        <View style={styles.gateInfo}>
                          <View
                            style={[
                              styles.gateBadge,
                              { backgroundColor: `${statusColor}15` },
                            ]}
                          >
                            <DoorOpen size={14} color={statusColor} />
                          </View>
                          <View>
                            <Text style={styles.gateName}>{gate.name}</Text>
                            <View style={styles.gateBarBg}>
                              <View
                                style={[
                                  styles.gateBarFill,
                                  {
                                    width: `${fillPct}%`,
                                    backgroundColor: statusColor,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        </View>
                        <View style={styles.gateStats}>
                          <View style={styles.gateRateRow}>
                            {gate.trend === "up" ? (
                              <ArrowUpRight
                                size={12}
                                color={gate.rate > 700 ? "#b91c1c" : "#1d3557"}
                              />
                            ) : (
                              <ArrowDownRight size={12} color="#10b981" />
                            )}
                            <Text
                              style={[
                                styles.gateRate,
                                gate.rate > 700 && { color: "#b91c1c" },
                              ]}
                            >
                              {gate.rate}/min
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: `${statusColor}15` },
                            ]}
                          >
                            <View
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: 3,
                                backgroundColor: statusColor,
                              }}
                            />
                            <Text
                              style={[
                                styles.statusText,
                                { color: statusColor },
                              ]}
                            >
                              {status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
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
                {[...criticalAlerts, ...dashboardData.recentActivity].map(
                  (item) => (
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
                  ),
                )}

                {[...criticalAlerts, ...dashboardData.recentActivity].length ===
                  0 && (
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
    height: 230,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stadiumOval: {
    width: 340,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f0f4f0",
    overflow: "hidden",
    position: "relative",
  },
  heatBlob: {
    position: "absolute",
  },
  zoneLabel: {
    position: "absolute",
    backgroundColor: "rgba(29, 53, 87, 0.75)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    zIndex: 10,
  },
  zoneLabelText: {
    color: "#FFFFFF",
    fontSize: 6.5,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  centerPitch: {
    position: "absolute",
    top: 55,
    left: 70,
    right: 70,
    bottom: 55,
    backgroundColor: "#059669",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  pitchLines: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.4)",
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
  // — Crowd Density Timeline —
  timelineContainer: {
    marginBottom: 32,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  timelineYAxis: {
    width: 40,
    justifyContent: "space-between",
    paddingVertical: 4,
    marginRight: 8,
    height: 140,
  },
  yAxisLabel: {
    fontSize: 8,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timelineChartArea: {
    flex: 1,
    height: 140,
    position: "relative",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  timelineBarsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 4,
    height: "100%",
    gap: 4,
  },
  timelineBarGroup: {
    alignItems: "center",
    width: 28,
  },
  timelineBarWrapper: {
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  timelineBar: {
    width: 16,
    borderRadius: 4,
    minHeight: 6,
  },
  peakDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#b91c1c",
    position: "absolute",
    top: 0,
  },
  timelineTime: {
    fontSize: 7,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 4,
  },
  timelineEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  timelineEmptyText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  timelineSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  timelineStat: {
    flex: 1,
    alignItems: "center",
  },
  timelineStatLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  timelineStatValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  // — Stampede Risk Gauge —
  gaugeContainer: {
    marginBottom: 32,
  },
  gaugeCard: {
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
  gaugeArc: {
    width: 180,
    height: 90,
    overflow: "hidden",
    position: "relative",
    marginBottom: 12,
  },
  gaugeBg: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 14,
    borderColor: "#f1f5f9",
    position: "absolute",
    top: 0,
  },
  gaugeFill: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 14,
    borderColor: "transparent",
    position: "absolute",
    top: 0,
  },
  gaugeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.white,
  },
  gaugeCenter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  gaugeScore: {
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 44,
  },
  gaugeLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "700",
    marginTop: -2,
  },
  gaugeScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  gaugeScaleText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  riskDetails: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 14,
  },
  riskDetail: {
    flex: 1,
    alignItems: "center",
  },
  riskDetailLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  riskDetailValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d3557",
  },
  // — Gate Flow Monitor —
  gateFlowContainer: {
    marginBottom: 32,
  },
  gateFlowCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  gateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  gateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  gateBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  gateName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  gateBarBg: {
    width: 80,
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
    overflow: "hidden",
  },
  gateBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  gateStats: {
    alignItems: "flex-end",
    gap: 4,
  },
  gateRateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  gateRate: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1d3557",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

export default AdminDashboardScreen;
