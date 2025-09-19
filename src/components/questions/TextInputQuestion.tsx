import React from 'react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { useQuizTranslation } from '../../hooks/useQuizTranslation';
import { ContinueButton } from '../ContinueButton';

interface TextInputQuestionProps {
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

export const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  primaryColor,
  buttonText,
}) => {
  const { translate, translateText } = useQuizTranslation();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerSelect(question.id, {
      value: e.target.value,
      weight: question.weight || {},
    });
  };

  const currentLength = (answer?.value || '').length;
  const maxLength = question.maxLength || 500;

  return (
    <div className="space-y-4">
      <textarea
        placeholder={
          question.placeholder
            ? translateText(question.placeholder)
            : translate('ui.enterAnswer')
        }
        value={answer?.value || ''}
        onChange={handleTextChange}
        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
        rows={4}
        maxLength={maxLength}
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          {translate('ui.characters', {
            current: currentLength,
            max: maxLength,
          })}
        </span>
      </div>
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
