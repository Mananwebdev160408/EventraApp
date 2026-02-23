import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../context/AuthContext";
import { API_CONFIG } from "../../api/config";
import { ChevronLeft, Flame, Users, Info } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import "text-encoding";

const LiveHeatmapScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [connecting, setConnecting] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const stompClient = useRef(null);
  const locationInterval = useRef(null);

  useEffect(() => {
    // Convert https to wss or http to ws
    const socketUrl = API_CONFIG.BASE_URL.replace("http", "ws") + "/ws";

    stompClient.current = new Client({
      brokerURL: socketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected to Stadium WebSocket: " + frame);
        setConnecting(false);

        // Subscribe to the clustered heatmap data from backend
        // Backend broadcastHeatmap() sends to "/topic/admin/heatmap"
        stompClient.current.subscribe("/topic/admin/heatmap", (message) => {
          const clusteredData = JSON.parse(message.body);
          setHeatmapPoints(clusteredData);

          // Calculate total users from weights
          const total = clusteredData.reduce(
            (acc, point) => acc + (point.weight || 0),
            0,
          );
          setUserCount(total);
        });

        // Start sending this user's location
        startLocationReporting();
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
      onWebSocketClose: () => {
        console.log("WebSocket connection closed");
        setConnecting(true);
      },
    });

    stompClient.current.activate();

    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, []);

  const startLocationReporting = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission denied");
      return;
    }

    // Send location every 2 seconds to match backend request
    locationInterval.current = setInterval(async () => {
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log("Live Heatmap - Raw GPS data captured:", position);

        const locationData = {
          userId: userInfo?.id || userInfo?.userId || 1,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log(
          "Live Heatmap - Reporting coordinates to backend:",
          locationData,
        );

        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.publish({
            destination: "/app/location/update",
            body: JSON.stringify(locationData),
          });
        }
      } catch (error) {
        console.error("Failed to get or send location:", error);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 28.6139, // Default: New Delhi (matches backend example)
          longitude: 77.209,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        customMapStyle={mapStyle}
      >
        {heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            radius={40}
            opacity={0.7}
            gradient={{
              colors: ["#0000FF", "#00FF00", "#FFFF00", "#FF0000"],
              startPoints: [0.01, 0.25, 0.5, 0.75],
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
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: connecting ? "#e63946" : "#2a9d8f" },
                ]}
              />
              <Text style={styles.statusText}>
                {connecting ? "Connecting..." : "Live Updates Active"}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Stats Overlay */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Users size={20} color={COLORS.brandPurple} />
          <View>
            <Text style={styles.statLabel}>Active Users</Text>
            <Text style={styles.statValue}>{userCount}</Text>
          </View>
        </View>
        <View style={[styles.statCard, { marginLeft: 12 }]}>
          <Flame size={20} color="#e63946" />
          <View>
            <Text style={styles.statLabel}>Density</Text>
            <Text style={styles.statValue}>
              {userCount > 50 ? "High" : userCount > 10 ? "Medium" : "Low"}
            </Text>
          </View>
        </View>
      </View>

      {connecting && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loaderText}>Establishing Secure Link...</Text>
        </View>
      )}
    </View>
  );
};

// Dark theme for map to make heatmap pop
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d3557",
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
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  statLabel: {
    fontSize: 11,
    color: "#457b9d",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 53, 87, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#FFFFFF",
    marginTop: 16,
    fontWeight: "700",
    fontSize: 15,
  },
});

export default LiveHeatmapScreen;
