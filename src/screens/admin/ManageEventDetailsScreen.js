import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Edit2,
  Download,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Clock,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { seatService, eventService } from "../../api/services";

const { width } = Dimensions.get("window");

const ManageEventDetailsScreen = ({ navigation, route }) => {
  const { event } = route.params;
  const [availability, setAvailability] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await seatService.getSeatAvailability(event.id);
      setAvailability(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching seat availability:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAvailability(false);
  };

  const totalSeats = availability.reduce((acc, cat) => acc + cat.totalSeats, 0);
  const availableSeats = availability.reduce(
    (acc, cat) => acc + cat.availableSeats,
    0,
  );
  const soldSeats = totalSeats - availableSeats;

  const categories = availability.map((cat, index) => ({
    name: cat.categoryName,
    sold: cat.totalSeats - cat.availableSeats,
    total: cat.totalSeats,
    color: index === 0 ? "#fbbf24" : index === 1 ? "#10b981" : "#3b82f6",
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 size={20} color={COLORS.brandPurple} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.brandPurple} />
            </View>
          ) : (
            <>
              <View style={styles.heroCard}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Calendar size={16} color={COLORS.gray400} />
                    <Text style={styles.metaText}>{event.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={COLORS.gray400} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          event.status === "Scheduled"
                            ? COLORS.success
                            : "#fbbf24",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          event.status === "Scheduled"
                            ? COLORS.success
                            : "#fbbf24",
                      },
                    ]}
                  >
                    {event.status}
                  </Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Total Sold</Text>
                  <Text style={styles.statValue}>
                    {totalSeats > 0
                      ? ((soldSeats / totalSeats) * 100).toFixed(1)
                      : "0"}
                    %
                  </Text>
                  <Text style={styles.statSubtext}>
                    {soldSeats} / {totalSeats}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Revenue (Est.)</Text>
                  <Text style={[styles.statValue, { color: COLORS.success }]}>
                    $1.2M
                  </Text>
                  <Text style={styles.statSubtext}>+12% vs avg</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Category Breakdown</Text>
              <View style={styles.categoryList}>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <View key={cat.name} style={styles.categoryCard}>
                      <View style={styles.catHeader}>
                        <View style={styles.catTitleRow}>
                          <View
                            style={[
                              styles.catColor,
                              { backgroundColor: cat.color },
                            ]}
                          />
                          <Text style={styles.catName}>{cat.name}</Text>
                        </View>
                        <Text style={styles.catPercent}>
                          {cat.total > 0
                            ? Math.round((cat.sold / cat.total) * 100)
                            : 0}
                          %
                        </Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${
                                cat.total > 0 ? (cat.sold / cat.total) * 100 : 0
                              }%`,
                              backgroundColor: cat.color,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.catStats}>
                        {cat.sold.toLocaleString()} sold of{" "}
                        {cat.total.toLocaleString()}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyActivity}>
                    <Text style={styles.emptyText}>No data available</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Download size={20} color={COLORS.text} />
                  <Text style={styles.actionText}>Export Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: COLORS.error }]}
                >
                  <Trash2 size={20} color={COLORS.error} />
                  <Text style={[styles.actionText, { color: COLORS.error }]}>
                    Cancel Event
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    gap: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: COLORS.gray600,
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  statSubtext: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  catTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  catName: {
    fontWeight: "600",
    color: COLORS.text,
  },
  catPercent: {
    fontWeight: "700",
    color: COLORS.text,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  catStats: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontWeight: "600",
    color: COLORS.text,
  },
  loaderContainer: {
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyActivity: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ManageEventDetailsScreen;
