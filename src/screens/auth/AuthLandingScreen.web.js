import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  Platform,
  Dimensions,
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

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const AuthLandingScreen = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;

  if (!isDesktop) {
    // Fallback to mobile-like layout for small web screens
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
  }

  // Desktop View Revamp
  return (
    <View style={styles.desktopContainer}>
      {/* Left side: Hero/Brand */}
      <View style={styles.desktopHero}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1540747737273-46c7028198f6?auto=format&fit=crop&q=80&w=1600",
          }}
          style={styles.desktopBackgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(29, 53, 87, 0.4)", "rgba(29, 53, 87, 0.85)"]}
            style={styles.desktopOverlay}
          >
            <View style={styles.desktopBrandSection}>
              <View style={styles.desktopLogoContainer}>
                <LayoutDashboard size={64} color={COLORS.error} />
              </View>
              <Text style={styles.desktopAppName}>Eventra</Text>
              <Text style={styles.desktopTagline}>
                The Future of Stadium Experiences
              </Text>
              <View style={styles.accentBar} />
              <Text style={styles.desktopDescription}>
                A complete ecosystem for fans, managers, and vendors to elevate every moment at the stadium. 
                Experience real-time navigation, seamless food ordering, and exclusive event access.
              </Text>
            </View>
            
            <View style={styles.desktopStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>50+</Text>
                <Text style={styles.statLabel}>Partner Stadiums</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1M+</Text>
                <Text style={styles.statLabel}>Happy Fans</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>10k+</Text>
                <Text style={styles.statLabel}>Events Hosted</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Right side: Actions */}
      <View style={styles.desktopActionArea}>
        <View style={styles.desktopCard}>
          <Text style={styles.desktopWelcomeTitle}>Welcome to Eventra</Text>
          <Text style={styles.desktopWelcomeSubtitle}>
            Sign in to your account or create a new one to get started with the best stadium experience.
          </Text>

          <View style={styles.desktopButtonGroup}>
            <TouchableOpacity
              style={styles.desktopPrimaryButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#e63946", "#d62828"]}
                style={styles.desktopGradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <LogIn size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Sign In to Your Account</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.desktopSecondaryButton}
              onPress={() => navigation.navigate("Signup")}
              activeOpacity={0.8}
            >
              <UserPlus size={20} color="#1d3557" />
              <Text style={styles.secondaryButtonText}>Join the Community</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.desktopDivider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>FOR PARTNERS</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.desktopStadiumButton}
            onPress={() => navigation.navigate("StadiumOnboarding")}
            activeOpacity={0.8}
          >
            <View style={styles.stadiumIconBox}>
              <Warehouse size={24} color="#457b9d" />
            </View>
            <View style={styles.stadiumTextContent}>
              <Text style={styles.stadiumButtonTitle}>Partner with Eventra</Text>
              <Text style={styles.stadiumButtonSub}>
                Register your stadium to manage events and increase fan engagement.
              </Text>
            </View>
            <ArrowRight size={20} color="#457b9d" />
          </TouchableOpacity>
          
          <View style={styles.desktopFooter}>
            <Text style={styles.footerText}>© 2024 Eventra Inc. All rights reserved.</Text>
            <View style={styles.footerLinks}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </View>
          </View>
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
    height: windowHeight * 0.45,
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
    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
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
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 14,
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
    gap: 16,
    marginVertical: 10,
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

  // Desktop Specific Styles
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
    justifyContent: "center",
    paddingHorizontal: 80,
  },
  desktopBrandSection: {
    maxWidth: 600,
  },
  desktopLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    marginBottom: 40,
  },
  desktopAppName: {
    fontSize: 84,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -3,
    lineHeight: 84,
  },
  desktopTagline: {
    fontSize: 28,
    color: "rgba(255,255,255,0.9)",
    marginTop: 16,
    fontWeight: "700",
  },
  accentBar: {
    width: 80,
    height: 8,
    backgroundColor: COLORS.error,
    borderRadius: 4,
    marginTop: 32,
    marginBottom: 32,
  },
  desktopDescription: {
    fontSize: 20,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 32,
    fontWeight: "500",
  },
  desktopStats: {
    flexDirection: "row",
    marginTop: 60,
    alignItems: "center",
    gap: 40,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  desktopActionArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  desktopCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 60,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 20,
  },
  desktopWelcomeTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1d3557",
    marginBottom: 16,
    letterSpacing: -1,
  },
  desktopWelcomeSubtitle: {
    fontSize: 18,
    color: "#64748b",
    lineHeight: 28,
    fontWeight: "500",
    marginBottom: 48,
  },
  desktopButtonGroup: {
    gap: 20,
    marginBottom: 40,
  },
  desktopPrimaryButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#e63946",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  desktopGradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    gap: 16,
  },
  desktopSecondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 22,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    gap: 16,
    backgroundColor: "#fff",
  },
  desktopDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 32,
  },
  desktopStadiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(69, 123, 157, 0.03)",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(69, 123, 157, 0.1)",
  },
  desktopFooter: {
    marginTop: 60,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  footerLinks: {
    flexDirection: "row",
    gap: 20,
    marginTop: 12,
  },
  footerLink: {
    fontSize: 14,
    color: "#457b9d",
    fontWeight: "700",
  },
});

export default AuthLandingScreen;
