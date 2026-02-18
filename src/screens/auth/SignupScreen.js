import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/theme';
import { ChevronLeft, Check } from 'lucide-react-native';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        // Navigate or show success
        navigation.navigate('RoleSelection');
    }, 1500);
  };

  const FloatingInput = ({ label, value, onChangeText, secureTextEntry, toggleSecure }) => (
      <View style={styles.floatingGroup}>
          <TextInput
              style={styles.floatingInput}
              value={value}
              onChangeText={onChangeText}
              placeholder={label}
              placeholderTextColor="transparent" // Using label as placeholder visually
              secureTextEntry={secureTextEntry}
          />
          <Text style={[styles.floatingLabel, value ? styles.floatingLabelActive : {}]}>{label}</Text>
          
          {/* Add eye toggle specifically if needed, simplified for this layout to match design which puts button absolute right bottom */}
      </View>
  );


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <ChevronLeft size={24} color="#1d3557" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ACCOUNT CREATION</Text>
            <View style={{width: 24}} /> 
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            
            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Join Us</Text>
                <View style={styles.heroLine} />
                <Text style={styles.heroSubtitle}>
                    Step into the elite circle of stadium event management.
                </Text>
            </View>

            <View style={styles.form}>
                
                {/* Full Name */}
                <View style={styles.floatingGroup}>
                    <TextInput
                        style={styles.floatingInput}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Full Name"
                        placeholderTextColor="transparent" 
                    />
                    <Text style={[styles.floatingLabel, fullName ? styles.floatingLabelActive : {}]}>FULL NAME</Text>
                </View>

                {/* Email */}
                <View style={styles.floatingGroup}>
                    <TextInput
                        style={styles.floatingInput}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email Address"
                        placeholderTextColor="transparent" 
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={[styles.floatingLabel, email ? styles.floatingLabelActive : {}]}>EMAIL ADDRESS</Text>
                </View>

                {/* Password */}
                <View style={styles.floatingGroup}>
                    <TextInput
                        style={styles.floatingInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="transparent" 
                        secureTextEntry={!showPassword}
                    />
                    <Text style={[styles.floatingLabel, password ? styles.floatingLabelActive : {}]}>PASSWORD</Text>
                </View>

                {/* Confirm Password */}
                <View style={styles.floatingGroup}>
                    <TextInput
                        style={styles.floatingInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="transparent" 
                        secureTextEntry={!showPassword}
                    />
                    <Text style={[styles.floatingLabel, confirmPassword ? styles.floatingLabelActive : {}]}>CONFIRM PASSWORD</Text>
                </View>


                {/* Terms */}
                <TouchableOpacity 
                    style={styles.termsContainer} 
                    activeOpacity={0.8}
                    onPress={() => setAgreed(!agreed)}
                >
                    <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                        {agreed && <Check size={14} color="#ffffff" />}
                    </View>
                    <Text style={styles.termsText}>
                        I accept the <Text style={styles.linkText}>Terms & Conditions</Text> and acknowledge the <Text style={styles.linkText}>Privacy Policy</Text>.
                    </Text>
                </TouchableOpacity>

                {/* Submit Button */}
                <TouchableOpacity 
                    style={styles.submitBtn}
                    onPress={handleSignup}
                    activeOpacity={0.9}
                    disabled={isLoading}
                >
                    <Text style={styles.submitBtnText}>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already a member? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>LOGIN</Text>
                </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
       
       {/* Bottom Badge */}
       <View style={styles.bottomBadge}>
           <Text style={styles.badgeText}>PREMIUM ACCESS</Text>
           {/* Simple verified icon representation/simulated */}
           <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#1d3557', alignItems: 'center', justifyContent: 'center' }}>
               <Check size={10} color="#1d3557" strokeWidth={4} />
           </View>
       </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1faee',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#1d3557',
    opacity: 0.4,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 56,
  },
  heroTitle: {
    fontSize: 42, // text-5xl equivalent roughly
    fontWeight: '800',
    color: '#1d3557',
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroLine: {
    height: 4,
    width: 48,
    backgroundColor: '#1d3557',
    marginBottom: 16,
  },
  heroSubtitle: {
    color: 'rgba(29, 53, 87, 0.6)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    maxWidth: 280,
  },
  form: {
    marginBottom: 24,
  },
  floatingGroup: {
    position: 'relative',
    marginBottom: 24,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(29, 53, 87, 0.2)',
  },
  floatingInput: {
    width: '100%',
    height: '100%',
    paddingTop: 16, // Space for label
    fontSize: 18,
    fontWeight: '500',
    color: '#1d3557',
    zIndex: 10,
  },
  floatingLabel: {
    position: 'absolute',
    left: 0,
    top: 18,
    fontSize: 16,
    color: 'rgba(29, 53, 87, 0.5)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 10,
  },
  floatingLabelActive: {
    top: 0,
    fontSize: 10, 
    color: 'rgba(29, 53, 87, 0.4)',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(29, 53, 87, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1d3557',
    borderColor: '#1d3557',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(29, 53, 87, 0.6)',
    lineHeight: 18,
    fontWeight: '500',
  },
  linkText: {
    color: '#1d3557',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#1d3557',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 3, // tracking-[0.2em]
  },
  footer: {
    marginTop: 40,
    marginBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(29, 53, 87, 0.5)',
    fontWeight: '500',
    marginBottom: 4,
  },
  loginLink: {
    color: '#1d3557',
    fontSize: 12,
    fontWeight: '800', // extrabold
    textTransform: 'uppercase',
    letterSpacing: 2, // tracking-widest
  },
  bottomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 32,
    opacity: 0.2, // opacity-10
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 4, // tracking-[0.4em]
    color: '#000',
  }

});

export default SignupScreen;
