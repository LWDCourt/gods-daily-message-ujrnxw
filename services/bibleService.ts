
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BibleVerse } from '@/types/notification';

// Sample Bible verses by topic (NIV version)
// In a production app, you would use a Bible API
const BIBLE_VERSES: Record<string, Array<{ reference: string; text: string }>> = {
  love: [
    {
      reference: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
    {
      reference: '1 Corinthians 13:4-5',
      text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.',
    },
    {
      reference: '1 John 4:19',
      text: 'We love because he first loved us.',
    },
    {
      reference: 'Romans 8:38-39',
      text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
    },
  ],
  peace: [
    {
      reference: 'Philippians 4:6-7',
      text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    },
    {
      reference: 'John 14:27',
      text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
    },
    {
      reference: 'Isaiah 26:3',
      text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',
    },
    {
      reference: 'Romans 15:13',
      text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    },
  ],
  strength: [
    {
      reference: 'Philippians 4:13',
      text: 'I can do all this through him who gives me strength.',
    },
    {
      reference: 'Isaiah 40:31',
      text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    },
    {
      reference: 'Psalm 46:1',
      text: 'God is our refuge and strength, an ever-present help in trouble.',
    },
    {
      reference: '2 Corinthians 12:9',
      text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness." Therefore I will boast all the more gladly about my weaknesses, so that Christ\'s power may rest on me.',
    },
  ],
  hope: [
    {
      reference: 'Jeremiah 29:11',
      text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    },
    {
      reference: 'Romans 15:13',
      text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    },
    {
      reference: 'Psalm 42:5',
      text: 'Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.',
    },
    {
      reference: 'Hebrews 11:1',
      text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    },
  ],
  faith: [
    {
      reference: 'Hebrews 11:1',
      text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    },
    {
      reference: 'Matthew 17:20',
      text: 'He replied, "Because you have so little faith. Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, \'Move from here to there,\' and it will move. Nothing will be impossible for you."',
    },
    {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    },
    {
      reference: 'Romans 10:17',
      text: 'Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.',
    },
  ],
  joy: [
    {
      reference: 'Nehemiah 8:10',
      text: 'Do not grieve, for the joy of the Lord is your strength.',
    },
    {
      reference: 'Psalm 16:11',
      text: 'You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.',
    },
    {
      reference: 'John 15:11',
      text: 'I have told you this so that my joy may be in you and that your joy may be complete.',
    },
    {
      reference: 'Romans 15:13',
      text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    },
  ],
  guidance: [
    {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    },
    {
      reference: 'Psalm 32:8',
      text: 'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.',
    },
    {
      reference: 'James 1:5',
      text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
    },
    {
      reference: 'Isaiah 30:21',
      text: 'Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, "This is the way; walk in it."',
    },
  ],
  comfort: [
    {
      reference: '2 Corinthians 1:3-4',
      text: 'Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.',
    },
    {
      reference: 'Psalm 23:4',
      text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    },
    {
      reference: 'Matthew 11:28',
      text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    },
    {
      reference: 'Isaiah 41:10',
      text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    },
  ],
};

// Rephrase verse as a direct message from God
export function rephraseVerseAsMessage(verse: { reference: string; text: string }): BibleVerse {
  const text = verse.text;
  let rephrased = text;

  // Convert third-person references to first-person
  rephrased = rephrased.replace(/\bGod\b/gi, 'I');
  rephrased = rephrased.replace(/\bthe Lord\b/gi, 'I');
  rephrased = rephrased.replace(/\bhe\b/gi, 'I');
  rephrased = rephrased.replace(/\bhim\b/gi, 'me');
  rephrased = rephrased.replace(/\bhis\b/gi, 'my');
  
  // Convert references to "you" to be more direct
  rephrased = rephrased.replace(/\bthose who\b/gi, 'you who');
  rephrased = rephrased.replace(/\bwhoever\b/gi, 'you who');
  
  // Add personal greeting
  const greetings = [
    'My beloved child, ',
    'Dear one, ',
    'My precious child, ',
    'Beloved, ',
    'My dear one, ',
  ];
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  // Capitalize first letter after greeting
  if (rephrased.length > 0) {
    rephrased = rephrased.charAt(0).toUpperCase() + rephrased.slice(1);
  }
  
  return {
    reference: verse.reference,
    text: verse.text,
    rephrased: greeting + rephrased,
  };
}

// Get a random verse for a topic
export function getVerseForTopic(topic: string): BibleVerse {
  const topicLower = topic.toLowerCase();
  const verses = BIBLE_VERSES[topicLower] || BIBLE_VERSES.love;
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  return rephraseVerseAsMessage(randomVerse);
}

// Get all available topics
export function getAvailableTopics(): string[] {
  return Object.keys(BIBLE_VERSES).map(topic => 
    topic.charAt(0).toUpperCase() + topic.slice(1)
  );
}

// Store last used verses to avoid repetition
const LAST_VERSES_KEY = 'lastUsedVerses';

export async function getUniqueVerseForTopic(topic: string): Promise<BibleVerse> {
  try {
    const lastVersesJson = await AsyncStorage.getItem(LAST_VERSES_KEY);
    const lastVerses: string[] = lastVersesJson ? JSON.parse(lastVersesJson) : [];
    
    const topicLower = topic.toLowerCase();
    const verses = BIBLE_VERSES[topicLower] || BIBLE_VERSES.love;
    
    // Filter out recently used verses
    const availableVerses = verses.filter(v => !lastVerses.includes(v.reference));
    
    // If all verses have been used, reset
    const versesToUse = availableVerses.length > 0 ? availableVerses : verses;
    
    const randomVerse = versesToUse[Math.floor(Math.random() * versesToUse.length)];
    
    // Update last used verses
    const updatedLastVerses = [...lastVerses, randomVerse.reference].slice(-10);
    await AsyncStorage.setItem(LAST_VERSES_KEY, JSON.stringify(updatedLastVerses));
    
    return rephraseVerseAsMessage(randomVerse);
  } catch (error) {
    console.log('Error getting unique verse:', error);
    return getVerseForTopic(topic);
  }
}
