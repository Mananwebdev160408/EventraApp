import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Info,
  Compass,
  MapPin,
  Users,
  Flame,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const StadiumMapScreen = ({ navigation }) => {
  const sectors = [
    { id: "north", name: "North Stand", color: "#e63946", active: true },
    { id: "south", name: "South Stand", color: "#457b9d", active: false },
    { id: "east", name: "East Terrace", color: "#f4a261", active: false },
    { id: "west", name: "West VIP", color: "#2a9d8f", active: false },
  ];

  const facilities = [
    {
      id: 1,
      name: "Gate A",
      icon: <MapPin size={16} color="#FFFFFF" />,
      top: "20%",
      left: "15%",
    },
    {
      id: 2,
      name: "Food Court",
      icon: <Compass size={16} color="#FFFFFF" />,
      top: "80%",
      left: "50%",
    },
    {
      id: 3,
      name: "Restrooms",
      icon: <Users size={16} color="#FFFFFF" />,
      top: "40%",
      left: "85%",
    },
    {
      id: 4,
      name: "Medical",
      icon: <Flame size={16} color="#FFFFFF" />,
      top: "10%",
      left: "70%",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200",
        }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={[
            "rgba(29, 53, 87, 0.9)",
            "rgba(29, 53, 87, 0.7)",
            "rgba(29, 53, 87, 0.9)",
          ]}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerTitle}>
                <Text style={styles.title}>Olympic Stadium</Text>
                <Text style={styles.subtitle}>Interactive Ground Map</Text>
              </View>
              <TouchableOpacity style={styles.infoButton}>
                <Info size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Stadium Visualizer */}
            <View style={styles.visualizerContainer}>
              <View style={styles.stadiumOval}>
                {/* Pitch Area */}
                <View style={styles.pitch}>
                  <View style={styles.pitchLines} />
                  <View style={styles.pitchCircle} />
                </View>

                {/* Facilities Dots */}
                {facilities.map((fac) => (
                  <TouchableOpacity
                    key={fac.id}
                    style={[
                      styles.facilityDot,
                      { top: fac.top, left: fac.left },
                    ]}
                  >
                    {fac.icon}
                  </TouchableOpacity>
                ))}

                {/* Section Indicators */}
                <View style={[styles.sectorLabel, { top: -20, left: "40%" }]}>
                  <Text style={styles.sectorLabelText}>NORTH</Text>
                </View>
                <View
                  style={[styles.sectorLabel, { bottom: -20, left: "40%" }]}
                >
                  <Text style={styles.sectorLabelText}>SOUTH</Text>
                </View>
                <View style={[styles.sectorLabel, { top: "45%", left: -40 }]}>
                  <Text style={styles.sectorLabelText}>WEST</Text>
                </View>
                <View style={[styles.sectorLabel, { top: "45%", right: -40 }]}>
                  <Text style={styles.sectorLabelText}>EAST</Text>
                </View>
              </View>
            </View>

            {/* You Are Here Card */}
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.userDot} />
                <Text style={styles.locationTitle}>You are here: Sector A</Text>
              </View>
              <Text style={styles.locationDesc}>
                Close to Gate 4 and the Official Merchandise store.
              </Text>
            </View>

            {/* Legend / Sections */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>STADIUM SECTORS</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.legendScroll}
              >
                {sectors.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.sectorChip, s.active && styles.activeChip]}
                  >
                    <View
                      style={[styles.colorDot, { backgroundColor: s.color }]}
                    />
                    <Text style={styles.chipText}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d3557",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    letterSpacing: 1,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  visualizerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  stadiumOval: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 150,
    borderWidth: 20,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pitch: {
    width: "60%",
    height: "50%",
    backgroundColor: "#2a9d8f",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pitchLines: {
    position: "absolute",
    height: "100%",
    width: 2,
    backgroundColor: "#FFFFFF",
  },
  pitchCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  facilityDot: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e63946",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sectorLabel: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sectorLabelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e63946",
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  locationDesc: {
    fontSize: 14,
    color: "#457b9d",
    lineHeight: 20,
  },
  legendContainer: {
    paddingBottom: 40,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "rgba(255,255,255,0.5)",
    paddingHorizontal: 24,
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  legendScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  sectorChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  activeChip: {
    backgroundColor: "rgba(255,255,255,1)",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default StadiumMapScreen;
