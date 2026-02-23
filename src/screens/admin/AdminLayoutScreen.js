import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Plus,
  Edit2,
  Layers,
  FileSpreadsheet,
  Maximize2,
  Users,
  DollarSign,
  Upload,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { SEAT_MAP_DATA } from "../../constants/mocks";
import { useUser } from "../../context/UserContext";
import { seatService } from "../../api/services";

const { width } = Dimensions.get("window");

const AdminLayoutScreen = ({ navigation }) => {
  const { stadiumLocation, stadiumId } = useUser();
  const [selectedSector, setSelectedSector] = useState(null);

  const handleImportExcel = async () => {
    if (!stadiumId) {
      Alert.alert(
        "Error",
        "Stadium information not found. Please log in again.",
      );
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/comma-separated-values", "text/csv", "application/csv"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Show processing alert or loading state
      Alert.alert("Processing", `Importing seats from ${file.name}...`);

      const response = await seatService.importSeats(file, stadiumId);

      if (response.success) {
        Alert.alert(
          "Success",
          `Successfully imported configuration. ${response.message}`,
        );
      } else {
        Alert.alert(
          "Import Failed",
          response.message || "Unknown error occurred",
        );
      }
    } catch (err) {
      console.error("Import error:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to upload file";
      Alert.alert("Error", errorMessage);
    }
  };

  const renderSectorBlock = (sector) => {
    // Positioning logic (simulated for visual layout)
    let sectorStyle = {};
    let gradientColor = COLORS.primary;

    if (sector.id === "north") {
      sectorStyle = { top: "12%", alignSelf: "center", width: 140, height: 90 };
      gradientColor = "#3b82f6";
    }
    if (sector.id === "south") {
      sectorStyle = {
        bottom: "22%",
        alignSelf: "center",
        width: 140,
        height: 90,
      };
      gradientColor = "#ef4444";
    }
    if (sector.id === "vip") {
      sectorStyle = { top: "42%", right: "8%", width: 100, height: 70 };
      gradientColor = "#fbbf24";
    }

    const isSelected = selectedSector?.id === sector.id;

    return (
      <TouchableOpacity
        key={sector.id}
        style={[
          styles.sectorBlock,
          sectorStyle,
          { backgroundColor: gradientColor, opacity: isSelected ? 1 : 0.9 },
          isSelected && styles.selectedBlock,
        ]}
        onPress={() => setSelectedSector(sector)}
        activeOpacity={0.9}
      >
        <View style={styles.sectorContent}>
          <Text style={styles.sectorName}>{sector.name}</Text>
        </View>

        {isSelected && <View style={styles.selectionRing} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{stadiumLocation}</Text>
            <Text style={styles.headerSubtitle}>Manage zones & seating</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionIconButton}
              onPress={handleImportExcel}
            >
              <Upload size={20} color={COLORS.gray600} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionIconButton,
                { backgroundColor: COLORS.brandPurple },
              ]}
            >
              <Plus size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          <View style={styles.mapViewer}>
            {/* Stadium Background Design */}
            <View style={styles.stadiumContainer}>
              <View style={styles.stadiumOuterRing} />
              <View style={styles.stadiumInnerRing} />

              {/* Field */}
              <View style={styles.pitch}>
                <View style={styles.pitchLineCenter} />
                <View style={styles.pitchCircle} />
              </View>

              {/* Sectors Layer */}
              <View style={styles.sectorsLayer}>
                {SEAT_MAP_DATA.sectors.map(renderSectorBlock)}
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Editing Panel */}
        <View style={styles.bottomSheet}>
          {selectedSector ? (
            <View>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>{selectedSector.name}</Text>
                  <Text style={styles.sheetSubtitle}>
                    {selectedSector.type.toUpperCase()} TIER
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedSector(null)}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Users
                    size={20}
                    color={COLORS.brandPurple}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.metricLabel}>Capacity</Text>
                  <Text style={styles.metricValue}>1,200</Text>
                </View>
                <View style={styles.metricCard}>
                  <Maximize2
                    size={20}
                    color={COLORS.secondary}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.metricLabel}>Rows</Text>
                  <Text style={styles.metricValue}>12</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.primaryActionBtn}>
                  <Edit2 size={16} color={COLORS.white} />
                  <Text style={styles.primaryBtnText}>Edit Configuration</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryActionBtn}>
                  <Layers size={16} color={COLORS.text} />
                  <Text style={styles.secondaryBtnText}>Duplicate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Layers size={24} color={COLORS.gray400} />
              </View>
              <Text style={styles.emptyTitle}>Select a Zone</Text>
              <Text style={styles.emptyDesc}>
                Tap on any stadium sector to view details, edit pricing, or
                configure seating arrangements.
              </Text>

              <TouchableOpacity
                style={styles.importBanner}
                onPress={handleImportExcel}
              >
                <FileSpreadsheet size={20} color={COLORS.brandPurple} />
                <Text style={styles.importBannerText}>
                  Import Configuration from Excel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  mapViewer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100, // Make room for bottom sheet
  },
  stadiumContainer: {
    width: width * 0.9,
    aspectRatio: 0.85,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  stadiumOuterRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
    borderWidth: 20,
    borderColor: "#e2e8f0",
    backgroundColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  stadiumInnerRing: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    backgroundColor: "transparent",
    borderStyle: "dashed",
  },
  pitch: {
    width: "40%",
    height: "55%",
    backgroundColor: "#10b981",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pitchLineCenter: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  pitchCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  sectorsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  sectorBlock: {
    position: "absolute",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    padding: 8,
  },
  selectedBlock: {
    transform: [{ scale: 1.1 }],
    zIndex: 10,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  sectorContent: {
    alignItems: "center",
  },
  sectorName: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  badgeContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectorBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  selectionRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 20,
    padding: 24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 280,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: COLORS.gray600,
    fontWeight: "600",
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray600,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryActionBtn: {
    flex: 2,
    backgroundColor: COLORS.brandPurple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  secondaryBtnText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  importBanner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    gap: 10,
    borderStyle: "dashed",
  },
  importBannerText: {
    color: COLORS.brandPurple,
    fontWeight: "600",
    fontSize: 14,
  },
});

export default AdminLayoutScreen;
