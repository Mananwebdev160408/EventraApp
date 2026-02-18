import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ShoppingBag, Search, Star, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { FOOD_VENDORS } from '../../constants/mocks';

const FoodOrderingScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const categories = ['All Items', 'Snacks', 'Drinks', 'Meals', 'Desserts'];

  const renderVendor = ({ item }) => (
    <View style={styles.vendorCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.vendorImage} resizeMode="cover" />
        <View style={styles.overlay} />
        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Star size={12} color="#facc15" fill="#facc15" />
            <Text style={styles.badgeText}>{item.rating}</Text>
          </View>
          <View style={styles.badge}>
            <Clock size={12} color={COLORS.white} />
            <Text style={styles.badgeText}>{item.time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.vendorInfo}>
        <View style={{flex: 1}}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <Text style={styles.vendorDesc}>{item.description}</Text>
        </View>
        <TouchableOpacity style={styles.viewMenuButton}>
          <Text style={styles.viewMenuText}>View Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={20} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Food & Drinks</Text>
          <View>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
              <ShoppingBag size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={20} color="rgba(159, 67, 234, 0.6)" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search vendors or menu items..." 
              placeholderTextColor="rgba(159, 67, 234, 0.4)"
              style={styles.searchInput}
            />
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <FlatList 
              horizontal
              data={categories}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.categoryChip, 
                    activeCategory === item && styles.categoryChipActive
                  ]}
                  onPress={() => setActiveCategory(item)}
                >
                  <Text 
                    style={[
                      styles.categoryText, 
                      activeCategory === item && styles.categoryTextActive
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.categoryList}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Banner */}
          <View style={styles.banner}>
             <Image 
               source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmH2K0hrsOfz81y1Ywtei0NbmHMhzYJUFbsewUaB5rFT-Hc4MUUNWej68r0_97l-mtKkjvasf5EDveil_RBwU0bYF6ZgxlXxODFMziaO8NrV_hEzEJtvmzCVTgByGWezNw7-Q5Uo574wpGneyf6gzZjrm3Z_k371jO8fIA4mPgFCUKAgasEi7S2Jq83z9MDzAgjAAYrfQqSiNgOBsmA1C6XJwNNQTeenxd0SwhsYq0ji9mZDW1eQvkl0FAqiTe8Bp4TNv3zYKCSDQ' }}
               style={styles.bannerImage}
               resizeMode="cover"
             />
             <View style={styles.bannerOverlay} />
             <View style={styles.bannerContent}>
               <Text style={styles.bannerTag}>MATCH DAY SPECIAL</Text>
               <Text style={styles.bannerTitle}>20% Off All{'\n'}Family Platters</Text>
             </View>
          </View>

          {/* Popular Vendors */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Vendors</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vendorsList}>
            {FOOD_VENDORS.map(vendor => (
              <View key={vendor.id}>
                {renderVendor({ item: vendor })}
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
    backgroundColor: '#240046', // stadium-purple
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(36, 0, 70, 0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(159, 67, 234, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandPurple,
    borderWidth: 2,
    borderColor: '#240046',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(159, 67, 234, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  categoriesContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  categoryList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(159, 67, 234, 0.2)',
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    color: '#e9d5ff', // primary-200
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  banner: {
    height: 128,
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'linear-gradient(to right, #9e4fde, transparent)', // Simplified for RN: just background color with opacity or gradient component required. Using semi-transparent fill for now.
    backgroundColor: 'rgba(158, 79, 222, 0.6)', 
  },
  bannerContent: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  seeAllText: {
    color: COLORS.brandPurple,
    fontSize: 14,
    fontWeight: '600',
  },
  vendorsList: {
    paddingHorizontal: 24,
    gap: 24,
  },
  vendorCard: {
    backgroundColor: 'rgba(159, 67, 234, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(159, 67, 234, 0.1)',
  },
  imageContainer: {
    height: 192,
    position: 'relative',
  },
  vendorImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(158, 79, 222, 0.1)',
    backdropFilter: 'blur(12px)', // Note: backdropFilter not supported in RN
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    // RN workaround for blur
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  vendorInfo: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  vendorDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  viewMenuButton: {
    backgroundColor: COLORS.brandPurple,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  viewMenuText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default FoodOrderingScreen;
