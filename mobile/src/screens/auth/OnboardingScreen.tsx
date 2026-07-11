import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList } from './SplashScreen';
import ThemeToggle from '../../components/auth/ThemeToggle';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  illustration: () => React.ReactNode;
}

export const OnboardingScreen = () => {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Custom visual components for illustrations to look premium
  const renderDocumentIllustration = () => (
    <View style={styles.illustrationWrapper}>
      <View style={[styles.illBackground, { backgroundColor: 'rgba(79, 70, 229, 0.1)' }]} />
      {/* Visual metaphor: document stack with upload arrow */}
      <View style={[styles.docCard, styles.docCardBack]} />
      <View style={[styles.docCard, styles.docCardMid]} />
      <View style={[styles.docCard, styles.docCardFront, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="file-document-outline" size={44} color="#4F46E5" />
        <View style={[styles.uploadCircle, { backgroundColor: '#8B5CF6' }]}>
          <MaterialCommunityIcons name="arrow-up" size={18} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );

  const renderAIIllustration = () => (
    <View style={styles.illustrationWrapper}>
      <View style={[styles.illBackground, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]} />
      {/* Visual metaphor: glowing AI core with sparkles and chips */}
      <View style={[styles.aiCoreGlow, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]} />
      <View style={[styles.aiCore, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MaterialCommunityIcons name="brain" size={48} color="#8B5CF6" />
      </View>
      <View style={[styles.sparkleItem, styles.sparkleLeft]}>
        <MaterialCommunityIcons name={"sparkles" as any} size={20} color="#22C55E" />
      </View>
      <View style={[styles.sparkleItem, styles.sparkleRight]}>
        <MaterialCommunityIcons name="lightning-bolt" size={20} color="#F59E0B" />
      </View>
    </View>
  );

  const renderProgressIllustration = () => (
    <View style={styles.illustrationWrapper}>
      <View style={[styles.illBackground, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]} />
      {/* Visual metaphor: stats graph and checklist */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statsBarRow}>
          <View style={[styles.statsBar, { height: 30, backgroundColor: '#E2E8F0' }]} />
          <View style={[styles.statsBar, { height: 50, backgroundColor: '#8B5CF6' }]} />
          <View style={[styles.statsBar, { height: 75, backgroundColor: '#22C55E' }]} />
          <View style={[styles.statsBar, { height: 60, backgroundColor: '#4F46E5' }]} />
        </View>
        <View style={styles.statsMarker}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#22C55E" />
        </View>
      </View>
    </View>
  );

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Study Smarter',
      description: 'Upload notes, PDFs and lecture slides effortlessly.',
      icon: 'file-document-outline',
      color: '#4F46E5',
      illustration: renderDocumentIllustration,
    },
    {
      id: 2,
      title: 'Learn with AI',
      description: 'Generate summaries, quizzes, flashcards and viva questions instantly.',
      icon: 'brain',
      color: '#8B5CF6',
      illustration: renderAIIllustration,
    },
    {
      id: 3,
      title: 'Track Your Progress',
      description: 'Monitor weak topics and get personalized revision reminders.',
      icon: 'trending-up',
      color: '#22C55E',
      illustration: renderProgressIllustration,
    },
  ];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  // Indicators mapping
  const renderDots = () => {
    return (
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          const backgroundColor = scrollX.interpolate({
            inputRange,
            outputRange: [colors.textMuted, '#8B5CF6', colors.textMuted],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header controls: Theme toggle */}
      <View style={styles.header}>
        <ThemeToggle />
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slideWidth}>
            <View style={styles.slideContainer}>
              {/* Premium abstract illustration */}
              {slide.illustration()}

              {/* Text content */}
              <View style={styles.textWrapper}>
                <Text style={[styles.title, { color: colors.text, fontSize: typography.fontSize.xl }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.description, { color: colors.textMuted, fontSize: typography.fontSize.md }]}>
                  {slide.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={[styles.footer, { paddingBottom: spacing.xl }]}>
        {renderDots()}

        <View style={styles.buttonContainer}>
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={[styles.skipText, { color: colors.textMuted, fontSize: typography.fontSize.md }]}>
                  Skip
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.nextButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
              >
                <Text style={[styles.nextText, { fontSize: typography.fontSize.md }]}>
                  Next
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleGetStarted}
              style={[styles.getStartedButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
            >
              <Text style={[styles.getStartedText, { fontSize: typography.fontSize.md }]}>
                Get Started
              </Text>
              <MaterialCommunityIcons name="rocket-launch" size={20} color="#FFFFFF" style={styles.rocketIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 50,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  slideWidth: {
    width: width,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationWrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  illBackground: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  docCard: {
    position: 'absolute',
    width: 100,
    height: 140,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  docCardBack: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
    transform: [{ rotate: '-12deg' }, { translateX: -15 }],
    opacity: 0.5,
  },
  docCardMid: {
    backgroundColor: '#EEF2F6',
    borderColor: '#E2E8F0',
    transform: [{ rotate: '-6deg' }, { translateX: -5 }],
    opacity: 0.8,
  },
  docCardFront: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  uploadCircle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  aiCoreGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  aiCore: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  sparkleItem: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sparkleLeft: {
    top: 30,
    left: 20,
  },
  sparkleRight: {
    bottom: 30,
    right: 20,
  },
  statsCard: {
    width: 160,
    height: 120,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statsBarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  statsBar: {
    width: 18,
    borderRadius: 4,
  },
  statsMarker: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    height: 10,
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 54,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipText: {
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 24,
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  nextText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  rocketIcon: {
    marginLeft: 4,
  },
});
export default OnboardingScreen;
