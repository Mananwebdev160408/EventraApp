import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', { email, password });
      navigation.navigate('RoleSelection'); // Navigate to role selection after login
    }, 1500);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6tND47zG6hHOzlcn2LpdJOpcXjoEPkbAUiLgWbNZuN1ixeCgQe6LtvNg-0alIWMVypnClgGYhKq7XA7z1FwVux5-NrwHvRVSHnU_DuQmvmYvKsQYJOs2ab4JiNJaWHkZAKYFfs2qJX8YMK9cJex7badPbsdhDYHWzrHCW6t7_mEFqJD51BVqcspbIPGPXPUxRnMD3VjP8ILsRpGhI_L2kfUECvck-7EVcMPpaTY8JlQiaceqXLntus0BpzhXlrnPVotkTgkS-Uk4' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../../assets/icon.png')} 
                style={{ width: '70%', height: '70%', resizeMode: 'contain' }} 
              />
            </View>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>To access your tickets and events</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
            />
            <View>
              <View style={styles.passwordHeader}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity>
                   <Text style={styles.forgotPassword}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Enter password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                containerStyle={{marginTop: 0}} // Label handled manually above for alignment
              />
            </View>

            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={{ marginTop: 20 }}
            />

            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq9WASSOPYe7FEi3b93s6fC6xHGCvG3oJS4AnnrRmx8mu8p9r98LOwTWPeV758veUHwcurpnPL2PdOGy3NtxKP1rwlp7iNintsZWzEh04Vq-nkFMRn3qppz1FrFTMmiqOfNYIIr7D90IE9DhcEjVMN3EKUh-CiUXvGeXAxLdhSY0fniFS7HnriAtRqeFna2GS9_mvXm-_f8L05Lbad3WNAzYwn3Y5OlZT5u3QJfgWVbQ2lAn3uIyfpUTOnqDdudkkckvvDBM1iFPk' }} 
                  style={{ width: 20, height: 20, tintColor: COLORS.white }} 
                />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbVmD5g122LU1_obn1dpGK28Bhf73yNdC_UZtcghqvdVdWoXLYvu0FtjNDojlJd-aDfhNSEWHSJe_uLOBaa0Dy0Fc6RxMM3Ut66lPFbzcyHJT203g0wNM1JCenU9mWEuGtLYZjqipP9bityr3_KTnp34fJSeAz1rmKD10l0HxFgtd9E0KRAD8T3SVnC3BHiSFV5PNb-UCN10ooOzkVMRVOQv9jJxdUnUnozUyhYqxkq-LL2_FwozUBvLnwr5ujdu9AiahISnZR8_s' }} 
                  style={{ width: 20, height: 20 }} 
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to the platform?</Text>
            <TouchableOpacity onPress={() => console.log('Create account')}>
              <Text style={styles.createAccount}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 0, 43, 0.85)', // Darker overlay to match design
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 40,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32, // text-4xl
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray400,
  },
  form: {
    flex: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputLabel: {
    color: COLORS.gray300,
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPassword: {
    color: COLORS.brandPurple,
    fontSize: 13,
    fontWeight: '500',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 16,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.white10,
  },
  separatorText: {
    color: COLORS.gray500,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.white10,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0)',
  },
  socialButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  footerText: {
    color: COLORS.gray400,
    fontSize: 14,
    marginRight: 4,
  },
  createAccount: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brandPurple,
  },
});

export default LoginScreen;
