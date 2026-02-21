import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  Plus,
  Calendar,
  MapPin,
  Search,
  Clock,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { ADMIN_SCHEDULE_DATA } from "../../constants/mocks";

const AdminEventScheduleScreen = ({ navigation }) => {
  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate("ManageEventDetails", { event: item })}
    >
      <View style={styles.eventHeader}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateMonth}>{item.date.split("-")[1]}</Text>
          <Text style={styles.dateDay}>{item.date.split("-")[2]}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.infoRow}>
            <Clock size={14} color={COLORS.gray600} />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color={COLORS.gray600} />
            <Text style={styles.infoText}>{item.venue}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "Scheduled" ? COLORS.success : "#fbbf24",
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === "Scheduled" ? COLORS.success : "#fbbf24",
              },
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Event Schedule</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddEvent")}
          >
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray600} />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={COLORS.gray600}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={ADMIN_SCHEDULE_DATA}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  eventCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: "row",
    gap: 20,
  },
  dateBadge: {
    backgroundColor: "rgba(158, 79, 222, 0.1)",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 74,
    borderWidth: 1,
    borderColor: "rgba(158, 79, 222, 0.1)",
  },
  dateMonth: {
    fontSize: 13,
    color: COLORS.brandPurple,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dateDay: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: "900",
  },
  eventInfo: {
    flex: 1,
    gap: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray600,
    fontWeight: "600",
    opacity: 0.8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignSelf: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default AdminEventScheduleScreen;
