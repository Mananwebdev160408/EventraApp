import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Info, Sparkles, Plus, Minus, Crosshair, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SelectSeatsScreen = ({ navigation }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Mock seat selection
  const toggleSeat = (id) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Select Your Seats</Text>
          <Text style={styles.subtitle}>Finals: Phoenix vs. Titans • Oct 24</Text>
        </View>
        <TouchableOpacity style={styles.circleButton}>
          <Info size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Main Map Area */}
      <View style={styles.mapArea}>
        {/* Smart Recommendation */}
        <TouchableOpacity style={styles.smartButton}>
          <Sparkles size={16} color={COLORS.white} />
          <Text style={styles.smartButtonText}>Smart Recommendation</Text>
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color="#10b981" label="Available" />
          <LegendItem color="#475569" label="Booked" />
          <LegendItem color={COLORS.brandPurple} label="Selected" />
          <LegendItem color="#d946ef" label="Women Only" />
          <LegendItem color="#fbbf24" label="Accessible" />
        </View>

        {/* Section Indicators */}
        <Text style={[styles.sectionDist, { top: 40 }]}>NORTH BLOCK</Text>
        <Text style={[styles.sectionDist, { bottom: 180 }]}>SOUTH TERRACE</Text>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <View style={styles.stadiumOval}>
             {/* Play Zone */}
             <View style={styles.playZone}>
               <Text style={styles.playZoneText}>PLAY ZONE</Text>
             </View>

             {/* Rings */}
             <View style={styles.ringOuter} pointerEvents="none" />
             <View style={styles.ringMiddle} pointerEvents="none" />
             <View style={styles.ringInner} pointerEvents="none" />

             {/* Seats (Visual Representation) */}
             <View style={styles.seatCtn}>
                {/* Example Seats */}
                <SeatGroup top="10%" left="25%" color="#10b981" count={2} />
                <SeatGroup top="12%" right="25%" color="#10b981" count={2} type="accessible" />
                
                <SeatGroup top="50%" left="10%" color="#475569" count={3} vertical />
                <SeatGroup top="50%" right="10%" color="#d946ef" count={3} vertical />

                {/* Interactive Area */}
                <View style={[styles.seatRow, { bottom: '15%' }]}>
                  <Seat 
                    selected={selectedSeats.includes(1)} 
                    onPress={() => toggleSeat(1)} 
                    color={selectedSeats.includes(1) ? COLORS.brandPurple : '#7b2cbf'} 
                    scale={1.2}
                  />
                  <Seat 
                    selected={selectedSeats.includes(2)} 
                    onPress={() => toggleSeat(2)} 
                    color={selectedSeats.includes(2) ? COLORS.brandPurple : '#7b2cbf'} 
                    scale={1.2}
                  />
                  <Seat color="#10b981" /> 
                </View>
             </View>
          </View>
        </View>

        {/* Pop-up Info (Visual only per design) */}
        <View style={styles.popupInfo}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>B12</Text>
            <View style={styles.dot} />
            <Text style={styles.popupText}>PREMIUM LOUNGE</Text>
          </View>
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
           <TouchableOpacity style={styles.zoomButton}><Plus size={20} color={COLORS.white} /></TouchableOpacity>
           <TouchableOpacity style={styles.zoomButton}><Minus size={20} color={COLORS.white} /></TouchableOpacity>
           <TouchableOpacity style={[styles.zoomButton, {marginTop: 8}]}><Crosshair size={20} color={COLORS.white} /></TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>SEATS SELECTED</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.seatCount}>{selectedSeats.length}</Text>
              <Text style={styles.totalPrice}>/ ${selectedSeats.length * 170}.00</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.proceedButton}
            onPress={() => navigation.navigate('SeatInformation')}
          >
            <Text style={styles.proceedText}>Proceed</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Seat = ({ color, selected, onPress, scale = 1, type }) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.7}
    style={[
      styles.seat, 
      { backgroundColor: color, transform: [{ scale }] },
      selected && { borderWidth: 2, borderColor: COLORS.white },
      type === 'accessible' && { alignItems: 'center', justifyContent: 'center' }
    ]}
  >
    {/* Optional Icon for types */}
  </TouchableOpacity>
);

const SeatGroup = ({ top, left, right, bottom, color, count, vertical, type }) => {
  const seats = Array(count).fill(0);
  return (
    <View style={[
      styles.seatGroup, 
      { top, left, right, bottom, flexDirection: vertical ? 'column' : 'row' }
    ]}>
      {seats.map((_, i) => <Seat key={i} color={color} type={type} />)}
    </View>
  );
};

const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1220',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 2,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#1a1220', // Radial gradient simulation via background color for now
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartButton: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
    shadowColor: COLORS.brandPurple,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  smartButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  legend: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(26, 18, 32, 0.6)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
    zIndex: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionDist: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 2,
  },
  mapContainer: {
    width: width * 0.9,
    aspectRatio: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    perspective: 1000, 
  },
  stadiumOval: {
    width: '100%',
    height: '100%',
    borderRadius: 120, // Elliptical approximation
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.05)',
    transform: [{ rotateX: '20deg' }, { scale: 0.9 }], // 3D effect
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(30, 20, 40, 0.5)',
  },
  playZone: {
    width: '35%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playZoneText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
  },
  ringOuter: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ringMiddle: {
     position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ringInner: {
    // optional
  },
  seatCtn: {
    ...StyleSheet.absoluteFillObject,
  },
  seatGroup: {
    position: 'absolute',
    gap: 8,
  },
  seatRow: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 12,
  },
  seat: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  popupInfo: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    backgroundColor: 'rgba(26, 18, 32, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  popupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  popupTitle: {
    color: COLORS.brandPurple,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray500,
  },
  popupText: {
    color: COLORS.gray300,
    fontSize: 10,
    fontWeight: '600',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(26, 18, 32, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  footer: {
    backgroundColor: '#231a2b',
    borderTopWidth: 1,
    borderTopColor: COLORS.white10,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { height: -10 },
    shadowOpacity: 0.3,
    elevation: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  footerLabel: {
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  seatCount: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  totalPrice: {
    fontSize: 14,
    color: COLORS.gray400,
  },
  proceedButton: {
    flex: 1,
    backgroundColor: COLORS.brandPurple,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  proceedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SelectSeatsScreen;
