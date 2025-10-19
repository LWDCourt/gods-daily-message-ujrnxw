
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import {
  saveUserSettings,
  scheduleNotifications,
  requestNotificationPermissions,
} from '@/services/notificationService';

export default function SetupFrequencyScreen() {
  const params = useLocalSearchParams();
  const topic = params.topic as string;
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const frequencies = [
    { value: 1, label: '1 message', description: 'Once a day' },
    { value: 2, label: '2 messages', description: 'Morning & evening' },
    { value: 3, label: '3 messages', description: 'Throughout the day' },
    { value: 5, label: '5 messages', description: 'Regular reminders' },
  ];

  const handleFrequencySelect = (frequency: number) => {
    setSelectedFrequency(frequency);
  };

  const handleComplete = async () => {
    if (!selectedFrequency) return;

    setIsLoading(true);

    try {
      // Request notification permissions
      const hasPermission = await requestNotificationPermissions();
      
      if (!hasPermission) {
        Alert.alert(
          'Permissions Required',
          'Please enable notifications to receive daily messages from God.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      // Save user settings
      await saveUserSettings({
        topic,
        messagesPerDay: selectedFrequency,
        isSetup: true,
      });

      // Schedule notifications
      await scheduleNotifications(topic, selectedFrequency);

      // Navigate to home
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.log('Error completing setup:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Message Frequency',
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
            <IconSymbol name="bell.fill" size={60} color={colors.primary} />
            <Text style={[commonStyles.title, styles.title]}>
              How often would you like to hear from God?
            </Text>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              Choose how many messages you&apos;d like to receive each day
            </Text>
          </View>

          <View style={styles.topicCard}>
            <Text style={styles.topicLabel}>Your Topic</Text>
            <Text style={styles.topicText}>{topic}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Messages Per Day</Text>
            <View style={styles.frequencyList}>
              {frequencies.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyButton,
                    selectedFrequency === freq.value && styles.frequencyButtonSelected,
                  ]}
                  onPress={() => handleFrequencySelect(freq.value)}
                >
                  <View style={styles.frequencyContent}>
                    <Text
                      style={[
                        styles.frequencyLabel,
                        selectedFrequency === freq.value && styles.frequencyLabelSelected,
                      ]}
                    >
                      {freq.label}
                    </Text>
                    <Text
                      style={[
                        styles.frequencyDescription,
                        selectedFrequency === freq.value && styles.frequencyDescriptionSelected,
                      ]}
                    >
                      {freq.description}
                    </Text>
                  </View>
                  {selectedFrequency === freq.value && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.background} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              !selectedFrequency && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!selectedFrequency || isLoading}
          >
            <Text style={styles.completeButtonText}>
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Text>
            {!isLoading && (
              <IconSymbol name="checkmark" size={20} color={colors.background} />
            )}
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
  topicCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  topicLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  topicText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
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
  frequencyList: {
    gap: 12,
  },
  frequencyButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  frequencyLabelSelected: {
    color: colors.background,
  },
  frequencyDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  frequencyDescriptionSelected: {
    color: colors.background,
    opacity: 0.9,
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  completeButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
  },
});
