import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, User, ShieldCheck, CheckCircle, Circle } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button';

const RoleCard = ({ title, description, icon, isSelected, onPress, isPro }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconContainerActive]}>
        {icon}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Text style={styles.cardTitle}>{title}</Text>
            {isPro && (
               <View style={styles.proBadge}>
                 <Text style={styles.proText}>PRO</Text>
               </View>
            )}
          </View>
          {isSelected ? (
            <CheckCircle size={20} color={COLORS.brandPurple} fill={COLORS.brandPurple} stroke={COLORS.brandDark} />
          ) : (
            <Circle size={20} color={COLORS.border} />
          )}
        </View>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState('fan'); // 'fan' or 'admin'

  const handleContinue = () => {
    // Navigate based on role or just go to main app for now
    if (selectedRole === 'admin') {
      console.log('Admin role selected');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminTabs' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.stepText}>STEP 1 OF 2</Text>
        <View style={{width: 40}} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>Select how you'd like to use the platform.</Text>
        </View>

        <View style={styles.cardsContainer}>
          <RoleCard
            title="Fan"
            description="Discover events, book premium seats, and access your digital tickets."
            icon={<User size={30} color={selectedRole === 'fan' ? COLORS.brandPurple : COLORS.gray400} />}
            isSelected={selectedRole === 'fan'}
            onPress={() => setSelectedRole('fan')}
          />
          <RoleCard
            title="Stadium Admin"
            description="Manage venues, monitor ticket sales, and oversee event operations."
            icon={<ShieldCheck size={30} color={selectedRole === 'admin' ? '#9d4edd' : COLORS.gray400} />}
            isSelected={selectedRole === 'admin'}
            onPress={() => setSelectedRole('admin')}
            isPro
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          style={{marginBottom: 16}}
        />
        <TouchableOpacity>
          <Text style={styles.helpText}>Need help choosing?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: COLORS.gray600,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30, // text-3xl
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray600,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  cardActive: {
    borderColor: COLORS.brandPurple,
    backgroundColor: 'rgba(123, 44, 191, 0.06)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(123, 44, 191, 0.2)',
    borderColor: 'rgba(123, 44, 191, 0.3)',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.2)',
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9d4edd',
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
  },
  helpText: {
    textAlign: 'center',
    color: COLORS.gray600,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RoleSelectionScreen;
