
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UserSettings } from '@/types/notification';
import { getUniqueVerseForTopic } from './bibleService';

const SETTINGS_KEY = 'userSettings';
const NOTIFICATION_IDS_KEY = 'scheduledNotificationIds';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-messages', {
        name: 'Daily Messages',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E8B57',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    return true;
  } catch (error) {
    console.log('Error requesting notification permissions:', error);
    return false;
  }
}

// Save user settings
export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved:', settings);
  } catch (error) {
    console.log('Error saving settings:', error);
  }
}

// Load user settings
export async function loadUserSettings(): Promise<UserSettings | null> {
  try {
    const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return null;
  } catch (error) {
    console.log('Error loading settings:', error);
    return null;
  }
}

// Generate completely random times throughout the entire day
function generateRandomTimes(count: number): Date[] {
  const times: Date[] = [];
  const now = new Date();
  
  // Start from current time
  const startTime = now.getTime();
  
  // End at midnight (start of next day)
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const endTime = endOfDay.getTime();
  
  // Calculate available time window in milliseconds
  const timeWindow = endTime - startTime;
  
  // Generate completely random timestamps
  const randomTimestamps: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate random milliseconds within the time window
    const randomOffset = Math.floor(Math.random() * timeWindow);
    randomTimestamps.push(startTime + randomOffset);
  }
  
  // Sort timestamps chronologically
  randomTimestamps.sort((a, b) => a - b);
  
  // Convert timestamps to Date objects
  for (const timestamp of randomTimestamps) {
    times.push(new Date(timestamp));
  }
  
  console.log(`Generated ${count} random notification times:`);
  times.forEach((time, index) => {
    console.log(`  ${index + 1}. ${time.toLocaleTimeString()}`);
  });
  
  return times;
}

// Schedule notifications for the day
export async function scheduleNotifications(topic: string, messagesPerDay: number): Promise<void> {
  try {
    // Cancel existing notifications
    await cancelAllNotifications();
    
    // Generate completely random times
    const times = generateRandomTimes(messagesPerDay);
    const notificationIds: string[] = [];
    
    console.log(`Scheduling ${messagesPerDay} notifications at random times for topic: ${topic}`);
    
    // Schedule each notification
    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      const verse = await getUniqueVerseForTopic(topic);
      
      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: time,
      };
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '✨ A Message from God',
          body: verse.rephrased,
          data: {
            reference: verse.reference,
            originalText: verse.text,
          },
          sound: true,
        },
        trigger,
      });
      
      notificationIds.push(notificationId);
      console.log(`Scheduled notification ${i + 1} at ${time.toLocaleTimeString()} - ${verse.reference}`);
    }
    
    // Save notification IDs
    await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(notificationIds));
    
    console.log(`Successfully scheduled ${notificationIds.length} notifications at completely random times`);
  } catch (error) {
    console.log('Error scheduling notifications:', error);
    throw error;
  }
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
    console.log('All notifications cancelled');
  } catch (error) {
    console.log('Error cancelling notifications:', error);
  }
}

// Get scheduled notifications count
export async function getScheduledNotificationsCount(): Promise<number> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.length;
  } catch (error) {
    console.log('Error getting scheduled notifications:', error);
    return 0;
  }
}

// Reschedule daily notifications (call this once per day)
export async function rescheduleDaily(): Promise<void> {
  try {
    const settings = await loadUserSettings();
    if (settings && settings.isSetup) {
      await scheduleNotifications(settings.topic, settings.messagesPerDay);
    }
  } catch (error) {
    console.log('Error rescheduling daily:', error);
  }
}
