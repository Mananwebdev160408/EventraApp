import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, ShoppingBag, Bell, Plus, Heart } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { STORE_ITEMS } from '../../constants/mocks';

const StoreScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Jerseys', 'Caps', 'Accessories', 'Souvenirs'];

  const filteredItems = activeCategory === 'All' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === activeCategory);

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={14} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <View style={{flex: 1}}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color={COLORS.white} />
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
          <Text style={styles.headerTitle}>Stadium Store</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color={COLORS.brandPurple} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray400} style={styles.searchIcon} />
          <TextInput 
            placeholder="Search merchandise..." 
            placeholderTextColor={COLORS.gray500}
            style={styles.searchInput}
          />
        </View>

        {/* Categories */}
        <View>
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

        {/* Product Grid */}
        <FlatList 
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Cart Button */}
        <TouchableOpacity 
          style={styles.floatingCart}
          onPress={() => navigation.navigate('Cart')}
        >
          <ShoppingBag size={24} color={COLORS.white} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1220', // background-dark
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandPurple,
  },
  categoryText: {
    color: COLORS.gray300,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for floating button
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    maxWidth: '48%',
  },
  imageContainer: {
    aspectRatio: 0.8,
    backgroundColor: '#2d1b4d', // slate-800 equivalent
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    backdropFilter: 'blur(4px)',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brandPurple,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.brandPurple,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default StoreScreen;
