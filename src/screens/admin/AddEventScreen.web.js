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
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FileText,
  DollarSign,
  CheckCircle,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
  Plus,
  BarChart3,
  Flame,
  ArrowLeft,
  Trash2,
  Save,
  Image as ImageIcon,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { eventService, stadiumService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

const CATEGORIES = [
  "Sports",
  "Music",
  "Concert",
  "Festival",
  "Conference",
  "Other",
];

const AddEventScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { userInfo } = useAuth();
  const { stadiumId: contextStadiumId, stadiumLocation } = useUser();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sports");
  const [vipPrice, setVipPrice] = useState("500");
  const [standardPrice, setStandardPrice] = useState("200");
  const [earlyBirdPrice, setEarlyBirdPrice] = useState("150");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingStadium, setIsFetchingStadium] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !date || !time) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const dateTime = `${date}T${time}:00`;
      const payload = {
        name: title.trim(),
        dateTime,
        category,
        stadiumId: contextStadiumId,
        description: description.trim(),
        tierPrices: {
          VIP: parseFloat(vipPrice),
          Standard: parseFloat(standardPrice),
          "Early Bird": parseFloat(earlyBirdPrice),
        },
      };
      await eventService.createEvent(payload);
      Alert.alert("Success", "Event created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDesktop) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc'}}>
        <Text>Please use desktop for event management</Text>
      </View>
    );
  }

  return (
    <View style={styles.desktopWrapper}>
      <StatusBar style="light" />
      
      {/* Sidebar - Consistent with other Admin pages */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <ShieldCheck size={28} color={COLORS.error} />
          </View>
          <View>
            <Text style={styles.logoText}>EVENTRA</Text>
            <Text style={styles.logoSub}>SHIELD ADMIN</Text>
          </View>
        </View>

        <View style={styles.navGroup}>
          <Text style={styles.navSectionLabel}>CORE CONTROL</Text>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminDashboard")}>
            <LayoutDashboard size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Command Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AdminAnalytics")}>
            <BarChart3 size={20} color="#94a3b8" />
            <Text style={styles.navItemText}>Deep Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navGroup}>
          <Text style={styles.navSectionLabel}>MANAGEMENT</Text>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Plus size={20} color="#fff" />
            <Text style={[styles.navItemText, styles.navItemTextActive]}>Create Event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.userProfile}>
            <Image source={{ uri: userInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{userInfo?.name || "System Admin"}</Text>
              <Text style={styles.userRole}>Super Admin</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#1d3557" />
            <Text style={styles.backBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.discardBtn} onPress={() => navigation.goBack()}>
              <Trash2 size={18} color="#ef4444" />
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : (
                <>
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveText}>Publish Event</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Create New Event</Text>
            <Text style={styles.pageSubtitle}>Schedule a new match, concert, or festival at {stadiumLocation}</Text>
          </View>

          <View style={styles.formGrid}>
            {/* Left: Main Form */}
            <View style={styles.formMain}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Event Overview</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT TITLE</Text>
                  <TextInput 
                    style={styles.textInput} 
                    placeholder="e.g. Champions League Final 2026" 
                    value={title} 
                    onChangeText={setTitle}
                  />
                </View>
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>DATE (YYYY-MM-DD)</Text>
                    <View style={styles.inputWithIcon}>
                      <Calendar size={18} color="#94a3b8" />
                      <TextInput 
                        style={styles.innerInput} 
                        placeholder="2026-05-24" 
                        value={date} 
                        onChangeText={setDate}
                      />
                    </View>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>TIME (HH:MM)</Text>
                    <View style={styles.inputWithIcon}>
                      <Clock size={18} color="#94a3b8" />
                      <TextInput 
                        style={styles.innerInput} 
                        placeholder="19:30" 
                        value={time} 
                        onChangeText={setTime}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>DESCRIPTION</Text>
                  <TextInput 
                    style={[styles.textInput, styles.textArea]} 
                    placeholder="Tell us more about the event..." 
                    multiline 
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Ticketing & Tiers</Text>
                <View style={styles.pricingTable}>
                  <View style={styles.priceItem}>
                    <View style={styles.priceHeader}>
                      <View style={[styles.priceDot, { backgroundColor: '#f59e0b' }]} />
                      <Text style={styles.priceLabel}>VIP Platinum</Text>
                    </View>
                    <View style={styles.priceInputBox}>
                      <Text style={styles.currency}>₹</Text>
                      <TextInput style={styles.priceInput} value={vipPrice} onChangeText={setVipPrice} keyboardType="numeric" />
                    </View>
                  </View>
                  <View style={styles.priceItem}>
                    <View style={styles.priceHeader}>
                      <View style={[styles.priceDot, { backgroundColor: '#3b82f6' }]} />
                      <Text style={styles.priceLabel}>Standard East</Text>
                    </View>
                    <View style={styles.priceInputBox}>
                      <Text style={styles.currency}>₹</Text>
                      <TextInput style={styles.priceInput} value={standardPrice} onChangeText={setStandardPrice} keyboardType="numeric" />
                    </View>
                  </View>
                  <View style={styles.priceItem}>
                    <View style={styles.priceHeader}>
                      <View style={[styles.priceDot, { backgroundColor: '#10b981' }]} />
                      <Text style={styles.priceLabel}>Early Bird</Text>
                    </View>
                    <View style={styles.priceInputBox}>
                      <Text style={styles.currency}>₹</Text>
                      <TextInput style={styles.priceInput} value={earlyBirdPrice} onChangeText={setEarlyBirdPrice} keyboardType="numeric" />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Right: Preview & Category */}
            <View style={styles.formAside}>
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Category</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity 
                      key={cat} 
                      style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
                <View style={styles.mockCard}>
                  <View style={styles.mockImage}>
                    <ImageIcon size={40} color="#e2e8f0" />
                  </View>
                  <View style={styles.mockContent}>
                    <View style={styles.mockBadge}><Text style={styles.mockBadgeText}>{category.toUpperCase()}</Text></View>
                    <Text style={styles.mockTitle}>{title || "Untitled Event"}</Text>
                    <View style={styles.mockMeta}>
                      <Calendar size={14} color="#94a3b8" />
                      <Text style={styles.mockMetaText}>{date || "Date TBA"}</Text>
                    </View>
                    <View style={styles.mockMeta}>
                      <MapPin size={14} color="#94a3b8" />
                      <Text style={styles.mockMetaText}>{stadiumLocation}</Text>
                    </View>
                    <View style={styles.mockFooter}>
                      <Text style={styles.mockPrice}>Starts at ₹{standardPrice}</Text>
                      <View style={styles.mockBtn} />
                    </View>
                  </View>
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
  desktopWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: 280,
    backgroundColor: "#0f172a",
    padding: 32,
    justifyContent: "space-between",
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 60,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logoText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
  },
  logoSub: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  navGroup: {
    marginBottom: 40,
    gap: 8,
  },
  navSectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  navItemText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "600",
  },
  navItemTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  sidebarFooter: {
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  userRole: {
    color: "#64748b",
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
    padding: 60,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d3557",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  discardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fff",
  },
  discardText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ef4444",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1d3557",
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
  },
  saveText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  scrollArea: {
    gap: 40,
  },
  pageHeader: {
    gap: 8,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1d3557",
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  formGrid: {
    flexDirection: "row",
    gap: 40,
  },
  formMain: {
    flex: 2,
    gap: 32,
  },
  formAside: {
    flex: 1,
    gap: 32,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1e293b",
    marginBottom: 8,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  textArea: {
    height: 120,
    paddingVertical: 16,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 20,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  innerInput: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  categoryBtnActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  categoryBtnTextActive: {
    color: "#fff",
  },
  pricingTable: {
    gap: 16,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  priceHeader: {
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
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  priceInputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    height: 40,
  },
  currency: {
    fontSize: 14,
    fontWeight: "800",
    color: "#94a3b8",
  },
  priceInput: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1d3557",
    width: 60,
  },
  previewCard: {
    gap: 16,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  mockCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    boxShadow: "0px 20px 40px rgba(0,0,0,0.05)",
  },
  mockImage: {
    height: 160,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  mockContent: {
    padding: 24,
    gap: 12,
  },
  mockBadge: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  mockBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  mockTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1d3557",
  },
  mockMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mockMetaText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  mockFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mockPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1d3557",
  },
  mockBtn: {
    width: 60,
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
  },
});

export default AddEventScreen;
