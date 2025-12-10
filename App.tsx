import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings as SettingsIcon, BarChart2, Moon, Sun, Zap, Volume2, VolumeX } from 'lucide-react';
import { DEFAULT_SETTINGS, Settings, Task, TimerMode, SessionStat, AppTheme } from './types';
import { playNotificationSound, playClickSound } from './utils/sound';
import CircularTimer from './components/CircularTimer';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import StatsModal from './components/StatsModal';
import DashboardWidget from './components/DashboardWidget';

const App: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.pomodoroTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [theme, setTheme] = useState<AppTheme>('light');
  
  // Stats & Modals
  const [stats, setStats] = useState<SessionStat[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // Refs for timer interval
  const timerRef = useRef<number | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('focusflow-data');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.settings) setSettings(data.settings);
      if (data.tasks) setTasks(data.tasks);
      if (data.stats) setStats(data.stats);
      if (data.theme) setTheme(data.theme);
      // Fallback for old dark mode data
      if (data.darkMode !== undefined && !data.theme) {
          setTheme(data.darkMode ? 'dark' : 'light');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('focusflow-data', JSON.stringify({
      settings, tasks, stats, theme
    }));
  }, [settings, tasks, stats, theme]);

  // --- Theme Logic ---
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'neon');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'neon') {
      root.classList.add('dark', 'neon');
    }
  }, [theme]);

  // --- Timer Logic ---
  
  const switchMode = useCallback((newMode: TimerMode) => {
    const timeMap = {
      'pomodoro': settings.pomodoroTime,
      'shortBreak': settings.shortBreakTime,
      'longBreak': settings.longBreakTime
    };
    setMode(newMode);
    setTimeLeft(timeMap[newMode] * 60);
    setIsActive(false);
  }, [settings]);

  // Handle settings change while timer is stopped
  useEffect(() => {
    if (!isActive) {
        if(mode === 'pomodoro') setTimeLeft(settings.pomodoroTime * 60);
        if(mode === 'shortBreak') setTimeLeft(settings.shortBreakTime * 60);
        if(mode === 'longBreak') setTimeLeft(settings.longBreakTime * 60);
    }
  }, [settings.pomodoroTime, settings.shortBreakTime, settings.longBreakTime, mode, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Update Title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timeString} - ${mode === 'pomodoro' ? 'Focus' : 'Break'}`;
  }, [timeLeft, mode]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (settings.soundEnabled) playNotificationSound();

    if (mode === 'pomodoro') {
      const newCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newCompleted);
      
      // Update stats
      const today = new Date().toISOString().split('T')[0];
      setStats(prev => {
        const existing = prev.find(s => s.date === today);
        if (existing) {
          return prev.map(s => s.date === today ? { ...s, minutesFocused: s.minutesFocused + settings.pomodoroTime, sessionsCompleted: s.sessionsCompleted + 1 } : s);
        } else {
          return [...prev, { date: today, minutesFocused: settings.pomodoroTime, sessionsCompleted: 1 }];
        }
      });

      // Update Active Task
      if (activeTaskId) {
        setTasks(prev => prev.map(t => t.id === activeTaskId ? { ...t, actPomodoros: t.actPomodoros + 1 } : t));
      }

      // Determine next break
      if (newCompleted % settings.longBreakInterval === 0) {
        switchMode('longBreak');
        if (settings.autoStartBreaks) setIsActive(true);
      } else {
        switchMode('shortBreak');
        if (settings.autoStartBreaks) setIsActive(true);
      }
    } else {
      // Break over, back to work
      switchMode('pomodoro');
      if (settings.autoStartPomodoros) setIsActive(true);
    }
  };

  const toggleTimer = () => {
    if (settings.soundEnabled) playClickSound();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switchMode(mode);
  };

  const skipTimer = () => {
    setIsActive(false);
    handleTimerComplete(); 
  };

  const cycleTheme = () => {
      if (theme === 'light') setTheme('dark');
      else if (theme === 'dark') setTheme('neon');
      else setTheme('light');
  };

  // --- Task Handlers ---
  const addTask = (title: string, est: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      estPomodoros: est,
      actPomodoros: 0
    };
    setTasks([...tasks, newTask]);
    if (!activeTaskId) setActiveTaskId(newTask.id);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTask = (updatedTask: Task) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  }

  // --- Styling ---
  const getBgColor = () => {
    // In neon mode, keep the background black (bg-main) instead of flooding it with color
    if (theme === 'neon') return 'bg-main';
    
    if (mode === 'pomodoro') return 'bg-pomo';
    if (mode === 'shortBreak') return 'bg-short';
    return 'bg-long';
  };

  const getTotalTime = () => {
      if(mode === 'pomodoro') return settings.pomodoroTime * 60;
      if(mode === 'shortBreak') return settings.shortBreakTime * 60;
      return settings.longBreakTime * 60;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${getBgColor()} flex flex-col items-center py-8 px-4`}>
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold">F</span>
            </div>
            <h1 className="text-white font-bold text-xl tracking-tight hidden sm:block">FocusFlow</h1>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => setIsStatsOpen(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all backdrop-blur-sm">
                <BarChart2 size={20} />
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all backdrop-blur-sm">
                <SettingsIcon size={20} />
            </button>
            <button onClick={cycleTheme} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all backdrop-blur-sm">
                {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Zap size={20} />}
            </button>
        </div>
      </header>

      {/* Dashboard Widget (Clock & Weather) */}
      <DashboardWidget />

      {/* Main Card */}
      <main className="w-full max-w-md bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 transition-colors duration-300">
        
        {/* Mode Switcher */}
        <div className="flex bg-input p-1 rounded-full mb-8 relative">
          <div 
             className={`absolute h-[calc(100%-8px)] top-1 rounded-full bg-card shadow-sm transition-all duration-300 ease-out`}
             style={{
                 left: mode === 'pomodoro' ? '4px' : mode === 'shortBreak' ? '33.33%' : '66.66%',
                 width: 'calc(33.33% - 4px)'
             }}
          />
          {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { switchMode(m); playClickSound(); }}
              className={`flex-1 relative z-10 py-2 text-sm font-bold rounded-full transition-colors ${mode === m ? 'text-primary' : 'text-secondary hover:text-primary'}`}
            >
              {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center mb-8">
          <CircularTimer 
            timeLeft={timeLeft} 
            totalTime={getTotalTime()} 
            isActive={isActive} 
            mode={mode}
            toggleTimer={toggleTimer}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
             {/* Sound Toggle (Quick Access) */}
             <button 
                 onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                 className="text-muted hover:text-primary transition-colors"
             >
                 {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
             </button>

             <button 
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transform active:scale-95 transition-all text-white ${
                    mode === 'pomodoro' ? 'bg-pomo hover:bg-pomo/90' : 
                    mode === 'shortBreak' ? 'bg-short hover:bg-short/90' : 
                    'bg-long hover:bg-long/90'
                }`}
             >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
             </button>

             <button 
                onClick={isActive ? skipTimer : resetTimer}
                className="text-muted hover:text-primary transition-colors"
            >
                 {isActive ? <SkipForward size={24} /> : <RotateCcw size={24} />}
             </button>
        </div>
      </main>

      {/* Stats/Goals Preview */}
      <div className="text-white/80 font-medium mb-8 text-center">
          <p>#{pomodorosCompleted} / {settings.dailyGoal} Daily Goal</p>
          <div className="w-64 h-1 bg-white/20 rounded-full mt-2 mx-auto overflow-hidden">
             <div 
                className="h-full bg-white transition-all duration-500" 
                style={{width: `${Math.min((pomodorosCompleted / settings.dailyGoal) * 100, 100)}%`}}
             />
          </div>
      </div>

      {/* Task List */}
      <TaskList 
        tasks={tasks} 
        activeTaskId={activeTaskId} 
        onAddTask={addTask} 
        onDeleteTask={deleteTask}
        onToggleTask={toggleTask}
        onSelectTask={setActiveTaskId}
        onUpdateTask={updateTask}
      />

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onUpdateSettings={setSettings}
        theme={theme}
        onUpdateTheme={setTheme}
      />

      <StatsModal 
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        totalSessions={stats.reduce((acc, curr) => acc + curr.sessionsCompleted, 0)}
      />

    </div>
  );
};

export default App;