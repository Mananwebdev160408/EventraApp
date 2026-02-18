import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Heart, ShoppingBag, Star, Share2 } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import Button from '../../components/Button';

const ProductDetailsScreen = ({ navigation, route }) => {
  const { product } = route.params || {};
  const [selectedSize, setSelectedSize] = useState('M');
  
  const sizes = ['S', 'M', 'L', 'XL'];

  if (!product) {
     return (
        <View style={styles.container}>
           <Text>Product not found</Text>
           <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
     );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Share2 size={22} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Heart size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
             <Image 
               source={{ uri: product.image }}
               style={styles.productImage}
               resizeMode="contain"
             />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.price}>{product.price}</Text>
            </View>
            
            <View style={styles.ratingRow}>
               <Star size={16} color="#fbbf24" fill="#fbbf24" />
               <Text style={styles.ratingText}>{product.rating} ({product.reviews} reviews)</Text>
            </View>

            <Text style={styles.description}>
              {product.description || "No description available for this item."}
            </Text>

            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeContainer}>
              {sizes.map(size => (
                <TouchableOpacity 
                  key={size} 
                  style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Add to Cart"
            onPress={() => navigation.navigate('Cart')}
            icon={<ShoppingBag size={20} color={COLORS.white} />}
          />
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 350,
    width: '100%',
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  detailsContainer: {
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.brandPurple,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: COLORS.gray600,
    lineHeight: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  sizeButtonActive: {
    backgroundColor: COLORS.brandPurple,
    borderColor: COLORS.brandPurple,
  },
  sizeText: {
    fontWeight: '600',
    color: COLORS.text,
  },
  sizeTextActive: {
    color: COLORS.white,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default ProductDetailsScreen;
