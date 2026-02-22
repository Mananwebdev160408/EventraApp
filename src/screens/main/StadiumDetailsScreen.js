import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Star,
  MapPin,
  Users,
  Calendar,
  ChevronRight,
  Navigation2,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService } from "../../api/services";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const StadiumDetailsScreen = ({ route, navigation }) => {
  const { stadium } = route.params;
  const [stadiumEvents, setStadiumEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStadiumEvents();
  }, [stadium.id]);

  const fetchStadiumEvents = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd have an endpoint getEventsByStadiumId
      // For now, we fetch all events and filter them
      const data = await eventService.getEvents();
      const events = Array.isArray(data) ? data : data?.events || [];
      const filtered = events.filter(
        (e) => e.stadiumId === stadium.id || e.venue === stadium.name,
      );
      setStadiumEvents(filtered);
    } catch (error) {
      console.error("Error fetching stadium events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: stadium.image }} style={styles.coverImage} />
          <LinearGradient
            colors={[
              "rgba(29, 53, 87, 0.6)",
              "transparent",
              "transparent",
              "#F8F9FA",
            ]}
            style={styles.imageOverlay}
          />
          <SafeAreaView style={styles.headerBtns}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.stadiumName}>{stadium.name}</Text>
            </View>
            <View style={styles.locRow}>
              <MapPin size={16} color={COLORS.gray500} />
              <Text style={styles.locationText}>{stadium.location}</Text>
            </View>

            <View style={styles.statsBar}>
              <View style={styles.statBox}>
                <Users size={18} color={COLORS.brandPurple} />
                <View>
                  <Text style={styles.statVal}>{stadium.capacity}</Text>
                  <Text style={styles.statLabel}>Capacity</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Navigation2 size={18} color={COLORS.brandPurple} />
                <View>
                  <Text style={styles.statVal}>8 Gates</Text>
                  <Text style={styles.statLabel}>Entry Points</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Map Preview Card */}
          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => navigation.navigate("SelectSeats", { mode: "view" })}
            activeOpacity={0.9}
          >
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVbU7LRxdQHmPVrTWO60ift0Ktua33XZ-kS9mnN-XX3cfUUikXiOEvrsbJDe__SiLy_swMO2qilZf1bzUWWwPhWZpO6ZqPDdvgzVrjIn6_qYRb3jtVcNL2TBDlYU41ep0flfisacPFSFoMEO1cf8KPQx6H1m0yEah6E_sQTAog85Gp2mVgEDjqncAACnWZ7k8ghN1lkYt9IaWWhYDdGmA2F91EoAe59ZQSKG5n8-bqhyBJB8lI_GI2QYsAXdtk6rGG_G5GEFjMqE0",
              }}
              style={styles.mapMiniImage}
              blurRadius={2}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.mapOverlay}
            >
              <View style={styles.mapInfo}>
                <Text style={styles.mapTitle}>Interactive Ground Map</Text>
                <Text style={styles.mapSubtitle}>
                  Find gates, stores, and more
                </Text>
              </View>
              <View style={styles.mapBtn}>
                <Text style={styles.mapBtnText}>VIEW MAP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Event Schedule */}
          <View style={styles.scheduleSection}>
            <View style={styles.secHeader}>
              <Text style={styles.secTitle}>Upcoming Schedule</Text>
              <Calendar size={18} color={COLORS.gray500} />
            </View>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.brandPurple}
                style={{ marginVertical: 20 }}
              />
            ) : stadiumEvents.length > 0 ? (
              stadiumEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventItem}
                  onPress={() =>
                    navigation.navigate("EventDetails", { eventId: event.id })
                  }
                >
                  <Image
                    source={{ uri: event.image }}
                    style={styles.eventThumb}
                  />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {event.time || event.date}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.gray400} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No events scheduled at this stadium.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageContainer: {
    width: width,
    height: 300,
    backgroundColor: "#E9ECEF",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBtns: {
    position: "absolute",
    top: 0,
    left: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  content: {
    marginTop: -40,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  mainInfo: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stadiumName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1d3557",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbbf24",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: "500",
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray500,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E9ECEF",
  },
  mapCard: {
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  mapMiniImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  mapInfo: {
    flex: 1,
  },
  mapTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  mapSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  mapBtn: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  mapBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  scheduleSection: {
    marginBottom: 40,
  },
  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  secTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  eventThumb: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: COLORS.gray500,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "rgba(29, 53, 87, 0.03)",
    borderRadius: 16,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
    alignItems: "center",
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "500",
  },
});

export default StadiumDetailsScreen;
