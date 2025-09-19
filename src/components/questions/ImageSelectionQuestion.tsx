import React from 'react';
import { CheckCircle } from 'lucide-react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { useQuizTranslation } from '../../hooks/useQuizTranslation';

interface ImageSelectionQuestionProps {
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
}

export const ImageSelectionQuestion: React.FC<ImageSelectionQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  autoAdvance,
  accentColor,
}) => {
  const { translateText } = useQuizTranslation();

  const handleOptionClick = (option: any) => {
    onAnswerSelect(question.id, option, autoAdvance);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`relative p-2 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              answer?.value === option.value
                ? `border-${accentColor} bg-blue-50`
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <img
              src={option.image}
              alt={translateText(option.label)}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <p className="text-sm font-medium text-gray-700">
              {translateText(option.label)}
            </p>
            {answer?.value === option.value && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {!autoAdvance && (
        <button
          onClick={onNext}
          disabled={!answer?.value}
          className={`w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none`}
        >
          Continue
        </button>
      )}
    </div>
  );
};
