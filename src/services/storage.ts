import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyRecord, Mistake, KeyPoint, StudyStats, CalendarDay, Tag } from '../types';

const STORAGE_KEYS = {
  STUDY_RECORDS: 'study_track:study_records',
  MISTAKES: 'study_track:mistakes',
  KEY_POINTS: 'study_track:key_points',
  STATS: 'study_track:stats',
};

export const storage = {
  // Study Records
  async saveStudyRecord(record: StudyRecord): Promise<void> {
    const records = await this.getStudyRecords();
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex >= 0) {
      records[existingIndex] = { ...record, updatedAt: Date.now() };
    } else {
      records.push({ ...record, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify(records));
  },

  async getStudyRecords(): Promise<StudyRecord[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_RECORDS);
    if (!data) return [];
    
    const records = JSON.parse(data);
    // Ensure boolean fields are correctly typed
    return records.map((record: any) => ({
      ...record,
      isCompleted: Boolean(record.isCompleted),
      createdAt: Number(record.createdAt),
      updatedAt: Number(record.updatedAt),
    }));
  },

  async getStudyRecordById(id: string): Promise<StudyRecord | undefined> {
    const records = await this.getStudyRecords();
    return records.find(r => r.id === id);
  },

  async getStudyRecordsByDate(date: string): Promise<StudyRecord[]> {
    const records = await this.getStudyRecords();
    return records.filter(r => r.date === date);
  },

  async deleteStudyRecord(id: string): Promise<void> {
    const records = await this.getStudyRecords();
    const filtered = records.filter(r => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_RECORDS, JSON.stringify(filtered));
  },

  // Mistakes
  async saveMistake(mistake: Mistake): Promise<void> {
    const mistakes = await this.getMistakes();
    const existingIndex = mistakes.findIndex(m => m.id === mistake.id);
    
    if (existingIndex >= 0) {
      mistakes[existingIndex] = { ...mistake, updatedAt: Date.now() };
    } else {
      mistakes.push({ ...mistake, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  },

  async getMistakes(): Promise<Mistake[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MISTAKES);
    if (!data) return [];
    
    const mistakes = JSON.parse(data);
    // Ensure boolean fields are correctly typed
    return mistakes.map((mistake: any) => ({
      ...mistake,
      isMastered: Boolean(mistake.isMastered),
      createdAt: Number(mistake.createdAt),
      updatedAt: Number(mistake.updatedAt),
    }));
  },

  async getMistakeById(id: string): Promise<Mistake | undefined> {
    const mistakes = await this.getMistakes();
    return mistakes.find(m => m.id === id);
  },

  async deleteMistake(id: string): Promise<void> {
    const mistakes = await this.getMistakes();
    const filtered = mistakes.filter(m => m.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(filtered));
  },

  // Key Points
  async saveKeyPoint(keyPoint: KeyPoint): Promise<void> {
    const keyPoints = await this.getKeyPoints();
    const existingIndex = keyPoints.findIndex(k => k.id === keyPoint.id);
    
    if (existingIndex >= 0) {
      keyPoints[existingIndex] = { ...keyPoint, updatedAt: Date.now() };
    } else {
      keyPoints.push({ ...keyPoint, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.KEY_POINTS, JSON.stringify(keyPoints));
  },

  async getKeyPoints(): Promise<KeyPoint[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.KEY_POINTS);
    if (!data) return [];
    
    const keyPoints = JSON.parse(data);
    // Ensure numeric fields are correctly typed
    return keyPoints.map((keyPoint: any) => ({
      ...keyPoint,
      createdAt: Number(keyPoint.createdAt),
      updatedAt: Number(keyPoint.updatedAt),
    }));
  },

  async getKeyPointById(id: string): Promise<KeyPoint | undefined> {
    const keyPoints = await this.getKeyPoints();
    return keyPoints.find(k => k.id === id);
  },

  async deleteKeyPoint(id: string): Promise<void> {
    const keyPoints = await this.getKeyPoints();
    const filtered = keyPoints.filter(k => k.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.KEY_POINTS, JSON.stringify(filtered));
  },

  // Stats
  async getStats(): Promise<StudyStats> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      const stats = JSON.parse(data);
      // Ensure numeric fields are correctly typed
      return {
        totalDays: Number(stats.totalDays),
        currentStreak: Number(stats.currentStreak),
        longestStreak: Number(stats.longestStreak),
        totalHours: Number(stats.totalHours),
        subjectDistribution: stats.subjectDistribution || {},
      };
    }
    
    // Default stats
    return {
      totalDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalHours: 0,
      subjectDistribution: {},
    };
  },

  async saveStats(stats: StudyStats): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  // Utility functions
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  },

  async exportData(): Promise<string> {
    const records = await this.getStudyRecords();
    const mistakes = await this.getMistakes();
    const keyPoints = await this.getKeyPoints();
    const stats = await this.getStats();
    
    return JSON.stringify({ records, mistakes, keyPoints, stats }, null, 2);
  },
};
