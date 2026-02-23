import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Share,
  Heart,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Briefcase,
  Utensils,
  ArrowRight,
} from "lucide-react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { eventService } from "../../api/services";
import { ActivityIndicator } from "react-native";
import { getEventImage } from "../../constants/assets";

const formatEventDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(
      dateString.includes(" ") ? dateString.replace(" ", "T") : dateString,
    );
    if (isNaN(date.getTime())) return dateString;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${dayName}, ${monthName} ${day} • ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return dateString;
  }
};

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const data = await eventService.getEventDetails(eventId);
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.brandPurple} />
      </View>
    );
  }

  if (!event) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: COLORS.text }}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Immersive Header */}
        <View style={styles.imageContainer}>
          <Image
            source={getEventImage(event.id)}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.gradientTop} />
          <View style={styles.gradientBottom} />

          <View style={styles.headerControls}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Share size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <View style={styles.tagsRow}>
            {(event.tags || [event.category || "Event"]).map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  index === 1 ? styles.tagSellingFast : styles.tagDefault,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    index === 1
                      ? styles.tagTextSellingFast
                      : styles.tagTextDefault,
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{event.name || event.title}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconBox}>
                <Calendar size={20} color={COLORS.brandPurple} />
              </View>
              <View>
                <Text style={styles.infoLabel}>DATE & TIME</Text>
                <Text style={styles.infoValue}>
                  {formatEventDate(
                    event.dateTime ||
                      event.datetime ||
                      event.date ||
                      event.time,
                  )}
                </Text>
              </View>
            </View>
            {(event.venue || event.stadiumName || event.stadium?.name) && (
              <View style={styles.infoItem}>
                <View style={styles.infoIconBox}>
                  <MapPin size={20} color={COLORS.brandPurple} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>STADIUM</Text>
                  <Text style={styles.infoValue}>
                    {event.venue || event.stadiumName || event.stadium?.name}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Briefcase size={20} color="rgba(230, 57, 70, 0.8)" />
              <Text style={styles.sectionTitle}>About This Event</Text>
            </View>
            <Text style={styles.description}>
              {event.description || "No description available for this event."}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Highlights */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Utensils size={20} color="rgba(230, 57, 70, 0.8)" />
              <Text style={styles.sectionTitle}>Event Highlights</Text>
            </View>
            <View style={styles.highlightsGrid}>
              {[
                "Live Performance",
                "Fan Zone",
                "VIP Lounge",
                "Meet & Greet",
                "Food Court",
                "Merchandise",
              ].map((h) => (
                <View key={h} style={styles.highlightChip}>
                  <Text style={styles.highlightChipText}>{h}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* What to Bring */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <ChevronRight size={20} color="rgba(230, 57, 70, 0.8)" />
              <Text style={styles.sectionTitle}>What to Bring</Text>
            </View>
            {[
              { icon: "✅", text: "Valid photo ID or passport" },
              { icon: "✅", text: "Printed or digital ticket" },
              { icon: "✅", text: "Small bag (under 30x30cm)" },
              { icon: "❌", text: "No outside food or drinks" }
            ].map((item, i) => (
              <View key={i} style={styles.checklistItem}>
                <Text style={styles.checklistIcon}>{item.icon}</Text>
                <Text style={styles.checklistText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Venue Amenities */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MapPin size={20} color="rgba(230, 57, 70, 0.8)" />
              <Text style={styles.sectionTitle}>Venue Amenities</Text>
            </View>
            <View style={styles.amenitiesGrid}>
              {[
                { emoji: "🍔", label: "Food Stalls" },
                { emoji: "🚻", label: "Restrooms" },
                { emoji: "♿", label: "Accessible" },
                { emoji: "🅿️", label: "Parking" },
                { emoji: "🏪", label: "Merch Store" },
                { emoji: "📶", label: "Free WiFi" },
              ].map((a) => (
                <View key={a.label} style={styles.amenityCard}>
                  <Text style={styles.amenityEmoji}>{a.emoji}</Text>
                  <Text style={styles.amenityLabel}>{a.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Padding for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.startFromText}>STARTING FROM</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                ₹{event.minPrice || event.price || "0"}
              </Text>
              <Text style={styles.perPerson}>/person</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.selectSeatsButton}
            onPress={() =>
              navigation.navigate("SelectSeats", { eventId: event.id })
            }
          >
            <Text style={styles.selectSeatsText}>Select Seats</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f6f8", // Using light bg as per design, then dark content if needed, but HTML has .dark class on Html, and body bg-background-light dark:bg-background-dark.
    // Let's stick to dark theme consistent with other pages
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 400,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.4)", // Simplified gradient
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "rgba(29, 53, 87, 0)", // Gradient handled by View styles if using LinearGradient, keeping simple here
  },
  headerControls: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(12px)", // Note: backdropFilter not supported in RN directly
  },
  contentCard: {
    marginTop: -64,
    backgroundColor: COLORS.background, // background-dark
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagDefault: {
    backgroundColor: "rgba(230, 57, 70, 0.2)",
  },
  tagSellingFast: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tagTextDefault: {
    color: "#e63946",
  },
  tagTextSellingFast: {
    color: "#10b981",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
    lineHeight: 34,
  },
  infoGrid: {
    flexDirection: "column",
    gap: 24,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.gray600,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white10,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray300,
    lineHeight: 22,
    marginBottom: 24,
  },
  mapThumbnail: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  directionsText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  menuLinks: {
    gap: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32, // Safe area padding
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  startFromText: {
    fontSize: 10,
    color: COLORS.gray600,
    fontWeight: "700",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e63946",
  },
  perPerson: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  selectSeatsButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#e63946",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  selectSeatsText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  highlightChip: {
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  highlightChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#e63946",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  checklistIcon: {
    fontSize: 16,
  },
  checklistText: {
    fontSize: 14,
    color: COLORS.gray300,
    fontWeight: "500",
    flex: 1,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityCard: {
    width: "30%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  amenityEmoji: {
    fontSize: 24,
  },
  amenityLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.gray300,
    textAlign: "center",
  },
});

export default EventDetailsScreen;
