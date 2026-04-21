import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Download,
  Wallet,
  Share2,
  Printer,
  ChevronRight,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { bookingService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import WebUserSidebar from "../../components/WebUserSidebar";
import { LinearGradient } from "expo-linear-gradient";

const TicketScreen = ({ navigation, route }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { bookingId } = route.params || {};
  const { userInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [bookingId]);

  const fetchTicketDetails = async () => {
    try {
      const data = await bookingService.getBookingById(bookingId);
      if (data) {
        setTicketData(data);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      // Mock fallback if empty
      if (!ticketData && (!bookingId || bookingId === "MOCK-TKT-789")) {
        setTicketData({
          id: "MOCK-TKT-789",
          event: {
            id: "mock-event-123",
            name: "IPL 2026: MI vs CSK",
            datetime: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
            stadiumName: "Wankhede Stadium",
            gate: "Gate B3",
          },
          seats: [{ seatCategory: "Level 1 - East", row: "12", seatNumber: "45" }],
        });
      }
      setLoading(false);
    }
  };

  const formatEventDate = (dateString, type = "date") => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (type === "time") return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const eventData = ticketData?.event || {};
  const primarySeat = ticketData?.seats?.[0] || {};

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <WebUserSidebar navigation={navigation} activeNav="MyEvents" />

      <View style={styles.mainContent}>
        {/* Header Section */}
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Digital Entry Pass</Text>
                 <Text style={styles.headerSub}>Ticket ID: {ticketData?.id || "---"}</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerActionBtn}><Printer size={20} color="#1d3557" /></TouchableOpacity>
              <TouchableOpacity style={styles.headerActionBtn}><Share2 size={20} color="#1d3557" /></TouchableOpacity>
              <TouchableOpacity style={styles.downloadBtn}>
                 <Download size={18} color="#fff" />
                 <Text style={styles.downloadBtnText}>Download PDF</Text>
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
           {loading ? (
             <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.brandPurple} />
             </View>
           ) : (
             <View style={styles.ticketCanvas}>
                {/* Visual Representation of a premium ticket */}
                <View style={styles.ticketMainCard}>
                   {/* Left Side: Event Image & Info */}
                   <View style={styles.ticketLeft}>
                      <Image source={{ uri: eventData.image }} style={styles.eventImg} />
                      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.eventOverlay}>
                         <View style={styles.eventDetails}>
                            <Text style={styles.eventDate}>{formatEventDate(eventData.datetime).toUpperCase()}</Text>
                            <Text style={styles.eventTitle}>{eventData.name}</Text>
                            <View style={styles.locationRow}>
                               <MapPin size={16} color="rgba(255,255,255,0.7)" />
                               <Text style={styles.locationText}>{eventData.stadiumName}</Text>
                            </View>
                         </View>
                      </LinearGradient>
                   </View>

                   {/* Right Side: Seat & QR */}
                   <View style={styles.ticketRight}>
                      <View style={styles.passHeader}>
                         <View style={styles.logoCircle}><Text style={styles.logoInitials}>E</Text></View>
                         <View>
                            <Text style={styles.passTitle}>Official Pass</Text>
                            <Text style={styles.passSub}>Eventra Stadium Network</Text>
                         </View>
                      </View>

                      <View style={styles.seatGrid}>
                         <View style={styles.seatInfo}>
                            <Text style={styles.seatLabel}>SECTION</Text>
                            <Text style={styles.seatValue}>{primarySeat.seatCategory || "GEN"}</Text>
                         </View>
                         <View style={styles.seatInfo}>
                            <Text style={styles.seatLabel}>ROW</Text>
                            <Text style={styles.seatValue}>{primarySeat.row || "12"}</Text>
                         </View>
                         <View style={styles.seatInfo}>
                            <Text style={styles.seatLabel}>SEAT</Text>
                            <Text style={styles.seatValue}>{primarySeat.seatNumber || "45"}</Text>
                         </View>
                         <View style={styles.seatInfo}>
                            <Text style={styles.seatLabel}>GATE</Text>
                            <Text style={[styles.seatValue, { color: COLORS.brandPurple }]}>{eventData.gate || "B3"}</Text>
                         </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.userRow}>
                         <View>
                            <Text style={styles.seatLabel}>PASS HOLDER</Text>
                            <Text style={styles.userName}>{userInfo?.firstname} {userInfo?.lastname}</Text>
                         </View>
                         <View style={styles.qrContainer}>
                            <Image 
                              source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData?.id}` }} 
                              style={styles.qrCode} 
                            />
                         </View>
                      </View>

                      <View style={styles.entryInstructions}>
                         <Text style={styles.instructionTitle}>ENTRY INSTRUCTIONS</Text>
                         <Text style={styles.instructionText}>• Please arrive 45 mins before the event start time.</Text>
                         <Text style={styles.instructionText}>• Keep this digital pass ready for scanning at {eventData.gate}.</Text>
                         <Text style={styles.instructionText}>• Identification proof may be required at the venue.</Text>
                      </View>
                   </View>
                   
                   {/* Ticket Notch Decorations */}
                   <View style={styles.notchTop} />
                   <View style={styles.notchBottom} />
                </View>

                {/* Secondary Actions */}
                <View style={styles.sideActions}>
                   <TouchableOpacity style={styles.appleWalletBtn}>
                      <Wallet size={20} color="#fff" />
                      <Text style={styles.appleWalletText}>Add to Apple Wallet</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.googlePayBtn}>
                      <Wallet size={20} color="#fff" />
                      <Text style={styles.googlePayText}>Save to Google Pay</Text>
                   </TouchableOpacity>
                   
                   <View style={styles.helpBox}>
                      <Text style={styles.helpTitle}>Need Help?</Text>
                      <Text style={styles.helpText}>If you're having trouble scanning your ticket, please visit the venue box office.</Text>
                      <TouchableOpacity style={styles.supportLink}>
                         <Text style={styles.supportLinkText}>Contact Support</Text>
                         <ChevronRight size={14} color={COLORS.brandPurple} />
                      </TouchableOpacity>
                   </View>
                </View>
             </View>
           )}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 60,
    alignItems: "center",
  },
  ticketCanvas: {
    flexDirection: "row",
    gap: 48,
    maxWidth: 1200,
    width: "100%",
  },
  ticketMainCard: {
    flex: 2,
    flexDirection: "row",
    height: 600,
    backgroundColor: "#fff",
    borderRadius: 40,
    overflow: "hidden",
    boxShadow: "0px 20px 50px rgba(0,0,0,0.1)",
    position: "relative",
  },
  ticketLeft: {
    flex: 1,
    position: "relative",
  },
  eventImg: {
    width: "100%",
    height: "100%",
  },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    padding: 40,
    justifyContent: "flex-end",
  },
  eventDate: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "500",
  },
  ticketRight: {
    flex: 1,
    padding: 48,
    backgroundColor: "#fff",
  },
  passHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 48,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInitials: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
  passTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  passSub: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  seatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 40,
  },
  seatInfo: {
    width: "45%",
  },
  seatLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  seatValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1d3557",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 40,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  userName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  qrContainer: {
    width: 100,
    height: 100,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  qrCode: {
    width: "100%",
    height: "100%",
  },
  entryInstructions: {
    backgroundColor: "#f8fafc",
    padding: 24,
    borderRadius: 24,
  },
  instructionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 12,
    letterSpacing: 1,
  },
  instructionText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 4,
  },
  notchTop: {
    position: "absolute",
    top: -20,
    left: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    marginLeft: -20,
  },
  notchBottom: {
    position: "absolute",
    bottom: -20,
    left: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    marginLeft: -20,
  },
  sideActions: {
    flex: 0.8,
    gap: 24,
  },
  appleWalletBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 16,
  },
  appleWalletText: {
    color: "#fff",
    fontWeight: "700",
  },
  googlePayBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#4285F4",
    paddingVertical: 18,
    borderRadius: 16,
  },
  googlePayText: {
    color: "#fff",
    fontWeight: "700",
  },
  helpBox: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginTop: 20,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: "500",
  },
  supportLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  supportLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.brandPurple,
  },
  loaderContainer: {
    paddingVertical: 100,
  }
});

export default TicketScreen;
