import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, CreditCard, Lock, CheckCircle } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';

const CheckoutScreen = ({ navigation }) => {
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    // Simulate payment processing
    setTimeout(() => {
      setSuccess(true);
      navigation.navigate('OrderConfirmed', { 
        order: {
          id: '#123456',
          total: '$89.50',
          date: 'Oct 26, 2024',
          paymentMethod: 'Visa **** 4242' 
        }
      });
    }, 1500);
  };

  if (success) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
        <View style={styles.successIcon}>
          <CheckCircle size={64} color={COLORS.white} />
        </View>
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successText}>Your payment was successful. You will receive an email confirmation shortly.</Text>
        <Button 
          title="Track Order" 
          onPress={() => navigation.navigate('TrackOrder')} 
          style={{ width: '100%', marginBottom: 12 }}
        />
        <Button 
          title="Back to Home" 
          onPress={() => navigation.navigate('MainTabs')} 
          variant="outline"
          style={{ width: '100%' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.cardSelector}>
              <View style={styles.cardOptionActive}>
                 <CreditCard size={24} color={COLORS.brandPurple} />
                 <Text style={styles.cardText}>.... 4242</Text>
                 <View style={styles.radioSelected} />
              </View>
            </View>
            <TouchableOpacity style={styles.addCardButton}>
              <Text style={styles.addCardText}>+ Add New Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$85.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>$4.50</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$89.50</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.secureBadge}>
            <Lock size={12} color={COLORS.gray400} />
            <Text style={styles.secureText}>Payments are secure and encrypted</Text>
          </View>
          <Button title="Pay $89.50" onPress={handlePay} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray600,
    marginBottom: 16,
  },
  cardSelector: {
    gap: 12,
  },
  cardOptionActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
    gap: 12,
  },
  cardText: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: COLORS.brandPurple,
    backgroundColor: COLORS.card,
  },
  addCardButton: {
    marginTop: 12,
    padding: 12,
  },
  addCardText: {
    color: COLORS.brandPurple,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: COLORS.gray600,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 16,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureText: {
    color: COLORS.gray600,
    fontSize: 12,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  successText: {
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
});

export default CheckoutScreen;
