import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  useWindowDimensions,
  ScrollView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import { ChevronLeft, Check, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthRepository } from "../../repositories/AuthRepository";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
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
    if (!firstName || !lastName || !email || !password || !username || !phoneNumber) {
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
      await AuthRepository.register({
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        gender,
        role: "user",
      });
      Alert.alert("Success", "Account created successfully! Please login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Signup Failed", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      
      {/* Left side: Artistic Brand Image */}
      <View style={styles.desktopHero}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1600",
          }}
          style={styles.desktopBackgroundImage}
        >
          <LinearGradient
            colors={["rgba(230, 57, 70, 0.4)", "rgba(29, 53, 87, 0.9)"]}
            style={styles.desktopOverlay}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Join the Elite</Text>
              <Text style={styles.heroSubtitle}>
                Create your Eventra account today and unlock a world of premium stadium experiences.
              </Text>
              
              <View style={styles.benefitBox}>
                <View style={styles.benefitItem}>
                  <Check size={20} color="#fff" />
                  <Text style={styles.benefitText}>Priority Ticket Access</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={20} color="#fff" />
                  <Text style={styles.benefitText}>Seamless In-Seat Service</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={20} color="#fff" />
                  <Text style={styles.benefitText}>Exclusive Fan Rewards</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Right side: Registration Form */}
      <ScrollView contentContainerStyle={styles.desktopFormArea} showsVerticalScrollIndicator={false}>
        <View style={styles.signupCard}>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>Fill in your details to get started</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>FIRST NAME</Text>
              <View style={styles.inputContainer}>
                <User size={18} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="John" value={firstName} onChangeText={setFirstName} />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>LAST NAME</Text>
              <View style={styles.inputContainer}>
                <User size={18} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="Doe" value={lastName} onChangeText={setLastName} />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>USERNAME</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.atSymbol}>@</Text>
                <TextInput style={styles.input} placeholder="johndoe" value={username} onChangeText={setUsername} autoCapitalize="none" />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color="#94a3b8" />
                <TextInput style={styles.input} placeholder="+1 234 567 890" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <Mail size={18} color="#94a3b8" />
              <TextInput style={styles.input} placeholder="john@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>
          </View>

          <View style={styles.genderGroup}>
            <Text style={styles.label}>GENDER</Text>
            <View style={styles.genderOptions}>
              {["Male", "Female", "Other"].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.genderBtn, gender === opt && styles.genderBtnActive]} 
                  onPress={() => setGender(opt)}
                >
                  <Text style={[styles.genderBtnText, gender === opt && styles.genderBtnTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#94a3b8" />
                <TextInput 
                  style={styles.input} 
                  placeholder="••••••••" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry={!showPassword} 
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#94a3b8" />
                <TextInput 
                  style={styles.input} 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                  secureTextEntry={!showPassword} 
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Check size={12} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={isLoading}>
            <LinearGradient colors={[COLORS.brandPurple, "#d62828"]} style={styles.gradientBtn}>
              <Text style={styles.submitBtnText}>{isLoading ? "CREATING..." : "CREATE ACCOUNT"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  desktopHero: {
    flex: 1,
    height: "100%",
  },
  desktopBackgroundImage: {
    flex: 1,
  },
  desktopOverlay: {
    flex: 1,
    padding: 60,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  heroContent: {
    maxWidth: 500,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 20,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 32,
    marginBottom: 48,
  },
  benefitBox: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  benefitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  desktopFormArea: {
    flex: 1.2,
    backgroundColor: "#f8fafc",
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  signupCard: {
    width: "100%",
    maxWidth: 640,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 48,
    boxShadow: "0px 20px 40px rgba(29, 53, 87, 0.05)",
  },
  formTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 40,
  },
  row: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#f8fafc",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1d3557",
    fontWeight: "600",
  },
  atSymbol: {
    fontSize: 18,
    color: "#94a3b8",
    fontWeight: "700",
  },
  genderGroup: {
    marginBottom: 24,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  genderBtnActive: {
    borderColor: COLORS.brandPurple,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  genderBtnTextActive: {
    color: COLORS.brandPurple,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#1d3557",
    borderColor: "#1d3557",
  },
  termsText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  linkText: {
    color: "#1d3557",
    fontWeight: "700",
  },
  submitBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  gradientBtn: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.brandPurple,
    fontWeight: "800",
  },
});

export default SignupScreen;
