export const COLORS = {
  brandDark: '#10002b',
  brandPurple: '#7b2cbf',
  brandPurpleHover: '#6a25a4',
  inputBorder: '#2d1b4d',
  white: '#ffffff',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  white10: 'rgba(255, 255, 255, 0.1)',
  white05: 'rgba(255, 255, 255, 0.05)',
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
