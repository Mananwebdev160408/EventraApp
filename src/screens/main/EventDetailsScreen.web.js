import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
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
  ShieldCheck,
  Star,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService } from "../../api/services";
import { getEventImage } from "../../constants/assets";
import { LinearGradient } from "expo-linear-gradient";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const EventDetailsScreen = ({ route, navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
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
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.brandPurple} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: COLORS.text }}>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="light" />
      
      {/* Left side: Immersive Image & Hero Info */}
      <View style={styles.desktopHero}>
        <Image source={getEventImage(event.id)} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient colors={["rgba(29, 53, 87, 0.2)", "rgba(29, 53, 87, 0.9)"]} style={styles.heroOverlay}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.backText}>Events</Text>
          </TouchableOpacity>

          <View style={styles.heroInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category || "EVENT"}</Text>
            </View>
            <Text style={styles.heroTitle}>{event.name}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.metaItem}>
                <Calendar size={20} color="#fff" />
                <Text style={styles.metaText}>{new Date(event.datetime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={20} color="#fff" />
                <Text style={styles.metaText}>{event.stadiumName}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Right side: Detailed Information & Booking */}
      <View style={styles.desktopSidebar}>
        <ScrollView contentContainerStyle={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          {/* Booking Card */}
          <View style={styles.bookingCard}>
             <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Tickets starting from</Text>
                <View style={styles.priceRow}>
                   <Text style={styles.currencySymbol}>₹</Text>
                   <Text style={styles.priceValue}>{event.minPrice || event.price || "800"}</Text>
                   <Text style={styles.perPerson}>/ person</Text>
                </View>
             </View>
             
             <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => navigation.navigate("SelectSeats", { eventId: event.id })}
             >
                <LinearGradient colors={[COLORS.brandPurple, "#d62828"]} style={styles.bookGradient}>
                   <Text style={styles.bookButtonText}>Select Your Seats</Text>
                   <ArrowRight size={20} color="#fff" />
                </LinearGradient>
             </TouchableOpacity>
             
             <View style={styles.trustBadge}>
                <ShieldCheck size={16} color="#10b981" />
                <Text style={styles.trustText}>Official Ticketing Partner</Text>
             </View>
          </View>

          {/* About Section */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>About the Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Venue Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {[
                { label: "Food Stalls", icon: <Utensils size={16} color="#64748b" /> },
                { label: "VIP Lounges", icon: <Star size={16} color="#64748b" /> },
                { label: "Merchandise", icon: <Briefcase size={16} color="#64748b" /> },
                { label: "Parking", icon: <MapPin size={16} color="#64748b" /> },
              ].map(a => (
                <View key={a.label} style={styles.amenityItem}>
                  {a.icon}
                  <Text style={styles.amenityLabel}>{a.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Guidelines */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Important Guidelines</Text>
            <View style={styles.guidelineList}>
               <View style={styles.guidelineItem}>
                  <View style={styles.dot} />
                  <Text style={styles.guidelineText}>Valid digital or printed ticket required for entry.</Text>
               </View>
               <View style={styles.guidelineItem}>
                  <View style={styles.dot} />
                  <Text style={styles.guidelineText}>Gates open 2 hours prior to the event start time.</Text>
               </View>
               <View style={styles.guidelineItem}>
                  <View style={styles.dot} />
                  <Text style={styles.guidelineText}>No outside food, professional cameras, or backpacks allowed.</Text>
               </View>
            </View>
          </View>
          
          <View style={styles.sidebarFooter}>
             <TouchableOpacity style={styles.secondaryAction}>
                <Share size={18} color="#1d3557" />
                <Text style={styles.secondaryActionText}>Share Event</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.secondaryAction}>
                <Heart size={18} color="#1d3557" />
                <Text style={styles.secondaryActionText}>Save for Later</Text>
             </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  desktopHero: {
    flex: 1.5,
    height: "100%",
    backgroundColor: "#000",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 60,
    justifyContent: "space-between",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  heroInfo: {
    maxWidth: 800,
  },
  categoryBadge: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 72,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 32,
    letterSpacing: -2,
    lineHeight: 80,
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 40,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  desktopSidebar: {
    width: 500,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 1,
    borderLeftColor: "#f1f5f9",
  },
  sidebarContent: {
    padding: 48,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 40,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    marginBottom: 48,
  },
  priceSection: {
    marginBottom: 32,
  },
  priceLabel: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1d3557",
  },
  priceValue: {
    fontSize: 48,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  perPerson: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
    marginLeft: 8,
  },
  bookButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  bookGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    gap: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "700",
  },
  detailSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 28,
    fontWeight: "500",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  amenityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  guidelineList: {
    gap: 16,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brandPurple,
    marginTop: 8,
  },
  guidelineText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
    lineHeight: 22,
  },
  sidebarFooter: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1d3557",
  },
});

export default EventDetailsScreen;
