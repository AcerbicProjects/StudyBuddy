import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { documents as mockDocs } from '../../data/documents';

const { width, height } = Dimensions.get('window');

interface DocumentDetailScreenProps {
    documentId: string;
    onBackPress: () => void;
}

export const DocumentDetailScreen: React.FC<DocumentDetailScreenProps> = ({ documentId, onBackPress }) => {
    const { colors, typography, borderRadius, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // Find document from mock records
    const document = mockDocs.find((doc) => doc.id === documentId) || mockDocs[0]!;

    // AI Bottom Sheet States
    const [activeModal, setActiveModal] = useState<'summary' | 'quiz' | 'flashcards' | null>(null);

    // Quiz interactive elements
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    // Render AI Summary Modal Content
    const renderSummaryContent = () => (
        <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: typography.fontSize.md + 1 }]}>
                📝 AI Key Concepts Summary
            </Text>
            <Text style={[styles.modalBody, { color: colors.textMuted, fontSize: typography.fontSize.sm }]}>
                This document outlines structural properties of the target syllabus. Key themes decoded:
                {'\n\n'}
                • <Text style={{ fontWeight: '700', color: colors.text }}>Core Principles:</Text> Core conceptual definitions outlining functional operations and theoretical assumptions.
                {'\n\n'}
                • <Text style={{ fontWeight: '700', color: colors.text }}>Key Frameworks:</Text> Logical flow models mapping elements interactively.
                {'\n\n'}
                • <Text style={{ fontWeight: '700', color: colors.text }}>Application Scope:</Text> Empirical examples reflecting target metrics.
            </Text>
        </View>
    );

    // Render AI Quiz Modal Content
    const renderQuizContent = () => {
        const questions = [
            {
                q: "What is the primary governing conservation law depicted in the text?",
                options: ["Law of mass displacement", "Conservation of total linear momentum", "Newton's thermodynamic constant", "Lorentz acceleration force"],
                ans: 1
            }
        ];
        const currentQ = questions[0]!;

        return (
            <View style={styles.modalContent}>
                <Text style={[styles.modalTitle, { color: colors.text, fontSize: typography.fontSize.md + 1 }]}>
                    🧠 Live AI Practice Quiz
                </Text>

                <View style={[styles.questionCard, { backgroundColor: colors.inputBg, borderRadius: borderRadius.md }]}>
                    <Text style={[styles.questionText, { color: colors.text, fontSize: typography.fontSize.sm }]}>
                        {currentQ.q}
                    </Text>
                </View>

                {currentQ.options.map((opt, idx) => {
                    const isCorrect = idx === currentQ.ans;
                    const isChosen = selectedAnswer === idx;
                    let btnBorderColor = colors.border;
                    let btnBgColor = colors.card;

                    if (selectedAnswer !== null) {
                        if (isCorrect) {
                            btnBorderColor = '#10B981';
                            btnBgColor = 'rgba(16, 185, 129, 0.08)';
                        } else if (isChosen) {
                            btnBorderColor = '#EF4444';
                            btnBgColor = 'rgba(239, 68, 68, 0.08)';
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={idx}
                            disabled={selectedAnswer !== null}
                            onPress={() => setSelectedAnswer(idx)}
                            style={[
                                styles.quizOptionBtn,
                                {
                                    backgroundColor: btnBgColor,
                                    borderColor: btnBorderColor,
                                    borderRadius: borderRadius.md,
                                }
                            ]}
                        >
                            <Text style={[styles.optionText, { color: colors.text, fontSize: typography.fontSize.xs + 1 }]}>
                                {opt}
                            </Text>
                            {selectedAnswer !== null && isCorrect && (
                                <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                            )}
                            {selectedAnswer !== null && isChosen && !isCorrect && (
                                <MaterialCommunityIcons name="close-circle" size={18} color="#EF4444" />
                            )}
                        </TouchableOpacity>
                    );
                })}

                {selectedAnswer !== null && (
                    <TouchableOpacity
                        onPress={() => setSelectedAnswer(null)}
                        style={[styles.resetQuizBtn, { backgroundColor: '#8B5CF6', borderRadius: borderRadius.round }]}
                    >
                        <Text style={styles.resetQuizText}>Try Next Question</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Render AI Flashcards Content
    const renderFlashcardsContent = () => (
        <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: typography.fontSize.md + 1 }]}>
                ⚡ Concept Flashcards
            </Text>

            {/* Front Card */}
            <View style={[styles.flashcardFront, { backgroundColor: colors.inputBg, borderRadius: borderRadius.xl, borderColor: colors.border }]}>
                <Text style={[styles.flashTextHeader, { color: '#8B5CF6' }]}>QUESTION</Text>
                <Text style={[styles.flashQuestion, { color: colors.text }]}>
                    Explain the core difference between passive reading and active recall.
                </Text>
                <View style={styles.divider} />
                <Text style={[styles.flashAnswer, { color: colors.textMuted }]}>
                    💡 Active recall forces the brain to retrieve information based on questions, strengthening synaptic paths, whereas passive reading simply loops pages.
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.mainBg, { backgroundColor: colors.background }]}>

            {/* Dynamic Sub-header Navigation row */}
            <View style={[styles.headerRow, { paddingTop: Math.max(insets.top, 16) }]}>
                <TouchableOpacity
                    onPress={onBackPress}
                    style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                    <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.headingTitle, { color: colors.text, fontSize: typography.fontSize.md }]}>
                    Syllabus Detail
                </Text>

                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                    <MaterialCommunityIcons name="bookmark-outline" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={[styles.contentPadding, { paddingBottom: 110 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* PDF Document Preview Area representation */}
                <View style={[styles.pdfMockPreview, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.xl }]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.03)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <MaterialCommunityIcons name="file-pdf-box" size={72} color="#8B5CF6" />
                    <Text style={[styles.pdfFileName, { color: colors.text, fontSize: typography.fontSize.sm }]}>
                        {document.title}
                    </Text>
                    <Text style={[styles.pdfFileSize, { color: colors.textMuted, fontSize: typography.fontSize.xs }]}>
                        {document.pages} Pages • Mock PDF Preview Mode
                    </Text>
                </View>

                {/* Informational description panel */}
                <View style={styles.metaPanel}>
                    <View style={styles.tagRow}>
                        <View style={[styles.tagBadge, { backgroundColor: '#8B5CF6' }]}>
                            <Text style={styles.tagLabelText}>{document.subject}</Text>
                        </View>
                        <View style={[styles.tagBadge, { backgroundColor: colors.border }]}>
                            <Text style={[styles.tagLabelText, { color: colors.text }]}>Study Buddy AI Pin</Text>
                        </View>
                    </View>

                    <Text style={[styles.docDocTitle, { color: colors.text, fontSize: typography.fontSize.lg + 1 }]}>
                        {document.title}
                    </Text>

                    {/* Quick Metrics display grid */}
                    <View style={styles.metricsRow}>
                        <View style={[styles.metricCard, { backgroundColor: colors.inputBg, borderRadius: borderRadius.md }]}>
                            <MaterialCommunityIcons name="timer-outline" size={20} color="#8B5CF6" />
                            <Text style={[styles.metricValue, { color: colors.text }]}>{document.studyTime}</Text>
                            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Study Limit</Text>
                        </View>

                        <View style={[styles.metricCard, { backgroundColor: colors.inputBg, borderRadius: borderRadius.md }]}>
                            <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#10B981" />
                            <Text style={[styles.metricValue, { color: colors.text }]}>{document.progress}%</Text>
                            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Coverage</Text>
                        </View>
                    </View>
                </View>

                {/* --- AI ACCELERATORS / TOOLS --- */}
                <Text style={[styles.sectionHeading, { color: colors.text, fontSize: typography.fontSize.md }]}>
                    AI Workspace Accelerators
                </Text>

                <View style={styles.acceleratorsRow}>

                    <TouchableOpacity
                        onPress={() => setActiveModal('summary')}
                        style={[styles.acceleratorBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                            <MaterialCommunityIcons name="text-box-search" size={24} color="#8B5CF6" />
                        </View>
                        <Text style={[styles.accLabel, { color: colors.text }]}>AI Summary</Text>
                        <Text style={[styles.accSub, { color: colors.textMuted }]}>Key concepts decoded</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveModal('quiz')}
                        style={[styles.acceleratorBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <MaterialCommunityIcons name="head-lightbulb-outline" size={24} color="#10B981" />
                        </View>
                        <Text style={[styles.accLabel, { color: colors.text }]}>AI Quiz</Text>
                        <Text style={[styles.accSub, { color: colors.textMuted }]}>Test note retrieval</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.acceleratorsRow}>
                    <TouchableOpacity
                        onPress={() => setActiveModal('flashcards')}
                        style={[styles.acceleratorBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.1)' }]}>
                            <MaterialCommunityIcons name="cards-outline" size={24} color="#0EA5E9" />
                        </View>
                        <Text style={[styles.accLabel, { color: colors.text }]}>Flashcards</Text>
                        <Text style={[styles.accSub, { color: colors.textMuted }]}>Spaced repetitions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.acceleratorBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                            <MaterialCommunityIcons name="headphones" size={24} color="#F59E0B" />
                        </View>
                        <Text style={[styles.accLabel, { color: colors.text }]}>Text-To-Speech</Text>
                        <Text style={[styles.accSub, { color: colors.textMuted }]}>Listen while walking</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* AI Bottom Sheets Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={activeModal !== null}
                onRequestClose={() => setActiveModal(null)}
            >
                <View style={styles.modalOverlay}>
                    {/* Dismiss keyboard layout */}
                    <TouchableOpacity
                        style={styles.modalDismissArea}
                        activeOpacity={1}
                        onPress={() => setActiveModal(null)}
                    />

                    <View style={[styles.bottomSheetCard, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <View style={styles.sheetHandle} />

                        {activeModal === 'summary' && renderSummaryContent()}
                        {activeModal === 'quiz' && renderQuizContent()}
                        {activeModal === 'flashcards' && renderFlashcardsContent()}

                        <TouchableOpacity
                            onPress={() => setActiveModal(null)}
                            style={[styles.closeSheetBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                        >
                            <Text style={[styles.closeSheetText, { color: colors.text }]}>Dismiss Panel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    mainBg: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headingTitle: {
        fontWeight: '800',
    },
    contentPadding: {
        paddingHorizontal: 16,
    },
    pdfMockPreview: {
        height: 180,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
    },
    pdfFileName: {
        fontWeight: '700',
        marginTop: 10,
    },
    pdfFileSize: {
        fontWeight: '500',
        marginTop: 2,
    },
    metaPanel: {
        paddingVertical: 12,
    },
    tagRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    tagBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    tagLabelText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    docDocTitle: {
        fontWeight: '900',
        letterSpacing: -0.5,
        lineHeight: 26,
    },
    metricsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    metricCard: {
        width: (width - 44) / 2,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    metricValue: {
        fontWeight: '800',
        fontSize: 14,
        marginTop: 6,
    },
    metricLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    sectionHeading: {
        fontWeight: '800',
        marginTop: 16,
        marginBottom: 12,
    },
    acceleratorsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    acceleratorBtn: {
        width: (width - 44) / 2,
        padding: 14,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    accLabel: {
        fontWeight: '700',
        fontSize: 13,
    },
    accSub: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 2,
    },
    // Modal configurations
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalDismissArea: {
        flex: 1,
    },
    bottomSheetCard: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 1.5,
        padding: 20,
        maxHeight: height * 0.70,
    },
    sheetHandle: {
        width: 44,
        height: 5,
        backgroundColor: '#94A3B8',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalContent: {
        marginBottom: 14,
    },
    modalTitle: {
        fontWeight: '900',
        marginBottom: 14,
    },
    modalBody: {
        lineHeight: 22,
        fontWeight: '500',
    },
    closeSheetBtn: {
        borderWidth: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 24,
        marginTop: 12,
    },
    closeSheetText: {
        fontWeight: '700',
    },
    // Quiz specifics
    questionCard: {
        padding: 16,
        marginBottom: 14,
    },
    questionText: {
        fontWeight: '700',
        lineHeight: 22,
    },
    quizOptionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    optionText: {
        fontWeight: '600',
        flex: 1,
        marginRight: 6,
    },
    resetQuizBtn: {
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    resetQuizText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 12,
    },
    // Flashcard design
    flashcardFront: {
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
        minHeight: 180,
        justifyContent: 'center',
    },
    flashTextHeader: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
    },
    flashQuestion: {
        fontWeight: '800',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        width: '90%',
        marginVertical: 14,
    },
    flashAnswer: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 20,
    },
});

export default DocumentDetailScreen;
