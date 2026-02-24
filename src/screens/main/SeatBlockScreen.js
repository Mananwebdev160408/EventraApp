import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, Info, ArrowRight } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { seatService } from "../../api/services";

const SeatBlockScreen = ({ navigation, route }) => {
  const { sector, mode, showUser, eventId } = route.params || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isViewMode = mode === "view";

  useEffect(() => {
    if (eventId) {
      fetchSeats();
    } else if (sector?.seats) {
      setSeats(sector.seats);
      setIsLoading(false);
    }
  }, [eventId]);

  const fetchSeats = async () => {
    setIsLoading(true);
    try {
      const data = await seatService.getEventSeats(eventId);
      const allEventSeats = Array.isArray(data) ? data : data?.seats || [];

      // Filter seats by category/sector name
      const filtered = allEventSeats
        .filter(
          (es) =>
            (es.seat?.category || "Regular").toLowerCase() ===
            (sector?.name || "Regular").toLowerCase(),
        )
        .map((es) => ({
          id: es.id,
          seatId: es.seat?.id,
          row: es.seat?.row,
          number: es.seat?.seatNo,
          price: es.price,
          availability: es.availability,
          status: es.availability ? "available" : "booked",
          seatCategory: es.seat?.category,
        }));

      setSeats(filtered);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.row || "A";
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();
  const toggleSeat = (id) => {
    if (isViewMode) return;
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((sId) => sId !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const getSeatColor = (seat) => {
    if (selectedSeats.includes(seat.id)) return COLORS.brandPurple;
    if (seat.status === "user" && showUser) return "#e63946";
    if (seat.status === "booked") return COLORS.gray300;

    // Categorized colors
    switch (seat.seatCategory) {
      case "VIP":
        return "#fbbf24"; // Gold
      case "Premium":
        return "#3b82f6"; // Blue
      case "Regular":
        return "#10b981"; // Green
      default:
        return "#10b981";
    }
  };

  const currentSectorName = sector?.name || "Section Layout";
  const currentSectorPrice =
    seats.length > 0 ? seats[0].price : sector?.price || 0;

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.brandPurple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>{currentSectorName}</Text>
            <Text style={styles.subtitle}>
              {isViewMode
                ? showUser
                  ? "Your Seat Location"
                  : "Section Layout"
                : "Select your seats"}
            </Text>
          </View>
          <TouchableOpacity style={styles.circleButton}>
            <Info size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Seat Grid */}
        <ScrollView
          contentContainerStyle={styles.gridContainer}
          maximumZoomScale={3}
          minimumZoomScale={1}
        >
          <ScrollView horizontal contentContainerStyle={styles.gridContent}>
            <View style={styles.seatsContainer}>
              <View style={styles.screenIndicator}>
                <Text style={styles.screenText}>PITCH SIDE</Text>
              </View>

              {sortedRows.map((rowLabel) => (
                <View key={rowLabel} style={styles.row}>
                  <Text style={styles.rowLabel}>{rowLabel}</Text>
                  {groupedSeats[rowLabel].map((seat) => (
                    <TouchableOpacity
                      key={seat.id}
                      disabled={seat.status === "booked" || isViewMode}
                      onPress={() => toggleSeat(seat.id)}
                      style={[
                        styles.seat,
                        {
                          backgroundColor: getSeatColor(seat),
                        },
                      ]}
                    >
                      {/* Optional: Add seat number inside or a small dot */}
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.rowLabel}>{rowLabel}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Footer - Only show in selection mode */}
        {!isViewMode && (
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <View>
                <Text style={styles.footerLabel}>SEATS SELECTED</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.seatCount}>{selectedSeats.length}</Text>
                  <Text style={styles.totalPrice}>
                    / ${selectedSeats.length * currentSectorPrice}.00
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.proceedButton,
                  selectedSeats.length === 0 && { opacity: 0.5 },
                ]}
                disabled={selectedSeats.length === 0}
                onPress={() =>
                  navigation.navigate("SeatInformation", {
                    seats: selectedSeats.map((id) =>
                      seats.find((s) => s.id === id),
                    ),
                    eventId: eventId,
                  })
                }
              >
                <Text style={styles.proceedText}>Confirm Seats</Text>
                <ArrowRight size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Legend for View Mode */}
        {isViewMode && (
          <View style={styles.viewLegend}>
            {showUser && (
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#e63946" }]}
                />
                <Text style={styles.legendText}>Your Seat</Text>
              </View>
            )}
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: COLORS.gray300 }]}
              />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10b981" }]}
              />
              <Text style={styles.legendText}>Available</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  },
  gridContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  gridContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  seatsContainer: {
    alignItems: "center",
    gap: 12,
  },
  screenIndicator: {
    width: "80%",
    height: 4,
    backgroundColor: COLORS.gray300,
    marginBottom: 32,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  screenText: {
    position: "absolute",
    top: -20,
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: "700",
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    width: 20,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gray400,
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 8,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    // borderBottomLeftRadius: 12,
    // borderBottomRightRadius: 12,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 10,
    color: COLORS.gray600,
    fontWeight: "700",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  seatCount: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  totalPrice: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  proceedButton: {
    backgroundColor: COLORS.brandPurple,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  proceedText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  viewLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 24,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray600,
  },
});

export default SeatBlockScreen;
