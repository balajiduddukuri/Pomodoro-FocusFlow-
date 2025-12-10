import React from 'react';
import { TimerMode } from '../types';

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  mode: TimerMode;
  toggleTimer: () => void;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ timeLeft, totalTime, isActive, mode, toggleTimer }) => {
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getColor = () => {
    switch (mode) {
      case 'pomodoro': return 'text-pomo';
      case 'shortBreak': return 'text-short';
      case 'longBreak': return 'text-long';
      default: return 'text-muted';
    }
  };

  const getStrokeColor = () => {
     switch (mode) {
      case 'pomodoro': return 'stroke-pomo';
      case 'shortBreak': return 'stroke-short';
      case 'longBreak': return 'stroke-long';
      default: return 'stroke-muted';
    }
  }

  return (
    <div className="relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300" onClick={toggleTimer}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg]"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-input transition-colors duration-300"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s linear' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${getStrokeColor()} transition-colors duration-300`}
        />
      </svg>
      <div className={`absolute text-5xl font-bold tracking-widest ${getColor()} select-none`}>
        {formattedTime}
        <div className="text-sm font-medium text-center mt-2 tracking-normal opacity-70 uppercase">
          {isActive ? 'Pause' : 'Start'}
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;