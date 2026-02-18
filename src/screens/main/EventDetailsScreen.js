import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Share, Heart, Calendar, Clock, MapPin, ChevronRight, Briefcase, Utensils, ArrowRight } from 'lucide-react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { EVENT_DETAILS } from '../../constants/mocks';

const EventDetailsScreen = ({ navigation }) => {
  const event = EVENT_DETAILS; // Using mock data for single event

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Immersive Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.gradientTop} />
          <View style={styles.gradientBottom} />
          
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <ChevronLeft size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Share size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          <View style={styles.tagsRow}>
            {event.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[
                  styles.tag, 
                  index === 1 ? styles.tagSellingFast : styles.tagDefault
                ]}
              >
                <Text 
                  style={[
                    styles.tagText,
                    index === 1 ? styles.tagTextSellingFast : styles.tagTextDefault
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconBox}>
                <Calendar size={20} color={COLORS.brandPurple} />
              </View>
              <View>
                <Text style={styles.infoLabel}>DATE</Text>
                <Text style={styles.infoValue}>{event.date}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoIconBox}>
                <Clock size={20} color={COLORS.brandPurple} />
              </View>
              <View>
                <Text style={styles.infoLabel}>TIME</Text>
                <Text style={styles.infoValue}>{event.time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MapPin size={20} color="rgba(159, 67, 234, 0.8)" />
              <Text style={styles.sectionTitle}>Stadium Info</Text>
            </View>
            <Text style={styles.description}>{event.description}</Text>

            <View style={styles.mapThumbnail}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAzR0Ruy7cFi--xT7VeobBs5dR1nYNL3guqfz7lH2J4fqovKJLH14axCX7BQ8P6fJArq_349ihuJB9UyCp9QrRw12AfY8tDxaKPpeG7IoAheTkWngn4p5qs_j5fvZbs8tW5CxArWm1e1YCH0KoeNfyIIJdbyOw_u_YQG0uzzmv114EYk66BjSfeVkSMS30QutpheGbqV-WOnp3s7mkzp13V_gicElgWJh7MYoz1y7aFfYSCkZ34YU-Qdsc4M8xjf4DebLW0tjyrZI' }} 
                style={styles.mapImage} 
              />
              <View style={styles.mapOverlay}>
                <View style={styles.directionsButton}>
                  <MapPin size={14} color={COLORS.white} />
                  <Text style={styles.directionsText}>GET DIRECTIONS</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.menuLinks}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Briefcase size={20} color="rgba(159, 67, 234, 0.8)" />
                <Text style={styles.menuItemText}>Bag Policy</Text>
              </View>
              <ChevronRight size={20} color={COLORS.gray400} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Utensils size={20} color="rgba(159, 67, 234, 0.8)" />
                <Text style={styles.menuItemText}>Food & Drinks</Text>
              </View>
              <ChevronRight size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Padding for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.startFromText}>STARTING FROM</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{event.price}</Text>
              <Text style={styles.perPerson}>/person</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.selectSeatsButton}
            onPress={() => navigation.navigate('SelectSeats')}
          >
            <Text style={styles.selectSeatsText}>Select Seats</Text>
            <ArrowRight size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6f8', // Using light bg as per design, then dark content if needed, but HTML has .dark class on Html, and body bg-background-light dark:bg-background-dark.
    // Let's stick to dark theme consistent with other pages
    backgroundColor: '#1a1121',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0.4)', // Simplified gradient
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(26, 17, 33, 0)', // Gradient handled by View styles if using LinearGradient, keeping simple here
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(12px)', // Note: backdropFilter not supported in RN directly
  },
  contentCard: {
    marginTop: -64,
    backgroundColor: '#1a1121', // background-dark
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagDefault: {
    backgroundColor: 'rgba(159, 67, 234, 0.2)',
  },
  tagSellingFast: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tagTextDefault: {
    color: '#9f43ea',
  },
  tagTextSellingFast: {
    color: '#10b981',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 24,
    lineHeight: 34,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(159, 67, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.gray400,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white10,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray300,
    lineHeight: 22,
    marginBottom: 24,
  },
  mapThumbnail: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  directionsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  menuLinks: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 17, 33, 0.9)',
    borderTopWidth: 1,
    borderTopColor: COLORS.white10,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32, // Safe area padding
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  startFromText: {
    fontSize: 10,
    color: COLORS.gray400,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9f43ea',
  },
  perPerson: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  selectSeatsButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#9f43ea',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#9f43ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  selectSeatsText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default EventDetailsScreen;
