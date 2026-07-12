import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import { AIStackParamList } from '../types/ai';
import ChatScreen from '../screens/ai/ChatScreen';
import SummaryScreen from '../screens/ai/SummaryScreen';
import FlashcardsScreen from '../screens/ai/FlashcardsScreen';
import QuizScreen from '../screens/ai/QuizScreen';
import QuizResultScreen from '../screens/ai/QuizResultScreen';
import VivaScreen from '../screens/ai/VivaScreen';

// AI Learning Module navigator (Person 3).
// Self-contained for Week 1 — NOT yet wired into the app's root navigation.
// Integration into MainTabScreen/AuthNavigator is a separate, agreed-upon step
// in a later week so this module never touches other members' files.

const Stack = createNativeStackNavigator<AIStackParamList>();

type Tool = {
    route: keyof AIStackParamList;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
};

const TOOLS: Tool[] = [
    { route: 'Chat', title: 'AI Chat', subtitle: 'Ask questions about your notes', icon: 'chat-processing-outline', color: '#4F46E5' },
    { route: 'Summary', title: 'Smart Summary', subtitle: 'Key concepts at a glance', icon: 'text-box-check-outline', color: '#8B5CF6' },
    { route: 'Flashcards', title: 'Flashcards', subtitle: 'Active recall practice', icon: 'cards-outline', color: '#06B6D4' },
    { route: 'Quiz', title: 'AI Quiz', subtitle: 'Test yourself before exams', icon: 'head-question-outline', color: '#F59E0B' },
    { route: 'Viva', title: 'Viva Prep', subtitle: 'Practice for oral exams', icon: 'microphone-variant', color: '#22C55E' },
];

// Entry hub for the AI tools generated from a document. Also doubles as the
// isolated test launcher during Week 1.
const AIHomeScreen: React.FC = () => {
    const { colors, borderRadius, typography, shadows } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NativeStackNavigationProp<AIStackParamList>>();

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
            >
                <View style={styles.hero}>
                    <View style={[styles.heroIcon, { backgroundColor: `${colors.primary}1A` }]}>
                        <MaterialCommunityIcons name="brain" size={30} color={colors.primary} />
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.text, fontSize: typography.fontSize.xl }]}>
                        AI Study Tools
                    </Text>
                    <Text style={[styles.heroSub, { color: colors.textMuted }]}>
                        Generated from Physics Notes Chapter 4
                    </Text>
                </View>

                {TOOLS.map((tool) => (
                    <TouchableOpacity
                        key={tool.route}
                        style={[
                            styles.toolCard,
                            shadows,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                borderRadius: borderRadius.xl,
                            },
                        ]}
                        onPress={() => navigation.navigate(tool.route as any)}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${tool.title}`}
                    >
                        <View style={[styles.toolIcon, { backgroundColor: `${tool.color}1A` }]}>
                            <MaterialCommunityIcons name={tool.icon as any} size={24} color={tool.color} />
                        </View>
                        <View style={styles.toolText}>
                            <Text style={[styles.toolTitle, { color: colors.text, fontSize: typography.fontSize.md }]}>
                                {tool.title}
                            </Text>
                            <Text style={[styles.toolSub, { color: colors.textMuted }]}>{tool.subtitle}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export const AINavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="AIHome"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="AIHome" component={AIHomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Summary" component={SummaryScreen} />
            <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="QuizResult" component={QuizResultScreen} />
            <Stack.Screen name="Viva" component={VivaScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hero: {
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 22,
    },
    heroIcon: {
        width: 60,
        height: 60,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontWeight: '800',
    },
    heroSub: {
        fontSize: 13,
        marginTop: 4,
    },
    toolCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        gap: 14,
    },
    toolIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolText: {
        flex: 1,
    },
    toolTitle: {
        fontWeight: '700',
    },
    toolSub: {
        fontSize: 12,
        marginTop: 2,
    },
});

export default AINavigator;
