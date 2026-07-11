import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface AuthInputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  error?: string;
  isValid?: boolean;
  rightAccessory?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  iconName,
  error,
  isValid,
  rightAccessory,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Border and background state styling
  let borderColor = colors.border;
  if (error) {
    borderColor = colors.error;
  } else if (isFocused) {
    borderColor = colors.primary;
  }

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text, fontSize: typography.fontSize.sm }]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: borderColor,
            borderRadius: borderRadius.md,
            borderWidth: isFocused || error ? 1.5 : 1,
          },
        ]}
      >
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={error ? colors.error : isFocused ? colors.primary : colors.textMuted}
            style={styles.icon}
          />
        )}
        
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.textInput,
            {
              color: colors.text,
              fontSize: typography.fontSize.md,
            },
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          {...rest}
        />

        {rightAccessory}

        {/* Validation indicators */}
        {error && (
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color={colors.error}
            style={styles.rightIcon}
          />
        )}
        
        {!error && isValid && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={colors.success}
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error, fontSize: typography.fontSize.xs }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontWeight: '500',
  },
});
export default AuthInput;
