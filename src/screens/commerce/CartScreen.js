import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Minus, Plus, Trash2, ChevronLeft } from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button";
import { useCart } from "../../context/CartContext";

const CartScreen = ({ navigation }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const handleRemove = (id, type) => {
    removeFromCart(id, type);
  };

  const handleUpdateQty = (id, type, delta) => {
    updateQuantity(id, type, delta);
  };

  const calculateTotal = () => {
    return cartTotal.toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.type === "Food"
            ? "Restaurant Item"
            : item.type === "Ticket"
              ? "Event Ticket"
              : "Stadium Merchandise"}
        </Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.qtyButton, item.type === "Ticket" && { opacity: 0.5 }]}
          onPress={() => handleUpdateQty(item.id, item.type, -1)}
          disabled={item.type === "Ticket"}
        >
          <Minus size={16} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.qtyButton, item.type === "Ticket" && { opacity: 0.5 }]}
          onPress={() => handleUpdateQty(item.id, item.type, 1)}
          disabled={item.type === "Ticket"}
        >
          <Plus size={16} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => handleRemove(item.id, item.type)}
        style={styles.removeButton}
      >
        <Trash2 size={18} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>Your Cart</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={clearCart}
            disabled={cartItems.length === 0}
          >
            <Trash2
              size={20}
              color={cartItems.length > 0 ? COLORS.error : COLORS.gray300}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty!</Text>
              <Button
                title="Start Shopping"
                onPress={() => navigation.navigate("Store")}
                style={{ marginTop: 20 }}
              />
            </View>
          )}
        </View>

        {cartItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text>
            </View>
            <Button
              title="Checkout"
              onPress={() => navigation.navigate("Checkout")}
            />
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
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.gray600,
    fontSize: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.gray600,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
  },
  qtyButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 16,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  totalLabel: {
    color: COLORS.gray600,
    fontSize: 16,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },
});

export default CartScreen;
