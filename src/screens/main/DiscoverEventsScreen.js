import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bell, Search, SlidersHorizontal, MapPin, Calendar, Clock, Armchair, Eye, Utensils, ShoppingBag, LayoutGrid, List } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { USERS, FEATURED_EVENTS, UPCOMING_EVENTS } from '../../constants/mocks';

const DiscoverEventsScreen = ({ navigation }) => {
  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredDisplay}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.featuredImage} resizeMode="cover" />
      <View style={styles.featuredOverlay} />
      <View style={styles.featuredContent}>
        <View style={styles.featuredTagContainer}>
          <Text style={styles.featuredTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <View style={styles.featuredMetaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={COLORS.gray400} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color={COLORS.gray400} />
            <Text style={styles.metaText}>{item.venue}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <View style={styles.eventImageContainer}>
        <Image source={{ uri: item.image }} style={styles.eventImage} resizeMode="cover" />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
      <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
      <View style={styles.eventMetaRow}>
        <Clock size={12} color={COLORS.brandPurple} />
        <Text style={styles.eventMetaText}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.remindButton}>
        <Text style={styles.remindButtonText}>Remind Me</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: USERS.currentUser.avatar }} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{USERS.currentUser.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color={COLORS.brandPurple} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.gray500} />
            <TextInput 
              placeholder="Search matches, concerts, teams..." 
              placeholderTextColor={COLORS.gray500}
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.filterButton}>
              <SlidersHorizontal size={16} color={COLORS.brandPurple} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          data={FEATURED_EVENTS}
          renderItem={renderFeaturedItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.featuredList}
          showsHorizontalScrollIndicator={false}
          snapToInterval={SIZES.width * 0.85 + 16}
          decelerationRate="fast"
        />

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButton 
            icon={<Armchair size={24} />} 
            label="Book Seats" 
            onPress={() => navigation.navigate('EventDetails', { eventId: '1' })} 
          />
          <QuickActionButton 
            icon={<Eye size={24} />} 
            label="Smart Seat" 
            onPress={() => navigation.navigate('SelectSeats')} 
          />
          <QuickActionButton 
            icon={<Utensils size={24} />} 
            label="Food Order" 
            onPress={() => navigation.navigate('FoodOrdering')} 
          />
          <QuickActionButton 
            icon={<ShoppingBag size={24} />} 
            label="Merch" 
            onPress={() => navigation.navigate('Store')} 
          />
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity style={styles.viewToggleButton}>
              <LayoutGrid size={16} color={COLORS.gray400} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewToggleButton}>
              <List size={16} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.upcomingGrid}>
          {UPCOMING_EVENTS.map(item => (
            <View key={item.id} style={styles.gridItemWrapper}>
              {renderUpcomingItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const QuickActionButton = ({ icon, label, onPress }) => (
  <View style={styles.actionItem}>
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {React.cloneElement(icon, { color: COLORS.brandPurple })}
    </TouchableOpacity>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandDark, // Using brandDark as background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 44, 191, 0.2)',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(123, 44, 191, 0.3)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 12,
    color: COLORS.gray400,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1220', // card-dark
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123, 44, 191, 0.2)',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1220',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.white,
    fontSize: 14,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(123, 44, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.brandPurple,
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  featuredDisplay: {
    width: 320,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1220',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', // React Native doesn't support this directly without LinearGradient, using solid background or View trick
  },
  featuredTagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
  },
  featuredTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.gray300,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(26, 18, 32, 0.7)',
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray400,
    textTransform: 'uppercase',
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1a1220',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  upcomingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
  },
  gridItemWrapper: {
    width: '47%', // roughly half minus gap
  },
  eventCard: {
    backgroundColor: '#1a1220',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  eventImageContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  eventMetaText: {
    fontSize: 11,
    color: COLORS.gray400,
  },
  remindButton: {
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'rgba(123, 44, 191, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  remindButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brandPurple,
    textTransform: 'uppercase',
  },
});

export default DiscoverEventsScreen;
