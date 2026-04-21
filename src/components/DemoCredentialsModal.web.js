import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { X, Shield, ChevronRight, User, Terminal } from "lucide-react-native";
import { COLORS } from "../constants/theme";
import { DEMO_CREDENTIALS } from "../utils/seedDemoUsers";

const { height, width } = Dimensions.get("window");

const CredentialItem = ({ label, value }) => (
  <View style={styles.credItem}>
    <Text style={styles.credLabel}>{label}</Text>
    <View style={styles.credValueContainer}>
      <Text style={styles.credValue}>{value}</Text>
    </View>
  </View>
);

const RoleCard = ({ cred, onSelect }) => {
  const isAdmin = cred.roleKey === "admin";
  
  return (
    <TouchableOpacity 
      style={[
        styles.roleCard,
        isAdmin && styles.roleCardAdmin
      ]}
      onPress={() => onSelect(cred)}
      activeOpacity={0.8}
    >
      <View style={styles.roleIconContainer}>
        {isAdmin ? (
          <Shield size={24} color={COLORS.brandPurple} />
        ) : (
          <User size={24} color={COLORS.inputBorder} />
        )}
      </View>
      
      <View style={styles.roleInfo}>
        <Text style={styles.roleName}>{cred.role}</Text>
        <Text style={styles.roleDesc}>{cred.description}</Text>
      </View>

      <View style={styles.credsList}>
        <CredentialItem label="EMAIL" value={cred.email} />
        <CredentialItem label="PASSWORD" value={cred.password} />
      </View>

      <View style={styles.launchBtn}>
        <Text style={styles.launchBtnText}>Select Profile</Text>
        <ChevronRight size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const DemoCredentialsModal = ({ visible, onClose, onSelectCredential }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />
        
        <Animated.View style={[
          styles.modalContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Terminal size={20} color={COLORS.brandPurple} />
            </View>
            <View>
              <Text style={styles.title}>Quick Access</Text>
              <Text style={styles.subtitle}>Select a demo profile to continue</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={COLORS.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.cardsGrid}>
              {DEMO_CREDENTIALS.map((cred) => (
                <RoleCard 
                  key={cred.roleKey} 
                  cred={cred} 
                  onSelect={onSelectCredential} 
                />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🔒 Secure trial environment. No actual data will be shared.
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(29, 53, 87, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: "blur(8px)",
      }
    })
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 750,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 20px 50px rgba(29, 53, 87, 0.2)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(230, 57, 70, 0.05)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    color: COLORS.gray500,
    fontSize: 14,
    marginTop: 2,
  },
  closeBtn: {
    marginLeft: "auto",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 32,
  },
  cardsGrid: {
    flexDirection: "row",
    gap: 20,
    flexWrap: "wrap",
  },
  roleCard: {
    flex: 1,
    minWidth: 300,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleCardAdmin: {
    borderColor: "rgba(230, 57, 70, 0.2)",
    backgroundColor: "rgba(230, 57, 70, 0.02)",
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
  },
  roleInfo: {
    marginBottom: 20,
  },
  roleName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  roleDesc: {
    color: COLORS.gray500,
    fontSize: 13,
    lineHeight: 18,
  },
  credsList: {
    gap: 12,
    marginBottom: 24,
  },
  credItem: {
    gap: 4,
  },
  credLabel: {
    color: COLORS.gray500,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  credValueContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  credValue: {
    color: COLORS.brandPurple,
    fontSize: 12,
    fontWeight: "700",
  },
  launchBtn: {
    backgroundColor: COLORS.brandPurple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  launchBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  footer: {
    padding: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  footerText: {
    color: COLORS.gray500,
    fontSize: 12,
    fontWeight: "500",
  },
});

export default DemoCredentialsModal;
