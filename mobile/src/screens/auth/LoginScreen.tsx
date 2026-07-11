import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from './SplashScreen';

// Import Reusable Components
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import PasswordInput from '../../components/auth/PasswordInput';
import LoadingButton from '../../components/auth/LoadingButton';
import { SocialLoginButton, OutlinedButton } from '../../components/auth/PrimaryButton';
import ThemeToggle from '../../components/auth/ThemeToggle';
import ErrorSnackbar from '../../components/auth/ErrorSnackbar';
import Logo from '../../components/auth/Logo';

export const LoginScreen = () => {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
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

  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
      setIsPasswordValid(false);
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setIsPasswordValid(false);
    } else {
      setPasswordError('');
      setIsPasswordValid(true);
    }
  };

  const handleLogin = () => {
    // Validate fields before submitting
    validateEmail(email);
    validatePassword(password);

    if (!isEmailValid || !isPasswordValid || !email || !password) {
      setSnackbarType('error');
      setSnackbarMessage('Please correct the validation errors first.');
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Dynamic response for prototyping
      if (email.toLowerCase() === 'error@studybuddy.com') {
        setSnackbarType('error');
        setSnackbarMessage('Invalid email or password. Please try again.');
        setSnackbarVisible(true);
      } else {
        setSnackbarType('success');
        setSnackbarMessage('Successfully logged in! Welcome back.');
        setSnackbarVisible(true);
        // Clear inputs on success
        setEmail('');
        setPassword('');
        setIsEmailValid(false);
        setIsPasswordValid(false);
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
        <View style={styles.logoSection}>
          <Logo size="small" animated={false} />
        </View>

        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to resume notes synthesis and AI quizzes"
        />

        <View style={styles.formContainer}>
          {/* Email input */}
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

          {/* Password Input */}
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={validatePassword}
            error={passwordError}
            isValid={isPasswordValid}
          />

          {/* Remember Me and Forgot Password links */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setRememberMe(prev => !prev)}
              style={styles.checkboxContainer}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={rememberMe ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.checkboxLabel, { color: colors.text, fontSize: typography.fontSize.sm }]}>
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.forgotText, { color: colors.primary, fontSize: typography.fontSize.sm }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <LoadingButton
            title="Sign In"
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.submitButton}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textMuted, fontSize: typography.fontSize.xs }]}>
              OR
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Sign In */}
          <SocialLoginButton
            provider="google"
            onPress={() => {
              setSnackbarType('success');
              setSnackbarMessage('Google Sign-In UI requested.');
              setSnackbarVisible(true);
            }}
            style={styles.socialButton}
          />

          {/* Footer Navigation Link */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textMuted, fontSize: typography.fontSize.sm }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: colors.primary, fontSize: typography.fontSize.sm }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  logoSection: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontWeight: '500',
  },
  forgotText: {
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  socialButton: {
    marginBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontWeight: '500',
  },
  footerLink: {
    fontWeight: '700',
  },
});
export default LoginScreen;
