import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import {
  ChevronLeft,
  MapPin,
  Warehouse,
  Mail,
  Lock,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const StadiumOnboardingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stadiumName: "",
    city: "",
    state: "",
    country: "",
    capacity: "",
    adminEmail: "",
    password: "",
  });

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.stadiumName ||
        !formData.city ||
        !formData.state ||
        !formData.country ||
        !formData.capacity
      ) {
        Alert.alert(
          "Required Fields",
          "Please fill in all stadium details to proceed.",
        );
        return;
      }
      setStep(2);
    } else {
      if (!formData.adminEmail || !formData.password) {
        Alert.alert(
          "Required Fields",
          "Please set your administrator credentials.",
        );
        return;
      }
      // Success - In a real app we'd save this data
      Alert.alert(
        "Registration Sent",
        "Your stadium partnership request has been received. Our team will verify your details.",
        [
          {
            text: "Back to Home",
            onPress: () => navigation.navigate("AuthLanding"),
          },
        ],
      );
    }
  };

  const renderProgress = () => (
    <View style={styles.progressRow}>
      <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
      <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
      <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Venue Partner</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                {step === 1 ? "Stadium Profile" : "Admin Account"}
              </Text>
              <Text style={styles.mainSubtitle}>
                {step === 1
                  ? "Tell us about your venue to begin the integration process."
                  : "Create the master administrator account for your stadium dashboard."}
              </Text>
              {renderProgress()}
            </View>

            {step === 1 ? (
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>STADIUM NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Warehouse size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Madison Square Garden"
                      value={formData.stadiumName}
                      onChangeText={(val) =>
                        setFormData({ ...formData, stadiumName: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>CITY</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChangeText={(val) =>
                        setFormData({ ...formData, city: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>STATE</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. NY"
                      value={formData.state}
                      onChangeText={(val) =>
                        setFormData({ ...formData, state: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>COUNTRY</Text>
                  <View style={styles.inputWrapper}>
                    <MapPin size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. USA"
                      value={formData.country}
                      onChangeText={(val) =>
                        setFormData({ ...formData, country: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>TOTAL SEATING CAPACITY</Text>
                  <View style={styles.inputWrapper}>
                    <Info size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 20,000"
                      keyboardType="numeric"
                      value={formData.capacity}
                      onChangeText={(val) =>
                        setFormData({ ...formData, capacity: val })
                      }
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ADMIN EMAIL</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="admin@stadium.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.adminEmail}
                      onChangeText={(val) =>
                        setFormData({ ...formData, adminEmail: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color={COLORS.gray400} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      secureTextEntry
                      value={formData.password}
                      onChangeText={(val) =>
                        setFormData({ ...formData, password: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.securityNote}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <Text style={styles.securityText}>
                    Credentials will be encrypted with AES-256 standards.
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
              <LinearGradient
                colors={["#1d3557", "#0f172a"]}
                style={styles.gradientAction}
              >
                <Text style={styles.actionText}>
                  {step === 1
                    ? "Configure Credentials"
                    : "Complete Registration"}
                </Text>
                <ArrowRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 10,
  },
  mainSubtitle: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    fontWeight: "500",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ebeef2",
  },
  stepDotActive: {
    backgroundColor: "#e63946",
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: "#ebeef2",
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: "#e63946",
  },
  formSection: {
    gap: 24,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(29, 53, 87, 0.5)",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1d3557",
    fontWeight: "600",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    padding: 12,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "700",
  },
  actionBtn: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 6,
  },
  gradientAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default StadiumOnboardingScreen;
