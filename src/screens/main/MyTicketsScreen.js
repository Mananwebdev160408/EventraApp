import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Calendar, Clock, MapPin, QRCode, Ticket as TicketIcon } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data for tickets
const TICKETS = [
  {
    id: 't1',
    eventTitle: 'Champions League Final',
    date: '15 Jun 2026',
    time: '20:00',
    venue: 'Wembley Stadium',
    seat: 'Sec 104, Row G, Seat 12',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80&w=800',
    status: 'upcoming',
    type: 'VIP'
  },
  {
    id: 't2',
    eventTitle: 'Neon Lights Concert',
    date: '22 Jul 2026',
    time: '19:30',
    venue: 'O2 Arena',
    seat: 'Standing A',
    image: 'https://images.unsplash.com/photo-1459749411177-0473ef716175?auto=format&fit=crop&q=80&w=800',
    status: 'upcoming',
    type: 'Standard'
  },
  {
    id: 't3',
    eventTitle: 'Basketball Finals',
    date: '10 May 2026',
    time: '18:00',
    venue: 'Madison Square Garden',
    seat: 'Court Side 2',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    status: 'past',
    type: 'VIP'
  }
];

const MyTicketsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  const filteredTickets = TICKETS.filter(t => activeTab === 'upcoming' ? t.status === 'upcoming' : t.status === 'past');

  const TicketCard = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('Ticket')}
      style={styles.ticketCard}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.imageOverlay} 
        />
        <View style={styles.ticketTypeBadge}>
          <Text style={styles.ticketType}>{item.type}</Text>
        </View>
        <View style={styles.cardHeaderContent}>
          <Text style={styles.eventTitle}>{item.eventTitle}</Text>
          <View style={styles.venueRow}>
            <MapPin size={14} color={COLORS.gray300} />
            <Text style={styles.venueText}>{item.venue}</Text>
          </View>
        </View>
      </View>

      <View style={styles.ticketBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={16} color={COLORS.brandPurple} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{item.date}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoItem}>
            <Clock size={16} color={COLORS.brandPurple} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{item.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.seatContainer}>
          <Text style={styles.seatLabel}>Seat Location</Text>
          <Text style={styles.seatValue}>{item.seat}</Text>
        </View>

        <View style={styles.actionsFooter}>
          <TouchableOpacity style={styles.viewTicketBtn} onPress={() => navigation.navigate('Ticket')}>
            <Text style={styles.viewTicketText}>View Ticket</Text>
            <ChevronRight size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View> 
      </View>
            
      {/* Visual rip effect using dashed line */}
      <View style={styles.ripLineContainer}>
        <View style={styles.ripCircleLeft} />
        <View style={styles.ripLine} />
        <View style={styles.ripCircleRight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <TouchableOpacity style={styles.calendarBtn}>
             <Calendar size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
             onPress={() => setActiveTab('upcoming')}
           >
             <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.tab, activeTab === 'past' && styles.activeTab]}
             onPress={() => setActiveTab('past')}
           >
             <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past Events</Text>
           </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTickets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TicketCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
               <TicketIcon size={48} color={COLORS.gray300} />
               <Text style={styles.emptyTitle}>No tickets found</Text>
               <Text style={styles.emptyText}>You haven't booked any events yet. Explore upcoming events to get started!</Text>
               <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Discover')}>
                 <Text style={styles.exploreBtnText}>Explore Events</Text>
               </TouchableOpacity>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

// Helper for chevron in button
const ChevronRight = ({size, color}) => (
    <View style={{ transform: [{ rotate: '0deg' }] }}> 
       {/* reusing existing import but icon is simple to simulate if needed, or stick to import from library */}
       {/* Actually I imported it but let's just use Text > for simplicity or fix import if it errors. I imported ChevronLeft, let's change to use rotate */}
       <ChevronLeft size={size} color={color} style={{ transform: [{ rotate: '180deg' }] }} />
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1faee',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28, // text-3xl
    fontWeight: '800',
    color: COLORS.text,
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1d3557', // Navy
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray500,
  },
  activeTabText: {
    color: '#1d3557',
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
    gap: 24,
  },
  ticketCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ticketTypeBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // Note: backdropFilter not supported on all RN stats, but rgba works visually
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ticketType: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardHeaderContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueText: {
    color: COLORS.gray300,
    fontSize: 12,
    fontWeight: '500',
  },
  ticketBody: {
    padding: 20,
    paddingTop: 24, // clearing the rip line
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  separator: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  seatContainer: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  seatLabel: {
    fontSize: 10,
    color: COLORS.gray500,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  seatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionsFooter: {
    marginTop: 0,
  },
  viewTicketBtn: {
    backgroundColor: '#1d3557', // Navy
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewTicketText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  ripLineContainer: {
    position: 'absolute',
    top: 150 - 10, // Image height - half circle
    left: 0,
    right: 0,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  ripCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f1faee', // Match screen background
    marginLeft: -10,
  },
  ripCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    marginRight: -10,
  },
  ripLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray600,
    lineHeight: 22,
    marginBottom: 24,
  },
  exploreBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
  },
  exploreBtnText: {
    color: COLORS.brandPurple,
    fontWeight: '600',
  },
});

export default MyTicketsScreen;
