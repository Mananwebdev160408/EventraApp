/**
 * DemoCredentialsModal — premium bottom-sheet style dialog
 * showing dummy credentials for each role, with one-tap copy.
 */
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Clipboard,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Copy, Check, Zap, Shield, ChevronRight } from "lucide-react-native";
import { DEMO_CREDENTIALS } from "../utils/seedDemoUsers";

const { height } = Dimensions.get("window");

const CredentialRow = ({ label, value }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    Clipboard.setString(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TouchableOpacity style={styles.credRow} onPress={handleCopy} activeOpacity={0.7}>
      <View style={styles.credLeft}>
        <Text style={styles.credLabel}>{label}</Text>
        <Text style={styles.credValue}>{value}</Text>
      </View>
      <View style={[styles.copyBtn, copied && styles.copyBtnDone]}>
        {copied ? (
          <Check size={13} color="#10b981" />
        ) : (
          <Copy size={13} color="#94a3b8" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const RoleCard = ({ cred, isLast }) => {
  const isAdmin = cred.roleKey === "admin";
  return (
    <View style={[styles.roleCard, !isLast && styles.roleCardGap]}>
      <LinearGradient
        colors={isAdmin ? ["#1d3557", "#0f1f36"] : ["#457b9d", "#2d5f80"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.roleHeader}
      >
        <View style={styles.roleHeaderLeft}>
          <Text style={styles.roleEmoji}>{cred.icon}</Text>
          <View>
            <Text style={styles.roleName}>{cred.role} Account</Text>
            <Text style={styles.roleDesc}>{cred.description}</Text>
          </View>
        </View>
        <View style={[styles.roleBadge, { borderColor: "rgba(255,255,255,0.3)" }]}>
          {isAdmin ? (
            <Shield size={12} color="rgba(255,255,255,0.9)" />
          ) : (
            <Zap size={12} color="rgba(255,255,255,0.9)" />
          )}
          <Text style={styles.roleBadgeText}>{cred.role.toUpperCase()}</Text>
        </View>
      </LinearGradient>

      <View style={styles.credList}>
        <CredentialRow label="EMAIL" value={cred.email} />
        <View style={styles.credDivider} />
        <CredentialRow label="PASSWORD" value={cred.password} />
      </View>
    </View>
  );
};

const DemoCredentialsModal = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetTitle}>Demo Credentials</Text>
            <Text style={styles.sheetSubtitle}>
              Tap any field to copy • Seeded in Firebase
            </Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoDot} />
          <Text style={styles.infoText}>
            These accounts are automatically created in your Firebase project on first launch.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {DEMO_CREDENTIALS.map((cred, i) => (
            <RoleCard
              key={cred.roleKey}
              cred={cred}
              isLast={i === DEMO_CREDENTIALS.length - 1}
            />
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              🔒 These credentials are for demo purposes only. Never use them in production.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  handleRow: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(69, 123, 157, 0.08)",
    borderRadius: 14,
    marginHorizontal: 24,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(69, 123, 157, 0.15)",
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#457b9d",
    marginTop: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#457b9d",
    fontWeight: "600",
    lineHeight: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  roleCard: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  roleCardGap: {
    marginBottom: 0,
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  roleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  roleEmoji: {
    fontSize: 32,
  },
  roleName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.3,
  },
  roleDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
    marginTop: 2,
    maxWidth: 180,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.5,
  },
  credList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  credRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  credLeft: {
    flex: 1,
  },
  credLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  credValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.2,
  },
  copyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  copyBtnDone: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  credDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  footer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "rgba(241, 245, 249, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  footerNote: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default DemoCredentialsModal;
