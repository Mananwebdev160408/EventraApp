import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  Database,
  Activity,
  ShieldCheck,
  ArrowRight,
  User,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    try {
      console.log("Attempting login for:", username);

      const response = await authService.login({
        username: username,
        password: password,
      });

      console.log(
        "Login full response body:",
        JSON.stringify(response, null, 2),
      );

      // Check for token in common property names
      const token =
        response?.accessToken ||
        response?.token ||
        response?.data?.accessToken ||
        response?.data?.token;

      if (token) {
        // ... (rest of the logic remains the same)
        let userData =
          response.user || response.data?.user || response.data || response;

        // Handle double-nesting if it exists (some APIs return { data: { data: ... } })
        if (userData?.data && !userData.username && !userData.firstname) {
          userData = userData.data;
        }

        // If user info is not in login response or missing name, fetch it
        if (
          !userData ||
          (!userData.firstName &&
            !userData.lastName &&
            !userData.name &&
            !userData.username)
        ) {
          try {
            console.log("User info missing, fetching profile...");
            // First save the token so getCurrentUser can use it
            await login(token, userData || { username: username });
            const profile = await authService.getCurrentUser();
            if (profile) {
              userData = profile;
            }
          } catch (e) {
            console.log("Could not fetch user profile, using fallback", e);
            userData = userData || { username: username };
          }
        }

        // Store final token and user data globally
        await login(token, userData);

        console.log("Login successful with user:", userData.username);

        // Check user roles for redirection
        const userRoles = userData.roles || userData.role || [];
        const isAdmin = Array.isArray(userRoles)
          ? userRoles.includes("admin") || userRoles.includes("ADMIN")
          : userRoles === "admin" || userRoles === "ADMIN";

        console.log(`User type identified as: ${isAdmin ? "ADMIN" : "USER"}`);
      } else {
        console.warn("No token found in response body");
        setErrorMessage("Invalid credentials or user doesn't exist");
      }
    } catch (error) {
      console.error("Login detailed error:", error);
      setErrorMessage("Invalid credentials or user doesn't exist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top Banner Image */}
      <View style={styles.topBanner}>
        <ImageBackground
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDA0vD9zaTpNVNUvl4SHFoVonsQMuO1W-yxHmvtgUA3iawwx6MGEuiS2sjFqt6u3cDxzwywg_cCLnfpDY7fflRcLSRIpiR9l4l6EHRfF8HGZP_JZUcfNzE0UiTI8AKn_pZ-R1sxCxjMYbFE53g4hNqS5zVkO0w67_f9jwAbtsUIwuRkheHNR6-Lwx0XxGwiixyyP_IsfXAkNP7Gb_1T2nX4SNv-xtaKn1CnVniCIwHltBKt_37kXlx_wyU1EtEuvoRj7sX0I_0JImo",
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.iconContainer}>
              <LayoutDashboard size={40} color={COLORS.error} />
            </View>
            <Text style={styles.appName}>Eventra</Text>
            <Text style={styles.appTagline}>Premium Event Management</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Main Content Card */}
      <View style={styles.contentCard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.textHeader}>
              <Text style={styles.loginTitle}>Secure Login</Text>
              <Text style={styles.loginSubtitle}>
                Access your professional dashboard
              </Text>
            </View>

            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: username ? COLORS.brandPurple : COLORS.border,
                  },
                ]}
              >
                <User size={20} color={COLORS.gray400} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.gray400}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>PASSWORD</Text>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: password ? COLORS.brandPurple : COLORS.border,
                  },
                ]}
              >
                <Lock size={20} color={COLORS.gray400} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.gray400}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.gray400} />
                  ) : (
                    <Eye size={20} color={COLORS.gray400} />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <Text style={styles.loginBtnText}>
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </Text>
              {!isLoading && <ArrowRight size={20} color={COLORS.white} />}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupText}>Register Now</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.secureBadge}>
              <ShieldCheck size={16} color={COLORS.gray600} />
              <Text style={styles.secureText}>PRODUCTION-READY ENCRYPTION</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1faee", // Matches Stitch bg-form-bg
  },
  topBanner: {
    height: height * 0.42, // Exactly 42vh from design
    width: "100%",
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 53, 87, 0.85)", // navy-custom/85
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    backgroundColor: COLORS.error, // primary red
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  appTagline: {
    color: "#cbd5e1", // slate-300
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#f1faee",
    marginTop: -40, // overlap effect
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  textHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d3557", // navy-custom
    marginBottom: 8,
  },
  loginSubtitle: {
    color: "#64748b", // slate-500
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(29, 53, 87, 0.6)",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#457b9d", // link-blue
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error, // primary red
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  footer: {
    marginTop: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 4,
  },
  signupText: {
    color: COLORS.error,
    fontWeight: "800",
    fontSize: 14,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 48,
    opacity: 0.5,
  },
  secureText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d3557",
    letterSpacing: 1.5,
  },
  errorContainer: {
    backgroundColor: "rgba(223, 71, 89, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(223, 71, 89, 0.2)",
  },
  errorText: {
    color: "#df4759",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LoginScreen;
