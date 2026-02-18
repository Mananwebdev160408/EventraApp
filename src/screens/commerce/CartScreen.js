import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button';

const CartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Trash2 size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>Your cart is ready for items!</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.totalRow}>
             <Text style={styles.totalLabel}>Total</Text>
             <Text style={styles.totalValue}>$0.00</Text>
          </View>
          <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1220',
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
    color: COLORS.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.gray500,
    fontSize: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.white10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  totalLabel: {
    color: COLORS.gray400,
    fontSize: 16,
  },
  totalValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  },
});

export default CartScreen;
