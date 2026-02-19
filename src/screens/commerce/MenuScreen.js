import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ShoppingCart, MapPin, Plus, ShoppingBag } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const VENDOR_COLORS = {
  primary: "#e73642",
  backgroundLight: "#f1faee",
  navy: "#1d3557",
  tealLight: "#a8dadc",
  blueMuted: "#457b9d",
  white: "#ffffff",
  slate100: "#f1f5f9",
};

const CATEGORIES = ['Burgers', 'Drinks', 'Snacks', 'Combos'];

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Classic Stadium Burger',
    description: 'Angus beef, cheddar, house sauce, brioche bun.',
    price: '$12.50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvimNeSVgm13vetW_W70g9it1n7T338eeCEPV1qCfxASl9eHNLsAaipVIfqLsY2tcnHmpJFCJYWNa-tAPc1rM32_YxAbVeyJJNESgjPEovKm1LSl-EtOzF273Wo4DVI3QXObPB_bAD6_WxIeMRYnpuN646AANWsbyk6IZZDjtGanrhGf1iU92gaVLhiksed_W3iT2Irj9ff9r2bsRh4KmSX6pHDdZeBB6axIs46MViUZ8g5mxkW75A9ixZrIQn0tuAt4BokIoFYVU',
    category: 'Burgers'
  },
  {
    id: '2',
    name: 'Double Meat Master',
    description: 'Two patties, double cheese, caramelized onions.',
    price: '$15.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvOW409INJPw_uljKOXUM-kW1b687zuBGFy0LKtstn7YyIOI2l-tcpB5OavECkaDt-tSNFYZnH2TfoAP9LdXC_qlE0B9G3D17bZXYiUep_vbTtv8D5lmO_8s-9JwZaqE-_98KtomurZt78OA0aU8qx1i56S1WZqe6Ux2mSX-YBCkEkU0kYT9PY2GaDqOhkq2okkt2FyrlZ9BI-E3NFJ09Wf77JwyU6f3HLbaYx9l6-Jqmw_xzO9RePWNfJ3sy6__nPTK2hGE015Ec',
    category: 'Burgers'
  },
  {
    id: '3',
    name: 'Bacon BBQ Special',
    description: 'Smoked bacon, spicy BBQ sauce, onion rings.',
    price: '$14.25',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGk0kkq6mutth_9ePs-Brht5L-HuoWSSdUPexyAqLM1f4zFW8qgf57SyBIZWQy8ChIxGI7qwBTSxcdZEsqvRrtY_Yx5LTL_aMNP_TH8f-TSiYPDZ0eMLjzSSyLndr2D38bnGyJCA7Zmw5VNEnCDvFteNBwbgmKW08Wi7LF1ORDbNR0mBqOJj0R6HO-EoZzzoi3dp4sH_Axgj-EznG8Xq-91kmJVwceEajqxtpdcrwjWe-qVAOsUsjBvSVyWEfBjrWwkbHCQ6mL3EU',
    category: 'Burgers'
  },
  {
    id: '4',
    name: 'Stadium Plant Burger',
    description: 'Plant-based patty, avocado, sprouts, vegan mayo.',
    price: '$13.50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6oS9ldkpuOrblCZ8JupCL1QkpNZ3DHd7gW743CDNxIywEyCy-cN2Yo3S1kPdRw4kXmA3pyzU3HRy77GyzMljkrSy26efsVbRSNAdLEIB_TqwjBnLWq5cF4cDmYkk5NL0zFC5T8JpHLhjeUH2tA4ojxfWJG0McQmfNCKRmcP2JOuXZbigjhPfCldK4jWkN4LkXwUALqHEgzfwdN2RaRSRMaeYlez7gnCEqlCkzdjP-X63BgHt70MxQBKqsjRv2wNWebjpJ2tg-kv4',
    category: 'Burgers'
  },
];

const MenuScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('Burgers');

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
        </View>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
        <Plus size={20} color={VENDOR_COLORS.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={VENDOR_COLORS.navy} />
          </TouchableOpacity>
          <View style={styles.cartContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
              <ShoppingCart size={24} color={VENDOR_COLORS.navy} />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
        </View>

        {/* Vendor Header */}
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>Grizzly Burgers</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={VENDOR_COLORS.blueMuted} />
            <Text style={styles.locationText}>Stadium Section 112 • Level 2</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isActive ? styles.categoryChipActive : styles.categoryChipInactive
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[
                      styles.categoryText, 
                      isActive ? styles.categoryTextActive : styles.categoryTextInactive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        {/* Menu Items */}
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={item => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        />

      </SafeAreaView>

      {/* Floating Bottom Bar */}
      <View style={styles.floatingBarContainer}>
        <LinearGradient
            colors={[VENDOR_COLORS.backgroundLight, VENDOR_COLORS.backgroundLight, 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientOverlay}
            pointerEvents="none"
        />
        <TouchableOpacity style={styles.viewCartButton} onPress={() => navigation.navigate('Cart')} activeOpacity={0.9}>
           <View style={styles.viewCartLeft}>
             <View style={styles.cartIconBox}>
                <ShoppingBag size={20} color={VENDOR_COLORS.white} />
             </View>
             <View>
                <Text style={styles.cartItemCount}>2 Items</Text>
                <Text style={styles.viewCartText}>View Cart</Text>
             </View>
           </View>
           <Text style={styles.cartTotal}>$27.50</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VENDOR_COLORS.backgroundLight,
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: VENDOR_COLORS.blueMuted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cartContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: VENDOR_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: VENDOR_COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  vendorHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  vendorName: {
    fontSize: 28, // text-3xl approx
    fontWeight: '700',
    color: VENDOR_COLORS.navy,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: VENDOR_COLORS.blueMuted,
  },
  categoriesWrapper: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: VENDOR_COLORS.navy,
  },
  categoryChipInactive: {
    backgroundColor: VENDOR_COLORS.tealLight,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: VENDOR_COLORS.white,
  },
  categoryTextInactive: {
    color: VENDOR_COLORS.navy,
  },
  menuList: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for floating bar
    paddingTop: 8,
    gap: 16,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VENDOR_COLORS.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: VENDOR_COLORS.tealLight,
    gap: 16,
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: VENDOR_COLORS.slate100,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 1,
    height: 96,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTextContainer: {
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: VENDOR_COLORS.navy,
    lineHeight: 20,
  },
  itemDesc: {
    fontSize: 12,
    color: VENDOR_COLORS.blueMuted,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: VENDOR_COLORS.navy,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: VENDOR_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
    top: -40,
  },
  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: VENDOR_COLORS.navy,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: VENDOR_COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  viewCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cartIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: VENDOR_COLORS.white,
  },
  cartTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: VENDOR_COLORS.white,
  },
});

export default MenuScreen;
