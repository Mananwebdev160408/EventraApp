import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, CreditCard, Lock } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button";
import {
  foodOrderService,
  merchandiseOrderService,
  bookingService,
} from "../../api/services";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const CheckoutScreen = ({ navigation }) => {
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    cartItems,
    foodItems,
    merchandiseItems,
    ticketItems,
    cartTotal,
    clearCart,
  } = useCart();
  const { userInfo } = useAuth();

  const handlePay = async () => {
    if (!userInfo) {
      Alert.alert("Error", "Please login to place an order");
      return;
    }

    setIsProcessing(true);
    try {
      const orderRequests = [];

      // 1. Create Food Order if there are food items
      if (foodItems.length > 0) {
        const firstFoodItem = foodItems[0];
        const foodOrderData = {
          foodIds: foodItems.map((item) => parseInt(item.id)),
          foodNames: foodItems.map((item) => item.name),
          quantity: foodItems.reduce((acc, item) => acc + item.quantity, 0),
          price: foodItems.reduce(
            (acc, item) =>
              acc +
              parseFloat(item.price.replace("₹", "").replace("$", "")) *
                item.quantity,
            0,
          ),
          status: "PENDING",
          userId: userInfo.id,
          restaurantId: firstFoodItem.restaurantId || 1,
          eventId: firstFoodItem.eventId || 1,
        };
        orderRequests.push(foodOrderService.placeFoodOrder(foodOrderData));
      }

      // 2. Create Merchandise Order if there are merch items
      if (merchandiseItems.length > 0) {
        const firstMerchItem = merchandiseItems[0];
        const merchOrderData = {
          merchandiseIds: merchandiseItems.map((item) => parseInt(item.id)),
          merchandiseNames: merchandiseItems.map((item) => item.name),
          quantity: merchandiseItems.reduce(
            (acc, item) => acc + item.quantity,
            0,
          ),
          price: merchandiseItems.reduce(
            (acc, item) =>
              acc +
              parseFloat(item.price.replace("₹", "").replace("$", "")) *
                item.quantity,
            0,
          ),
          status: "PENDING",
          userId: userInfo.id,
          stadiumId: firstMerchItem.stadiumId || 1,
        };
        orderRequests.push(
          merchandiseOrderService.placeMerchandiseOrder(merchOrderData),
        );
      }

      // 3. Confirm Ticket Bookings
      if (ticketItems.length > 0) {
        const firstTicket = ticketItems[0];
        const seatIdList = ticketItems.map((item) => item.id);

        orderRequests.push(
          bookingService.confirmBooking({
            seatIdList,
            userId: userInfo.id,
            eventId: firstTicket.eventId,
            stadiumId: firstTicket.stadiumId,
          }),
        );
      }

      await Promise.all(orderRequests);

      clearCart();
      setSuccess(true);
    } catch (error) {
      console.error("Order completion error:", error);
      Alert.alert(
        "Payment Failed",
        "Something went wrong while finalizing your order. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (success) {
    // ... success view remains same
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.cardSelector}>
              <View style={styles.cardOptionActive}>
                <CreditCard size={24} color={COLORS.brandPurple} />
                <Text style={styles.cardText}>.... 4242</Text>
                <View style={styles.radioSelected} />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.secureBadge}>
            <Lock size={12} color={COLORS.gray400} />
            <Text style={styles.secureText}>
              Payments are secure and encrypted
            </Text>
          </View>
          <Button
            title={isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
            onPress={handlePay}
            disabled={isProcessing}
          />
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.gray600,
    marginBottom: 16,
  },
  cardSelector: {
    gap: 12,
  },
  cardOptionActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
    gap: 12,
  },
  cardText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: COLORS.brandPurple,
    backgroundColor: COLORS.card,
  },
  addCardButton: {
    marginTop: 12,
    padding: 12,
  },
  addCardText: {
    color: COLORS.brandPurple,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: COLORS.gray600,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 16,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secureText: {
    color: COLORS.gray600,
    fontSize: 12,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  successText: {
    color: COLORS.gray600,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
});

export default CheckoutScreen;
