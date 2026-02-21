import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import {
  LayoutDashboard,
  ArrowRight,
  UserPlus,
  LogIn,
  Warehouse,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const AuthLandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1540747737273-46c7028198f6?auto=format&fit=crop&q=80&w=800",
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(29, 53, 87, 0.4)", "rgba(29, 53, 87, 0.95)"]}
            style={styles.overlay}
          >
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <LayoutDashboard size={42} color={COLORS.error} />
              </View>
              <Text style={styles.appName}>Eventra</Text>
              <Text style={styles.tagline}>
                Elevating the Stadium Experience
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.actionArea}>
        <Text style={styles.welcomeTitle}>Get Started</Text>
        <Text style={styles.welcomeSubtitle}>
          Experience events like never before or manage your venue
          professionally.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#e63946", "#d62828"]}
              style={styles.gradientBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <LogIn size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Sign In to Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.8}
          >
            <UserPlus size={20} color="#1d3557" />
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.stadiumButton}
            onPress={() => navigation.navigate("StadiumOnboarding")}
            activeOpacity={0.8}
          >
            <View style={styles.stadiumIconBox}>
              <Warehouse size={22} color="#457b9d" />
            </View>
            <View style={styles.stadiumTextContent}>
              <Text style={styles.stadiumButtonTitle}>Add My Stadium</Text>
              <Text style={styles.stadiumButtonSub}>
                Register as a venue partner
              </Text>
            </View>
            <ArrowRight size={18} color="#457b9d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topArea: {
    height: height * 0.45,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  brandSection: {
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  actionArea: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    fontWeight: "500",
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    gap: 12,
    backgroundColor: "#fff",
  },
  secondaryButtonText: {
    color: "#1d3557",
    fontSize: 16,
    fontWeight: "800",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  dividerText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  stadiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(69, 123, 157, 0.05)",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(69, 123, 157, 0.1)",
    marginTop: 8,
  },
  stadiumIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  stadiumTextContent: {
    flex: 1,
    marginLeft: 16,
  },
  stadiumButtonTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1d3557",
  },
  stadiumButtonSub: {
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "600",
    marginTop: 2,
  },
});

export default AuthLandingScreen;
