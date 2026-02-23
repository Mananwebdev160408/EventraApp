import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { userInfo } = useAuth();
  const { stadiumId: contextStadiumId, stadiumLocation } = useUser();

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
    if (!userInfo?.email && !userInfo?.username) return;
    setIsFetchingStadium(true);
    try {
      // Use stadium from userInfo if already included in login response
      if (userInfo?.stadium) {
        setStadiumId(userInfo.stadium.id);
        setVenueName(userInfo.stadium.name);
        return;
      }
      const stadiums = await stadiumService.getAllStadiums();
      const myStadium = (Array.isArray(stadiums) ? stadiums : []).find(
        (s) =>
          s.adminEmail === userInfo?.email ||
          s.adminEmail === userInfo?.username,
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

  const validateDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
  const validateTime = (t) => /^\d{2}:\d{2}$/.test(t);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Field", "Please enter an event title.");
      return;
    }
    if (!validateDate(date)) {
      Alert.alert("Invalid Date", "Please enter the date as YYYY-MM-DD.");
      return;
    }
    if (!validateTime(time)) {
      Alert.alert("Invalid Time", "Please enter the time as HH:MM (24h).");
      return;
    }
    if (!stadiumId) {
      Alert.alert(
        "No Venue",
        "Could not determine your stadium. Please try again.",
      );
      return;
    }
    if (isNaN(parseFloat(vipPrice)) || isNaN(parseFloat(standardPrice))) {
      Alert.alert("Invalid Price", "Please enter valid ticket prices.");
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
      Alert.alert(
        "🎉 Event Created!",
        `"${title}" has been scheduled successfully.`,
        [{ text: "Done", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error("Error creating event:", error);
      const msg =
        error?.response?.data?.message ||
        "Failed to create event. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateInput = (text) => {
    // Auto-insert dashes: 2026 -> 2026- -> 2026-12- -> 2026-12-05
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 4)
      cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    if (cleaned.length > 7)
      cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
    setDate(cleaned.slice(0, 10));
  };

  const formatTimeInput = (text) => {
    let cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length > 2)
      cleaned = cleaned.slice(0, 2) + ":" + cleaned.slice(2);
    setTime(cleaned.slice(0, 5));
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
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Create Event</Text>
            {venueName ? (
              <Text style={styles.headerSubtitle}>{venueName}</Text>
            ) : null}
          </View>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Event Basic Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Event Details</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>EVENT TITLE *</Text>
                <View style={styles.inputRow}>
                  <Zap size={18} color={COLORS.brandPurple} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Champions League Final"
                    placeholderTextColor="#adb5bd"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              <View style={styles.rowFields}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>DATE *</Text>
                  <View style={styles.inputRow}>
                    <Calendar size={18} color={COLORS.brandPurple} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#adb5bd"
                      value={date}
                      onChangeText={formatDateInput}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.label}>TIME *</Text>
                  <View style={styles.inputRow}>
                    <Clock size={18} color={COLORS.brandPurple} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="HH:MM"
                      placeholderTextColor="#adb5bd"
                      value={time}
                      onChangeText={formatTimeInput}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>VENUE</Text>
                <View style={[styles.inputRow, styles.disabledInput]}>
                  <MapPin
                    size={18}
                    color={isFetchingStadium ? COLORS.gray400 : "#10b981"}
                  />
                  {isFetchingStadium ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.brandPurple}
                      style={{ marginLeft: 8 }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.textInput,
                        { color: venueName ? "#1d3557" : "#adb5bd" },
                      ]}
                    >
                      {venueName || "Loading your stadium..."}
                    </Text>
                  )}
                  {venueName ? <CheckCircle size={16} color="#10b981" /> : null}
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>DESCRIPTION</Text>
                <View
                  style={[
                    styles.inputRow,
                    { alignItems: "flex-start", paddingTop: 12 },
                  ]}
                >
                  <FileText
                    size={18}
                    color={COLORS.brandPurple}
                    style={{ marginTop: 2 }}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      { height: 90, textAlignVertical: "top" },
                    ]}
                    placeholder="Describe the event, performers, rules..."
                    placeholderTextColor="#adb5bd"
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Category</Text>
              <View style={styles.chipGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, category === cat && styles.chipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === cat && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ticket Pricing */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Ticket Pricing</Text>

              {[
                {
                  label: "VIP",
                  value: vipPrice,
                  setter: setVipPrice,
                  color: "#f59e0b",
                },
                {
                  label: "Standard",
                  value: standardPrice,
                  setter: setStandardPrice,
                  color: "#3b82f6",
                },
                {
                  label: "Early Bird",
                  value: earlyBirdPrice,
                  setter: setEarlyBirdPrice,
                  color: "#10b981",
                },
              ].map(({ label, value, setter, color }) => (
                <View key={label} style={styles.priceRow}>
                  <View
                    style={[
                      styles.priceBadge,
                      { backgroundColor: `${color}18` },
                    ]}
                  >
                    <Text style={[styles.priceLabel, { color }]}>{label}</Text>
                  </View>
                  <View style={styles.priceInputWrap}>
                    <DollarSign size={16} color={color} />
                    <TextInput
                      style={[styles.priceInput, { color }]}
                      keyboardType="numeric"
                      value={value}
                      onChangeText={setter}
                      placeholder="0"
                      placeholderTextColor="#adb5bd"
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Submit Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleCreate}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#1d3557", "#457b9d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Zap size={20} color="#fff" />
                  <Text style={styles.submitText}>CREATE EVENT</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d3557",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#457b9d",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: "#457b9d",
    letterSpacing: 1.2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  disabledInput: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "500",
    padding: 0,
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#f1f3f5",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  chipActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#495057",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
  },
  priceBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 110,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  priceInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 110,
  },
  priceInput: {
    fontSize: 18,
    fontWeight: "800",
    width: 80,
    padding: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "#f1faee",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  submitBtn: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },
});

export default AddEventScreen;
