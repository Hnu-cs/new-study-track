export type Tag = string;

export interface StudyRecord {
  id: string;
  date: string; // YYYY-MM-DD format
  subject: string;
  duration?: number; // in minutes
  content?: string;
  tags: Tag[];
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}

export enum ErrorReason {
  CONCEPT = '概念不清',
  CALCULATION = '计算错误',
  CARELESS = '粗心',
  STRATEGY = '解题思路错误',
  OTHER = '其他'
}

export interface Mistake {
  id: string;
  date: string;
  content: string;
  images?: string[];
  subject: Tag;
  errorReason: ErrorReason | string;
  importance: number; // 1-5 stars
  isMastered: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface KeyPoint {
  id: string;
  date: string;
  content: string;
  images?: string[];
  voiceNote?: string;
  tags: Tag[];
  createdAt: number;
  updatedAt: number;
}

export interface StudyStats {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  totalHours: number;
  subjectDistribution: Record<Tag, number>; // subject -> total hours
}

export interface CalendarDay {
  date: string;
  isStudied: boolean;
  duration?: number;
}
