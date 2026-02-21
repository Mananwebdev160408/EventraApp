import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Info,
  Sparkles,
  Plus,
  Minus,
  Crosshair,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { SEAT_MAP_DATA } from "../../constants/mocks";

const { width } = Dimensions.get("window");

const SelectSeatsScreen = ({ navigation, route }) => {
  const { mode, showUser } = route.params || {};
  const isViewMode = mode === "view";

  const renderSectorBlock = (sector) => {
    // Basic positioning logic based on sector id, represented as blocks
    let sectorStyle = {};
    if (sector.id === "north")
      sectorStyle = {
        top: "10%",
        alignSelf: "center",
        backgroundColor: "#3b82f6",
        width: 120,
        height: 80,
        borderRadius: 20,
      };
    if (sector.id === "south")
      sectorStyle = {
        bottom: "20%",
        alignSelf: "center",
        backgroundColor: "#ef4444",
        width: 120,
        height: 80,
        borderRadius: 20,
      };
    if (sector.id === "vip")
      sectorStyle = {
        top: "40%",
        right: "10%",
        backgroundColor: "#fbbf24",
        width: 80,
        height: 60,
        borderRadius: 16,
      };

    // Highlight user's active sector in view mode ONLY if showUser is true
    const isUserSector = isViewMode && showUser && sector.id === "north";

    return (
      <TouchableOpacity
        key={sector.id}
        style={[
          styles.sectorBlock,
          sectorStyle,
          isUserSector && styles.userSectorGlow,
        ]}
        onPress={() =>
          navigation.navigate("SeatBlock", { sector, mode, showUser })
        }
        activeOpacity={0.8}
      >
        <Text style={styles.sectorName}>{sector.name}</Text>
        {!isViewMode && <Text style={styles.sectorPrice}>${sector.price}</Text>}
        {isUserSector && (
          <View style={styles.userPresence}>
            <Text style={styles.userPresenceText}>YOUR BLOCK</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>
            {isViewMode ? "Stadium Overview" : "Select Zone"}
          </Text>
          <Text style={styles.subtitle}>
            Finals: Phoenix vs. Titans • Oct 24
          </Text>
        </View>
        <TouchableOpacity style={styles.circleButton}>
          <Info size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Main Map Area */}
      <View style={styles.mapArea}>
        {/* Smart Recommendation - Hide in view mode */}
        {!isViewMode && (
          <TouchableOpacity style={styles.smartButton}>
            <Sparkles size={16} color={COLORS.white} />
            <Text style={styles.smartButtonText}>Smart Recommendation</Text>
          </TouchableOpacity>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color="#3b82f6" label="North" />
          <LegendItem color="#ef4444" label="South" />
          <LegendItem color="#fbbf24" label="VIP" />
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <View style={styles.stadiumOval}>
            {/* Play Zone */}
            <View style={styles.playZone}>
              <Text style={styles.playZoneText}>PITCH</Text>
            </View>

            {/* Rings */}
            <View style={styles.ringOuter} pointerEvents="none" />

            {/* Sectors (Rendered as Blocks) */}
            <View style={styles.seatCtn}>
              {SEAT_MAP_DATA.sectors.map(renderSectorBlock)}
            </View>
          </View>
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Plus size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Minus size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, { marginTop: 8 }]}>
            <Crosshair size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 2,
  },
  mapArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  smartButton: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 20,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  smartButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
  legend: {
    position: "absolute",
    top: 80,
    right: 16,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    zIndex: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.text,
    opacity: 0.8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  mapContainer: {
    width: width * 0.9,
    aspectRatio: 0.8,
    alignItems: "center",
    justifyContent: "center",
    perspective: 1000,
  },
  stadiumOval: {
    width: "100%",
    height: "100%",
    borderRadius: 120,
    borderWidth: 4,
    borderColor: COLORS.border,
    transform: [{ rotateX: "20deg" }, { scale: 0.9 }],
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "rgba(230, 57, 70, 0.05)",
  },
  playZone: {
    width: "35%",
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  playZoneText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 2,
  },
  ringOuter: {
    position: "absolute",
    width: "85%",
    height: "85%",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  seatCtn: {
    ...StyleSheet.absoluteFillObject,
  },
  sectorBlock: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sectorName: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
  sectorPrice: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    marginTop: 2,
  },
  zoomControls: {
    position: "absolute",
    bottom: 40,
    right: 24,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userSectorGlow: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  userPresence: {
    position: "absolute",
    top: -10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userPresenceText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#3b82f6",
  },
});

export default SelectSeatsScreen;
