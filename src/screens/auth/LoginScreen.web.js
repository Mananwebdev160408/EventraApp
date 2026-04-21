import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/theme";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { AuthRepository } from "../../repositories/AuthRepository";
import { DEMO_CREDENTIALS } from "../../utils/seedDemoUsers";
import DemoCredentialsModal from "../../components/DemoCredentialsModal";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const LoginScreen = ({ navigation, route }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDemoModalVisible, setIsDemoModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.autoEmail && route.params?.autoPassword) {
      setEmail(route.params.autoEmail);
      setPassword(route.params.autoPassword);
      setIsDemoModalVisible(false);
    }
  }, [route.params]);

  const handleSelectDemoCredential = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setErrorMessage("");
    setIsDemoModalVisible(false);
  };

  const handleBypassLogin = async () => {
    const demo = DEMO_CREDENTIALS.find((cred) => cred.email === email) || DEMO_CREDENTIALS[0];
    const mockProfile = {
      uid: `demo-${demo.roleKey}`,
      email: demo.email,
      firstName: demo.firstName,
      lastName: demo.lastName,
      displayName: `${demo.firstName} ${demo.lastName}`,
      username: demo.username,
      phoneNumber: demo.phoneNumber,
      gender: demo.gender,
      role: demo.roleKey,
      roles: [demo.roleKey],
      isDemo: true,
    };
    await login(mockProfile.uid, mockProfile);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    try {
      const { user, userProfile } = await AuthRepository.login({ email, password });
      await login(user.uid, userProfile);
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/quota-exceeded") {
        const demo = DEMO_CREDENTIALS.find((cred) => cred.email === email);
        if (demo) {
          await handleBypassLogin();
          return;
        }

        setErrorMessage("Firebase quota exceeded. Use a demo account to continue.");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDesktop) {
    // Mobile view fallback
    return (
      <View style={{flex: 1, backgroundColor: '#f1faee', justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'}}>Welcome to Eventra Web</Text>
        <Text style={{textAlign: 'center', marginBottom: 20}}>Please use a desktop browser for the full revamped experience.</Text>
        <TouchableOpacity 
          onPress={() => setIsDemoModalVisible(true)}
          style={{backgroundColor: COLORS.brandPurple, padding: 15, borderRadius: 10, width: '100%', alignItems: 'center'}}
        >
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Open Demo Credentials</Text>
        </TouchableOpacity>
        <DemoCredentialsModal visible={isDemoModalVisible} onClose={() => setIsDemoModalVisible(false)} onSelectCredential={handleSelectDemoCredential} />
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      
      {/* Left side: Background & Branding */}
      <View style={styles.desktopHero}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1600",
          }}
          style={styles.desktopBackgroundImage}
        >
          <LinearGradient
            colors={["rgba(29, 53, 87, 0.7)", "rgba(29, 53, 87, 0.95)"]}
            style={styles.desktopOverlay}
          >
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.heroContent}>
              <View style={styles.logoBox}>
                <LayoutDashboard size={48} color={COLORS.error} />
              </View>
              <Text style={styles.heroTitle}>Welcome Back to Eventra</Text>
              <Text style={styles.heroSubtitle}>
                Managing your stadium experience has never been easier. Sign in to access your customized dashboard.
              </Text>
              
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}><ShieldCheck size={18} color="#fff" /></View>
                  <Text style={styles.featureText}>Secure Enterprise Encryption</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}><LayoutDashboard size={18} color="#fff" /></View>
                  <Text style={styles.featureText}>Real-time Analytics Dashboard</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Right side: Login Form */}
      <View style={styles.desktopFormArea}>
        <View style={styles.loginCard}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#94a3b8" />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>PASSWORD</Text>
              <TouchableOpacity><Text style={styles.forgotText}>Forgot?</Text></TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#94a3b8" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient colors={[COLORS.brandPurple, "#d62828"]} style={styles.gradientBtn}>
              <Text style={styles.loginButtonText}>{isLoading ? "SIGNING IN..." : "SIGN IN"}</Text>
              <ArrowRight size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={() => setIsDemoModalVisible(true)}>
            <Text style={styles.demoButtonText}>Try Demo Account</Text>
          </TouchableOpacity>

          {/* Development Bypass */}
          <TouchableOpacity style={[styles.demoButton, { marginTop: 12 }]} onPress={handleBypassLogin}>
            <Text style={[styles.demoButtonText, { color: "#e63946" }]}>Development Bypass (Skip Firebase)</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
             <View style={styles.line} />
             <Text style={styles.dividerText}>NEW HERE?</Text>
             <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupButtonText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DemoCredentialsModal
        visible={isDemoModalVisible}
        onClose={() => setIsDemoModalVisible(false)}
        onSelectCredential={handleSelectDemoCredential}
      />
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
    flex: 1.2,
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
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 28,
    marginBottom: 48,
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  desktopFormArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loginCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 60,
    boxShadow: "0px 20px 40px rgba(29, 53, 87, 0.05)",
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 12,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#f8fafc",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1d3557",
    fontWeight: "500",
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.brandPurple,
    fontWeight: "700",
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  demoButton: {
    alignSelf: "center",
    marginTop: 24,
  },
  demoButtonText: {
    color: "#457b9d",
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#cbd5e1",
    letterSpacing: 1.5,
  },
  signupButton: {
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#1d3557",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default LoginScreen;
