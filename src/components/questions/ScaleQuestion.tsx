import React from 'react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { useQuizTranslation } from '../../hooks/useQuizTranslation';
import { ContinueButton } from '../ContinueButton';

interface ScaleQuestionProps {
  question: QuizQuestion;
  answer?: QuizAnswer;
  onAnswerSelect: (
    questionId: string | number,
    answer: QuizAnswer,
    shouldAutoAdvance?: boolean
  ) => void;
  onNext: () => void;
  autoAdvance: boolean;
  accentColor: string;
  primaryColor: string;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
}

export const ScaleQuestion: React.FC<ScaleQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  autoAdvance,
  accentColor,
  primaryColor,
  buttonText,
}) => {
  const { translate, translateText } = useQuizTranslation();

  const handleValueClick = (value: number) => {
    onAnswerSelect(
      question.id,
      {
        value,
        weight: question.scaleWeights?.[value] || {},
      },
      autoAdvance
    );
  };

  const scaleMax = question.scaleMax || 5;

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          {question.scaleLabels?.min
            ? translateText(question.scaleLabels.min)
            : translate('ui.stronglyDisagree')}
        </span>
        <span>
          {question.scaleLabels?.max
            ? translateText(question.scaleLabels.max)
            : translate('ui.stronglyAgree')}
        </span>
      </div>
      <div className="flex justify-between">
        {Array.from({ length: scaleMax }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            onClick={() => handleValueClick(value)}
            className={`w-12 h-12 rounded-full border-2 font-semibold transition-all duration-200 hover:shadow-md ${
              answer?.value === value
                ? `border-${accentColor} bg-${accentColor} text-white`
                : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {!autoAdvance && (
        <ContinueButton
          onClick={onNext}
          primaryColor={primaryColor}
          buttonText={buttonText}
          text="continue"
          disabled={!answer?.value}
        />
      )}
    </div>
  );
};
