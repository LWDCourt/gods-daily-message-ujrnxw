
export interface UserSettings {
  topic: string;
  messagesPerDay: number;
  isSetup: boolean;
}

export interface BibleVerse {
  reference: string;
  text: string;
  rephrased: string;
}

export interface ScheduledMessage {
  id: string;
  verse: BibleVerse;
  scheduledTime: Date;
}
