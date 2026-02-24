import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import MapView, { Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Flame,
  Users,
  Info,
  Zap,
  Shield,
} from "lucide-react-native";
import { Client } from "@stomp/stompjs";
import { API_CONFIG } from "../../api/config";
import { COLORS } from "../../constants/theme";

const STADIUM_CENTER = { latitude: 28.6127, longitude: 77.2292 };
const STADIUM_RADIUS = 0.004;

const ZONES = [
  { name: "Main Gate", lat: 28.614, lng: 77.229, baseIntensity: 0 },
  { name: "South Stand", lat: 28.6115, lng: 77.2285, baseIntensity: 0 },
  { name: "VIP Lounge", lat: 28.6132, lng: 77.2305, baseIntensity: 0 },
  { name: "Food Court", lat: 28.612, lng: 77.23, baseIntensity: 0 },
  { name: "North Stand", lat: 28.6145, lng: 77.2295, baseIntensity: 0 },
  { name: "Merch Zone", lat: 28.6128, lng: 77.2275, baseIntensity: 0 },
  { name: "East Wing", lat: 28.6135, lng: 77.231, baseIntensity: 0 },
  { name: "Parking A", lat: 28.615, lng: 77.228, baseIntensity: 0 },
];

// ── Generate initial grid of heatmap points ──
const generateInitialGrid = () => {
  const points = [];
  const GRID_SIZE = 18; // 18x18 grid = 324 points

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const lat =
        STADIUM_CENTER.latitude -
        STADIUM_RADIUS +
        (i / GRID_SIZE) * STADIUM_RADIUS * 2;
      const lng =
        STADIUM_CENTER.longitude -
        STADIUM_RADIUS +
        (j / GRID_SIZE) * STADIUM_RADIUS * 2;

      // Calculate base weight from proximity to zone hotspots
      let weight = 0.05; // ambient floor
      ZONES.forEach((zone) => {
        const dist = Math.hypot(lat - zone.lat, lng - zone.lng);
        weight += zone.baseIntensity * Math.exp(-dist / 0.0012);
      });

      points.push({
        latitude: lat,
        longitude: lng,
        weight: Math.min(weight, 1) * 10, // scale up for heatmap visibility
        _baseWeight: Math.min(weight, 1),
      });
    }
  }
  return points;
};

// ── Hotspot burst: spike a random area ──
const addRandomHotspot = (points) => {
  const zone = ZONES[Math.floor(Math.random() * ZONES.length)];
  const cx = zone.lat + (Math.random() - 0.5) * 0.001;
  const cy = zone.lng + (Math.random() - 0.5) * 0.001;
  const intensity = 3 + Math.random() * 5;
  const radius = 0.0008 + Math.random() * 0.0008;

  return points.map((p) => {
    const dist = Math.hypot(p.latitude - cx, p.longitude - cy);
    const boost = intensity * Math.exp(-dist / radius);
    return { ...p, weight: Math.max(0.1, Math.min(p.weight + boost, 20)) };
  });
};

// ── Random walk: each point drifts slightly ──
const applyRandomWalk = (points, frame) => {
  return points.map((p) => {
    // Sine wave modulation for smooth organic motion
    const sineWave =
      Math.sin(p.latitude * 500 + frame * 0.08) *
      Math.cos(p.longitude * 500 + frame * 0.06) *
      1.5;
    // Random drift
    const drift = (Math.random() - 0.5) * 0.4;
    // Pull back toward base weight to prevent runaway values
    const pullback = (p._baseWeight * 10 - p.weight) * 0.03;
    const newWeight = p.weight + sineWave * 0.15 + drift + pullback;
    return { ...p, weight: Math.max(0.1, Math.min(newWeight, 20)) };
  });
};

const LiveHeatmapScreen = ({ navigation }) => {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [peakZone, setPeakZone] = useState("Main Gate");
  const [isLive, setIsLive] = useState(false);
  const [heatmapKey, setHeatmapKey] = useState(0);
  const frameRef = useRef(0);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;
  const stompClient = useRef(null);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    // Initial simulation while connecting
    setHeatmapPoints(generateInitialGrid());

    const socketUrl = API_CONFIG.BASE_URL.replace("http", "ws") + "/ws";
    stompClient.current = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Heatmap Screen Connected");
        setIsLive(true);
        stompClient.current.subscribe("/topic/admin/heatmap", (message) => {
          const clusteredPoints = JSON.parse(message.body);
          if (clusteredPoints && clusteredPoints.length > 0) {
            updateWithRealData(clusteredPoints);
          }
        });
      },
    });

    stompClient.current.activate();
    return () => stompClient.current?.deactivate();
  }, []);

  const updateWithRealData = (points) => {
    setHeatmapPoints(
      points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
        weight: p.weight * 5, // Amplify for better heatmap visibility
      })),
    );

    const totalUsers = points.reduce((acc, p) => acc + p.weight, 0);
    setUserCount(totalUsers);

    // Peak zone logic
    let maxVal = 0;
    let maxZone = "Main Gate";
    ZONES.forEach((zone) => {
      const nearbyPoints = points.filter(
        (p) =>
          Math.hypot(p.latitude - zone.lat, p.longitude - zone.lng) < 0.0015,
      );
      const zoneWeight = nearbyPoints.reduce((a, p) => a + p.weight, 0);
      if (zoneWeight > maxVal) {
        maxVal = zoneWeight;
        maxZone = zone.name;
      }
    });
    setPeakZone(maxZone);
    setHeatmapKey((k) => k + 1);
  };

  // Keep simulation for empty data or background movement
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      frameRef.current += 1;
      setHeatmapPoints((prev) => {
        // Only simulate if we have very few points (likely just the test user)
        if (prev.length < 50) {
          let updated = applyRandomWalk(prev, frameRef.current);
          if (frameRef.current % 4 === 0) updated = addRandomHotspot(updated);
          return updated;
        }
        return prev;
      });
      setHeatmapKey((k) => k + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Filter valid points for the Heatmap component
  const validPoints = heatmapPoints
    .filter((p) => p.weight > 0.5)
    .map(({ latitude, longitude, weight }) => ({
      latitude,
      longitude,
      weight,
    }));

  const density =
    userCount > 800
      ? "Critical"
      : userCount > 400
        ? "High"
        : userCount > 150
          ? "Medium"
          : "Low";
  const densityColor =
    userCount > 800
      ? "#e63946"
      : userCount > 400
        ? "#f4a261"
        : userCount > 150
          ? "#2a9d8f"
          : "#457b9d";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: STADIUM_CENTER.latitude,
          longitude: STADIUM_CENTER.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }}
        customMapStyle={mapStyle}
      >
        {validPoints.length > 0 && (
          <Heatmap
            key={`heatmap-${heatmapKey}`}
            points={validPoints}
            radius={35}
            opacity={0.75}
            gradient={{
              colors: ["#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#e63946"],
              startPoints: [0.05, 0.2, 0.4, 0.65, 0.85],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      {/* Header Overlay */}
      <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Live Stadium Heatmap</Text>
            <View style={styles.statusRow}>
              {isLive ? (
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: "#2a9d8f",
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
              ) : (
                <View
                  style={[styles.statusDot, { backgroundColor: "#e63946" }]}
                />
              )}
              <Text style={styles.statusText}>
                {isLive ? "LIVE — Simulated Data" : "Initializing..."}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Stats Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.statsRow}>
          {/* Active Users */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: "rgba(29, 53, 87, 0.08)" },
              ]}
            >
              <Users size={18} color="#1d3557" />
            </View>
            <View>
              <Text style={styles.statLabel}>Active Fans</Text>
              <Text style={styles.statValue}>{userCount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Density */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: `${densityColor}18` },
              ]}
            >
              <Flame size={18} color={densityColor} />
            </View>
            <View>
              <Text style={styles.statLabel}>Density</Text>
              <Text style={[styles.statValue, { color: densityColor }]}>
                {density}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {/* Peak Zone */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: "rgba(230, 57, 70, 0.08)" },
              ]}
            >
              <Zap size={18} color="#e63946" />
            </View>
            <View>
              <Text style={styles.statLabel}>Hottest Zone</Text>
              <Text style={styles.statValue}>{peakZone}</Text>
            </View>
          </View>

          {/* Safety Status */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIconBox,
                { backgroundColor: "rgba(42, 157, 143, 0.08)" },
              ]}
            >
              <Shield size={18} color="#2a9d8f" />
            </View>
            <View>
              <Text style={styles.statLabel}>Safety</Text>
              <Text style={[styles.statValue, { color: "#2a9d8f" }]}>
                Normal
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Loading overlay */}
      {!isLive && (
        <View style={styles.loader}>
          <Flame size={48} color="#e63946" />
          <Text style={styles.loaderTitle}>Warming Up Heatmap</Text>
          <Text style={styles.loaderText}>
            Generating crowd simulation data...
          </Text>
        </View>
      )}
    </View>
  );
};

// ── Dark map theme ──
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4a574" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6a6a6a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e3a2e" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2a4a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a3e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2a3a5a" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2a2a4e" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a1a3e" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3a5a8a" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  bottomPanel: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    gap: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 9,
    color: "#457b9d",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1d3557",
    marginTop: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 26, 46, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loaderTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 20,
    marginTop: 8,
  },
  loaderText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default LiveHeatmapScreen;
