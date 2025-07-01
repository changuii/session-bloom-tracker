
export interface PomodoroSettings {
  focusTime: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  longBreakInterval: number; // every N sessions
  autoStart: boolean;
  soundEnabled: boolean;
}

export interface SessionData {
  id: string;
  date: string; // ISO date string
  type: 'focus' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  completed: boolean;
  reflection?: string;
  createdAt: number; // timestamp
}

export interface DailyStats {
  date: string;
  totalFocusTime: number;
  completedSessions: number;
  reflections: string[];
}

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';
export type SessionType = 'focus' | 'shortBreak' | 'longBreak';
