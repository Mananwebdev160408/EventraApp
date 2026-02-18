import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const Input = ({ label, placeholder, secureTextEntry, value, onChangeText, containerStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray600}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.gray300,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.white05,
    borderWidth: 1,
    borderColor: COLORS.white10,
    borderRadius: 0, // Design shows sharp edges or slightly rounded? HTML says rounded-none so 0.
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default Input;
