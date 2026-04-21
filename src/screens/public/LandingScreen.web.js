import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Shield,
  Activity,
  Zap,
  Users,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  Database,
  LayoutDashboard,
  Globe,
  Terminal,
  Trophy,
  BarChart3,
  Smartphone,
  Cpu,
  Clock,
  ExternalLink,
  ChevronDown,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import DemoCredentialsModal from "../../components/DemoCredentialsModal";

const { width, height } = Dimensions.get("window");

const LandingScreen = () => {
  const navigation = useNavigation();
  const { userToken, userInfo } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Determine user role and target screen
  const getRoles = (user) => {
    if (!user) return [];
    const source = user.userDetails || user;
    const rolesData =
      source.roles ||
      source.role ||
      source.authorities ||
      source.permissions ||
      [];
    if (Array.isArray(rolesData)) {
      return rolesData
        .map((r) =>
          (typeof r === "string"
            ? r
            : r.name || r.authority || r.role || ""
          ).toUpperCase(),
        )
        .filter(Boolean);
    }
    if (typeof rolesData === "string") return [rolesData.toUpperCase()];
    return [];
  };

  const currentRoles = getRoles(userInfo);
  const isAdmin = currentRoles.some((r) => r.includes("ADMIN"));
  const targetDashboard = isAdmin ? "AdminTabs" : "MainTabs";

  const navLinks = [
    { name: "Platform", href: "#platform" },
    { name: "Solutions", href: "#solutions" },
    { name: "Ecosystem", href: "#ecosystem" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <View style={styles.container}>
      {/* Navigation */}
      <View style={[styles.navbar, scrollY > 50 && styles.navbarScrolled]}>
        <View style={styles.navContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <LayoutDashboard color={COLORS.brandPurple} size={24} />
            </View>
            <Text style={styles.logoText}>EVENTRA</Text>
          </View>

          {width > 1024 && (
            <View style={styles.navLinks}>
              {navLinks.map((link) => (
                <TouchableOpacity key={link.name} style={styles.navLink}>
                  <Text style={styles.navLinkText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.navActions}>
            {width > 768 && !userToken && (
              <TouchableOpacity
                style={styles.demoNavBtn}
                onPress={() => setShowDemoModal(true)}
              >
                <Terminal size={18} color={COLORS.brandPurple} />
                <Text style={styles.demoNavBtnText}>System Access</Text>
              </TouchableOpacity>
            )}
            {width > 768 && (
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() =>
                  navigation.navigate(userToken ? targetDashboard : "Login")
                }
              >
                <Text style={styles.loginBtnText}>
                  {userToken ? "Go to Dashboard" : "Login"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() =>
                userToken
                  ? navigation.navigate(targetDashboard)
                  : navigation.navigate("Register")
              }
            >
              <Text style={styles.getStartedBtnText}>
                {userToken ? "Launch Console" : "Join the Platform"}
              </Text>
              <ArrowRight size={18} color="#fff" />
            </TouchableOpacity>

            {width <= 1024 && (
              <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? (
                  <X color={COLORS.text} />
                ) : (
                  <Menu color={COLORS.text} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            <View style={styles.heroGlow1} />
            <View style={styles.heroGlow2} />
          </View>

          <Animated.View
            style={[
              styles.heroContent,
              { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
            ]}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEXT-GEN STADIUM ECOSYSTEM</Text>
            </View>
            <Text style={styles.heroTitle}>
              One Platform.{"\n"}
              <Text style={styles.highlightText}>Infinite Venue Control.</Text>
            </Text>
            <Text style={styles.heroSubtext}>
              Eventra is the industry-leading command center for modern sports
              operations. From real-time inventory flow to high-density fan
              engagement, we provide the tools that power the world's most
              intelligent stadiums.
            </Text>

            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() =>
                  userToken
                    ? navigation.navigate(targetDashboard)
                    : setShowDemoModal(true)
                }
              >
                <Text style={styles.primaryBtnText}>
                  {userToken ? "Access Your Console" : "Launch Instant Demo"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>
                  Explore Architecture
                </Text>
                <ChevronRight size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Premium Preview */}
            <View style={styles.premiumPreviewContainer}>
              <View style={styles.previewSidebar}>
                <View style={[styles.sidebarItem, { width: "80%" }]} />
                <View style={[styles.sidebarItem, { width: "60%" }]} />
                <View style={[styles.sidebarItem, { width: "70%" }]} />
              </View>
              <View style={styles.previewMain}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewSearch} />
                  <View style={styles.previewUser} />
                </View>
                <View style={styles.previewGrid}>
                  <View style={styles.previewCardLg} />
                  <View style={styles.previewCardSm} />
                  <View style={styles.previewCardSm} />
                </View>
              </View>
              <View style={styles.previewFloatingCard}>
                <Activity size={20} color={COLORS.brandPurple} />
                <View>
                  <Text style={styles.floatingTitle}>Live Flow</Text>
                  <Text style={styles.floatingValue}>84.2k active</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Trusted By Section (Marquee Feel) */}
        <View style={styles.trustedBySection}>
          <Text style={styles.trustedLabel}>
            TRUSTED BY GLOBAL VENUE LEADERS
          </Text>
          <View style={styles.logoMarquee}>
            {/* Simple text-based placeholders for high-fidelity look */}
            {[
              "STADIUM ONE",
              "APEX ARENA",
              "GLOBAL SPORTS",
              "ELITE VENUES",
              "PRIME CENTER",
            ].map((logo) => (
              <Text key={logo} style={styles.marqueeLogo}>
                {logo}
              </Text>
            ))}
          </View>
        </View>

        {/* Core Value Props (The "Mind" Section) */}
        <View id="platform" style={styles.platformSection}>
          <View style={styles.platformContent}>
            <View style={styles.platformTextSide}>
              <View style={styles.sectionIconBox}>
                <Cpu color={COLORS.brandPurple} size={24} />
              </View>
              <Text style={styles.sectionTag}>OPERATING SYSTEM</Text>
              <Text style={styles.sectionTitle}>The Pulse of Your Venue</Text>
              <Text style={styles.sectionDesc}>
                Eventra isn't just software; it's the digital nervous system for
                your stadium. We unify disparate operations—from gate security
                to hot-dog stands—into a single, high-fidelity command
                interface.
              </Text>

              <View style={styles.benefitList}>
                <View style={styles.benefitItem}>
                  <CheckCircle2 size={20} color={COLORS.brandPurple} />
                  <Text style={styles.benefitText}>
                    Millisecond-latency data synchronization
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <CheckCircle2 size={20} color={COLORS.brandPurple} />
                  <Text style={styles.benefitText}>
                    Enterprise-grade security protocols
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <CheckCircle2 size={20} color={COLORS.brandPurple} />
                  <Text style={styles.benefitText}>
                    AI-driven crowd flow prediction
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.platformVisualSide}>
              <View style={styles.visualStack}>
                <View style={styles.visualCard1} />
                <View style={styles.visualCard2} />
                <View style={styles.visualCard3}>
                  <BarChart3 color={COLORS.brandPurple} size={40} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bento Grid Features */}
        <View id="solutions" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>CAPABILITIES</Text>
            <Text style={styles.sectionTitle}>
              Precision Engineered Solutions
            </Text>
          </View>

          <View style={styles.bentoGrid}>
            <View style={[styles.bentoCard, styles.bentoCardWide]}>
              <View style={styles.bentoIcon}>
                <Activity color={COLORS.brandPurple} size={32} />
              </View>
              <Text style={styles.bentoTitle}>Unified Analytics</Text>
              <Text style={styles.bentoDesc}>
                Comprehensive visibility into venue health, revenue streams, and
                fan satisfaction metrics in real-time.
              </Text>
            </View>

            <View style={styles.bentoCard}>
              <View style={styles.bentoIcon}>
                <Shield color={COLORS.inputBorder} size={32} />
              </View>
              <Text style={styles.bentoTitle}>Security Mesh</Text>
              <Text style={styles.bentoDesc}>
                Encrypted communication channels for staff and rapid-response
                emergency protocols.
              </Text>
            </View>

            <View style={styles.bentoCard}>
              <View style={styles.bentoIcon}>
                <Database color={COLORS.brandPurple} size={32} />
              </View>
              <Text style={styles.bentoTitle}>Smart Inventory</Text>
              <Text style={styles.bentoDesc}>
                Dynamic stock management that reacts to demand spikes across
                concession stands.
              </Text>
            </View>

            <View style={[styles.bentoCard, styles.bentoCardWide]}>
              <View style={styles.bentoIcon}>
                <Smartphone color={COLORS.inputBorder} size={32} />
              </View>
              <Text style={styles.bentoTitle}>Fan Integration</Text>
              <Text style={styles.bentoDesc}>
                Seamless mobile tickets, seat upgrades, and in-app dining
                experiences that reduce queue times.
              </Text>
            </View>
          </View>
        </View>

        {/* Impact Section */}
        <View style={styles.impactSection}>
          <View style={styles.impactGrid}>
            {[
              { label: "QUEUE REDUCTION", value: "42%" },
              { label: "REVENUE GROWTH", value: "28%" },
              { label: "STAFF EFFICIENCY", value: "65%" },
              { label: "SECURITY RESPONSE", value: "3x Faster" },
            ].map((item, i) => (
              <View key={i} style={styles.impactItem}>
                <Text style={styles.impactValue}>{item.value}</Text>
                <Text style={styles.impactLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View id="pricing" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>PRICING</Text>
            <Text style={styles.sectionTitle}>Scale at Your Speed</Text>
          </View>

          <View style={styles.pricingGrid}>
            {[
              {
                name: "Standard",
                price: "$1,499",
                desc: "For regional stadiums and arenas.",
                features: [
                  "Real-time Inventory",
                  "Basic Admin Suite",
                  "Standard Security",
                  "Email Support",
                ],
              },
              {
                name: "Elite",
                price: "Custom",
                desc: "For global world-class venues.",
                features: [
                  "AI Predictive Flow",
                  "Multi-Venue Command",
                  "Advanced API Access",
                  "24/7 Dedicated Support",
                ],
                highlight: true,
              },
            ].map((plan, i) => (
              <View
                key={i}
                style={[
                  styles.pricingCard,
                  plan.highlight && styles.pricingCardHighlight,
                ]}
              >
                {plan.highlight && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>RECOMMENDED</Text>
                  </View>
                )}
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDesc}>{plan.desc}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.priceValue}>{plan.price}</Text>
                  <Text style={styles.pricePeriod}>/ venue / mo</Text>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((f, idx) => (
                    <View key={idx} style={styles.planFeatureItem}>
                      <CheckCircle2
                        size={16}
                        color={
                          plan.highlight
                            ? COLORS.brandPurple
                            : COLORS.inputBorder
                        }
                      />
                      <Text style={styles.planFeatureText}>{f}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.planBtn,
                    plan.highlight
                      ? styles.planBtnPrimary
                      : styles.planBtnSecondary,
                  ]}
                >
                  <Text
                    style={
                      plan.highlight
                        ? styles.planBtnTextPrimary
                        : styles.planBtnTextSecondary
                    }
                  >
                    {plan.name === "Elite"
                      ? "Contact Enterprise"
                      : "Start 14-Day Trial"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Final CTA */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Ready to Transform Your Venue?</Text>
            <Text style={styles.ctaSubtext}>
              Join 150+ world-class stadiums using Eventra today.
            </Text>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setShowDemoModal(true)}
              >
                <Text style={styles.primaryBtnText}>Initialize System</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>
                  Speak with an Expert
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            <View style={styles.footerBrand}>
              <View style={styles.logoContainer}>
                <LayoutDashboard color={COLORS.brandPurple} size={24} />
                <Text style={styles.logoText}>EVENTRA</Text>
              </View>
              <Text style={styles.footerDescription}>
                Engineering the next generation of digital infrastructure for
                global sports and entertainment venues.
              </Text>
            </View>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLinkTitle}>Product</Text>
              <Text style={styles.footerLink}>Admin Console</Text>
              <Text style={styles.footerLink}>Fan Hub</Text>
              <Text style={styles.footerLink}>Security Mesh</Text>
              <Text style={styles.footerLink}>API Specs</Text>
            </View>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLinkTitle}>Resources</Text>
              <Text style={styles.footerLink}>Documentation</Text>
              <Text style={styles.footerLink}>System Status</Text>
              <Text style={styles.footerLink}>Help Center</Text>
              <Text style={styles.footerLink}>Brand Assets</Text>
            </View>

            <View style={styles.footerLinks}>
              <Text style={styles.footerLinkTitle}>Legal</Text>
              <Text style={styles.footerLink}>Privacy</Text>
              <Text style={styles.footerLink}>Terms</Text>
              <Text style={styles.footerLink}>Security</Text>
              <Text style={styles.footerLink}>Cookies</Text>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <View style={styles.footerSocials}>
              <View style={styles.socialIcon} />
              <View style={styles.socialIcon} />
              <View style={styles.socialIcon} />
            </View>
            <Text style={styles.copyright}>
              © 2026 Eventra Systems Inc. Architecting the future of stadium
              management.
            </Text>
          </View>
        </View>
      </ScrollView>

      <DemoCredentialsModal
        visible={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectCredential={(cred) => {
          setShowDemoModal(false);
          navigation.navigate("Login", {
            autoEmail: cred.email,
            autoPassword: cred.password,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  navbarScrolled: {
    backgroundColor: "rgba(241, 250, 238, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    boxShadow: "0px 10px 30px rgba(29, 53, 87, 0.08)",
    height: 80,
  },
  navContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  navLinks: {
    flexDirection: "row",
    gap: 40,
  },
  navLinkText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    opacity: 0.7,
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  demoNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.15)",
  },
  demoNavBtnText: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: "800",
  },
  loginBtnText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
  },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    boxShadow: "0px 4px 12px rgba(230, 57, 70, 0.2)",
  },
  getStartedBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  heroSection: {
    paddingTop: 200,
    paddingBottom: 120,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  heroGlow1: {
    position: "absolute",
    top: -200,
    left: -100,
    width: 600,
    height: 600,
    backgroundColor: "rgba(230, 57, 70, 0.03)",
    borderRadius: 300,
    filter: "blur(100px)",
  },
  heroGlow2: {
    position: "absolute",
    bottom: 0,
    right: -100,
    width: 500,
    height: 500,
    backgroundColor: "rgba(69, 123, 157, 0.03)",
    borderRadius: 250,
    filter: "blur(100px)",
  },
  heroContent: {
    maxWidth: 1000,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(230, 57, 70, 0.08)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(230, 57, 70, 0.1)",
  },
  badgeText: {
    color: COLORS.brandPurple,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: width > 768 ? 80 : 48,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: width > 768 ? 88 : 54,
    marginBottom: 32,
    letterSpacing: -2,
  },
  highlightText: {
    color: COLORS.brandPurple,
  },
  heroSubtext: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 56,
    opacity: 0.6,
    maxWidth: 750,
  },
  heroActions: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 100,
  },
  primaryBtn: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    boxShadow: "0px 10px 25px rgba(230, 57, 70, 0.25)",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  secondaryBtnText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  premiumPreviewContainer: {
    width: "100%",
    maxWidth: 1100,
    aspectRatio: 16 / 9,
    backgroundColor: "#fff",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    boxShadow: "0px 40px 80px rgba(29, 53, 87, 0.12)",
    flexDirection: "row",
    overflow: "visible",
  },
  previewSidebar: {
    width: "22%",
    backgroundColor: "#f8fafc",
    padding: 32,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    gap: 20,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  sidebarItem: {
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
  },
  previewMain: {
    flex: 1,
    padding: 40,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  previewSearch: {
    width: "60%",
    height: 40,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
  },
  previewUser: {
    width: 40,
    height: 40,
    backgroundColor: "#cbd5e1",
    borderRadius: 20,
  },
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  previewCardLg: {
    width: "100%",
    height: 200,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
  },
  previewCardSm: {
    width: "47%",
    height: 120,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
  },
  previewFloatingCard: {
    position: "absolute",
    bottom: -40,
    right: -40,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
    zIndex: 10,
  },
  floatingTitle: {
    color: COLORS.gray500,
    fontSize: 12,
    fontWeight: "800",
  },
  floatingValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  trustedBySection: {
    paddingVertical: 60,
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  trustedLabel: {
    color: COLORS.gray400,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 40,
  },
  logoMarquee: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 1200,
    opacity: 0.4,
  },
  marqueeLogo: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "900",
  },
  platformSection: {
    paddingVertical: 140,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  platformContent: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 1300,
    alignSelf: "center",
    gap: 100,
    flexWrap: "wrap",
  },
  platformTextSide: {
    flex: 1,
    minWidth: 400,
  },
  sectionIconBox: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(230, 57, 70, 0.08)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  platformVisualSide: {
    flex: 1,
    minWidth: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  visualStack: {
    width: 500,
    height: 400,
    position: "relative",
  },
  visualCard1: {
    position: "absolute",
    width: 400,
    height: 300,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  visualCard2: {
    position: "absolute",
    width: 400,
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    top: 50,
    left: 50,
    zIndex: 2,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.05)",
  },
  visualCard3: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
    bottom: 0,
    right: 0,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 20px 30px rgba(230, 57, 70, 0.15)",
  },
  sectionTag: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 24,
    letterSpacing: -1,
  },
  sectionDesc: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 30,
    opacity: 0.6,
    marginBottom: 40,
  },
  benefitList: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  benefitText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.8,
  },
  section: {
    paddingVertical: 140,
    paddingHorizontal: 40,
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 80,
  },
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "center",
  },
  bentoCard: {
    width: "31%",
    minWidth: 350,
    backgroundColor: "#fff",
    padding: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    boxShadow: "0px 10px 30px rgba(0,0,0,0.02)",
  },
  bentoCardWide: {
    width: "64%",
  },
  bentoIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  bentoTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  bentoDesc: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 26,
    opacity: 0.6,
  },
  impactSection: {
    backgroundColor: COLORS.brandDark,
    paddingVertical: 120,
  },
  impactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
    gap: 60,
  },
  impactItem: {
    alignItems: "center",
  },
  impactValue: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -2,
  },
  impactLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  pricingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 32,
  },
  pricingCard: {
    width: 480,
    maxWidth: "100%",
    backgroundColor: "#fff",
    padding: 60,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.02)",
    position: "relative",
  },
  pricingCardHighlight: {
    borderColor: COLORS.brandPurple,
    boxShadow: "0px 30px 60px rgba(230, 57, 70, 0.1)",
  },
  planBadge: {
    position: "absolute",
    top: 32,
    right: 32,
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  planBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  planName: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },
  planDesc: {
    color: COLORS.gray500,
    fontSize: 16,
    marginBottom: 40,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 48,
  },
  priceValue: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: "900",
  },
  pricePeriod: {
    color: COLORS.gray400,
    fontSize: 16,
    fontWeight: "600",
  },
  planFeatures: {
    gap: 20,
    marginBottom: 56,
  },
  planFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  planFeatureText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
  planBtn: {
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  planBtnPrimary: {
    backgroundColor: COLORS.brandPurple,
    boxShadow: "0px 10px 20px rgba(230, 57, 70, 0.2)",
  },
  planBtnSecondary: {
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  planBtnTextPrimary: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  planBtnTextSecondary: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 16,
  },
  ctaSection: {
    paddingVertical: 160,
    backgroundColor: "#f1faee",
    alignItems: "center",
  },
  ctaContent: {
    maxWidth: 800,
    alignItems: "center",
  },
  ctaTitle: {
    color: COLORS.text,
    fontSize: 56,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: -2,
  },
  ctaSubtext: {
    color: COLORS.text,
    fontSize: 20,
    opacity: 0.6,
    marginBottom: 56,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#fff",
    paddingTop: 120,
    paddingBottom: 60,
    paddingHorizontal: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
    gap: 60,
    marginBottom: 100,
  },
  footerBrand: {
    maxWidth: 400,
  },
  footerDescription: {
    color: COLORS.text,
    marginTop: 32,
    lineHeight: 28,
    opacity: 0.5,
    fontSize: 16,
  },
  footerLinks: {
    gap: 20,
  },
  footerLinkTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerLink: {
    color: COLORS.text,
    fontSize: 15,
    opacity: 0.6,
    fontWeight: "600",
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1400,
    alignSelf: "center",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 40,
  },
  footerSocials: {
    flexDirection: "row",
    gap: 20,
  },
  socialIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
  },
  copyright: {
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LandingScreen;
