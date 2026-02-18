import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Plus, Calendar, MapPin, Search, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { ADMIN_SCHEDULE_DATA } from '../../constants/mocks';

const AdminEventScheduleScreen = ({ navigation }) => {
  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('ManageEventDetails', { event: item })}>
      <View style={styles.eventHeader}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateMonth}>{item.date.split('-')[1]}</Text>
          <Text style={styles.dateDay}>{item.date.split('-')[2]}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.infoRow}>
            <Clock size={14} color={COLORS.gray600} />
            <Text style={styles.infoText}>{item.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={14} color={COLORS.gray600} />
            <Text style={styles.infoText}>{item.venue}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.statusBadge}>
           <View style={[styles.statusDot, { backgroundColor: item.status === 'Scheduled' ? COLORS.success : '#fbbf24' }]} />
           <Text style={[styles.statusText, { color: item.status === 'Scheduled' ? COLORS.success : '#fbbf24' }]}>
             {item.status}
           </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Schedule</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEvent')}>
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray600} />
          <TextInput 
            placeholder="Search events..." 
            placeholderTextColor={COLORS.gray600}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={ADMIN_SCHEDULE_DATA}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 24,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  eventCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  dateBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateMonth: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
  },
  eventInfo: {
    flex: 1,
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default AdminEventScheduleScreen;
