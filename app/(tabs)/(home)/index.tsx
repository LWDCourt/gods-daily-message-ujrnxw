
import React, { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import {
  loadUserSettings,
  getScheduledNotificationsCount,
  cancelAllNotifications,
  saveUserSettings,
} from '@/services/notificationService';
import { UserSettings } from '@/types/notification';

export default function HomeScreen() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await loadUserSettings();
      
      if (!userSettings || !userSettings.isSetup) {
        // User hasn't completed setup, redirect to setup
        router.replace('/(tabs)/(home)/setup-topic');
        return;
      }

      setSettings(userSettings);
      const count = await getScheduledNotificationsCount();
      setNotificationCount(count);
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeSettings = () => {
    router.push('/(tabs)/(home)/setup-topic');
  };

  const handleResetApp = async () => {
    Alert.alert(
      'Reset App',
      'Are you sure you want to reset the app? This will cancel all scheduled messages.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAllNotifications();
              await saveUserSettings({
                topic: '',
                messagesPerDay: 0,
                isSetup: false,
              });
              router.replace('/(tabs)/(home)/setup-topic');
            } catch (error) {
              console.log('Error resetting app:', error);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Daily Messages',
          headerRight: () => (
            <TouchableOpacity
              onPress={handleChangeSettings}
              style={styles.headerButton}
            >
              <IconSymbol name="gear" color={colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <IconSymbol name="book.fill" size={80} color={colors.primary} />
            <Text style={[commonStyles.title, styles.title]}>
              Daily Messages from God
            </Text>
            <Text style={[commonStyles.textSecondary, styles.subtitle]}>
              You&apos;re all set to receive personalized Bible verses
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <IconSymbol name="tag.fill" size={32} color={colors.primary} />
              <Text style={styles.statLabel}>Your Topic</Text>
              <Text style={styles.statValue}>{settings.topic}</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol name="bell.fill" size={32} color={colors.primary} />
              <Text style={styles.statLabel}>Messages Per Day</Text>
              <Text style={styles.statValue}>{settings.messagesPerDay}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <IconSymbol name="calendar" size={24} color={colors.primary} />
              <Text style={styles.infoTitle}>Scheduled Messages</Text>
            </View>
            <Text style={styles.infoText}>
              You have <Text style={styles.infoHighlight}>{notificationCount}</Text> messages scheduled for today
            </Text>
            <Text style={styles.infoDescription}>
              Messages will be delivered at random times throughout the day between 8 AM and 9 PM
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <IconSymbol name="sparkles" size={24} color={colors.primary} />
              <Text style={styles.infoTitle}>How It Works</Text>
            </View>
            <Text style={styles.infoDescription}>
              Each message contains a Bible verse (NIV) related to your chosen topic, rephrased as a personal message from God directly to you.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleChangeSettings}
            >
              <IconSymbol name="pencil" size={20} color={colors.background} />
              <Text style={styles.primaryButtonText}>Change Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleResetApp}
            >
              <IconSymbol name="arrow.counterclockwise" size={20} color={colors.accent} />
              <Text style={styles.secondaryButtonText}>Reset App</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  infoHighlight: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  headerButton: {
    padding: 8,
  },
});
