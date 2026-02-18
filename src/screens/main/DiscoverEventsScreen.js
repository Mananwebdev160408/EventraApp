import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bell, Search, SlidersHorizontal, MapPin, Calendar, Clock, Armchair, Eye, Utensils, ShoppingBag, LayoutGrid, List, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { USERS, FEATURED_EVENTS, UPCOMING_EVENTS } from '../../constants/mocks';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DiscoverEventsScreen = ({ navigation }) => {
  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredDisplay}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.featuredImage} resizeMode="cover" />
      <LinearGradient 
        colors={['transparent', 'rgba(29, 53, 87, 0.9)']} 
        style={styles.featuredOverlay} 
      />
      <View style={styles.featuredContent}>
        <View style={styles.featuredTagContainer}>
          <Text style={styles.featuredTagText}>{item.tag}</Text>
        </View>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <View style={styles.featuredMetaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color="rgba(255,255,255,0.7)" />
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
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.eventMetaRow}>
            <View style={styles.metaSubRow}>
                <Clock size={12} color="#457b9d" />
                <Text style={styles.eventMetaText}>{item.time}</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>Book Now</Text>
            <ChevronRight size={14} color="#1d3557" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: USERS.currentUser.avatar }} style={styles.avatar} />
                </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeText}>GOOD MORNING,</Text>
              <Text style={styles.userName}>{USERS.currentUser.name.split(' ')[0]}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#1d3557" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="rgba(29, 53, 87, 0.4)" />
              <TextInput 
                placeholder="Find matches, concerts, teams..." 
                placeholderTextColor="rgba(29, 53, 87, 0.4)"
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterButton}>
                <SlidersHorizontal size={18} color="#1d3557" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <QuickActionButton 
              icon={<Armchair size={24} />} 
              label="Seats" 
              onPress={() => navigation.navigate('EventDetails', { eventId: '1' })} 
            />
            <QuickActionButton 
              icon={<Utensils size={24} />} 
              label="Food" 
              onPress={() => navigation.navigate('FoodOrdering')} 
            />
            <QuickActionButton 
              icon={<ShoppingBag size={24} />} 
              label="Merch" 
              onPress={() => navigation.navigate('Store')} 
            />
            <QuickActionButton 
                icon={<Eye size={24} />} 
                label="Explore" 
                onPress={() => navigation.navigate('SelectSeats')} 
            />
          </View>

          {/* Featured Events */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Highlights</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={FEATURED_EVENTS}
            renderItem={renderFeaturedItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.featuredList}
            showsHorizontalScrollIndicator={false}
            snapToInterval={320 + 16}
            decelerationRate="fast"
          />

          {/* Upcoming Events */}
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>Upcoming Near You</Text>
            <TouchableOpacity>
                <LayoutGrid size={20} color="#1d3557" />
            </TouchableOpacity>
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
    </View>
  );
};

const QuickActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.actionButton}>
      {React.cloneElement(icon, { color: '#1d3557' })}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(29, 53, 87, 0.1)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  welcomeText: {
    fontSize: 10,
    color: '#457b9d',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  userName: {
    fontSize: 20,
    color: '#1d3557',
    fontWeight: '800',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(29, 53, 87, 0.1)',
    position: 'relative',
  },
  notifDot: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.error,
      borderWidth: 2,
      borderColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#1d3557',
    fontSize: 15,
    fontWeight: '600',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(29, 53, 87, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionItem: {
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(29, 53, 87, 0.05)',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d3557',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1d3557',
  },
  seeAllText: {
    fontSize: 11,
    color: '#457b9d',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  featuredDisplay: {
    width: 320,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  featuredTagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  featuredTagText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  upcomingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
  },
  gridItemWrapper: {
    width: (width - 48 - 16) / 2,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 10,
    shadowColor: '#1d3557',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  eventImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(29, 53, 87, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  eventInfo: {
      paddingHorizontal: 4,
      paddingBottom: 4,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1d3557',
    marginBottom: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaSubRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
  },
  eventMetaText: {
    fontSize: 12,
    color: 'rgba(29, 53, 87, 0.5)',
    fontWeight: '600',
  },
  viewDetailsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      backgroundColor: 'rgba(29, 53, 87, 0.05)',
      borderRadius: 12,
      gap: 4,
  },
  viewDetailsText: {
      fontSize: 13,
      fontWeight: '800',
      color: '#1d3557',
  },
});

export default DiscoverEventsScreen;
