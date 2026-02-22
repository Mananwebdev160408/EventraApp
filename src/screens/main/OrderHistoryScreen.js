import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Package,
  Trash2,
  Phone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      title: "Stadium Burger & Fries",
      type: "Food",
      date: "Today, 2:30 PM",
      status: "In Progress",
      amount: "$18.50",
      venue: "The Stadium Grill",
    },
    {
      id: "ORD002",
      title: "Home Match Jersey 2024",
      type: "Merchandise",
      date: "Today, 1:15 PM",
      status: "Delivered",
      amount: "$85.00",
      venue: "Official Store",
    },
    {
      id: "ORD003",
      title: "Classic Hot Dog",
      type: "Food",
      date: "Today, 12:45 PM",
      status: "In Progress",
      amount: "$8.00",
      venue: "Arena Dogs & Co.",
    },
  ]);

  const handleMarkDelivered = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "Delivered" } : order,
      ),
    );
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:+1234567890");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleCallSupport}
          >
            <Phone size={20} color={COLORS.brandPurple} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        order.type === "Food"
                          ? "rgba(230, 57, 70, 0.1)"
                          : "rgba(244, 162, 97, 0.1)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: order.type === "Food" ? "#e63946" : "#f4a261" },
                    ]}
                  >
                    {order.type}
                  </Text>
                </View>
                <Text style={styles.orderId}>#{order.id}</Text>
              </View>

              <View style={styles.orderBody}>
                <View style={styles.orderMainInfo}>
                  <Text style={styles.orderTitle}>{order.title}</Text>
                  <Text style={styles.orderVenue}>{order.venue}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <Text style={styles.orderAmount}>{order.amount}</Text>
              </View>

              <View style={styles.orderFooter}>
                <View style={styles.statusRow}>
                  {order.status === "Delivered" ? (
                    <View style={styles.deliveredLabel}>
                      <CheckCircle2 size={16} color="#059669" />
                      <Text style={styles.deliveredText}>Delivered</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingLabel}>
                      <AlertCircle size={16} color="#f59e0b" />
                      <Text style={styles.pendingText}>In Progress</Text>
                    </View>
                  )}
                </View>

                {order.status !== "Delivered" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.deliveredBtn}
                      onPress={() => handleMarkDelivered(order.id)}
                    >
                      <Text style={styles.deliveredBtnText}>
                        Mark as Delivered
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.supportBtn}
                      onPress={handleCallSupport}
                    >
                      <Phone size={14} color={COLORS.gray500} />
                      <Text style={styles.supportBtnText}>Help</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpCard}>
              <View style={styles.helpIconBox}>
                <Phone size={24} color={COLORS.brandPurple} />
              </View>
              <View style={styles.helpInfo}>
                <Text style={styles.helpTitle}>Need Immediate Help?</Text>
                <Text style={styles.helpSubtitle}>
                  Call our 24/7 stadium support line
                </Text>
                <TouchableOpacity onPress={handleCallSupport}>
                  <Text style={styles.phoneNumber}>+1 (800) EVENTRA</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(123, 44, 191, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  orderId: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray500,
  },
  orderBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  orderMainInfo: {
    flex: 1,
    marginRight: 16,
  },
  orderTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  orderVenue: {
    fontSize: 13,
    color: COLORS.gray500,
    fontWeight: "600",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.gray400,
    fontWeight: "500",
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1d3557",
  },
  orderFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  statusRow: {
    marginBottom: 16,
  },
  deliveredLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(5, 150, 105, 0.08)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  deliveredText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
  pendingLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#f59e0b",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  deliveredBtn: {
    flex: 2,
    backgroundColor: COLORS.brandPurple,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveredBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  supportBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  supportBtnText: {
    color: COLORS.gray600,
    fontSize: 13,
    fontWeight: "700",
  },
  helpSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(123, 44, 191, 0.1)",
  },
  helpIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "rgba(123, 44, 191, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  helpInfo: {
    flex: 1,
    marginLeft: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    fontWeight: "600",
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.brandPurple,
    letterSpacing: 0.5,
  },
});

export default OrderHistoryScreen;
