import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Plus,
  MapPin,
  Search,
  Clock,
  Zap,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { Alert } from "react-native";

const AdminEventScheduleScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { stadiumLocation, stadiumId: contextStadiumId } = useUser();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stadiumId, setStadiumId] = useState(contextStadiumId);

  useEffect(() => {
    if (contextStadiumId) {
      setStadiumId(contextStadiumId);
      fetchEvents(contextStadiumId, true);
    } else {
      initializeData();
    }
  }, [contextStadiumId]);

  const initializeData = async () => {
    setIsLoading(true);
    let currentStadiumId = stadiumId;

    if (!currentStadiumId && userInfo?.email) {
      try {
        const stadiums = await stadiumService.getAllStadiums();
        const myStadium = stadiums.find(
          (s) =>
            s.adminEmail === userInfo.email ||
            s.adminEmail === userInfo.username,
        );
        if (myStadium) {
          currentStadiumId = myStadium.id;
          setStadiumId(currentStadiumId);
        }
      } catch (error) {
        console.error("Error fetching admin stadium:", error);
      }
    }

    await fetchEvents(currentStadiumId, true);
  };

  const fetchEvents = async (sid = stadiumId, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const data = await eventService.getEvents({ stadiumId: sid });
      // Handle page response
      const eventList = Array.isArray(data.content)
        ? data.content
        : Array.isArray(data)
          ? data
          : data?.events || [];
      setEvents(eventList);
    } catch (error) {
      console.error("Error fetching admin events:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleGoLive = async (eventId) => {
    try {
      await eventService.goEventLive(eventId);
      Alert.alert("Success", "Event is now LIVE!");
      fetchEvents(stadiumId, false);
    } catch (error) {
      console.error("Error going live:", error);
      Alert.alert("Error", "Failed to set event live.");
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchEvents(stadiumId, false);
  };

  const query = (searchQuery || "").toLowerCase();
  const filteredEvents = events.filter((event) =>
    (event.name || event.title || "").toLowerCase().includes(query),
  );

  const getDayAndMonth = (dateStr) => {
    if (!dateStr) return { day: "??", month: "??" };
    try {
      // Handle both "YYYY-MM-DD HH:MM" and ISO "YYYY-MM-DDTHH:MM:SS"
      const normalizedDate = dateStr.includes("T")
        ? dateStr
        : dateStr.replace(" ", "T");
      const date = new Date(normalizedDate);

      if (isNaN(date.getTime())) return { day: "??", month: "??" };

      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      return { day: date.getDate(), month: months[date.getMonth()] };
    } catch (e) {
      return { day: "??", month: "??" };
    }
  };

  const renderEventItem = ({ item }) => {
    const { day, month } = getDayAndMonth(item.datetime || item.date);
    const isLive = item.status === "LIVE" || item.status === "ongoing";
    const eventTime =
      (item.dateTime || item.time || "").split("T")[1]?.substring(0, 5) ||
      (item.dateTime || item.time || "").split(" ")[1]?.substring(0, 5) ||
      "TBA";

    return (
      <View style={styles.eventCard}>
        <TouchableOpacity
          style={styles.eventMainRow}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("ManageEventDetails", { event: item })
          }
        >
          <View style={styles.dateBadge}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>

          <View style={styles.eventInfo}>
            <View style={styles.titleStatusRow}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {item.name || item.title}
              </Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.infoRow}>
                <Clock size={14} color={COLORS.gray500} />
                <Text style={styles.infoText}>{eventTime}</Text>
              </View>
              <View style={styles.infoRow}>
                <MapPin size={14} color={COLORS.gray500} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {item.venue || item.stadiumName || "Wembley Stadium"}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isLive
                    ? "rgba(230, 57, 70, 0.1)"
                    : "rgba(16, 185, 129, 0.1)",
                  borderColor: isLive
                    ? "rgba(230, 57, 70, 0.2)"
                    : "rgba(16, 185, 129, 0.2)",
                  borderWidth: 1,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isLive ? COLORS.error : COLORS.success,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isLive ? COLORS.error : COLORS.success,
                  },
                ]}
              >
                {item.status || "Scheduled"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {!isLive && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.goLiveButton}
              onPress={() => handleGoLive(item.id)}
            >
              <Zap size={16} color={COLORS.white} />
              <Text style={styles.goLiveText}>SET EVENT LIVE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
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
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>Event Schedule</Text>
            <Text style={styles.stadiumSubtitle}>{stadiumLocation}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddEvent")}
          >
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray400} />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={COLORS.gray400}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.brandPurple} />
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  stadiumSubtitle: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "uppercase",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F3F5",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  eventMainRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  dateBadge: {
    backgroundColor: "rgba(158, 79, 222, 0.08)",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 68,
    height: 78,
    borderWidth: 1,
    borderColor: "rgba(158, 79, 222, 0.15)",
  },
  dateMonth: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  dateDay: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: "900",
    lineHeight: 28,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  titleStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  detailsGrid: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: "#F1F3F5",
    paddingTop: 12,
    marginTop: 4,
  },
  goLiveButton: {
    backgroundColor: "#1D3557",
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  goLiveText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },
});

export default AdminEventScheduleScreen;
