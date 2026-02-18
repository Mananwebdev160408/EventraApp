import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  ScrollView, Dimensions, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Plus, Edit2, Trash2, ShoppingBag, Search, Filter, MoreVertical, Coffee } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { STORE_ITEMS } from '../../constants/mocks';

const AdminStoreScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Merchandise'); // 'Merchandise' or 'Food'

  const MerchandiseCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity>
             <MoreVertical size={16} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardPrice}>${item.price}</Text>
        <Text style={styles.cardStock}>Stock: 120</Text>
        
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn}>
            <Edit2 size={14} color={COLORS.brandPurple} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn}>
            <Trash2 size={14} color={COLORS.error} />
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
          <Text style={styles.headerTitle}>Store Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Merchandise' && styles.activeTab]}
            onPress={() => setActiveTab('Merchandise')}
          >
            <ShoppingBag size={16} color={activeTab === 'Merchandise' ? COLORS.brandPurple : COLORS.gray500} />
            <Text style={[styles.tabText, activeTab === 'Merchandise' && styles.activeTabText]}>Merchandise</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Food' && styles.activeTab]}
            onPress={() => setActiveTab('Food')}
          >
            <Coffee size={16} color={activeTab === 'Food' ? COLORS.brandPurple : COLORS.gray500} />
            <Text style={[styles.tabText, activeTab === 'Food' && styles.activeTabText]}>Food & Beverage</Text>
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
           <View style={styles.searchBar}>
             <Search size={20} color={COLORS.gray400} />
             <Text style={styles.searchPlaceholder}>Search items...</Text>
           </View>
           <TouchableOpacity style={styles.filterBtn}>
             <Filter size={20} color={COLORS.text} />
           </TouchableOpacity>
        </View>

        {/* Content List */}
        <FlatList
          data={STORE_ITEMS} // Using same mock data for now, ideally would separate or filter
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MerchandiseCard item={item} />}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
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
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    borderColor: COLORS.brandPurple,
    backgroundColor: 'rgba(123, 44, 191, 0.05)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray500,
  },
  activeTabText: {
    color: COLORS.brandPurple,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchPlaceholder: {
    color: COLORS.gray400,
    fontSize: 14,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.gray100,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brandPurple,
    marginBottom: 4,
  },
  cardStock: {
    fontSize: 12,
    color: COLORS.gray500,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    backgroundColor: 'rgba(123, 44, 191, 0.05)',
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brandPurple,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 8,
  },
});

export default AdminStoreScreen;
