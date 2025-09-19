import React from 'react';
import { QuizQuestion, QuizAnswer } from '../../types';
import { ContinueButton } from '../ContinueButton';

interface MatrixQuestionProps {
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

export const MatrixQuestion: React.FC<MatrixQuestionProps> = ({
  question,
  answer,
  onAnswerSelect,
  onNext,
  primaryColor,
  buttonText,
}) => {
  const handleRadioChange = (rowIdx: number, colIdx: number, col: string) => {
    const currentAnswers = answer && answer.value ? answer.value : {};
    onAnswerSelect(question.id, {
      value: {
        ...currentAnswers,
        [rowIdx]: { row: question.rows?.[rowIdx], column: col, value: colIdx },
      },
      weight: {},
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col className="w-1/2" />
          {question.columns?.map((_, idx) => (
            <col key={idx} className="w-1/10" />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="p-3 text-left"></th>
            {question.columns?.map((col, idx) => (
              <th
                key={idx}
                className="p-2 text-xs font-medium text-gray-700 text-center min-w-0"
              >
                <div className="break-words">{col}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.rows?.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-700 text-sm">{row}</td>
              {question.columns?.map((col, colIdx) => (
                <td key={colIdx} className="p-2 text-center">
                  <input
                    type="radio"
                    name={`matrix-${question.id}-${rowIdx}`}
                    value={colIdx}
                    onChange={(e) => handleRadioChange(rowIdx, colIdx, col)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ContinueButton
        onClick={onNext}
        primaryColor={primaryColor}
        buttonText={buttonText}
        text="continue"
        className="mt-6"
      />
    </div>
  );
};
