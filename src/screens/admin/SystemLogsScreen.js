import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, RefreshCw, Share, Search, Calendar, User, Fingerprint, Router, Globe, Key, AlertCircle, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: "#137fec",
  backgroundLight: "#f6f7f8",
  backgroundDark: "#101922", // Not used as requested strictly light mode
  white: "#ffffff",
  slate900: "#0f172a",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  success: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  cyanLight: "#a8dadc",
  navy: "#1d3557",
  navySurface: "#1d3557",
};

const LOG_DATA = [
  {
    id: '1',
    title: 'Security Breach Attempt',
    type: 'Critical',
    user: 'System / Automated',
    time: 'Today, 10:45 AM',
    ip: '185.22.41.102',
    icon: <ShieldAlert size={18} color={COLORS.slate500} />,
    color: COLORS.critical,
    bgShadow: 'rgba(239,68,68,0.6)',
  },
  {
    id: '2',
    title: 'Seat Map Uploaded',
    type: 'Success',
    user: 'Marcus Admin',
    time: 'Today, 09:22 AM',
    ip: '192.168.1.12',
    icon: <User size={18} color={COLORS.slate500} />,
    color: COLORS.success,
  },
  {
    id: '3',
    title: 'Event Schedule Conflict',
    type: 'Warning',
    user: 'Sarah Jenkins',
    time: 'Yesterday, 11:59 PM',
    ip: '104.22.1.88',
    icon: <User size={18} color={COLORS.slate500} />,
    color: COLORS.warning,
  },
  {
    id: '4',
    title: 'New Event Created',
    type: 'Success',
    user: 'Admin Root',
    time: 'Yesterday, 04:30 PM',
    ip: '192.168.1.1',
    icon: <User size={18} color={COLORS.slate500} />,
    color: COLORS.success,
  },
  {
    id: '5',
    title: 'Ticket Pool Adjusted',
    type: 'Success',
    user: 'Sarah Jenkins',
    time: 'Oct 12, 10:15 AM',
    ip: '104.22.1.88',
    icon: <User size={18} color={COLORS.slate500} />,
    color: COLORS.success,
    opacity: 0.8,
  },
];

const SystemLogsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All Severities');

  const renderLogItem = ({ item }) => (
    <View style={[styles.card, item.opacity && { opacity: item.opacity }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.statusDot, { backgroundColor: item.color }, item.bgShadow && { shadowColor: item.color, elevation: 5 }]} />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${item.color}1A` }]}>
          <Text style={[styles.badgeText, { color: item.color }]}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.userRow}>
            {item.icon}
            <Text style={styles.userName}>{item.user}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.ipRow}>
            <Router size={18} color={COLORS.slate400} />
            <Text style={styles.ipText}>IP: {item.ip}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.detailsButton}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ChevronLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>System Logs</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <RefreshCw size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Share size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.slate400} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search Admin or Action..."
              placeholderTextColor={COLORS.slate400}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity style={[styles.filterChip, styles.activeChip]}>
              <Text style={styles.activeChipText}>All Severities</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterChip}>
              <View style={[styles.filterDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.chipText}>Success</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterChip}>
              <View style={[styles.filterDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.chipText}>Warning</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.filterChip}>
              <View style={[styles.filterDot, { backgroundColor: COLORS.critical }]} />
              <Text style={styles.chipText}>Critical</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterChip}>
              <Calendar size={16} color={COLORS.slate900} />
              <Text style={[styles.chipText, { marginLeft: 4 }]}>Oct 2023</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Logs List */}
        <FlatList
          data={LOG_DATA}
          keyExtractor={item => item.id}
          renderItem={renderLogItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Showing {LOG_DATA.length} of 1,240 entries</Text>
            </View>
          )}
        />

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f080', // Slate 200 with opacity
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.slate900,
  },
  filterContainer: {
    paddingVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f080',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.slate900,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.slate900,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.slate600,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.slate400,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
  },
  ipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ipText: {
    fontSize: 12,
    color: COLORS.slate500,
  },
  detailsButton: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.slate500,
  },
});

export default SystemLogsScreen;
