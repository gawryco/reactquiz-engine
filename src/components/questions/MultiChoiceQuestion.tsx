import React from 'react';
import { CheckCircle } from 'lucide-react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { useQuizTranslation } from '../../hooks/useQuizTranslation';

interface MultiChoiceQuestionProps {
  question: QuizQuestion;
  answer?: QuizAnswer;
  onAnswerSelect: (
    questionId: string | number,
    answer: QuizAnswer,
    shouldAutoAdvance?: boolean
  ) => void;
  onNext: () => void;
  accentColor: string;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
}

export const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  accentColor,
  buttonText,
}) => {
  const { translateText } = useQuizTranslation();

  const handleOptionClick = (option: any) => {
    const currentAnswers =
      answer && Array.isArray(answer.value) ? answer.value : [];
    let newAnswers;
    const isSelected = currentAnswers.some((a) => a.value === option.value);

    if (isSelected) {
      newAnswers = currentAnswers.filter((a) => a.value !== option.value);
    } else {
      newAnswers = [...currentAnswers, option];
    }
    onAnswerSelect(question.id, {
      value: newAnswers,
      weight: option.weight || {},
    });
  };

  const isSelected = (option: any) => {
    return (
      answer &&
      Array.isArray(answer.value) &&
      answer.value.some((a) => a.value === option.value)
    );
  };

  const layout = question.layout || { type: 'list' };
  const isGrid = layout.type === 'grid';
  const columns = layout.columns || 2;
  const gap = layout.gap || 'md';

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }[gap];

  const gridClass = isGrid
    ? `grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} ${gapClass}`
    : 'space-y-3';

  return (
    <div className={gridClass}>
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 hover:shadow-md ${
            isSelected(option)
              ? `border-${accentColor} bg-blue-50`
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-6 h-6 border-2 rounded mr-4 transition-colors ${
                isSelected(option)
                  ? `border-${accentColor} bg-${accentColor}`
                  : 'border-gray-300'
              }`}
            >
              {isSelected(option) && (
                <CheckCircle className="w-full h-full text-white" />
              )}
            </div>
            <span className="text-gray-700 font-medium">
              {translateText(option.label)}
            </span>
          </div>
        </button>
      ))}
      <button
        onClick={onNext}
        disabled={
          !answer || (Array.isArray(answer.value) && answer.value.length === 0)
        }
        className={`w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none ${isGrid ? 'col-span-full' : ''}`}
      >
        {buttonText?.continue || 'Continue'}
      </button>
    </div>
  );
};
