import React, { useMemo } from 'react';
import { QuizAnimations } from '../types';

interface UseAnimationsProps {
  animations?: QuizAnimations;
  isTransitioning?: boolean;
  hasError?: boolean;
  isFocused?: boolean;
  transitionDirection?: 'forward' | 'backward';
}

export const useAnimations = ({
  animations,
  isTransitioning = false,
  hasError = false,
  isFocused = false,
  transitionDirection = 'forward',
}: UseAnimationsProps) => {
  const defaultAnimations: QuizAnimations = {
    transitions: {
      slideLeft: true,
      fadeIn: true,
      bounce: false,
      scale: false,
      slideUp: false,
    },
    timing: {
      questionTransition: 300,
      optionHover: 150,
      buttonHover: 200,
      progressUpdate: 300,
    },
    effects: {
      pulseOnSelect: true,
      shakeOnError: true,
      glowOnFocus: true,
    },
  };

  const config = { ...defaultAnimations, ...animations };

  const getButtonClasses = useMemo(() => {
    const classes: string[] = [];

    // Base transition
    classes.push('transition-all duration-200 ease-in-out transform');

    // Hover effects
    classes.push('hover:shadow-lg hover:scale-105 hover:shadow-xl');

    // Focus effects
    if (config.effects.glowOnFocus && isFocused) {
      classes.push('ring-2 ring-white ring-opacity-50 shadow-lg');
    }

    // Error effects
    if (config.effects.shakeOnError && hasError) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  }, [config, isFocused, hasError]);

  const getQuestionClasses = useMemo(() => {
    const classes: string[] = [];

    // Base transition
    classes.push('transition-all duration-300 ease-in-out');

    // Error effects
    if (config.effects.shakeOnError && hasError) {
      classes.push('animate-pulse');
    }

    return classes.join(' ');
  }, [config.effects.shakeOnError, hasError]);

  const getQuestionTransitionClasses = useMemo(() => {
    const classes: string[] = [];

    // Base transition classes with Tailwind
    classes.push('transition-all duration-300 ease-in-out');

    if (config.transitions.slideLeft) {
      if (isTransitioning) {
        if (transitionDirection === 'forward') {
          classes.push('-translate-x-full opacity-0 blur-sm');
        } else {
          classes.push('translate-x-full opacity-0 blur-sm');
        }
      } else {
        classes.push('translate-x-0 opacity-100 blur-0');
      }
    } else if (config.transitions.fadeIn) {
      if (isTransitioning) {
        classes.push('opacity-0 scale-95 blur-sm');
      } else {
        classes.push('opacity-100 scale-100 blur-0');
      }
    } else if (config.transitions.slideUp) {
      if (isTransitioning) {
        classes.push('-translate-y-8 opacity-0 blur-sm');
      } else {
        classes.push('translate-y-0 opacity-100 blur-0');
      }
    } else if (config.transitions.scale) {
      if (isTransitioning) {
        classes.push('scale-95 opacity-0 blur-sm');
      } else {
        classes.push('scale-100 opacity-100 blur-0');
      }
    }

    return classes.join(' ');
  }, [config, isTransitioning, transitionDirection]);

  const getTimingStyles = useMemo(() => {
    return {
      '--question-transition': `${config.timing.questionTransition}ms`,
      '--option-hover': `${config.timing.optionHover}ms`,
      '--button-hover': `${config.timing.buttonHover}ms`,
      '--progress-update': `${config.timing.progressUpdate}ms`,
    } as React.CSSProperties;
  }, [config.timing]);

  return {
    config,
    getButtonClasses,
    getQuestionClasses,
    getQuestionTransitionClasses,
    getTimingStyles,
  };
};
