import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, CreditCard, Lock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { foodOrderService, merchandiseOrderService, bookingService } from "../../api/services";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import WebUserSidebar from "../../components/WebUserSidebar";

const CheckoutScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, foodItems, merchandiseItems, ticketItems, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment delay
    setTimeout(async () => {
        try {
          const userId = userInfo?.uid || userInfo?.id || "guest-123";
          const orderRequests = [];

          if (foodItems.length > 0) {
            orderRequests.push(foodOrderService.placeFoodOrder({
              foodIds: foodItems.map(i => parseInt(i.id)),
              quantity: foodItems.reduce((acc, i) => acc + i.quantity, 0),
              price: foodItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
              status: "PENDING", userId,
              restaurantId: foodItems[0].restaurantId || 1,
              eventId: foodItems[0].eventId || 1
            }));
          }

          if (merchandiseItems.length > 0) {
            orderRequests.push(merchandiseOrderService.placeMerchandiseOrder({
              merchandiseIds: merchandiseItems.map(i => parseInt(i.id)),
              quantity: merchandiseItems.reduce((acc, i) => acc + i.quantity, 0),
              price: merchandiseItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
              status: "PENDING", userId,
              stadiumId: merchandiseItems[0].stadiumId || 1
            }));
          }

          if (ticketItems.length > 0) {
            orderRequests.push(bookingService.confirmBooking({
              seats: ticketItems.map(i => ({ id: i.id, price: i.price })),
              userId, eventId: ticketItems[0].eventId, stadiumId: ticketItems[0].stadiumId
            }));
          }

          await Promise.all(orderRequests);
          clearCart();
          setSuccess(true);
        } catch (error) {
          console.error("Order error:", error);
        } finally {
          setIsProcessing(false);
        }
    }, 2000);
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
         <View style={styles.successCard}>
            <View style={styles.successIconBox}>
               <CheckCircle2 size={80} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSub}>Your payment was successful and your order is being processed.</Text>
            <View style={styles.successDivider} />
            <Text style={styles.successNote}>A confirmation email has been sent to {userInfo?.email || "your inbox"}.</Text>
            
            <TouchableOpacity 
              style={styles.doneBtn}
              onPress={() => navigation.navigate("MainTabs")}
            >
               <Text style={styles.doneBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
         </View>
      </View>
    );
  }

  const subtotal = cartTotal;
  const convenienceFee = 49;
  const tax = subtotal * 0.05;
  const total = subtotal + convenienceFee + tax;

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="Dashboard" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Secure Checkout</Text>
                 <Text style={styles.headerSub}>Complete your purchase securely</Text>
              </View>
           </View>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              <View style={styles.checkoutGrid}>
                 {/* Left: Payment & Shipping */}
                 <View style={styles.leftSection}>
                    <View style={styles.stepCard}>
                       <Text style={styles.stepTitle}>1. Payment Method</Text>
                       <View style={styles.paymentOptions}>
                          <TouchableOpacity style={styles.payOptionActive}>
                             <View style={styles.payOptionHeader}>
                                <CreditCard size={20} color={COLORS.brandPurple} />
                                <Text style={styles.payOptionTitle}>Credit / Debit Card</Text>
                                <View style={styles.radioActive} />
                             </View>
                             <View style={styles.cardPreview}>
                                <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
                                <Text style={styles.cardExpiry}>Exp: 12/28</Text>
                             </View>
                          </TouchableOpacity>
                          
                          <TouchableOpacity style={styles.payOption}>
                             <View style={styles.payOptionHeader}>
                                <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" }} style={styles.upiLogo} />
                                <Text style={styles.payOptionTitle}>UPI Payment (PhonePe, GPay)</Text>
                                <View style={styles.radio} />
                             </View>
                          </TouchableOpacity>
                       </View>
                    </View>

                    <View style={styles.stepCard}>
                       <Text style={styles.stepTitle}>2. Card Details</Text>
                       <View style={styles.inputGrid}>
                          <View style={styles.inputGroupFull}>
                             <Text style={styles.inputLabel}>Name on Card</Text>
                             <TextInput style={styles.input} placeholder="John Doe" />
                          </View>
                          <View style={styles.inputGroupHalf}>
                             <Text style={styles.inputLabel}>Expiry Date</Text>
                             <TextInput style={styles.input} placeholder="MM/YY" />
                          </View>
                          <View style={styles.inputGroupHalf}>
                             <Text style={styles.inputLabel}>CVV</Text>
                             <TextInput style={styles.input} placeholder="•••" secureTextEntry />
                          </View>
                       </View>
                    </View>
                 </View>

                 {/* Right: Order Review */}
                 <View style={styles.rightSection}>
                    <View style={styles.orderSummaryCard}>
                       <Text style={styles.summaryTitle}>Order Review</Text>
                       <View style={styles.itemsList}>
                          {cartItems.map((item, idx) => (
                            <View key={idx} style={styles.reviewItem}>
                               <View style={styles.reviewItemInfo}>
                                  <Text style={styles.reviewItemName} numberOfLines={1}>{item.name}</Text>
                                  <Text style={styles.reviewItemQty}>Qty: {item.quantity}</Text>
                               </View>
                               <Text style={styles.reviewItemPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
                            </View>
                          ))}
                       </View>

                       <View style={styles.calcDivider} />
                       
                       <View style={styles.calcRow}>
                          <Text style={styles.calcLabel}>Subtotal</Text>
                          <Text style={styles.calcValue}>₹{subtotal.toLocaleString()}</Text>
                       </View>
                       <View style={styles.calcRow}>
                          <Text style={styles.calcLabel}>Convenience Fee</Text>
                          <Text style={styles.calcValue}>₹{convenienceFee}</Text>
                       </View>
                       <View style={styles.calcRow}>
                          <Text style={styles.calcLabel}>Taxes (5%)</Text>
                          <Text style={styles.calcValue}>₹{tax.toFixed(0)}</Text>
                       </View>
                       
                       <View style={styles.totalRow}>
                          <Text style={styles.totalLabel}>Total Payable</Text>
                          <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
                       </View>

                       <TouchableOpacity 
                        style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                        onPress={handlePay}
                        disabled={isProcessing}
                       >
                          {isProcessing ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <>
                              <Text style={styles.payBtnText}>Confirm and Pay ₹{total.toFixed(0)}</Text>
                              <ArrowRight size={20} color="#fff" />
                            </>
                          )}
                       </TouchableOpacity>
                       
                       <View style={styles.secureBadge}>
                          <ShieldCheck size={16} color="#10b981" />
                          <Text style={styles.secureText}>Guaranteed Safe Checkout</Text>
                       </View>
                    </View>
                    
                    <View style={styles.trustBadge}>
                       <Lock size={16} color="#64748b" />
                       <Text style={styles.trustText}>Your payment data is processed by our secure bank partners and never stored on our servers.</Text>
                    </View>
                 </View>
              </View>
           </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  mainContent: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 60,
    paddingVertical: 32,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
  },
  headerSub: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  checkoutGrid: {
    flexDirection: "row",
    gap: 40,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  leftSection: {
    flex: 1.5,
    gap: 32,
  },
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 24,
  },
  paymentOptions: {
    gap: 16,
  },
  payOptionActive: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
  },
  payOption: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  payOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  payOptionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  radioActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: COLORS.brandPurple,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  cardPreview: {
    marginLeft: 36,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d3557",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  upiLogo: {
    width: 40,
    height: 20,
    resizeMode: "contain",
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  inputGroupFull: {
    width: "100%",
  },
  inputGroupHalf: {
    width: "47%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    fontSize: 15,
  },
  rightSection: {
    flex: 1,
    gap: 24,
  },
  orderSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 24,
  },
  itemsList: {
    gap: 16,
    marginBottom: 24,
  },
  reviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewItemInfo: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  reviewItemQty: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  reviewItemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  calcDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calcLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  calcValue: {
    fontSize: 14,
    color: "#1d3557",
    fontWeight: "700",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 32,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.brandPurple,
  },
  payBtn: {
    backgroundColor: "#1d3557",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    borderRadius: 16,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  secureText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  trustBadge: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
  },
  trustText: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    fontWeight: "500",
  },
  successContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 60,
    alignItems: "center",
    maxWidth: 600,
    width: "100%",
    boxShadow: "0px 20px 50px rgba(0,0,0,0.05)",
  },
  successIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 12,
  },
  successSub: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  successDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#f1f5f9",
    marginBottom: 32,
  },
  successNote: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 40,
  },
  doneBtn: {
    backgroundColor: "#1d3557",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  }
});

export default CheckoutScreen;
