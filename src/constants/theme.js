  export const COLORS = {
  background: '#f1faee',
  text: '#1d3557',
  card: '#ffffff',
  border: 'rgba(29, 53, 87, 0.1)',
  success: '#10b981',
  error: '#ef4444',
  brandDark: '#1d3557', // Prussian Blue
  brandPurple: '#e63946', // Imperial Red (Primary)
  brandPurpleHover: '#c1303b', // Darker Red
  inputBorder: '#457b9d', // Celadon Blue
  secondary: '#a8dadc', // Powder Blue
  surface: '#f1faee', // Honeydew
  white: '#ffffff',
  gray300: '#9ca3af', // Darker for light mode visibility
  gray400: '#6b7280', // Darker for light mode visibility
  gray500: '#4b5563', // Darker for light mode visibility
  gray600: '#374151',
  white10: 'rgba(29, 53, 87, 0.1)', // Redirecting to dark alpha for light mode compatibility
  white05: 'rgba(29, 53, 87, 0.05)',
  transparent: 'transparent',
};

export const FONTS = {
  // Mapping to system fonts for now as custom fonts require loading
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System',
};

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const SIZES = {
  padding: 20,
  radius: 12,
  width,
  height,
};
