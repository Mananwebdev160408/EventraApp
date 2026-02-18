import React from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Share, Calendar, Clock, MapPin, MoreVertical, Download, Wallet } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { EVENT_DETAILS } from '../../constants/mocks';

const TicketScreen = ({ navigation }) => {
  const event = EVENT_DETAILS;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MainTabs')}>
          <ChevronLeft size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Ticket</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MoreVertical size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.ticketContainer}>
          {/* Ticket Top (Event Image & Info) */}
          <View style={styles.ticketTop}>
            <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
            <View style={styles.eventOverlay} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Calendar size={14} color={COLORS.gray300} />
                  <Text style={styles.metaText}>{event.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={14} color={COLORS.gray300} />
                  <Text style={styles.metaText}>{event.time}</Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={14} color={COLORS.gray300} />
                <Text style={styles.metaText}>{event.venue}</Text>
              </View>
            </View>
          </View>

          {/* Semicircles for tear effect */}
          <View style={styles.tearLineContainer}>
             <View style={styles.semicircleLeft} />
             <View style={styles.dashedLine} />
             <View style={styles.semicircleRight} />
          </View>

          {/* Ticket Middle (Seat Info) */}
          <View style={styles.ticketMiddle}>
            <View style={styles.seatRow}>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>SECTION</Text>
                <Text style={styles.seatValue}>A</Text>
              </View>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>ROW</Text>
                <Text style={styles.seatValue}>5</Text>
              </View>
              <View style={styles.seatItem}>
                <Text style={styles.seatLabel}>SEAT</Text>
                <Text style={styles.seatValue}>12</Text>
              </View>
            </View>
            
            <View style={styles.userInfoRow}>
              <View>
                <Text style={styles.userLabel}>HOLDER</Text>
                <Text style={styles.userName}>Alex Johnson</Text>
              </View>
              <View>
                <Text style={styles.userLabel}>ORDER ID</Text>
                <Text style={styles.orderId}>#928374</Text>
              </View>
            </View>
          </View>
          
           {/* Tear line 2 */}
          <View style={styles.tearLineContainer}>
             <View style={styles.semicircleLeft} />
             <View style={styles.dashedLine} />
             <View style={styles.semicircleRight} />
          </View>

          {/* Ticket Bottom (QR Code) */}
          <View style={styles.ticketBottom}>
            <View style={styles.qrContainer}>
               {/* Mock QR Code */}
               <Image 
                 source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' }}
                 style={styles.qrCode}
               />
            </View>
            <Text style={styles.scanText}>Scan this code at the gate</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color={COLORS.white} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Wallet size={20} color={COLORS.white} />
            <Text style={styles.primaryButtonText}>Add to Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconButton: {
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  ticketTop: {
    height: 200,
    position: 'relative',
    padding: 24,
    justifyContent: 'flex-end',
  },
  eventImage: {
    ...StyleSheet.absoluteFillObject,
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  eventInfo: {
    zIndex: 1,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.gray300,
    fontWeight: '500',
  },
  tearLineContainer: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
    marginHorizontal: -1, // Fix gap
  },
  semicircleLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background, // Match background
    position: 'absolute',
    left: -15,
  },
  semicircleRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    position: 'absolute',
    right: -15,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginHorizontal: 30,
  },
  ticketMiddle: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  seatItem: {
    alignItems: 'center',
  },
  seatLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 4,
  },
  seatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  ticketBottom: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
  },
  qrContainer: {
    width: 160,
    height: 160,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 8,
    padding: 4,
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  scanText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
  },
  actionText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default TicketScreen;
