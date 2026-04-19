import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
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

const generateInitialGrid = () => {
  const points = [];
  const GRID_SIZE = 18;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const lat = STADIUM_CENTER.latitude - STADIUM_RADIUS + (i / GRID_SIZE) * STADIUM_RADIUS * 2;
      const lng = STADIUM_CENTER.longitude - STADIUM_RADIUS + (j / GRID_SIZE) * STADIUM_RADIUS * 2;
      let weight = 0.05;
      ZONES.forEach((zone) => {
        const dist = Math.hypot(lat - zone.lat, lng - zone.lng);
        weight += zone.baseIntensity * Math.exp(-dist / 0.0012);
      });
      points.push({
        latitude: lat,
        longitude: lng,
        weight: Math.min(weight, 1) * 10,
        _baseWeight: Math.min(weight, 1),
      });
    }
  }
  return points;
};

const applyRandomWalk = (points, frame) => {
  return points.map((p) => {
    const sineWave = Math.sin(p.latitude * 500 + frame * 0.08) * Math.cos(p.longitude * 500 + frame * 0.06) * 1.5;
    const drift = (Math.random() - 0.5) * 0.4;
    const pullback = (p._baseWeight * 10 - p.weight) * 0.03;
    const newWeight = p.weight + sineWave * 0.15 + drift + pullback;
    return { ...p, weight: Math.max(0.1, Math.min(newWeight, 20)) };
  });
};

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

const LiveHeatmapScreen = ({ navigation }) => {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [peakZone, setPeakZone] = useState("Main Gate");
  const [isLive, setIsLive] = useState(false);
  const frameRef = useRef(0);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 800, useNativeDriver: false }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    setHeatmapPoints(generateInitialGrid());
    // Web version runs in simulation mode — no backend dependency.
    setIsLive(true);
  }, []);

  const updateWithRealData = (points) => {
    setHeatmapPoints(points.map((p) => ({
      latitude: p.latitude,
      longitude: p.longitude,
      weight: p.weight * 5,
    })));
    const totalUsers = points.reduce((acc, p) => acc + p.weight, 0);
    setUserCount(totalUsers);
    let maxVal = 0;
    let maxZone = "Main Gate";
    ZONES.forEach((zone) => {
      const nearbyPoints = points.filter((p) => Math.hypot(p.latitude - zone.lat, p.longitude - zone.lng) < 0.0015);
      const zoneWeight = nearbyPoints.reduce((a, p) => a + p.weight, 0);
      if (zoneWeight > maxVal) {
        maxVal = zoneWeight;
        maxZone = zone.name;
      }
    });
    setPeakZone(maxZone);
  };

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      frameRef.current += 1;
      setHeatmapPoints((prev) => {
        if (prev.length < 50) {
          let updated = applyRandomWalk(prev, frameRef.current);
          if (frameRef.current % 4 === 0) updated = addRandomHotspot(updated);
          return updated;
        }
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const density = userCount > 800 ? "Critical" : userCount > 400 ? "High" : userCount > 150 ? "Medium" : "Low";
  const densityColor = userCount > 800 ? "#e63946" : userCount > 400 ? "#f4a261" : userCount > 150 ? "#2a9d8f" : "#457b9d";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Web-optimized visual representation instead of native MapView */}
      <View style={styles.webMapContainer}>
        <View style={styles.stadiumOutline}>
          <View style={styles.pitch} />
          {heatmapPoints.filter(p => p.weight > 2).map((p, i) => {
            const left = ((p.longitude - STADIUM_CENTER.longitude + STADIUM_RADIUS) / (STADIUM_RADIUS * 2)) * 100;
            const top = ((p.latitude - STADIUM_CENTER.latitude + STADIUM_RADIUS) / (STADIUM_RADIUS * 2)) * 100;
            return (
              <View 
                key={i}
                style={[
                  styles.heatPoint,
                  {
                    left: `${left}%`,
                    top: `${top}%`,
                    width: p.weight * 3,
                    height: p.weight * 3,
                    backgroundColor: p.weight > 12 ? '#e63946' : p.weight > 8 ? '#f4a261' : '#2a9d8f',
                    opacity: 0.4,
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.webOverlay}>
          <Text style={styles.webWarning}>WEB PREVIEW MODE</Text>
          <Text style={styles.webSubtext}>Live interactive maps are available on the mobile app.</Text>
        </View>
      </View>

      <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Live Stadium Heatmap</Text>
            <View style={styles.statusRow}>
              {isLive ? (
                <Animated.View style={[styles.statusDot, { backgroundColor: "#2a9d8f", transform: [{ scale: pulseAnim }] }]} />
              ) : (
                <View style={[styles.statusDot, { backgroundColor: "#e63946" }]} />
              )}
              <Text style={styles.statusText}>{isLive ? "LIVE — Web Simulation" : "Initializing..."}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.infoButton}><Info size={24} color="#FFFFFF" /></TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.bottomPanel}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(29, 53, 87, 0.08)" }]}><Users size={18} color="#1d3557" /></View>
            <View>
              <Text style={styles.statLabel}>Active Fans</Text>
              <Text style={styles.statValue}>{userCount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: `${densityColor}18` }]}><Flame size={18} color={densityColor} /></View>
            <View>
              <Text style={styles.statLabel}>Density</Text>
              <Text style={[styles.statValue, { color: densityColor }]}>{density}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(230, 57, 70, 0.08)" }]}><Zap size={18} color="#e63946" /></View>
            <View>
              <Text style={styles.statLabel}>Hottest Zone</Text>
              <Text style={styles.statValue}>{peakZone}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(42, 157, 143, 0.08)" }]}><Shield size={18} color="#2a9d8f" /></View>
            <View>
              <Text style={styles.statLabel}>Safety</Text>
              <Text style={[styles.statValue, { color: "#2a9d8f" }]}>Normal</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  webMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
  },
  stadiumOutline: {
    width: 300,
    height: 400,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pitch: {
    width: 120,
    height: 180,
    backgroundColor: '#1e3a2e',
    borderRadius: 4,
    opacity: 0.3,
  },
  heatPoint: {
    position: 'absolute',
    borderRadius: 100,
  },
  webOverlay: {
    position: 'absolute',
    bottom: 240,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    borderRadius: 12,
  },
  webWarning: { color: '#FFFFFF', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  webSubtext: { color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 4 },
  headerContainer: { position: "absolute", top: 0, left: 0, right: 0 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  titleContainer: { alignItems: "center" },
  title: { fontSize: 18, fontWeight: "900", color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.8)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 12, letterSpacing: 0.5 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  infoButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  bottomPanel: { position: "absolute", bottom: 30, left: 16, right: 16, gap: 10 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 20, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 9, color: "#457b9d", fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8 },
  statValue: { fontSize: 16, fontWeight: "900", color: "#1d3557", marginTop: 1 },
});

export default LiveHeatmapScreen;
