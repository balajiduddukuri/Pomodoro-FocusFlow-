import React from 'react';
import { Settings, AppTheme } from '../types';
import { X, Clock, Bell, Target, Monitor, Palette } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-input/30">
          <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
            <Clock size={20} /> Settings
          </h2>
          <button onClick={onClose} className="text-muted hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
            {/* Theme Settings */}
            <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={14}/> Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'neon'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => onUpdateTheme(t as AppTheme)}
                            className={`py-2 px-3 rounded-lg border-2 font-bold capitalize transition-all ${theme === t ? 'border-pomo text-pomo bg-pomo/10' : 'border-border text-muted hover:border-muted'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </section>

            {/* Timer Settings */}
            <section>
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Timer (Minutes)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Pomodoro</label>
                        <input 
                            type="number" 
                            value={settings.pomodoroTime}
                            onChange={(e) => handleChange('pomodoroTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-pomo/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Short Break</label>
                        <input 
                            type="number" 
                            value={settings.shortBreakTime}
                            onChange={(e) => handleChange('shortBreakTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-short/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Long Break</label>
                        <input 
                            type="number" 
                            value={settings.longBreakTime}
                            onChange={(e) => handleChange('longBreakTime', Number(e.target.value))}
                            className="w-full p-2 bg-input rounded-lg text-primary outline-none focus:ring-2 ring-long/50"
                        />
                    </div>
                </div>
            </section>

            {/* Automation */}
            <section>
                 <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Monitor size={14}/> Automation</h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-primary">Auto-start Breaks</span>
                        <button 
                            onClick={() => handleChange('autoStartBreaks', !settings.autoStartBreaks)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.autoStartBreaks ? 'bg-green-500' : 'bg-input'}`}
                        >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-primary">Auto-start Pomodoros</span>
                        <button 
                            onClick={() => handleChange('autoStartPomodoros', !settings.autoStartPomodoros)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.autoStartPomodoros ? 'bg-green-500' : 'bg-input'}`}
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
                        <span className="text-primary flex items-center gap-2"><Bell size={16}/> Sound Enabled</span>
                        <button 
                            onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${settings.soundEnabled ? 'bg-green-500' : 'bg-input'}`}
                        >
                             <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="text-primary flex items-center gap-2"><Target size={16}/> Daily Goal</span>
                         <input 
                            type="number" 
                            min="1"
                            value={settings.dailyGoal}
                            onChange={(e) => handleChange('dailyGoal', Number(e.target.value))}
                            className="w-20 p-2 bg-input rounded-lg text-right font-bold text-primary"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="text-primary">Long Break Interval</span>
                         <input 
                            type="number" 
                            min="1"
                            value={settings.longBreakInterval}
                            onChange={(e) => handleChange('longBreakInterval', Number(e.target.value))}
                            className="w-20 p-2 bg-input rounded-lg text-right font-bold text-primary"
                        />
                    </div>
                </div>
             </section>
        </div>
        
        <div className="p-4 border-t border-border bg-input/30">
             <button onClick={onClose} className="w-full py-3 bg-primary text-main font-bold rounded-xl hover:opacity-90 transition-all">
                Done
             </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;