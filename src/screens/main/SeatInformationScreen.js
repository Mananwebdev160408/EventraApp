import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Check,
  Wifi,
  BatteryCharging,
  ArrowRight,
  User,
  Utensils,
  Cable,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button";

import { useCart } from "../../context/CartContext";
import { bookingService } from "../../api/services";
import { Alert, ActivityIndicator } from "react-native";

const SeatInformationScreen = ({ navigation, route }) => {
  const { seats, eventId } = route.params || {};
  const { setTickets } = useCart();
  const [isReserving, setIsReserving] = React.useState(false);

  const representativeSeat = seats && seats.length > 0 ? seats[0] : null;
  const totalPrice = seats
    ? seats.reduce((sum, s) => sum + (s.price || 0), 0)
    : 0;
  const seatNames = seats
    ? seats.map((s) => `${s.row}${s.number}`).join(", ")
    : "";

  const handleConfirm = async () => {
    setIsReserving(true);
    try {
      // 1. Reserve seats in backend
      const seatIdList = seats.map((s) => s.id);
      await bookingService.reserveSeats({ seatIdList });

      // 2. Add to cart
      setTickets(seats, eventId, representativeSeat?.stadiumId);

      // 3. Navigate to Checkout
      navigation.navigate("Checkout");
    } catch (error) {
      console.error("Reservation error:", error);
      Alert.alert(
        "Reservation Failed",
        "Could not reserve those seats. They might have been taken.",
      );
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background with Blur Effect Simulator */}
      <View style={styles.backgroundContainer}>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1rZsXf3I8lxOWC6n2kMc98lqHoZmnaUd16CxHNXze2Wr-dQ4VaBDKtoKiZZUt_Keg33NR-3nmmClEXVx-aZ0H6W176WEuJH6kLNN02f58iLG-xluNTvRMMAEr77xRhiqRl8JV9XlWu0WBXLD9Pj_mgdpyxrRT8ZNnT2gTWSfQG1aq2wYuMWUaUya_bWn_3IfccyBG_ohjRubk090NYYYYKZ23NvJ0cOIDQqbo2xe8o1o2TAzfAxwPHoAfAXNpG2Z2KbGi-EeOPWg",
          }}
          style={styles.backgroundImage}
          blurRadius={10}
        />
        <View style={styles.overlay} />
      </View>

      {/* Close/Back Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <View style={styles.dragHandle} />
      </TouchableOpacity>

      {/* Bottom Sheet Content */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHeader}>
          <View style={styles.dragHandleBar} />
        </View>

        <View style={styles.content}>
          <View style={styles.rowBetween}>
            <View>
              <View
                style={[
                  styles.badge,
                  {
                    borderColor:
                      representativeSeat?.seatCategory === "VIP"
                        ? "#fbbf24"
                        : COLORS.brandPurple,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        representativeSeat?.seatCategory === "VIP"
                          ? "#fbbf24"
                          : COLORS.brandPurple,
                    },
                  ]}
                >
                  {representativeSeat?.seatCategory || "VIP"}
                </Text>
              </View>
              <Text style={styles.seatTitle}>
                {seats && seats.length > 1
                  ? "Multiple Seats"
                  : `Row ${representativeSeat?.row || "A"}`}
              </Text>
              <Text style={styles.seatSubtitle}>
                {seats && seats.length > 1
                  ? seatNames
                  : `Seat ${representativeSeat?.seatNumber || "1"}`}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.priceLabel}>TOTAL PRICE</Text>
              <Text style={styles.priceValue}>${totalPrice.toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            <Tag
              icon={<User size={14} color={COLORS.brandPurple} />}
              label="Stadium View"
            />
            <Tag
              icon={<ArrowRight size={14} color={COLORS.brandPurple} />}
              label="Fast Entry"
            />
            <Tag
              icon={<Wifi size={14} color={COLORS.brandPurple} />}
              label="Free WiFi"
            />
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>LOCATION VIEW</Text>
              <View style={styles.miniMap}>
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRtmcFY9Ol931xxd-bPARRAAa8m7lH2SCDgQJtGHxhXqyZMczu4d0NJ_vHxuQIXzHVj6A_EmVQf5kaeaLYNMniAARzTfxqWiJdpQXvOrqgZOviu0v18CeV7_h1GaepuiYm51IsiC_ZzhYsLsROLUgzmQha2uT4BzBrg62tpEYHjyzuJhKiCwFhuenX60ERdn1PzODx1M9krGZNt4NwoiTQW3lIm_KwA4l3FwF_EOvb0Xy31YvpHcDL3bWrLCmx3BKpIisTMpv0MDs",
                  }}
                  style={styles.mapImage}
                />
                <View style={styles.locationDot} />
              </View>
            </View>
            <View
              style={[styles.gridItem, { justifyContent: "space-between" }]}
            >
              <View>
                <Text style={styles.gridLabel}>EXPERIENCE</Text>
                <View style={styles.distRow}>
                  <Text style={styles.distValue}>Premium</Text>
                </View>
              </View>
              <Text style={styles.gateText}>Lounge Access Included</Text>
            </View>
          </View>

          <View style={styles.perksSection}>
            <Text style={styles.gridLabel}>SEAT PERKS</Text>
            <View style={styles.perkItem}>
              <View style={styles.perkLeft}>
                <View style={styles.perkIcon}>
                  <Utensils size={14} color={COLORS.brandPurple} />
                </View>
                <Text style={styles.perkText}>Seat Delivery Service</Text>
              </View>
              <Check size={16} color={COLORS.brandPurple} />
            </View>
            <View style={[styles.perkItem, { borderBottomWidth: 0 }]}>
              <View style={styles.perkLeft}>
                <View style={styles.perkIcon}>
                  <Cable size={14} color={COLORS.brandPurple} />
                </View>
                <Text style={styles.perkText}>Personal Charging Port</Text>
              </View>
              <Check size={16} color={COLORS.brandPurple} />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, isReserving && { opacity: 0.7 }]}
            onPress={handleConfirm}
            disabled={isReserving}
          >
            {isReserving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.confirmText}>Proceed to Checkout</Text>
                <ArrowRight size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Tag = ({ icon, label }) => (
  <View style={styles.tag}>
    {icon}
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 53, 87, 0.4)",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%", // Clickable area to close if implemented as custom modal
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { height: -10 },
    shadowOpacity: 0.5,
    elevation: 20,
    maxHeight: "85%",
  },
  sheetHeader: {
    alignItems: "center",
    paddingVertical: 16,
  },
  dragHandleBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray600,
  },
  content: {
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  badge: {
    backgroundColor: "rgba(230, 57, 70, 0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.3)",
    marginBottom: 8,
  },
  badgeText: {
    color: COLORS.brandPurple,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  seatTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  seatSubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.brandPurple,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 32,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.2)",
  },
  tagText: {
    color: COLORS.gray600,
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.gray600,
    letterSpacing: 1,
    marginBottom: 8,
  },
  miniMap: {
    height: 80,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  locationDot: {
    position: "absolute",
    top: "30%",
    left: "40%",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.brandPurple,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  distRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  distValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  gateText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginTop: 4,
  },
  perksSection: {
    marginBottom: 32,
  },
  perkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  perkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  perkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(230, 57, 70, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  perkText: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: COLORS.brandPurple,
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default SeatInformationScreen;
