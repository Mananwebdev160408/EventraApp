import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  ScrollView, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Edit2, Download, Trash2, Users, DollarSign, Calendar, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';


const { width } = Dimensions.get('window');

const ManageEventDetailsScreen = ({ navigation, route }) => {
  const { event } = route.params;

  // Mock data for this specific event
  const eventStats = {
    totalSeats: 45000,
    sold: 38500,
    vipSold: 1200,
    vipTotal: 1500,
    standardSold: 25000,
    standardTotal: 30000,
    economySold: 12300,
    economyTotal: 13500,
    revenue: '$1.2M',
  };

  const categories = [
    { name: 'VIP', sold: eventStats.vipSold, total: eventStats.vipTotal, color: '#fbbf24' },
    { name: 'Standard', sold: eventStats.standardSold, total: eventStats.standardTotal, color: '#10b981' },
    { name: 'Economy', sold: eventStats.economySold, total: eventStats.economyTotal, color: '#3b82f6' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit2 size={20} color={COLORS.brandPurple} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
             <Text style={styles.eventTitle}>{event.title}</Text>
             <View style={styles.metaRow}>
               <View style={styles.metaItem}>
                 <Calendar size={16} color={COLORS.gray400} />
                 <Text style={styles.metaText}>{event.date}</Text>
               </View>
               <View style={styles.metaItem}>
                 <Clock size={16} color={COLORS.gray400} />
                 <Text style={styles.metaText}>{event.time}</Text>
               </View>
             </View>
             <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: event.status === 'Scheduled' ? COLORS.success : '#fbbf24' }]} />
                <Text style={[styles.statusText, { color: event.status === 'Scheduled' ? COLORS.success : '#fbbf24' }]}>
                  {event.status}
                </Text>
             </View>
          </View>

          <View style={styles.statsGrid}>
             <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Sold</Text>
                <Text style={styles.statValue}>{(eventStats.sold / eventStats.totalSeats * 100).toFixed(1)}%</Text>
                <Text style={styles.statSubtext}>{eventStats.sold} / {eventStats.totalSeats}</Text>
             </View>
             <View style={styles.statCard}>
                <Text style={styles.statLabel}>Revenue</Text>
                <Text style={[styles.statValue, { color: COLORS.success }]}>{eventStats.revenue}</Text>
                <Text style={styles.statSubtext}>+12% vs avg</Text>
             </View>
          </View>

          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.categoryList}>
            {categories.map((cat) => (
              <View key={cat.name} style={styles.categoryCard}>
                <View style={styles.catHeader}>
                   <View style={styles.catTitleRow}>
                     <View style={[styles.catColor, { backgroundColor: cat.color }]} />
                     <Text style={styles.catName}>{cat.name}</Text>
                   </View>
                   <Text style={styles.catPercent}>{Math.round(cat.sold / cat.total * 100)}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${cat.sold / cat.total * 100}%`, backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.catStats}>{cat.sold.toLocaleString()} sold of {cat.total.toLocaleString()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn}>
               <Download size={20} color={COLORS.text} />
               <Text style={styles.actionText}>Export Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { borderColor: COLORS.error }]}>
               <Trash2 size={20} color={COLORS.error} />
               <Text style={[styles.actionText, { color: COLORS.error }]}>Cancel Event</Text>
            </TouchableOpacity>
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
    borderColor: COLORS.border,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.brandPurple,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: 24,
    gap: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: COLORS.gray600,
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray600,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.brandPurple,
  },
  statSubtext: {
    fontSize: 12,
    color: COLORS.gray500,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  catTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  catName: {
    fontWeight: '600',
    color: COLORS.text,
  },
  catPercent: {
    fontWeight: '700',
    color: COLORS.text,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  catStats: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default ManageEventDetailsScreen;
