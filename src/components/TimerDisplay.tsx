import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  isWarning: boolean;
  isExpired: boolean;
  formatTime: (seconds: number) => string;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isWarning,
  isExpired,
  formatTime,
  className = '',
}) => {
  const getTimerColor = () => {
    if (isExpired) return 'text-red-500';
    if (isWarning) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getTimerBgColor = () => {
    if (isExpired) return 'bg-red-50 border-red-200';
    if (isWarning) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-2 rounded-lg border-2 ${getTimerBgColor()} ${className}`}
    >
      <Clock className={`w-4 h-4 mr-2 ${getTimerColor()}`} />
      <span className={`font-mono font-semibold text-sm ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
      {isWarning && !isExpired && (
        <AlertTriangle className="w-4 h-4 ml-2 text-orange-500 animate-pulse" />
      )}
    </div>
  );
};
