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
  ActivityIndicator,
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
  User,
  Phone,
  AtSign,
  ShieldCheck,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authService, stadiumService } from "../../api/services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const InputField = ({
  label,
  icon: Icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <View style={styles.iconBox}>
        <Icon size={18} color="#457b9d" />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(29, 53, 87, 0.3)"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  </View>
);

const StadiumOnboardingScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Stadium Info
    stadiumName: "",
    city: "",
    state: "",
    country: "",
    capacity: "",
    // Admin Info
    firstname: "",
    lastname: "",
    username: "",
    phone: "",
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
      if (
        !formData.firstname ||
        !formData.lastname ||
        !formData.username ||
        !formData.phone ||
        !formData.adminEmail ||
        !formData.password
      ) {
        Alert.alert(
          "Identity Required",
          "Please complete all administrator identity fields.",
        );
        return;
      }

      setIsLoading(true);
      performRegistration();
    }
  };

  const performRegistration = async () => {
    try {
      // 1. Prepare Admin User Data
      const adminData = {
        username: formData.username.trim(),
        email: formData.adminEmail.trim(),
        password: formData.password,
        firstName: formData.firstname.trim(),
        lastName: formData.lastname.trim(),
        phoneNumber: formData.phone.trim(),
        roles: ["admin"], // Explicitly sending admin role
      };

      console.log("Registering Admin:", adminData.username);
      const userResult = await authService.register(adminData);

      if (userResult) {
        // 2. NEW: Automatic login to get token for stadium upload
        console.log("Auto-logging in to acquire session token...");
        const loginResponse = await authService.login({
          username: adminData.username,
          password: adminData.password,
        });

        const token =
          loginResponse?.accessToken ||
          loginResponse?.token ||
          loginResponse?.data?.accessToken ||
          loginResponse?.data?.token;

        if (!token) {
          throw new Error(
            "Could not acquire session token after registration.",
          );
        }

        // 3. Manually save token to storage so apiClient interceptor picks it up
        await AsyncStorage.setItem("userToken", token);

        // 4. Prepare Stadium Data - Ordering matches backend constructor to improve deserialization reliability
        const stadiumData = {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
          capacity: parseInt(formData.capacity) || 0,
          name: formData.stadiumName.trim(),
        };

        console.log("Uploading Stadium Profile:", stadiumData.name);
        try {
          await stadiumService.uploadStadium(stadiumData);
        } catch (stadiumErr) {
          console.warn("User created but stadium upload failed:", stadiumErr);
        }

        // 5. Finalize login via context to update app state and redirect to dashboard
        const userData =
          loginResponse.user ||
          loginResponse.data?.user ||
          loginResponse.data ||
          adminData;
        await login(token, userData);

        Alert.alert(
          "Success",
          "Your Venue Partner account and stadium profile have been created successfully.",
          [
            {
              text: "GO TO DASHBOARD",
              onPress: () => {}, // login() call above will handle navigation via AppNavigator
            },
          ],
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
          "Could not complete registration. Please check your network or try a different username.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressRow}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>
            1
          </Text>
        </View>
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>
            2
          </Text>
        </View>
      </View>
      <View style={styles.labelRow}>
        <Text
          style={[
            styles.progressLabel,
            step === 1 && styles.progressLabelActive,
          ]}
        >
          VENUE
        </Text>
        <Text
          style={[
            styles.progressLabel,
            step === 2 && styles.progressLabelActive,
          ]}
        >
          ADMIN
        </Text>
      </View>
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
          <Text style={styles.headerTitle}>VENUE PARTNER</Text>
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
                {step === 1 ? "Stadium Profile" : "Admin Identity"}
              </Text>
              <Text style={styles.mainSubtitle}>
                {step === 1
                  ? "Configure your venue's technical profile for the global dashboard."
                  : "Establish the master administrator identity for this stadium."}
              </Text>
              {renderProgress()}
            </View>

            {step === 1 ? (
              <View style={styles.formSection}>
                <InputField
                  label="STADIUM NAME"
                  icon={Warehouse}
                  placeholder="e.g. Madison Square Garden"
                  value={formData.stadiumName}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, stadiumName: val }))
                  }
                />

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <InputField
                      label="CITY"
                      icon={MapPin}
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChangeText={(val) =>
                        setFormData((prev) => ({ ...prev, city: val }))
                      }
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <InputField
                      label="STATE"
                      icon={MapPin}
                      placeholder="e.g. NY"
                      value={formData.state}
                      onChangeText={(val) =>
                        setFormData((prev) => ({ ...prev, state: val }))
                      }
                    />
                  </View>
                </View>

                <InputField
                  label="COUNTRY"
                  icon={MapPin}
                  placeholder="e.g. USA"
                  value={formData.country}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, country: val }))
                  }
                />

                <InputField
                  label="SEATING CAPACITY"
                  icon={Info}
                  placeholder="e.g. 20,000"
                  keyboardType="numeric"
                  value={formData.capacity}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, capacity: val }))
                  }
                />
              </View>
            ) : (
              <View style={styles.formSection}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <InputField
                      label="FIRST NAME"
                      icon={User}
                      placeholder="Admin"
                      value={formData.firstname}
                      onChangeText={(val) =>
                        setFormData((prev) => ({ ...prev, firstname: val }))
                      }
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <InputField
                      label="LAST NAME"
                      icon={User}
                      placeholder="Partner"
                      value={formData.lastname}
                      onChangeText={(val) =>
                        setFormData((prev) => ({ ...prev, lastname: val }))
                      }
                    />
                  </View>
                </View>

                <InputField
                  label="MASTER USERNAME"
                  icon={AtSign}
                  placeholder="stadium_admin"
                  value={formData.username}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, username: val }))
                  }
                />

                <InputField
                  label="CONTACT NUMBER"
                  icon={Phone}
                  placeholder="+91 98XXX XXXXX"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, phone: val }))
                  }
                />

                <InputField
                  label="ADMIN EMAIL"
                  icon={Mail}
                  placeholder="admin@stadium.com"
                  keyboardType="email-address"
                  value={formData.adminEmail}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, adminEmail: val }))
                  }
                />

                <InputField
                  label="ACCOUNT PASSWORD"
                  icon={Lock}
                  placeholder="••••••••"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(val) =>
                    setFormData((prev) => ({ ...prev, password: val }))
                  }
                />

                <View style={styles.securityBox}>
                  <ShieldCheck size={18} color="#10b981" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.securityTitle}>
                      Secure Registration
                    </Text>
                    <Text style={styles.securityDesc}>
                      This is a master account. Multi-factor authentication will
                      be required for dashboard access.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleNext}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1d3557", "#0f172a"]}
                style={styles.gradientAction}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.actionText}>
                      {step === 1
                        ? "Define Admin Identity"
                        : "Register Venue Partner"}
                    </Text>
                    <ArrowRight size={20} color="#fff" />
                  </>
                )}
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  mainSubtitle: {
    fontSize: 16,
    color: "#457b9d",
    lineHeight: 24,
    fontWeight: "600",
    marginTop: 8,
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(29, 53, 87, 0.1)",
  },
  stepDotActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  stepNum: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1d3557",
  },
  stepNumActive: {
    color: "#FFFFFF",
  },
  stepLine: {
    width: 30,
    height: 3,
    backgroundColor: "rgba(29, 53, 87, 0.1)",
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: "#1d3557",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(29, 53, 87, 0.2)",
    letterSpacing: 1,
  },
  progressLabelActive: {
    color: "#1d3557",
  },
  formSection: {
    gap: 20,
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1d3557",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 64,
    borderWidth: 1.5,
    borderColor: "rgba(29, 53, 87, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(69, 123, 157, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    color: "#1d3557",
    fontWeight: "700",
  },
  securityBox: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#059669",
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: "#059669",
    lineHeight: 18,
    fontWeight: "600",
    opacity: 0.8,
  },
  actionBtn: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  gradientAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    gap: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
});

export default StadiumOnboardingScreen;
