import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../api/services";

const EditProfileScreen = ({ navigation }) => {
  const { userInfo, setUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstname: userInfo?.firstname || "",
    lastname: userInfo?.lastname || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
  });

  const handleUpdate = async () => {
    if (!formData.firstname || !formData.lastname || !formData.email) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await userService.updateUser(userInfo.id || userInfo.username, formData);

      // Update local state and context
      const updatedUser = { ...userInfo, ...formData };
      setUserInfo(updatedUser);

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    icon: Icon,
    placeholder,
    keyboardType = "default",
    editable = true,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
        <View style={styles.iconBox}>
          <Icon
            size={18}
            color={editable ? "#a8dadc" : "rgba(255,255,255,0.4)"}
          />
        </View>
        <TextInput
          style={[styles.input, !editable && styles.disabledText]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1511732351157-1865efda9b0b?auto=format&fit=crop&q=80&w=1000",
        }}
        style={styles.bgImage}
        blurRadius={6}
      >
        <LinearGradient
          colors={["rgba(10, 25, 47, 0.6)", "rgba(10, 25, 47, 0.9)", "#0a192f"]}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.glassCard}>
                  <View style={styles.infoBox}>
                    <View style={styles.subtitleRow}>
                      <Sparkles size={16} color="#a8dadc" />
                      <Text style={styles.infoSubtitle}>
                        Account Management
                      </Text>
                    </View>
                    <Text style={styles.infoTitle}>Edit Information</Text>
                  </View>

                  <InputField
                    label="Username"
                    value={`@${userInfo?.username}`}
                    icon={User}
                    editable={false}
                  />

                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <InputField
                        label="First Name"
                        value={formData.firstname}
                        onChangeText={(text) =>
                          setFormData({ ...formData, firstname: text })
                        }
                        icon={User}
                        placeholder="First Name"
                      />
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={{ flex: 1 }}>
                      <InputField
                        label="Last Name"
                        value={formData.lastname}
                        onChangeText={(text) =>
                          setFormData({ ...formData, lastname: text })
                        }
                        icon={User}
                        placeholder="Last Name"
                      />
                    </View>
                  </View>

                  <InputField
                    label="Email Address"
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    icon={Mail}
                    placeholder="Email Address"
                    keyboardType="email-address"
                  />

                  <InputField
                    label="Phone Number"
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone: text })
                    }
                    icon={Phone}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                  />

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleUpdate}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#f1faee", "#f8fafc"]}
                      style={styles.btnGradient}
                    >
                      {loading ? (
                        <ActivityIndicator color="#1d3557" size="small" />
                      ) : (
                        <>
                          <Save size={20} color="#1d3557" strokeWidth={2.5} />
                          <Text style={styles.saveBtnText}>Save Changes</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.noteContainer}>
                    <Lock size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.noteText}>
                      Username is unique and cannot be changed.
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a192f",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  glassCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 36,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    overflow: "hidden",
  },
  infoBox: {
    marginBottom: 32,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  infoSubtitle: {
    fontSize: 13,
    color: "#a8dadc",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    height: 64,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
  },
  disabledInput: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderColor: "rgba(255,255,255,0.05)",
  },
  disabledText: {
    color: "rgba(255,255,255,0.3)",
  },
  saveBtn: {
    width: "100%",
    height: 64,
    borderRadius: 22,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    overflow: "hidden",
  },
  btnGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  saveBtnText: {
    color: "#1d3557",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
  },
});

export default EditProfileScreen;
