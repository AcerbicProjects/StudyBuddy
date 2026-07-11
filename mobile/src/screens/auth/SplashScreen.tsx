import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import Logo from '../../components/auth/Logo';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export const SplashScreen = () => {
  const { colors, typography, spacing } = useTheme();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Fade and slide tagline and loading indicator in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition to Onboarding after 2.8 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <LinearGradient
      colors={[colors.background, colors.background === '#0F172A' ? '#1E1B4B' : '#EEF2F6']} // Subtle blending gradient
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Animated StudyBuddy Logo */}
        <Logo size="large" animated={true} />
        
        {/* Tagline and spinner container */}
        <Animated.View 
          style={[
            styles.animatedTextContainer, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={[styles.tagline, { color: colors.textMuted, fontSize: typography.fontSize.md }]}>
            "Transform Your Notes Into Knowledge"
          </Text>
          
          <ActivityIndicator 
            size="small" 
            color="#8B5CF6" 
            style={[styles.loader, { marginTop: spacing.xl }]} 
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  animatedTextContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  tagline: {
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loader: {
    transform: [{ scale: 1.2 }],
  },
});
export default SplashScreen;
