import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  ChevronLeft,
  User,
  ShieldCheck,
  Check,
  ChevronRight,
  Crown,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../../context/UserContext";

const { width } = Dimensions.get("window");

const RoleCard = ({ title, description, icon, isSelected, onPress, isPro }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View
        style={[styles.iconContainer, isSelected && styles.iconContainerActive]}
      >
        {icon}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, isSelected && styles.cardTitleActive]}
          >
            {title}
          </Text>
          {isPro && (
            <View style={styles.proBadge}>
              <Crown size={10} color="#ffffff" fill="#ffffff" />
              <Text style={styles.proText}>PRO</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.cardDescription,
            isSelected && styles.cardDescriptionActive,
          ]}
        >
          {description}
        </Text>
      </View>
      <View
        style={[
          styles.selectionCircle,
          isSelected && styles.selectionCircleActive,
        ]}
      >
        {isSelected && <Check size={14} color="#ffffff" strokeWidth={4} />}
      </View>
    </TouchableOpacity>
  );
};

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState("fan"); // 'fan' or 'admin'
  const { setRole, updateLocation } = useUser();

  const handleContinue = () => {
    setRole(selectedRole);
    updateLocation(); // Trigger location track on "Login/Entry"

    if (selectedRole === "admin") {
      navigation.reset({
        index: 0,
        routes: [{ name: "AdminTabs" }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Decorative Background Elements */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>

          <View style={styles.stepContainer}>
            <View style={styles.stepBubbleActive}>
              <Text style={styles.stepTextActive}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepBubbleInactive}>
              <Text style={styles.stepTextInactive}>2</Text>
            </View>
          </View>

          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleWrapper}>
            <View style={styles.accentLine} />
            <Text style={styles.title}>Account Type</Text>
            <Text style={styles.subtitle}>
              Personalize your platform experience by selecting your primary
              role.
            </Text>
          </View>

          <View style={styles.cardsWrapper}>
            <RoleCard
              title="Global Fan"
              description="Access world-class events, book premium seating, and manage your digital pass."
              icon={
                <User
                  size={28}
                  color={selectedRole === "fan" ? "#ffffff" : "#1d3557"}
                />
              }
              isSelected={selectedRole === "fan"}
              onPress={() => setSelectedRole("fan")}
            />

            <RoleCard
              title="Stadium Executive"
              description="Full operational control over venue logistics, real-time analytics, and event security."
              icon={
                <ShieldCheck
                  size={28}
                  color={selectedRole === "admin" ? "#ffffff" : "#1d3557"}
                />
              }
              isSelected={selectedRole === "admin"}
              onPress={() => setSelectedRole("admin")}
              isPro
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              You can always switch or link multiple accounts later in your
              profile settings.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={0.9}
            style={styles.ctaButton}
          >
            <LinearGradient
              colors={["#1d3557", "#0f172a"]}
              style={styles.gradient}
            >
              <Text style={styles.ctaText}>Proceed to Dashboard</Text>
              <View style={styles.ctaArrow}>
                <ChevronRight size={18} color="#ffffff" />
              </View>
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
    backgroundColor: "#ffffff", // Clean white background for contrast
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(29, 53, 87, 0.03)",
  },
  bgCircle2: {
    position: "absolute",
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(230, 57, 70, 0.02)",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBubbleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1d3557",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  stepLine: {
    width: 20,
    height: 2,
    backgroundColor: "#e2e8f0",
  },
  stepBubbleInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  stepTextInactive: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  titleWrapper: {
    marginBottom: 48,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.error,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
    lineHeight: 24,
  },
  cardsWrapper: {
    gap: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 2,
    borderColor: "#f1f5f9",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardActive: {
    borderColor: "#1d3557",
    backgroundColor: "#ffffff",
    shadowOpacity: 0.1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerActive: {
    backgroundColor: "#1d3557",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1d3557",
  },
  cardTitleActive: {
    color: "#1d3557",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  proText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    fontWeight: "500",
  },
  cardDescriptionActive: {
    color: "#334155",
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionCircleActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  infoBox: {
    marginTop: 40,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(29, 53, 87, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
  },
  infoText: {
    textAlign: "center",
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    lineHeight: 18,
  },
  footer: {
    padding: 28,
    paddingBottom: 40,
  },
  ctaButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 16,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RoleSelectionScreen;
