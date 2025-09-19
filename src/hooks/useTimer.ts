import { useState, useEffect, useCallback, useRef } from 'react';
import { QuizTimer } from '../types';

interface UseTimerProps {
  timer?: QuizTimer;
  onExpiry?: () => void;
  isActive?: boolean;
}

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isExpired: boolean;
  isWarning: boolean;
}

export const useTimer = ({
  timer,
  onExpiry,
  isActive = true,
}: UseTimerProps) => {
  const [state, setState] = useState<TimerState>({
    timeLeft: timer?.duration || 0,
    isRunning: false,
    isExpired: false,
    isWarning: false,
  });

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const expiredRef = useRef<boolean>(false);

  const startTimer = useCallback(() => {
    if (!timer?.enabled || intervalRef.current || expiredRef.current) return;

    setState((prev) => ({
      ...prev,
      timeLeft: timer.duration,
      isRunning: true,
      isExpired: false,
      isWarning: false,
    }));

    startTimeRef.current = Date.now();
    expiredRef.current = false;

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const newTimeLeft = Math.max(0, timer.duration - elapsed);
        const isExpired = newTimeLeft === 0;
        const isWarning = timer.warningThreshold
          ? newTimeLeft <= timer.warningThreshold
          : false;

        if (isExpired && !expiredRef.current) {
          expiredRef.current = true;
          // Clear interval immediately to prevent multiple calls
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Timer expired - call callbacks
          setTimeout(() => {
            if (timer.autoAdvanceOnExpiry && onExpiry) {
              onExpiry();
            }
            if (timer.onExpiry) {
              timer.onExpiry();
            }
          }, 0);
        }

        return {
          timeLeft: newTimeLeft,
          isRunning: !isExpired,
          isExpired,
          isWarning,
        };
      });
    }, 100);
  }, [timer?.enabled, timer?.duration, timer?.warningThreshold, onExpiry]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    expiredRef.current = false;
    setState({
      timeLeft: timer?.duration || 0,
      isRunning: false,
      isExpired: false,
      isWarning: false,
    });
  }, [timer?.duration]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start timer when active and timer is enabled
  useEffect(() => {
    if (
      isActive &&
      timer?.enabled &&
      !intervalRef.current &&
      !expiredRef.current
    ) {
      startTimer();
    } else if (!isActive || !timer?.enabled) {
      pauseTimer();
    }
  }, [isActive, timer?.enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  };
};
