import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Ticket,
  ShoppingBag,
  Utensils,
  History,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import {
  foodOrderService,
  merchandiseOrderService,
  bookingService,
} from "../../api/services";
import { useAuth } from "../../context/AuthContext";

const ActivityHistoryScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      fetchActivities();
    }
  }, [userInfo]);

  const fetchActivities = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const [foodOrders, merchOrders, bookings] = await Promise.all([
        foodOrderService.getFoodOrderByUserId(userInfo.id),
        merchandiseOrderService.getMerchandiseOrderByUserId(userInfo.id),
        bookingService.getBookingByUserId(userInfo.id),
      ]);

      const formattedFood = (Array.isArray(foodOrders) ? foodOrders : []).map(
        (order) => ({
          id: `food-${order.id}`,
          type: "food",
          title: `Food Order #${order.id}`,
          date: order.timeStamp
            ? new Date(order.timeStamp).toLocaleDateString()
            : "Recently",
          amount: `$${(order.price || 0).toFixed(2)}`,
          timestamp: order.timeStamp ? new Date(order.timeStamp).getTime() : 0,
        }),
      );

      const formattedMerch = (
        Array.isArray(merchOrders) ? merchOrders : []
      ).map((order) => ({
        id: `merch-${order.id}`,
        type: "store",
        title: `Merchandise #${order.id}`,
        date: order.timeStamp
          ? new Date(order.timeStamp).toLocaleDateString()
          : "Recently",
        amount: `$${(order.price || 0).toFixed(2)}`,
        timestamp: order.timeStamp ? new Date(order.timeStamp).getTime() : 0,
      }));

      const formattedBookings = (Array.isArray(bookings) ? bookings : []).map(
        (booking) => ({
          id: `ticket-${booking.id}`,
          type: "ticket",
          title: `Ticket Booking #${booking.id}`,
          date: booking.bookingDate
            ? new Date(booking.bookingDate).toLocaleDateString()
            : "Recently",
          amount: `$${(booking.totalPrice || 0).toFixed(2)}`,
          timestamp: booking.bookingDate
            ? new Date(booking.bookingDate).getTime()
            : 0,
        }),
      );

      const allActivities = [
        ...formattedFood,
        ...formattedMerch,
        ...formattedBookings,
      ].sort((a, b) => b.timestamp - a.timestamp);

      setActivities(allActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchActivities(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "ticket":
        return <Ticket size={24} color={COLORS.brandPurple} />;
      case "store":
        return <ShoppingBag size={24} color={COLORS.secondary} />;
      case "food":
        return <Utensils size={24} color="#fbbf24" />;
      default:
        return <Ticket size={24} color={COLORS.gray600} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity History</Text>
          <View style={{ width: 40 }} />
        </View>

        {isLoading && !isRefreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
            <Text style={styles.loadingText}>Fetching activity history...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {activities.length > 0 ? (
              activities.map((item) => (
                <TouchableOpacity key={item.id} style={styles.card}>
                  <View style={styles.iconBox}>{getIcon(item.type)}</View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.cardAmount}>{item.amount}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <History size={64} color={COLORS.gray200} />
                <Text style={styles.emptyText}>No activity history found</Text>
              </View>
            )}
          </ScrollView>
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
    padding: 24,
  },
  backButton: {
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
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 6,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  cardDate: {
    color: COLORS.gray600,
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
  },
  cardAmount: {
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 17,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.gray500,
    fontWeight: "500",
  },
});

export default ActivityHistoryScreen;
