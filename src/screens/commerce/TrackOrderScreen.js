import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Package, Check, Clock, MapPin } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

const TrackOrderScreen = ({ navigation }) => {
  const steps = [
    { label: 'Order Confirmed', time: '10:30 AM', status: 'completed' },
    { label: 'Preparing', time: '10:35 AM', status: 'completed' },
    { label: 'Out for Delivery', time: '10:45 AM', status: 'active' },
    { label: 'Delivered', time: 'Est. 10:55 AM', status: 'pending' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order #4829</Text>
          <View style={{width: 40}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.mapPlaceholder}>
             <MapPin size={48} color={COLORS.brandPurple} />
             <Text style={styles.mapText}>Live Map Tracking View</Text>
          </View>

          <View style={styles.statusCard}>
             <View style={styles.driverInfo}>
                <View style={styles.driverAvatar}>
                   <Text style={{fontSize: 20}}>🛵</Text>
                </View>
                <View>
                   <Text style={styles.driverName}>Coming to Seat B12</Text>
                   <Text style={styles.driverStatus}>Arriving in 10 mins</Text>
                </View>
             </View>
          </View>

          <View style={styles.timeline}>
             {steps.map((step, index) => (
                <View key={index} style={styles.timelineItem}>
                   <View style={styles.timelineLeft}>
                      <Text style={styles.timelineTime}>{step.time}</Text>
                   </View>
                   <View style={styles.timelineCenter}>
                      <View style={[
                         styles.timelineDot, 
                         step.status === 'completed' && styles.dotCompleted,
                         step.status === 'active' && styles.dotActive,
                      ]}>
                         {step.status === 'completed' && <Check size={12} color={COLORS.white} />}
                         {step.status === 'active' && <Clock size={12} color={COLORS.white} />}
                      </View>
                      {index < steps.length - 1 && <View style={styles.timelineLine} />}
                   </View>
                   <View style={styles.timelineRight}>
                      <Text style={[
                         styles.timelineLabel,
                         step.status === 'pending' && { color: COLORS.gray500 }
                      ]}>{step.label}</Text>
                   </View>
                </View>
             ))}
          </View>
        </ScrollView>
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
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: 24,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  mapText: {
    marginTop: 12,
    color: COLORS.gray600,
    fontSize: 14,
  },
  statusCard: {
    backgroundColor: '#1d3557',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
     fontSize: 16,
     fontWeight: '700',
     color: COLORS.text,
  },
  driverStatus: {
     color: COLORS.gray600,
     fontSize: 14,
  },
  timeline: {
     paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 32,
    minHeight: 40,
  },
  timelineLeft: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  timelineTime: {
    color: COLORS.gray600,
    fontSize: 12,
  },
  timelineCenter: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray600,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
  },
  dotActive: {
     backgroundColor: COLORS.background,
     borderColor: COLORS.brandPurple,
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    bottom: -32,
    width: 2,
    backgroundColor: COLORS.border,
  },
  timelineRight: {
     paddingLeft: 16,
     justifyContent: 'center',
  },
  timelineLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrackOrderScreen;
