import React from 'react';
import { useAnimations } from '../hooks/useAnimations';
import { useQuizTranslation } from '../hooks/useQuizTranslation';
import { QuizAnimations } from '../types';

interface ContinueButtonProps {
  onClick: () => void;
  primaryColor: string;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
  text?: 'next' | 'back' | 'continue' | 'submit' | 'start';
  disabled?: boolean;
  className?: string;
  animations?: QuizAnimations;
  hasError?: boolean;
  isFocused?: boolean;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  primaryColor,
  buttonText,
  text = 'continue',
  disabled = false,
  className = '',
  animations,
  hasError = false,
  isFocused = false,
}) => {
  const { translate } = useQuizTranslation();
  const { getButtonClasses } = useAnimations({
    animations,
    hasError,
    isFocused,
  });
  const getButtonText = () => {
    switch (text) {
      case 'next':
        return buttonText?.next || translate('buttons.next');
      case 'back':
        return buttonText?.back || translate('buttons.back');
      case 'continue':
        return buttonText?.continue || translate('buttons.continue');
      case 'submit':
        return buttonText?.submit || translate('buttons.submit');
      case 'start':
        return buttonText?.start || translate('buttons.start');
      default:
        return buttonText?.continue || translate('buttons.continue');
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full mt-4 bg-gradient-to-r ${primaryColor} text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none ${getButtonClasses} ${className}`}
    >
      {getButtonText()}
    </button>
  );
};
