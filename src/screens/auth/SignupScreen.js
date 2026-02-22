import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import { ChevronLeft, Check } from "lucide-react-native";
import { authService } from "../../api/services";
import { Alert } from "react-native";

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("Male");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !username ||
      !phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!agreed) {
      Alert.alert("Error", "Please agree to the Terms & Conditions.");
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        username: username,
        gender: gender,
        email: email,
        password: password,
        firstname: firstName.trim(),
        lastname: lastName.trim(),
        phonenumber: phoneNumber.trim(),
        roles: ["user"],
      };

      console.log("Sending registration data:", userData);
      const response = await authService.register(userData);

      if (response) {
        Alert.alert("Success", "Account created successfully! Please login.", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message ||
          "Registration failed. Please check your details or try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const FloatingInput = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    toggleSecure,
  }) => (
    <View style={styles.floatingGroup}>
      <TextInput
        style={styles.floatingInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="transparent" // Using label as placeholder visually
        secureTextEntry={secureTextEntry}
      />
      <Text
        style={[styles.floatingLabel, value ? styles.floatingLabelActive : {}]}
      >
        {label}
      </Text>

      {/* Add eye toggle specifically if needed, simplified for this layout to match design which puts button absolute right bottom */}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color="#1d3557" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ACCOUNT CREATION</Text>
          <View style={{ width: 24 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>Join Us</Text>
              <View style={styles.heroLine} />
              <Text style={styles.heroSubtitle}>
                Step into the elite circle of stadium event management.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.row}>
                {/* First Name */}
                <View
                  style={[styles.floatingGroup, { flex: 1, marginRight: 8 }]}
                >
                  <TextInput
                    style={styles.floatingInput}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="transparent"
                  />
                  <Text
                    style={[
                      styles.floatingLabel,
                      firstName ? styles.floatingLabelActive : {},
                    ]}
                  >
                    FIRST NAME
                  </Text>
                </View>

                {/* Last Name */}
                <View
                  style={[styles.floatingGroup, { flex: 1, marginLeft: 8 }]}
                >
                  <TextInput
                    style={styles.floatingInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="transparent"
                  />
                  <Text
                    style={[
                      styles.floatingLabel,
                      lastName ? styles.floatingLabelActive : {},
                    ]}
                  >
                    LAST NAME
                  </Text>
                </View>
              </View>

              {/* Username */}
              <View style={styles.floatingGroup}>
                <TextInput
                  style={styles.floatingInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="transparent"
                  autoCapitalize="none"
                />
                <Text
                  style={[
                    styles.floatingLabel,
                    username ? styles.floatingLabelActive : {},
                  ]}
                >
                  USERNAME
                </Text>
              </View>

              {/* Email */}
              <View style={styles.floatingGroup}>
                <TextInput
                  style={styles.floatingInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor="transparent"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text
                  style={[
                    styles.floatingLabel,
                    email ? styles.floatingLabelActive : {},
                  ]}
                >
                  EMAIL ADDRESS
                </Text>
              </View>

              {/* Phone Number */}
              <View style={styles.floatingGroup}>
                <TextInput
                  style={styles.floatingInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone Number"
                  placeholderTextColor="transparent"
                  keyboardType="phone-pad"
                />
                <Text
                  style={[
                    styles.floatingLabel,
                    phoneNumber ? styles.floatingLabelActive : {},
                  ]}
                >
                  PHONE NUMBER
                </Text>
              </View>

              {/* Gender Selection */}
              <View style={styles.genderSection}>
                <Text style={styles.sectionLabel}>GENDER</Text>
                <View style={styles.genderOptions}>
                  {["Male", "Female", "Other"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderBtn,
                        gender === option && styles.genderBtnActive,
                      ]}
                      onPress={() => setGender(option)}
                    >
                      <Text
                        style={[
                          styles.genderBtnText,
                          gender === option && styles.genderBtnTextActive,
                        ]}
                      >
                        {option.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Password */}
              <View style={styles.floatingGroup}>
                <TextInput
                  style={styles.floatingInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="transparent"
                  secureTextEntry={!showPassword}
                />
                <Text
                  style={[
                    styles.floatingLabel,
                    password ? styles.floatingLabelActive : {},
                  ]}
                >
                  PASSWORD
                </Text>
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeBtnText}>
                    {showPassword ? "HIDE" : "SHOW"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.floatingGroup}>
                <TextInput
                  style={styles.floatingInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="transparent"
                  secureTextEntry={!showPassword}
                />
                <Text
                  style={[
                    styles.floatingLabel,
                    confirmPassword ? styles.floatingLabelActive : {},
                  ]}
                >
                  CONFIRM PASSWORD
                </Text>
              </View>

              {/* Terms */}
              <TouchableOpacity
                style={styles.termsContainer}
                activeOpacity={0.8}
                onPress={() => setAgreed(!agreed)}
              >
                <View
                  style={[styles.checkbox, agreed && styles.checkboxChecked]}
                >
                  {agreed && <Check size={14} color="#ffffff" />}
                </View>
                <Text style={styles.termsText}>
                  I accept the{" "}
                  <Text style={styles.linkText}>Terms & Conditions</Text> and
                  acknowledge the{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSignup}
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <Text style={styles.submitBtnText}>
                  {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already a member? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Badge */}
        <View style={styles.bottomBadge}>
          <Text style={styles.badgeText}>PREMIUM ACCESS</Text>
          {/* Simple verified icon representation/simulated */}
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 1.5,
              borderColor: "#1d3557",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={10} color="#1d3557" strokeWidth={4} />
          </View>
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#1d3557",
    opacity: 0.4,
    textTransform: "uppercase",
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 56,
  },
  heroTitle: {
    fontSize: 42, // text-5xl equivalent roughly
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroLine: {
    height: 4,
    width: 48,
    backgroundColor: "#1d3557",
    marginBottom: 16,
  },
  heroSubtitle: {
    color: "rgba(29, 53, 87, 0.6)",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    maxWidth: 280,
  },
  form: {
    marginBottom: 24,
  },
  floatingGroup: {
    position: "relative",
    marginBottom: 24,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(29, 53, 87, 0.2)",
  },
  floatingInput: {
    width: "100%",
    height: "100%",
    paddingTop: 16, // Space for label
    fontSize: 18,
    fontWeight: "500",
    color: "#1d3557",
    zIndex: 10,
  },
  floatingLabel: {
    position: "absolute",
    left: 0,
    top: 18,
    fontSize: 16,
    color: "rgba(29, 53, 87, 0.5)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 10,
  },
  floatingLabelActive: {
    top: 0,
    fontSize: 10,
    color: "rgba(29, 53, 87, 0.4)",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "rgba(29, 53, 87, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(29, 53, 87, 0.6)",
    lineHeight: 18,
    fontWeight: "500",
  },
  linkText: {
    color: "#1d3557",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  submitBtn: {
    width: "100%",
    backgroundColor: "#1d3557",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 3, // tracking-[0.2em]
  },
  footer: {
    marginTop: 40,
    marginBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(29, 53, 87, 0.5)",
    fontWeight: "500",
    marginBottom: 4,
  },
  loginLink: {
    color: "#1d3557",
    fontSize: 12,
    fontWeight: "800", // extrabold
    textTransform: "uppercase",
    letterSpacing: 2, // tracking-widest
  },
  bottomBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 32,
    opacity: 0.2, // opacity-10
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 4, // tracking-[0.4em]
    color: "#000",
  },
  row: {
    flexDirection: "row",
  },
  genderSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(29, 53, 87, 0.4)",
    letterSpacing: 1,
    marginBottom: 12,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 12,
  },
  genderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "rgba(29, 53, 87, 0.1)",
    borderRadius: 8,
  },
  genderBtnActive: {
    borderColor: "#1d3557",
    backgroundColor: "rgba(29, 53, 87, 0.05)",
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(29, 53, 87, 0.4)",
  },
  genderBtnTextActive: {
    color: "#1d3557",
  },
  eyeBtn: {
    position: "absolute",
    right: 0,
    bottom: 12,
    zIndex: 20,
  },
  eyeBtnText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d3557",
    opacity: 0.5,
  },
});

export default SignupScreen;
