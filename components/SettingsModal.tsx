import React from 'react';
import { Settings, AppTheme } from '../types';
import { X, Clock, Bell, Target, Monitor, Palette, LayoutTemplate } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
  theme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, theme, onUpdateTheme }) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const CUSTOM_PRESETS = [10, 15, 20, 30, 45, 60];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-input/30">
          <h2 id="settings-title" className="text-lg font-bold flex items-center gap-2 text-primary">
            <Clock size={20} aria-hidden="true" /> Settings
          </h2>
          <button 
            onClick={onClose} 
            className="text-muted hover:text-primary p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            {/* Theme Settings */}
            <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={14} aria-hidden="true"/> Theme</h3>
                <div className="grid grid-cols-3 gap-3" role="group" aria-label="Theme Selection">
                    {['light', 'dark', 'neon'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => onUpdateTheme(t as AppTheme)}
                            aria-pressed={theme === t}
                            className={`py-2 px-3 rounded-lg border-2 font-bold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pomo ${theme === t ? 'border-pomo text-pomo bg-pomo/10' : 'border-border text-muted hover:border-muted'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </section>

             {/* Layout Settings */}
             <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} aria-hidden="true"/> Layout</h3>
                <div className="grid grid-cols-2 gap-3" role="group" aria-label="Layout Selection">
                    <button 
                        onClick={() => handleChange('layoutMode', 'stacked')}
                        aria-pressed={settings.layoutMode === 'stacked'}
                        className={`py-2 px-3 rounded-lg border-2 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pomo ${settings.layoutMode === 'stacked' ? 'border-pomo text-pomo bg-pomo/10' : 'border-border text-muted hover:border-muted'}`}
                    >
                        Center (Stacked)
                    </button>
                    <button 
                        onClick={() => handleChange('layoutMode', 'side-by-side')}
                        aria-pressed={settings.layoutMode === 'side-by-side'}
                        className={`py-2 px-3 rounded-lg border-2 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pomo ${settings.layoutMode === 'side-by-side' ? 'border-pomo text-pomo bg-pomo/10' : 'border-border text-muted hover:border-muted'}`}
                    >
                        Split (Side-by-Side)
                    </button>
                </div>
            </section>

            {/* Timer Settings */}
            <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Timer (Minutes)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pomodoroTime" className="block text-sm font-medium text-muted mb-1">Pomodoro</label>
                        <input 
                            id="pomodoroTime"
                            type="number" 
                            value={settings.pomodoroTime}
                            onChange={(e) => handleChange('pomodoroTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-pomo/50"
                        />
                    </div>
                    <div>
                        <label htmlFor="shortBreakTime" className="block text-sm font-medium text-muted mb-1">Short Break</label>
                        <input 
                            id="shortBreakTime"
                            type="number" 
                            value={settings.shortBreakTime}
                            onChange={(e) => handleChange('shortBreakTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-short/50"
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="longBreakTime" className="block text-sm font-medium text-muted mb-1">Long Break</label>
                        <input 
                            id="longBreakTime"
                            type="number" 
                            value={settings.longBreakTime}
                            onChange={(e) => handleChange('longBreakTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-long/50"
                        />
                    </div>
                    
                    {/* Custom Timer Section with Presets */}
                    <div className="col-span-2 bg-custom/5 p-3 rounded-xl border border-custom/20">
                        <label htmlFor="customTime" className="block text-sm font-bold text-custom mb-2">Custom Timer</label>
                        <div className="flex gap-3 mb-3">
                           <input 
                              id="customTime"
                              type="number" 
                              value={settings.customTime}
                              onChange={(e) => handleChange('customTime', Number(e.target.value))}
                              className="w-24 p-2 bg-card rounded-lg text-primary outline-none focus:ring-2 ring-custom/50 text-center font-bold"
                          />
                          <div className="flex-1 flex flex-col justify-center text-xs text-muted">
                            <span>Manually enter minutes or pick a preset below.</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CUSTOM_PRESETS.map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => handleChange('customTime', preset)}
                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-colors ${settings.customTime === preset ? 'bg-custom text-white shadow-md' : 'bg-card text-muted hover:text-custom border border-transparent hover:border-custom/30'}`}
                                >
                                    {preset}m
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Automation */}
            <section>
                 <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Monitor size={14} aria-hidden="true"/> Automation</h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span id="auto-breaks-label" className="text-primary">Auto-start Breaks</span>
                        <button 
                            role="switch"
                            aria-checked={settings.autoStartBreaks}
                            aria-labelledby="auto-breaks-label"
                            onClick={() => handleChange('autoStartBreaks', !settings.autoStartBreaks)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${settings.autoStartBreaks ? 'bg-green-500' : 'bg-input'}`}
                        >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <span id="auto-pomo-label" className="text-primary">Auto-start Pomodoros</span>
                        <button 
                            role="switch"
                            aria-checked={settings.autoStartPomodoros}
                            aria-labelledby="auto-pomo-label"
                            onClick={() => handleChange('autoStartPomodoros', !settings.autoStartPomodoros)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${settings.autoStartPomodoros ? 'bg-green-500' : 'bg-input'}`}
                        >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                 </div>
            </section>

             {/* Sound & Goals */}
             <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">Misc</h3>
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span id="sound-enabled-label" className="text-primary flex items-center gap-2"><Bell size={16} aria-hidden="true"/> Sound Enabled</span>
                        <button 
                            role="switch"
                            aria-checked={settings.soundEnabled}
                            aria-labelledby="sound-enabled-label"
                            onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${settings.soundEnabled ? 'bg-green-500' : 'bg-input'}`}
                        >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                         <label htmlFor="dailyGoal" className="text-primary flex items-center gap-2"><Target size={16} aria-hidden="true"/> Daily Goal</label>
                         <input 
                            id="dailyGoal"
                            type="number" 
                            min="1"
                            value={settings.dailyGoal}
                            onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                            className="w-20 p-2 bg-input rounded-lg text-right font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                         <label htmlFor="longBreakInterval" className="text-primary">Long Break Interval</label>
                         <input 
                            id="longBreakInterval"
                            type="number" 
                            min="1"
                            value={settings.longBreakInterval}
                            onChange={(e) => handleChange('longBreakInterval', Number(e.target.value))}
                            className="w-20 p-2 bg-input rounded-lg text-right font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
             </section>
        </div>
        
        <div className="p-4 border-t border-border bg-input/30">
             <button onClick={onClose} className="w-full py-3 bg-primary text-main font-bold rounded-xl hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Done
             </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;