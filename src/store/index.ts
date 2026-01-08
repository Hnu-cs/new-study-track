import { create } from 'zustand';
import dayjs from 'dayjs';
import { StudyRecord, Mistake, KeyPoint, StudyStats, Tag } from '../types';
import { storage } from '../services/storage';

interface AppState {
  // Study Records
  studyRecords: StudyRecord[];
  isLoading: boolean;
  
  // Mistakes
  mistakes: Mistake[];
  
  // Key Points
  keyPoints: KeyPoint[];
  
  // Stats
  stats: StudyStats;
  
  // Actions
  loadData: () => Promise<void>;
  
  // Study Record Actions
  addStudyRecord: (record: Omit<StudyRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStudyRecord: (record: StudyRecord) => Promise<void>;
  deleteStudyRecord: (id: string) => Promise<void>;
  toggleStudyCompletion: (date: string) => Promise<void>;
  
  // Mistake Actions
  addMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMistake: (mistake: Mistake) => Promise<void>;
  deleteMistake: (id: string) => Promise<void>;
  toggleMistakeMastery: (id: string) => Promise<void>;
  
  // Key Point Actions
  addKeyPoint: (keyPoint: Omit<KeyPoint, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateKeyPoint: (keyPoint: KeyPoint) => Promise<void>;
  deleteKeyPoint: (id: string) => Promise<void>;
  
  // Stats Actions
  calculateStats: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  studyRecords: [],
  mistakes: [],
  keyPoints: [],
  stats: {
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalHours: 0,
    subjectDistribution: {},
  },
  isLoading: true,

  // Load all data from storage
  loadData: async () => {
    set({ isLoading: true });
    
    try {
      const [studyRecords, mistakes, keyPoints, stats] = await Promise.all([
        storage.getStudyRecords(),
        storage.getMistakes(),
        storage.getKeyPoints(),
        storage.getStats(),
      ]);
      
      set({ studyRecords, mistakes, keyPoints, stats });
      await get().calculateStats();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Study Record Actions
  addStudyRecord: async (record) => {
    const newRecord: StudyRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await storage.saveStudyRecord(newRecord);
    set((state) => ({
      studyRecords: [...state.studyRecords, newRecord],
    }));
    
    await get().calculateStats();
  },

  updateStudyRecord: async (record) => {
    await storage.saveStudyRecord(record);
    set((state) => ({
      studyRecords: state.studyRecords.map((r) =>
        r.id === record.id ? record : r
      ),
    }));
    
    await get().calculateStats();
  },

  deleteStudyRecord: async (id) => {
    await storage.deleteStudyRecord(id);
    set((state) => ({
      studyRecords: state.studyRecords.filter((r) => r.id !== id),
    }));
    
    await get().calculateStats();
  },

  toggleStudyCompletion: async (date) => {
    const existingRecord = get().studyRecords.find((r) => r.date === date);
    
    if (existingRecord) {
      const updatedRecord = { ...existingRecord, isCompleted: !existingRecord.isCompleted };
      await get().updateStudyRecord(updatedRecord);
    } else {
      await get().addStudyRecord({
        date,
        subject: '未分类',
        tags: [],
        isCompleted: true,
      });
    }
  },

  // Mistake Actions
  addMistake: async (mistake) => {
    const newMistake: Mistake = {
      ...mistake,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await storage.saveMistake(newMistake);
    set((state) => ({
      mistakes: [...state.mistakes, newMistake],
    }));
  },

  updateMistake: async (mistake) => {
    await storage.saveMistake(mistake);
    set((state) => ({
      mistakes: state.mistakes.map((m) =>
        m.id === mistake.id ? mistake : m
      ),
    }));
  },

  deleteMistake: async (id) => {
    await storage.deleteMistake(id);
    set((state) => ({
      mistakes: state.mistakes.filter((m) => m.id !== id),
    }));
  },

  toggleMistakeMastery: async (id) => {
    const mistake = get().mistakes.find((m) => m.id === id);
    if (mistake) {
      await get().updateMistake({
        ...mistake,
        isMastered: !mistake.isMastered,
      });
    }
  },

  // Key Point Actions
  addKeyPoint: async (keyPoint) => {
    const newKeyPoint: KeyPoint = {
      ...keyPoint,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    await storage.saveKeyPoint(newKeyPoint);
    set((state) => ({
      keyPoints: [...state.keyPoints, newKeyPoint],
    }));
  },

  updateKeyPoint: async (keyPoint) => {
    await storage.saveKeyPoint(keyPoint);
    set((state) => ({
      keyPoints: state.keyPoints.map((k) =>
        k.id === keyPoint.id ? keyPoint : k
      ),
    }));
  },

  deleteKeyPoint: async (id) => {
    await storage.deleteKeyPoint(id);
    set((state) => ({
      keyPoints: state.keyPoints.filter((k) => k.id !== id),
    }));
  },

  // Calculate and update statistics
  calculateStats: async () => {
    const records = get().studyRecords;
    const completedRecords = records.filter((r) => r.isCompleted);
    
    // Total days studied
    const totalDays = new Set(completedRecords.map((r) => r.date)).size;
    
    // Calculate streaks
    const sortedDates = completedRecords
      .map((r) => r.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    if (sortedDates.length > 0) {
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = dayjs(sortedDates[i - 1]);
        const currDate = dayjs(sortedDates[i]);
        
        if (currDate.diff(prevDate, 'day') === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Check if current streak is ongoing
      const today = dayjs().format('YYYY-MM-DD');
      const lastStudyDate = sortedDates[sortedDates.length - 1];
      
      if (lastStudyDate === today) {
        currentStreak = tempStreak;
      } else if (dayjs(today).diff(dayjs(lastStudyDate), 'day') === 1) {
        currentStreak = 0; // Streak broken yesterday
      }
    }
    
    // Total hours studied
    const totalHours = completedRecords.reduce((total, record) => {
      return total + (record.duration || 0) / 60;
    }, 0);
    
    // Subject distribution
    const subjectDistribution: Record<Tag, number> = {};
    completedRecords.forEach((record) => {
      if (record.subject && record.duration) {
        subjectDistribution[record.subject] = (subjectDistribution[record.subject] || 0) + record.duration / 60;
      }
    });
    
    const newStats: StudyStats = {
      totalDays,
      currentStreak,
      longestStreak,
      totalHours,
      subjectDistribution,
    };
    
    await storage.saveStats(newStats);
    set({ stats: newStats });
  },
}));
