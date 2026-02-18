import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const Button = ({ title, onPress, variant = 'primary', isLoading, style, icon }) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPrimary ? styles.primary : styles.outline,
        style
      ]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.white} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, isPrimary ? styles.primaryText : styles.outlineText]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  primary: {
    backgroundColor: COLORS.brandPurple,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white10,
  },
  text: {
    fontSize: 14, // Matches text-sm in design
    fontWeight: '600',
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.white,
  },
});

export default Button;
