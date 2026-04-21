import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  DollarSign,
  CheckCircle,
  Zap,
  ChevronLeft,
  Image as ImageIcon,
  Plus,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import AdminSidebar from "../../components/AdminSidebar.web";

const CATEGORIES = [
  "Sports",
  "Music",
  "Concert",
  "Festival",
  "Conference",
  "Other",
];

const AddEventScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { stadiumId: contextStadiumId, stadiumLocation } = useUser();
  const { width: windowWidth } = useWindowDimensions();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sports");
  const [stadiumId, setStadiumId] = useState(contextStadiumId || null);
  const [venueName, setVenueName] = useState(stadiumLocation || "");
  const [vipPrice, setVipPrice] = useState("500");
  const [standardPrice, setStandardPrice] = useState("200");
  const [earlyBirdPrice, setEarlyBirdPrice] = useState("150");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingStadium, setIsFetchingStadium] = useState(false);

  useEffect(() => {
    if (contextStadiumId) {
      setStadiumId(contextStadiumId);
      setVenueName(stadiumLocation || "");
    } else {
      fetchAdminStadium();
    }
  }, [contextStadiumId, stadiumLocation]);

  const fetchAdminStadium = async () => {
    setIsFetchingStadium(true);
    try {
      const stadiums = await stadiumService.getAllStadiums();
      const myStadium = (Array.isArray(stadiums) ? stadiums : []).find(
        (s) => s.adminEmail === userInfo?.email || s.adminEmail === userInfo?.username
      );
      if (myStadium) {
        setStadiumId(myStadium.id);
        setVenueName(myStadium.name);
      }
    } catch (error) {
      console.error("Error fetching admin stadium:", error);
    } finally {
      setIsFetchingStadium(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTime = `${date}T${time}:00`;
      const payload = {
        name: title.trim(),
        dateTime,
        category,
        stadiumId,
        description: description.trim(),
        tierPrices: {
          VIP: parseFloat(vipPrice),
          Standard: parseFloat(standardPrice),
          "Early Bird": parseFloat(earlyBirdPrice) || parseFloat(standardPrice),
        },
      };

      await eventService.createEvent(payload);
      alert("🎉 Event Created Successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <AdminSidebar navigation={navigation} activeNav="AddEvent" />

      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
           <View style={styles.headerTitleRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                 <ChevronLeft size={20} color="#1d3557" />
              </TouchableOpacity>
              <View>
                 <Text style={styles.headerTitle}>Schedule New Event</Text>
                 <Text style={styles.headerSub}>Create and configure a new event for {venueName || "your stadium"}</Text>
              </View>
           </View>
           
           <View style={styles.headerActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                 <Text style={styles.cancelText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={isSubmitting}>
                 {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                 ) : (
                    <>
                       <Plus size={18} color="#fff" />
                       <Text style={styles.submitText}>Publish Event</Text>
                    </>
                 )}
              </TouchableOpacity>
           </View>
        </View>

        <ScrollView style={styles.scrollArea}>
           <View style={styles.contentPadding}>
              <View style={styles.formGrid}>
                 {/* Left Column: Core Info */}
                 <View style={styles.formLeft}>
                    <View style={styles.formCard}>
                       <Text style={styles.cardTitle}>Basic Information</Text>
                       
                       <View style={styles.inputGroup}>
                          <Text style={styles.label}>Event Title</Text>
                          <View style={styles.inputWrap}>
                             <Zap size={20} color="#94a3b8" />
                             <TextInput 
                                style={styles.textInput}
                                placeholder="e.g. IPL 2026: Mumbai Indians vs CSK"
                                value={title}
                                onChangeText={setTitle}
                             />
                          </View>
                       </View>

                       <View style={styles.row}>
                          <View style={[styles.inputGroup, { flex: 1 }]}>
                             <Text style={styles.label}>Event Date</Text>
                             <View style={styles.inputWrap}>
                                <Calendar size={20} color="#94a3b8" />
                                <TextInput 
                                   style={styles.textInput}
                                   placeholder="YYYY-MM-DD"
                                   value={date}
                                   onChangeText={setDate}
                                />
                             </View>
                          </View>
                          <View style={[styles.inputGroup, { flex: 1 }]}>
                             <Text style={styles.label}>Start Time</Text>
                             <View style={styles.inputWrap}>
                                <Clock size={20} color="#94a3b8" />
                                <TextInput 
                                   style={styles.textInput}
                                   placeholder="HH:MM (24h)"
                                   value={time}
                                   onChangeText={setTime}
                                />
                             </View>
                          </View>
                       </View>

                       <View style={styles.inputGroup}>
                          <Text style={styles.label}>Event Description</Text>
                          <View style={[styles.inputWrap, { alignItems: 'flex-start', paddingTop: 16 }]}>
                             <FileText size={20} color="#94a3b8" />
                             <TextInput 
                                style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
                                placeholder="Provide detailed information about the event..."
                                multiline
                                value={description}
                                onChangeText={setDescription}
                             />
                          </View>
                       </View>
                    </View>

                    <View style={styles.formCard}>
                       <Text style={styles.cardTitle}>Venue & Category</Text>
                       <View style={styles.row}>
                          <View style={[styles.inputGroup, { flex: 1 }]}>
                             <Text style={styles.label}>Stadium / Venue</Text>
                             <View style={[styles.inputWrap, styles.disabledInput]}>
                                <MapPin size={20} color="#10b981" />
                                <Text style={styles.disabledText}>{venueName || "Locating..."}</Text>
                             </View>
                          </View>
                          <View style={[styles.inputGroup, { flex: 1 }]}>
                             <Text style={styles.label}>Category</Text>
                             <View style={styles.categoryPicker}>
                                {CATEGORIES.slice(0, 3).map(cat => (
                                   <TouchableOpacity 
                                      key={cat}
                                      style={[styles.catChip, category === cat && styles.activeCatChip]}
                                      onPress={() => setCategory(cat)}
                                   >
                                      <Text style={[styles.catText, category === cat && styles.activeCatText]}>{cat}</Text>
                                   </TouchableOpacity>
                                ))}
                             </View>
                          </View>
                       </View>
                    </View>
                 </View>

                 {/* Right Column: Pricing & Media */}
                 <View style={styles.formRight}>
                    <View style={styles.formCard}>
                       <Text style={styles.cardTitle}>Ticket Pricing (INR)</Text>
                       
                       <View style={styles.priceItem}>
                          <View style={styles.priceInfo}>
                             <View style={[styles.priceDot, { backgroundColor: '#f59e0b' }]} />
                             <Text style={styles.priceLabel}>VIP Platinum</Text>
                          </View>
                          <View style={styles.priceInputRow}>
                             <Text style={styles.currencySymbol}>₹</Text>
                             <TextInput 
                                style={styles.priceInput}
                                value={vipPrice}
                                onChangeText={setVipPrice}
                                keyboardType="numeric"
                             />
                          </View>
                       </View>

                       <View style={styles.priceItem}>
                          <View style={styles.priceInfo}>
                             <View style={[styles.priceDot, { backgroundColor: '#3b82f6' }]} />
                             <Text style={styles.priceLabel}>Standard Seating</Text>
                          </View>
                          <View style={styles.priceInputRow}>
                             <Text style={styles.currencySymbol}>₹</Text>
                             <TextInput 
                                style={styles.priceInput}
                                value={standardPrice}
                                onChangeText={setStandardPrice}
                                keyboardType="numeric"
                             />
                          </View>
                       </View>

                       <View style={styles.priceItem}>
                          <View style={styles.priceInfo}>
                             <View style={[styles.priceDot, { backgroundColor: '#10b981' }]} />
                             <Text style={styles.priceLabel}>Early Bird Offer</Text>
                          </View>
                          <View style={styles.priceInputRow}>
                             <Text style={styles.currencySymbol}>₹</Text>
                             <TextInput 
                                style={styles.priceInput}
                                value={earlyBirdPrice}
                                onChangeText={setEarlyBirdPrice}
                                keyboardType="numeric"
                             />
                          </View>
                       </View>
                    </View>

                    <View style={styles.formCard}>
                       <Text style={styles.cardTitle}>Event Media</Text>
                       <View style={styles.uploadArea}>
                          <ImageIcon size={48} color="#e2e8f0" />
                          <Text style={styles.uploadMain}>Click to upload event banner</Text>
                          <Text style={styles.uploadSub}>Recommended size: 1200 x 600px</Text>
                       </View>
                    </View>
                    
                    <View style={styles.infoBox}>
                       <ShieldAlert size={20} color="#1d3557" />
                       <Text style={styles.infoBoxText}>Events once published will be visible to all users immediately. Heatmaps will activate 2 hours prior to start time.</Text>
                    </View>
                 </View>
              </View>
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
    borderBottomColor: "#e2e8f0",
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
    color: "#1e293b",
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
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1d3557",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: "0px 10px 20px rgba(29, 53, 87, 0.2)",
  },
  submitText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 60,
  },
  formGrid: {
    flexDirection: "row",
    gap: 32,
  },
  formLeft: {
    flex: 3,
    gap: 32,
  },
  formRight: {
    flex: 2,
    gap: 32,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  disabledInput: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  disabledText: {
    fontSize: 15,
    color: "#10b981",
    fontWeight: "700",
  },
  categoryPicker: {
    flexDirection: "row",
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeCatChip: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  catText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  activeCatText: {
    color: "#fff",
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  priceInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    width: 120,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  uploadArea: {
    height: 200,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  uploadMain: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  uploadSub: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#eff6ff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoBoxText: {
    flex: 1,
    fontSize: 14,
    color: "#1d4ed8",
    lineHeight: 22,
    fontWeight: "600",
  }
});

export default AddEventScreen;
