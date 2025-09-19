import React from 'react';
import { QuizQuestion, QuizAnswer, QuizAnimations } from '../../types';
import { useTimer } from '../../hooks/useTimer';
import { useAnimations } from '../../hooks/useAnimations';
import { TimerDisplay } from '../TimerDisplay';
import { ContinueButton } from '../ContinueButton';

interface SliderQuestionProps {
  question: QuizQuestion;
  answer?: QuizAnswer;
  onAnswerSelect: (
    questionId: string | number,
    answer: QuizAnswer,
    shouldAutoAdvance?: boolean
  ) => void;
  onNext: () => void;
  autoAdvance: boolean;
  primaryColor: string;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
  animations?: QuizAnimations;
  quizTimer?: any;
}

export const SliderQuestion: React.FC<SliderQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  autoAdvance,
  primaryColor,
  buttonText,
  animations,
  quizTimer,
}) => {
  const value = answer?.value || question.min || 0;

  // Animation system
  const { getQuestionClasses, getTimingStyles } = useAnimations({
    animations,
  });

  // Question-level timer
  const questionTimer = useTimer({
    timer: question.timer,
    onExpiry: () => {
      if (question.timer?.autoAdvanceOnExpiry) {
        onNext();
      }
    },
    isActive: true,
  });

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onAnswerSelect(question.id, {
      value: newValue,
      weight: question.valueWeights?.[newValue] || {},
    });
  };

  return (
    <div className={`space-y-6 ${getQuestionClasses}`} style={getTimingStyles}>
      {/* Question Timer */}
      {question.timer?.enabled && question.timer?.showDisplay && (
        <div className="flex justify-center mb-4">
          <TimerDisplay
            timeLeft={questionTimer.timeLeft}
            isWarning={questionTimer.isWarning}
            isExpired={questionTimer.isExpired}
            formatTime={questionTimer.formatTime}
          />
        </div>
      )}

      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">{value}</div>
        <div className="text-sm text-gray-600">{question.unit || ''}</div>
      </div>
      <input
        type="range"
        min={question.min || 0}
        max={question.max || 100}
        step={question.step || 1}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-200 hover:bg-gray-300"
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{question.min || 0}</span>
        <span>{question.max || 100}</span>
      </div>
      <ContinueButton
        onClick={onNext}
        primaryColor={primaryColor}
        buttonText={buttonText}
        text="continue"
        animations={animations}
      />
    </div>
  );
};
