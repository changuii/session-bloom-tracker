
export interface PomodoroSettings {
  focusTime: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  longBreakInterval: number; // every N sessions
  autoStart: boolean;
  soundEnabled: boolean;
  notificationEnabled: boolean;
  streakThreshold: number; // minimum minutes per day for streak
  geminiApiKey?: string;
}

export interface SessionData {
  id: string;
  date: string; // ISO date string
  type: 'focus' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  completed: boolean;
  reflection?: string;
  aiComment?: string;
  createdAt: number; // timestamp
}

export interface DailyStats {
  date: string;
  totalFocusTime: number;
  completedSessions: number;
  reflections: string[];
}

export interface TimeSlotStats {
  morning: number; // 6-12
  afternoon: number; // 12-18
  evening: number; // 18-24
  night: number; // 0-6
}

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';
