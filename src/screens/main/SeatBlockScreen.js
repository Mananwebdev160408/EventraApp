import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Info, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const SeatBlockScreen = ({ navigation, route }) => {
  const { sector } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  // Group seats by row for grid rendering
  const rows = {};
  sector.seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>{sector.name}</Text>
            <Text style={styles.subtitle}>Select your seats</Text>
          </View>
          <TouchableOpacity style={styles.circleButton}>
            <Info size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Seat Grid */}
        <ScrollView contentContainerStyle={styles.gridContainer} maximumZoomScale={3} minimumZoomScale={1}>
          <ScrollView horizontal contentContainerStyle={styles.gridContent}>
            <View style={styles.seatsContainer}>
              <View style={styles.screenIndicator}>
                <Text style={styles.screenText}>PITCH SIDE</Text>
              </View>
              
              {Object.keys(rows).map(rowIdx => (
                <View key={rowIdx} style={styles.row}>
                  <Text style={styles.rowLabel}>{String.fromCharCode(65 + parseInt(rowIdx))}</Text>
                  {rows[rowIdx].map(seat => (
                    <TouchableOpacity
                      key={seat.id}
                      disabled={seat.status === 'booked'}
                      onPress={() => toggleSeat(seat.id)}
                      style={[
                        styles.seat,
                        { 
                          backgroundColor: selectedSeats.includes(seat.id) ? COLORS.brandPurple : 
                                         seat.status === 'booked' ? COLORS.gray300 : '#10b981'
                        }
                      ]}
                    />
                  ))}
                  <Text style={styles.rowLabel}>{String.fromCharCode(65 + parseInt(rowIdx))}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.footerLabel}>SEATS SELECTED</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.seatCount}>{selectedSeats.length}</Text>
                <Text style={styles.totalPrice}>/ ${selectedSeats.length * sector.price}.00</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.proceedButton, selectedSeats.length === 0 && { opacity: 0.5 }]}
              disabled={selectedSeats.length === 0}
              onPress={() => navigation.navigate('SeatInformation', { seats: selectedSeats })}
            >
              <Text style={styles.proceedText}>Confirm Seats</Text>
              <ArrowRight size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  gridContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  gridContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  seatsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  screenIndicator: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.gray300,
    marginBottom: 32,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  screenText: {
    position: 'absolute',
    top: -20,
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: '700',
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowLabel: {
    width: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gray400,
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 8,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    // borderBottomLeftRadius: 12,
    // borderBottomRightRadius: 12,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 10,
    color: COLORS.gray600,
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  seatCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalPrice: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  proceedButton: {
    backgroundColor: COLORS.brandPurple,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  proceedText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SeatBlockScreen;
