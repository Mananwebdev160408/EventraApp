import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
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
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";
import { COLORS } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../api/services";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const EditProfileScreen = ({ navigation }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isDesktop = windowWidth > 768;
  const { userInfo, setUserInfo } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstname || userInfo?.firstName || "",
    lastName: userInfo?.lastname || userInfo?.lastName || "",
    email: userInfo?.email || "",
    phoneNumber: userInfo?.phoneNumber || userInfo?.phone || "",
  });

  const handleUpdate = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const userId = userInfo?.uid || userInfo?.id;
      await userService.updateUser(userId, formData);
      setUserInfo({ ...userInfo, ...formData });
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const WebInputField = ({ label, value, onChangeText, icon: Icon, editable = true, placeholder }) => (
    <View style={styles.webInputGroup}>
      <Text style={styles.webLabel}>{label}</Text>
      <View style={[styles.webInputWrapper, !editable && styles.webDisabledInput]}>
        <Icon size={18} color={editable ? "#94a3b8" : "#cbd5e1"} />
        <TextInput
          style={[styles.webInput, !editable && styles.webDisabledText]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.desktopContainer}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.desktopContent} showsVerticalScrollIndicator={false}>
        <View style={styles.editCard}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1d3557" />
            <Text style={styles.backText}>Profile</Text>
          </TouchableOpacity>

          <View style={styles.headerBox}>
            <View style={styles.titleRow}>
               <Sparkles size={24} color={COLORS.brandPurple} />
               <Text style={styles.title}>Edit Profile</Text>
            </View>
            <Text style={styles.subtitle}>Update your personal information and account settings.</Text>
          </View>

          <View style={styles.formGrid}>
            <View style={styles.formRow}>
               <View style={{ flex: 1 }}>
                  <WebInputField 
                     label="First Name" 
                     value={formData.firstName} 
                     onChangeText={(t) => setFormData({...formData, firstName: t})} 
                     icon={User} 
                     placeholder="John"
                  />
               </View>
               <View style={{ flex: 1 }}>
                  <WebInputField 
                     label="Last Name" 
                     value={formData.lastName} 
                     onChangeText={(t) => setFormData({...formData, lastName: t})} 
                     icon={User} 
                     placeholder="Doe"
                  />
               </View>
            </View>

            <WebInputField 
               label="Email Address" 
               value={formData.email} 
               onChangeText={(t) => setFormData({...formData, email: t})} 
               icon={Mail} 
               placeholder="john@example.com"
            />

            <WebInputField 
               label="Phone Number" 
               value={formData.phoneNumber} 
               onChangeText={(t) => setFormData({...formData, phoneNumber: t})} 
               icon={Phone} 
               placeholder="+1 234 567 890"
            />

            <WebInputField 
               label="Username" 
               value={`@${userInfo?.username}`} 
               icon={User} 
               editable={false} 
            />

            <View style={styles.securityNote}>
               <ShieldCheck size={18} color="#10b981" />
               <Text style={styles.securityText}>Your account is verified and secure.</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
               <LinearGradient colors={[COLORS.brandPurple, "#d62828"]} style={styles.saveGradient}>
                  {loading ? <ActivityIndicator color="#fff" /> : (
                     <>
                        <Save size={20} color="#fff" />
                        <Text style={styles.saveBtnText}>Save All Changes</Text>
                     </>
                  )}
               </LinearGradient>
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
    backgroundColor: "#f8fafc",
  },
  desktopContent: {
    padding: 80,
    alignItems: "center",
  },
  editCard: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 60,
    shadowColor: "#1d3557",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 48,
  },
  backText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d3557",
  },
  headerBox: {
    marginBottom: 48,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1d3557",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "500",
  },
  formGrid: {
    gap: 24,
  },
  formRow: {
    flexDirection: "row",
    gap: 24,
  },
  webInputGroup: {
    marginBottom: 8,
  },
  webLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
    marginLeft: 4,
  },
  webInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 20,
    height: 64,
  },
  webDisabledInput: {
    backgroundColor: "#f1f5f9",
    borderColor: "#f1f5f9",
  },
  webInput: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#1d3557",
  },
  webDisabledText: {
    color: "#94a3b8",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  securityText: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "700",
  },
  saveBtn: {
    marginTop: 40,
    borderRadius: 18,
    overflow: "hidden",
  },
  saveGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    height: 68,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default EditProfileScreen;
