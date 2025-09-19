import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import React from 'react';
import { useAnimations } from '../hooks/useAnimations';
import { useQuiz } from '../hooks/useQuiz';
import { useQuizTranslation } from '../hooks/useQuizTranslation';
import { QuizProps } from '../types';
import ResultsView from './ResultsView';
import {
  getDefaultValidationRules,
  isLeadDataValid,
} from '../utils/validation';
import { TimerDisplay } from './TimerDisplay';
import {
  DatePickerQuestion,
  ImageSelectionQuestion,
  MatrixQuestion,
  MultiChoiceQuestion,
  ScaleQuestion,
  SingleChoiceQuestion,
  SliderQuestion,
  TextInputQuestion,
} from './questions';

export const Quiz: React.FC<QuizProps> = ({
  quizConfig,
  quizId = 'default-quiz',
  className = '',
}) => {
  const { translate, translateText } = useQuizTranslation();

  const {
    config,
    state,
    visibleQuestions,
    progress,
    quizTimer,
    handleAnswerSelect,
    handleNext,
    handleBack,
    handleLeadDataChange,
    handleSubmit,
    resetQuiz,
    calculateResult,
  } = useQuiz(quizConfig, quizId);

  // Animation system for question transitions
  const { getQuestionTransitionClasses, getTimingStyles } = useAnimations({
    animations: config.behavior.animations,
    isTransitioning: state.isTransitioning,
    transitionDirection: state.transitionDirection,
  });

  const renderQuestion = (question: any) => {
    const answer = state.answers[question.id];
    const commonProps = {
      question,
      answer,
      onAnswerSelect: handleAnswerSelect,
      onNext: handleNext,
      primaryColor: config.branding.colors.primary,
      accentColor: config.branding.colors.accent,
      autoAdvance: config.behavior.autoAdvance ?? true,
      buttonText: config.behavior.buttonText,
      animations: config.behavior.animations,
      quizTimer: config.behavior.timer?.enabled ? quizTimer : undefined,
    };

    switch (question.type) {
      case 'single-choice':
        return <SingleChoiceQuestion {...commonProps} />;
      case 'multi-choice':
        return <MultiChoiceQuestion {...commonProps} />;
      case 'scale':
        return <ScaleQuestion {...commonProps} />;
      case 'slider':
        return <SliderQuestion {...commonProps} />;
      case 'text-input':
        return <TextInputQuestion {...commonProps} />;
      case 'image-selection':
        return <ImageSelectionQuestion {...commonProps} />;
      case 'date-picker':
        return <DatePickerQuestion {...commonProps} />;
      case 'matrix':
        return <MatrixQuestion {...commonProps} />;
      default:
        return <SingleChoiceQuestion {...commonProps} />;
    }
  };

  // Welcome Screen
  if (state.currentStep === 0) {
    const IconComponent = config.branding.icon;

    return (
      <div
        className={`max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl ${className}`}
      >
        <div className="text-center">
          <div
            className={`w-16 h-16 bg-gradient-to-r ${config.branding.colors.primary} rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {translateText(config.title)}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {translateText(config.subtitle)}
          </p>
          <button
            onClick={handleNext}
            className={`bg-gradient-to-r ${config.branding.colors.primary} text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center mx-auto`}
          >
            {translateText(
              config.startButtonText ||
                config.behavior.buttonText?.start || {
                  key: 'defaults.startButtonText',
                }
            )}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
        {config.welcomeFooter && (
          <div className="mt-8 text-center text-sm text-gray-500">
            {translateText(config.welcomeFooter)}
          </div>
        )}
      </div>
    );
  }

  // Questions
  if (state.currentStep <= visibleQuestions.length) {
    const question = visibleQuestions[state.currentStep - 1];
    const errors = state.validationErrors[question.id] || [];

    return (
      <div
        className={`max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl ${getQuestionTransitionClasses} ${className}`}
        style={getTimingStyles}
      >
        {/* Progress Bar */}
        {config.behavior.showProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                {translate('ui.questionProgress', {
                  current: state.currentStep,
                  total: visibleQuestions.length,
                })}
              </span>
              <span>
                {translate('ui.progressComplete', {
                  percent: Math.round(progress),
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${config.branding.colors.primary} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          {config.behavior.allowBack ? (
            <button
              onClick={handleBack}
              disabled={state.currentStep <= 1}
              className="flex items-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              {config.behavior.buttonText?.back || translate('buttons.back')}
            </button>
          ) : (
            <div />
          )}

          {/* Quiz Timer */}
          {config.behavior.timer?.enabled &&
            config.behavior.timer?.showDisplay && (
              <TimerDisplay
                timeLeft={quizTimer.timeLeft}
                isWarning={quizTimer.isWarning}
                isExpired={quizTimer.isExpired}
                formatTime={quizTimer.formatTime}
              />
            )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {translateText(question.question)}
          </h2>

          {question.description && (
            <p className="text-gray-600 mb-6">
              {translateText(question.description)}
            </p>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              {errors.map((error, idx) => (
                <p key={idx} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          {renderQuestion(question)}
        </div>
      </div>
    );
  }

  // Lead Capture Form (if enabled)
  if (
    config.leadCapture.enabled &&
    state.currentStep === visibleQuestions.length + 1
  ) {
    // Apply default validation rules to fields that don't have them
    const fieldsWithValidation = config.leadCapture.fields.map((field) => ({
      ...field,
      validation:
        field.validation || getDefaultValidationRules(field.type, field.key),
    }));

    const isFormValid = isLeadDataValid(fieldsWithValidation, state.leadData);

    return (
      <div
        className={`max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl ${getQuestionTransitionClasses} ${className}`}
        style={getTimingStyles}
      >
        {/* Progress Bar */}
        {config.behavior.showProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{translate('ui.almostThere')}</span>
              <span>
                {translate('ui.progressComplete', {
                  percent: Math.round(progress),
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${config.branding.colors.primary} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Back button */}
        {config.behavior.allowBack && (
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {config.behavior.buttonText?.back || translate('buttons.back')}
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {translateText(config.leadCapture.title)}
          </h2>
          <p className="text-gray-600 mb-8">
            {translateText(config.leadCapture.subtitle)}
          </p>

          <div className="space-y-4 max-w-md mx-auto">
            {config.leadCapture.fields.map((field) => {
              const IconComponent = field.icon;
              const fieldErrors = state.leadValidationErrors[field.key] || [];
              const hasErrors = fieldErrors.length > 0;

              return (
                <div key={field.key} className="space-y-1">
                  <div className="relative">
                    <IconComponent
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        hasErrors ? 'text-red-400' : 'text-gray-400'
                      }`}
                    />
                    <input
                      type={field.type}
                      placeholder={field.placeholder || field.label}
                      value={state.leadData[field.key] || ''}
                      onChange={(e) =>
                        handleLeadDataChange(field.key, e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        hasErrors
                          ? 'border-red-300 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                      required={field.required}
                    />
                    {hasErrors && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                    )}
                  </div>
                  {hasErrors && (
                    <div className="space-y-1">
                      {fieldErrors.map((error, index) => (
                        <p
                          key={index}
                          className="text-sm text-red-600 flex items-center"
                        >
                          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full bg-gradient-to-r ${config.branding.colors.primary} text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center`}
            >
              {translateText(
                config.leadCapture.submitText ||
                  config.behavior.buttonText?.submit || {
                    key: 'defaults.leadCapture.submitText',
                  }
              )}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {translateText(config.leadCapture.privacyText)}
          </p>
        </div>
      </div>
    );
  }

  // Results Page (new, customizable)
  const resultType = calculateResult();
  const result = config.results[resultType];

  const resultsProps = {
    quizId,
    resultKey: resultType,
    result,
    answers: state.answers,
    leadData: state.leadData,
    branding: config.branding,
    translateText,
    resetQuiz,
  } as const;

  if (typeof (quizConfig as any).renderResults === 'function') {
    // Allow render prop override when provided via props
    // @ts-ignore legacy typing until consumers update
    return (quizConfig as any).renderResults(resultsProps);
  }

  return (
    <div
      className={`${getQuestionTransitionClasses} ${className}`}
      style={getTimingStyles}
    >
      <ResultsView {...resultsProps} />
    </div>
  );
};
