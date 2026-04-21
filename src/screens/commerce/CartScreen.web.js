import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Minus, Plus, Trash2, ChevronLeft, ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useCart } from "../../context/CartContext";
import WebUserSidebar from "../../components/WebUserSidebar";

const CartScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleUpdateQty = (id, type, delta) => {
    updateQuantity(id, type, delta);
  };

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImg} />
      <View style={styles.itemInfo}>
         <View style={styles.itemHeader}>
            <View>
               <Text style={styles.itemName}>{item.name}</Text>
               <Text style={styles.itemType}>{item.type || "Item"}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id, item.type)}>
               <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
         </View>
         
         <View style={styles.itemFooter}>
            <View style={styles.qtyBox}>
               <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQty(item.id, item.type, -1)}
                disabled={item.quantity <= 1}
               >
                  <Minus size={14} color="#1d3557" />
               </TouchableOpacity>
               <Text style={styles.qtyText}>{item.quantity}</Text>
               <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => handleUpdateQty(item.id, item.type, 1)}
               >
                  <Plus size={14} color="#1d3557" />
               </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>₹{(item.price || 0).toLocaleString()}</Text>
         </View>
      </View>
    </View>
  );

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
                 <Text style={styles.headerTitle}>Shopping Cart</Text>
                 <Text style={styles.headerSub}>{cartItems.length} items ready for checkout</Text>
              </View>
           </View>
           {cartItems.length > 0 && (
             <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                <Trash2 size={16} color="#ef4444" />
                <Text style={styles.clearBtnText}>Clear Cart</Text>
             </TouchableOpacity>
           )}
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              {cartItems.length > 0 ? (
                <View style={styles.cartGrid}>
                   {/* Items List */}
                   <View style={styles.itemsSection}>
                      {cartItems.map((item, idx) => (
                        <CartItem key={`${item.type}-${item.id}-${idx}`} item={item} />
                      ))}
                   </View>

                   {/* Summary Section */}
                   <View style={styles.summarySection}>
                      <View style={styles.summaryCard}>
                         <Text style={styles.summaryTitle}>Order Summary</Text>
                         
                         <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString()}</Text>
                         </View>
                         <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Convenience Fee</Text>
                            <Text style={styles.summaryValue}>₹49</Text>
                         </View>
                         <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>GST (5%)</Text>
                            <Text style={styles.summaryValue}>₹{(cartTotal * 0.05).toFixed(0)}</Text>
                         </View>
                         
                         <View style={styles.totalDivider} />
                         
                         <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹{(cartTotal + 49 + (cartTotal * 0.05)).toFixed(0)}</Text>
                         </View>

                         <TouchableOpacity 
                          style={styles.checkoutBtn}
                          onPress={() => navigation.navigate("Checkout")}
                         >
                            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                            <ArrowRight size={20} color="#fff" />
                         </TouchableOpacity>
                         
                         <View style={styles.secureBox}>
                            <ShieldCheck size={16} color="#10b981" />
                            <Text style={styles.secureText}>Secure SSL Encrypted Checkout</Text>
                         </View>
                      </View>
                      
                      <View style={styles.promoCard}>
                         <Text style={styles.promoTitle}>Have a promo code?</Text>
                         <View style={styles.promoInputRow}>
                            <TextInput placeholder="Enter code" style={styles.promoInput} />
                            <TouchableOpacity style={styles.applyBtn}>
                               <Text style={styles.applyBtnText}>Apply</Text>
                            </TouchableOpacity>
                         </View>
                      </View>
                   </View>
                </View>
              ) : (
                <View style={styles.emptyState}>
                   <View style={styles.emptyIconCircle}>
                      <ShoppingCart size={48} color="#94a3b8" />
                   </View>
                   <Text style={styles.emptyTitle}>Your cart is empty</Text>
                   <Text style={styles.emptySub}>Looks like you haven't added anything to your cart yet.</Text>
                   <TouchableOpacity 
                    style={styles.shopBtn}
                    onPress={() => navigation.navigate("Store")}
                   >
                      <Text style={styles.shopBtnText}>Start Shopping</Text>
                   </TouchableOpacity>
                </View>
              )}
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
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff1f2",
  },
  clearBtnText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  cartGrid: {
    flexDirection: "row",
    gap: 40,
  },
  itemsSection: {
    flex: 2,
    gap: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  itemImg: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
  },
  itemInfo: {
    flex: 1,
    marginLeft: 24,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  itemType: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 12,
    gap: 16,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d3557",
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
  },
  summarySection: {
    flex: 1,
    gap: 24,
  },
  summaryCard: {
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
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "700",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.brandPurple,
  },
  checkoutBtn: {
    backgroundColor: "#1d3557",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 32,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secureBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  secureText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  promoCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: 16,
  },
  promoInputRow: {
    flexDirection: "row",
    gap: 12,
  },
  promoInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 12,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    textAlign: "center",
  },
  shopBtn: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  shopBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  }
});

export default CartScreen;
