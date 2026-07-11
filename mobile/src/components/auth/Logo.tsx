import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../constants/theme';

// We import MaterialCommunityIcons from expo vector icons
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'large';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'small', animated = true }) => {
  const { colors, typography, spacing } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated, pulseAnim]);

  const isLarge = size === 'large';
  const iconSize = isLarge ? 64 : 32;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          {/* Graduation cap and lightbulb/sparkle metaphor */}
          <MaterialCommunityIcons 
            name="school-outline" 
            size={iconSize} 
            color="#4F46E5" 
          />
          <View style={styles.sparklePosition}>
            <MaterialCommunityIcons 
              name={"sparkles" as any} 
              size={iconSize * 0.4} 
              color="#8B5CF6" 
            />
          </View>
        </View>
      </Animated.View>
      
      <Text style={[
        styles.title, 
        { 
          color: colors.text, 
          fontSize: isLarge ? typography.fontSize.h1 : typography.fontSize.xl,
          marginTop: isLarge ? spacing.md : spacing.sm 
        }
      ]}>
        Study<Text style={{ color: '#8B5CF6' }}>Buddy</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 'auto',
    height: 'auto',
    padding: 16,
    borderRadius: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sparklePosition: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
export default Logo;
