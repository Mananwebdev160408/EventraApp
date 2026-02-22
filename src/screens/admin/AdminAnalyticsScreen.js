import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Ticket,
  Activity,
  Download,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { ADMIN_ANALYTICS_DATA } from "../../constants/mocks";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const AdminAnalyticsScreen = ({ navigation }) => {
  const { overview, revenueByMonth, ticketSales } = ADMIN_ANALYTICS_DATA;
  const maxRevenue = Math.max(...revenueByMonth.map((d) => d.value));

  const StatCard = ({
    label,
    value,
    change,
    type,
    icon,
    iconBg,
    fullWidth,
  }) => (
    <View style={[styles.statCard, fullWidth && { width: "100%" }]}>
      <View style={styles.statHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconBg || "rgba(29, 53, 87, 0.05)" },
          ]}
        >
          {icon}
        </View>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor:
                type === "up"
                  ? "rgba(5, 150, 105, 0.1)"
                  : "rgba(230, 57, 70, 0.1)",
            },
          ]}
        >
          {type === "up" ? (
            <TrendingUp size={12} color="#059669" />
          ) : (
            <TrendingDown size={12} color={COLORS.error} />
          )}
          <Text
            style={[
              styles.changeText,
              { color: type === "up" ? "#059669" : COLORS.error },
            ]}
          >
            {change}
          </Text>
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stadium Insights</Text>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#1d3557" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Performance Highlight */}
          <LinearGradient
            colors={["#1d3557", "#457b9d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.performanceBanner}
          >
            <View>
              <Text style={styles.bannerTitle}>Total Revenue</Text>
              <Text style={styles.bannerValue}>$4,285,000</Text>
            </View>
            <View style={styles.bannerBadge}>
              <TrendingUp size={16} color="#ffffff" />
              <Text style={styles.bannerBadgeText}>+18.4%</Text>
            </View>
          </LinearGradient>

          {/* Overview Grid */}
          <View style={styles.grid}>
            <StatCard
              label={overview[0].label}
              value={overview[0].value}
              change={overview[0].change}
              type={overview[0].type}
              icon={<DollarSign size={20} color="#059669" />}
              iconBg="rgba(5, 150, 105, 0.1)"
              fullWidth
            />
            <StatCard
              label={overview[1].label}
              value={overview[1].value}
              change={overview[1].change}
              type={overview[1].type}
              icon={<Ticket size={20} color={COLORS.error} />}
              iconBg="rgba(230, 57, 70, 0.1)"
            />
            <StatCard
              label={overview[2].label}
              value={overview[2].value}
              change={overview[2].change}
              type={overview[2].type}
              icon={<Activity size={20} color="#1d3557" />}
              iconBg="rgba(29, 53, 87, 0.1)"
            />
          </View>

          {/* Revenue Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>Revenue Trend</Text>
              <TouchableOpacity>
                <Text style={styles.chartFilter}>Last 6 Months</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>
              {revenueByMonth.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item.value / maxRevenue) * 150,
                        backgroundColor:
                          index % 2 === 0 ? "#1d3557" : COLORS.error,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ticket Breakdown */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Categorical Distribution</Text>
            <View style={{ marginTop: 20 }}>
              {ticketSales.map((item, index) => (
                <View key={index} style={styles.progressRow}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>{item.category}</Text>
                    <Text style={styles.progressValue}>{item.count}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${(item.count / 5000) * 100}%`,
                          backgroundColor:
                            index === 0 ? COLORS.error : "#1d3557",
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
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
    backgroundColor: "#f1faee",
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  performanceBanner: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  bannerTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  bannerValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  bannerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerBadgeText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48 - 16) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(29, 53, 87, 0.5)",
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  chartFilter: {
    fontSize: 13,
    fontWeight: "700",
    color: "#457b9d",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
  },
  barContainer: {
    alignItems: "center",
    gap: 12,
  },
  bar: {
    width: 30,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: "rgba(29, 53, 87, 0.4)",
    fontWeight: "700",
  },
  progressRow: {
    marginBottom: 20,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: "#1d3557",
    fontWeight: "700",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(29, 53, 87, 0.05)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});

export default AdminAnalyticsScreen;
