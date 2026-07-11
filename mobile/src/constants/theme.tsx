import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const COLORS = {
  primary: '#4F46E5',
  secondary: '#8B5CF6',
  accent: '#22C55E',
  light: {
    primary: '#4F46E5',
    secondary: '#8B5CF6',
    accent: '#22C55E',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    inputBg: '#F1F5F9',
    error: '#EF4444',
    success: '#22C55E',
  },
  dark: {
    primary: '#4F46E5',
    secondary: '#8B5CF6',
    accent: '#22C55E',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
    inputBg: '#0F172A',
    error: '#EF4444',
    success: '#22C55E',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  light: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    h1: 36,
  },
};

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof COLORS.light;
  isDark: boolean;
  spacing: typeof SPACING;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS.light;
  typography: typeof TYPOGRAPHY;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    if (systemScheme === 'light' || systemScheme === 'dark') {
      setTheme(systemScheme);
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? COLORS.light : COLORS.dark;
  const shadows = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors,
        isDark,
        spacing: SPACING,
        borderRadius: BORDER_RADIUS,
        shadows,
        typography: TYPOGRAPHY,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
