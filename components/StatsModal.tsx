import React from 'react';
import { SessionStat } from '../types';
import { X, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SessionStat[];
  totalSessions: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats, totalSessions }) => {
  if (!isOpen) return null;

  // Aggregate stats for chart (last 7 days usually, or just show all provided)
  const data = stats.slice(-7);

  const totalMinutes = stats.reduce((acc, curr) => acc + curr.minutesFocused, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-input/30">
          <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
            <BarChart2 size={20} /> Report
          </h2>
          <button onClick={onClose} className="text-muted hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-pomo/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-pomo">{hours}<span className="text-sm">h</span> {minutes}<span className="text-sm">m</span></div>
                    <div className="text-xs uppercase tracking-wide text-muted font-bold mt-1">Focus Time</div>
                </div>
                 <div className="bg-pomo/10 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-pomo">{totalSessions}</div>
                    <div className="text-xs uppercase tracking-wide text-muted font-bold mt-1">Sessions</div>
                </div>
            </div>

            <h3 className="text-md font-bold text-primary mb-4">Activity (Minutes)</h3>
            <div className="h-64 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis 
                                dataKey="date" 
                                tick={{fontSize: 12}} 
                                tickFormatter={(value) => value.split('-').slice(1).join('/')} 
                                axisLine={false}
                                tickLine={false}
                                stroke="var(--text-muted)"
                            />
                            <Tooltip 
                                cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            />
                            <Bar dataKey="minutesFocused" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="rgb(var(--color-pomo))" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted">
                        No activity yet
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;