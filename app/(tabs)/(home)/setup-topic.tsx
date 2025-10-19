
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { getAvailableTopics } from '@/services/bibleService';
import { IconSymbol } from '@/components/IconSymbol';

export default function SetupTopicScreen() {
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const availableTopics = getAvailableTopics();

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  const handleContinue = () => {
    const topic = customTopic.trim() || selectedTopic;
    if (topic) {
      router.push({
        pathname: '/(tabs)/(home)/setup-frequency',
        params: { topic },
      });
    }
  };

  const isValid = customTopic.trim() || selectedTopic;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Choose Your Topic',
          headerBackTitle: 'Back',
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <IconSymbol name="book.fill" size={60} color={colors.primary} />
            <Text style={[commonStyles.title, styles.title]}>
              What would you like to hear about?
            </Text>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              Choose a topic for your daily messages from God
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Topics</Text>
            <View style={styles.topicsGrid}>
              {availableTopics.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.topicButton,
                    selectedTopic === topic && styles.topicButtonSelected,
                  ]}
                  onPress={() => handleTopicSelect(topic)}
                >
                  <Text
                    style={[
                      styles.topicButtonText,
                      selectedTopic === topic && styles.topicButtonTextSelected,
                    ]}
                  >
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Or Enter Your Own</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              placeholder="e.g., Forgiveness, Patience, Gratitude..."
              placeholderTextColor={colors.textSecondary}
              value={customTopic}
              onChangeText={(text) => {
                setCustomTopic(text);
                setSelectedTopic('');
              }}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isValid}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <IconSymbol name="arrow.right" size={20} color={colors.background} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'android' ? 100 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  topicButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  topicButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  topicButtonTextSelected: {
    color: colors.background,
  },
  input: {
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  continueButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
  },
});
