import React from 'react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { ContinueButton } from '../ContinueButton';

interface DatePickerQuestionProps {
  question: QuizQuestion;
  answer?: QuizAnswer;
  onAnswerSelect: (
    questionId: string | number,
    answer: QuizAnswer,
    shouldAutoAdvance?: boolean
  ) => void;
  onNext: () => void;
  primaryColor: string;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
}

export const DatePickerQuestion: React.FC<DatePickerQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  primaryColor,
  buttonText,
}) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerSelect(question.id, {
      value: e.target.value,
      weight: question.weight || {},
    });
  };

  return (
    <div className="space-y-4">
      <input
        type="date"
        value={answer?.value || ''}
        min={question.minDate}
        max={question.maxDate}
        onChange={handleDateChange}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
      />
      <ContinueButton
        onClick={onNext}
        primaryColor={primaryColor}
        buttonText={buttonText}
        text="continue"
        disabled={question.required && !answer?.value}
      />
    </div>
  );
};
