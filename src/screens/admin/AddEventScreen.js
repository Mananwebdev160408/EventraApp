import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Tag,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { eventService, stadiumService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

const AddEventScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-12-05");
  const [time, setTime] = useState("18:30");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Sports");
  const [stadiumId, setStadiumId] = useState(null);
  const [vipPrice, setVipPrice] = useState("500");
  const [standardPrice, setStandardPrice] = useState("200");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdminStadium();
  }, []);

  const fetchAdminStadium = async () => {
    try {
      const stadiums = await stadiumService.getAllStadiums();
      const myStadium = stadiums.find(
        (s) =>
          s.adminEmail === userInfo?.email ||
          s.adminEmail === userInfo?.username,
      );
      if (myStadium) {
        setStadiumId(myStadium.id);
        setVenue(myStadium.name);
      }
    } catch (error) {
      console.error("Error fetching stadium:", error);
    }
  };

  const handleCreate = async () => {
    if (!title || !date || !time || !stadiumId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTime = new Date(`${date}T${time}:00`).toISOString();
      const payload = {
        name: title,
        dateTime: dateTime,
        category: category,
        stadiumId: stadiumId,
        description: description,
        tierPrices: {
          VIP: parseFloat(vipPrice),
          Standard: parseFloat(standardPrice),
        },
      };

      await eventService.createEvent(payload);
      Alert.alert("Success", "Event created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.headerTitle}>Add New Event</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Event Title</Text>
            <Input
              placeholder="e.g. Champions League Final"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Date</Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                icon={<Calendar size={20} color={COLORS.gray400} />}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Time</Text>
              <Input
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
                icon={<Clock size={20} color={COLORS.gray400} />}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <Input
              placeholder="e.g. Sports, Music"
              value={category}
              onChangeText={setCategory}
              icon={<Tag size={20} color={COLORS.gray400} />}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Venue</Text>
            <Input
              placeholder="Venue Name"
              value={venue}
              editable={false}
              icon={<MapPin size={20} color={COLORS.gray400} />}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the event..."
              placeholderTextColor={COLORS.gray400}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Ticket Settings</Text>

          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>VIP Seats Price</Text>
            <Input
              placeholder="300"
              style={{ width: 100 }}
              keyboardType="numeric"
              value={vipPrice}
              onChangeText={setVipPrice}
            />
          </View>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketLabel}>Standard Seats Price</Text>
            <Input
              placeholder="150"
              style={{ width: 100 }}
              keyboardType="numeric"
              value={standardPrice}
              onChangeText={setStandardPrice}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isSubmitting ? "Creating..." : "Create Event"}
            onPress={handleCreate}
            disabled={isSubmitting}
          />
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 20,
    paddingBottom: 100,
  },
  imageUpload: {
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    marginBottom: 8,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray600,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  textArea: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    textAlignVertical: "top",
    height: 100,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
});

export default AddEventScreen;
