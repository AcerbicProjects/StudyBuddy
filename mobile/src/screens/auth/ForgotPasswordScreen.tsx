import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from './SplashScreen';

// Import Reusable Components
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import LoadingButton from '../../components/auth/LoadingButton';
import ThemeToggle from '../../components/auth/ThemeToggle';
import ErrorSnackbar from '../../components/auth/ErrorSnackbar';

export const ForgotPasswordScreen = () => {
  const { colors, spacing, borderRadius, typography, shadows } = useTheme();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  // Form State
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Flow States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Snackbar Alert States
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'error' | 'success'>('error');

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email is required');
      setIsEmailValid(false);
    } else if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
    } else {
      setEmailError('');
      setIsEmailValid(true);
    }
  };

  const handleSendLink = () => {
    validateEmail(email);

    if (!isEmailValid || !email) {
      setSnackbarType('error');
      setSnackbarMessage('Please enter a valid email address first.');
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);

    // Simulate Reset link trigger API
    setTimeout(() => {
      setIsLoading(false);

      if (email.toLowerCase() === 'error@studybuddy.com') {
        setSnackbarType('error');
        setSnackbarMessage('This email address is not registered in our system.');
        setSnackbarVisible(true);
      } else {
        setIsSubmitted(true);
      }
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.themeToggleWrapper}>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {!isSubmitted ? (
          <>
            <AuthHeader
              title="Reset Password"
              subtitle="Enter your email to receive a password recovery link"
              onBackPress={() => navigation.navigate('Login')}
            />

            <View style={styles.formContainer}>
              <AuthInput
                label="Email Address"
                placeholder="e.g. student@university.edu"
                value={email}
                onChangeText={validateEmail}
                error={emailError}
                isValid={isEmailValid}
                iconName="email-outline"
                keyboardType="email-address"
              />

              <LoadingButton
                title="Send Reset Link"
                onPress={handleSendLink}
                isLoading={isLoading}
                style={styles.submitButton}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.backLink}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="arrow-left" size={16} color={colors.primary} style={styles.backIcon} />
                <Text style={[styles.backLinkText, { color: colors.primary, fontSize: typography.fontSize.sm }]}>
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <View style={[styles.successCard, shadows, { backgroundColor: colors.card, borderRadius: borderRadius.xl }]}>
              {/* Success Badge */}
              <View style={[styles.successIconWrapper, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                <MaterialCommunityIcons name="email-check-outline" size={48} color={colors.success} />
              </View>

              <Text style={[styles.successTitle, { color: colors.text, fontSize: typography.fontSize.xl }]}>
                Reset Link Sent!
              </Text>
              
              <Text style={[styles.successDescription, { color: colors.textMuted, fontSize: typography.fontSize.md }]}>
                We've sent a recovery email to{' '}
                <Text style={{ fontWeight: '700', color: colors.text }}>{email}</Text>.
                Please click the link inside to set up a new password.
              </Text>

              <LoadingButton
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                isLoading={false}
                style={styles.cardButton}
              />

              <TouchableOpacity
                onPress={() => setIsSubmitted(false)}
                style={styles.resendContainer}
                activeOpacity={0.7}
              >
                <Text style={[styles.resendText, { color: colors.textMuted, fontSize: typography.fontSize.sm }]}>
                  Didn't receive email?{' '}
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>Try again</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Snackbar Alert */}
      <ErrorSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggleWrapper: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    flexGrow: 1,
  },
  formContainer: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  backIcon: {
    marginRight: 6,
  },
  backLinkText: {
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  successCard: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  successIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  cardButton: {
    width: '100%',
  },
  resendContainer: {
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    fontWeight: '500',
  },
});
export default ForgotPasswordScreen;
