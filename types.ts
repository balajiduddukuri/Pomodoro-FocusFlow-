export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

export type AppTheme = 'light' | 'dark' | 'neon';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estPomodoros: number;
  actPomodoros: number;
}

export interface Settings {
  pomodoroTime: number; // in minutes
  shortBreakTime: number;
  longBreakTime: number;
  customTime: number; // in minutes
  longBreakInterval: number; // number of pomodoros before long break
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  dailyGoal: number;
  layoutMode: 'stacked' | 'side-by-side';
}

export interface SessionStat {
  date: string; // ISO Date string YYYY-MM-DD
  minutesFocused: number;
  sessionsCompleted: number;
}

export const DEFAULT_SETTINGS: Settings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  customTime: 30,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  dailyGoal: 8,
  layoutMode: 'stacked',
};