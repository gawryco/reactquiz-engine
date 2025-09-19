import { useState, useEffect, useMemo, useCallback } from 'react';
import { QuizConfig, QuizState, QuizAnswer, ConditionalLogic } from '../types';
import { useTimer } from './useTimer';
import { useQuizTranslation } from './useQuizTranslation';
import {
  validateLeadData,
  isLeadDataValid,
  getDefaultValidationRules,
  validateQuestionAnswer,
} from '../utils/validation';

const defaultConfig: Partial<QuizConfig> = {
  title: 'Take Our Quiz',
  subtitle: 'Discover personalized recommendations',
  branding: {
    colors: {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-green-500 to-emerald-600',
      accent: 'blue-500',
    },
    icon: null as any, // Will be set by component
  },
  behavior: {
    autoAdvance: true,
    showProgress: true,
    allowBack: true,
    saveProgress: true,
    shuffleOptions: false,
    buttonText: {
      next: 'Next',
      back: 'Back',
      continue: 'Continue',
      submit: 'Submit',
      start: 'Start Quiz',
    },
  },
  leadCapture: {
    enabled: true,
    title: 'Get Your Results!',
    subtitle: 'Enter your details to receive personalized recommendations',
    fields: [],
    privacyText: "🔒 Your data is secure. We don't send spam.",
  },
  questions: [],
  conditionalLogic: [],
  resultLogic: { type: 'scoring' },
  results: {},
  onSubmit: () => {},
};

export const useQuiz = (
  quizConfig: Partial<QuizConfig>,
  quizId: string = 'default-quiz'
) => {
  const { translate, translateText } = useQuizTranslation();
  const config = { ...defaultConfig, ...quizConfig } as QuizConfig;

  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: {},
    visitedSteps: new Set([0]),
    leadData: {},
    isSubmitted: false,
    validationErrors: {},
    leadValidationErrors: {},
    isTransitioning: false,
    transitionDirection: 'forward',
  });

  // Progress persistence
  useEffect(() => {
    if (config.behavior.saveProgress) {
      const savedData = localStorage.getItem(`quiz-${quizId}`);
      if (savedData) {
        try {
          const {
            step,
            answers: savedAnswers,
            leadData: savedLeadData,
          } = JSON.parse(savedData);
          setState((prev) => ({
            ...prev,
            currentStep: step,
            answers: savedAnswers,
            leadData: savedLeadData,
            visitedSteps: new Set(
              Array.from({ length: step + 1 }, (_, i) => i)
            ),
          }));
        } catch (e) {
          console.warn('Could not restore quiz progress');
        }
      }
    }
  }, [quizId, config.behavior.saveProgress]);

  // Save progress
  useEffect(() => {
    if (
      config.behavior.saveProgress &&
      (state.currentStep > 0 || Object.keys(state.answers).length > 0)
    ) {
      localStorage.setItem(
        `quiz-${quizId}`,
        JSON.stringify({
          step: state.currentStep,
          answers: state.answers,
          leadData: state.leadData,
        })
      );
    }
  }, [
    state.currentStep,
    state.answers,
    state.leadData,
    quizId,
    config.behavior.saveProgress,
  ]);

  // Filter questions based on conditional logic
  const visibleQuestions = useMemo(() => {
    return config.questions.filter((question) => {
      if (!config.conditionalLogic || config.conditionalLogic.length === 0) {
        return true;
      }

      const conditions = config.conditionalLogic.filter(
        (rule) => rule.questionId === question.id
      );
      if (conditions.length === 0) return true;

      // Check if ANY condition is met (for alternative paths)
      const shouldShow = conditions.some((condition) => {
        const dependentAnswer = state.answers[condition.dependsOn];
        if (!dependentAnswer) return false;

        if (condition.operator === 'equals') {
          return dependentAnswer.value === condition.value;
        }
        if (condition.operator === 'contains') {
          // For multi-choice questions, check if the selected options contain the condition value
          return (
            Array.isArray(dependentAnswer.value) &&
            dependentAnswer.value.some((ans) => ans.value === condition.value)
          );
        }
        if (condition.operator === 'not_equals') {
          return dependentAnswer.value !== condition.value;
        }
        return false;
      });

      // Debug logging for conditional logic
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
      ) {
        console.log(`Question ${question.id} (${question.question}):`, {
          conditions: conditions.map((c) => ({
            dependsOn: c.dependsOn,
            operator: c.operator,
            value: c.value,
          })),
          answers: state.answers,
          shouldShow,
        });
      }

      return shouldShow;
    });
  }, [config.questions, config.conditionalLogic, state.answers]);

  const validateAnswer = useCallback(
    (question: any, answer: QuizAnswer) => {
      return validateQuestionAnswer(question, answer, translate, translateText);
    },
    [translate, translateText]
  );

  const handleAnswerSelect = useCallback(
    (
      questionId: string | number,
      answer: QuizAnswer,
      shouldAutoAdvance?: boolean
    ) => {
      setState((prev) => {
        const newAnswers = { ...prev.answers, [questionId]: answer };

        // Find the question to check its type
        const question = visibleQuestions.find((q) => q.id === questionId);

        // Clear validation errors for this question if a valid answer is provided
        let hasValidAnswer = false;

        // Special validation for matrix questions
        if (question?.type === 'matrix') {
          hasValidAnswer =
            answer &&
            answer.value &&
            typeof answer.value === 'object' &&
            Object.keys(answer.value).length === (question.rows?.length || 0);
        } else {
          // Standard validation for other question types
          hasValidAnswer =
            answer &&
            ((typeof answer.value === 'string' && answer.value.trim() !== '') ||
              typeof answer.value === 'number' ||
              (Array.isArray(answer.value) && answer.value.length > 0) ||
              (typeof answer.value === 'object' && answer.value !== null));
        }

        const newValidationErrors = { ...prev.validationErrors };
        if (hasValidAnswer && newValidationErrors[questionId]) {
          delete newValidationErrors[questionId];
        }

        return {
          ...prev,
          answers: newAnswers,
          validationErrors: newValidationErrors,
        };
      });

      // Handle auto-advance after state update
      if (shouldAutoAdvance && config.behavior.autoAdvance) {
        // Start transition immediately for auto-advance
        setState((prev) => ({
          ...prev,
          isTransitioning: true,
          transitionDirection: 'forward',
        }));

        // Complete transition after animation duration
        const transitionDuration =
          config.behavior.animations?.timing?.questionTransition || 300;
        setTimeout(() => {
          setState((prevState) => {
            const currentQuestion = visibleQuestions[prevState.currentStep - 1];
            if (currentQuestion && currentQuestion.id === questionId) {
              // Trigger next step
              const nextStep = prevState.currentStep + 1;
              return {
                ...prevState,
                currentStep: nextStep,
                visitedSteps: new Set([...prevState.visitedSteps, nextStep]),
                isTransitioning: false,
              };
            }
            return prevState;
          });
        }, transitionDuration);
      }
    },
    [
      config.behavior.autoAdvance,
      config.behavior.animations,
      visibleQuestions,
      state.currentStep,
    ]
  );

  const handleNext = useCallback(() => {
    const currentQuestion = visibleQuestions[state.currentStep - 1];
    if (currentQuestion && state.currentStep > 0) {
      const answer = state.answers[currentQuestion.id];
      const errors = validateAnswer(currentQuestion, answer);

      if (errors.length > 0) {
        setState((prev) => ({
          ...prev,
          validationErrors: {
            ...prev.validationErrors,
            [currentQuestion.id]: errors,
          },
        }));
        return;
      }
    }

    // Start transition
    setState((prev) => ({
      ...prev,
      isTransitioning: true,
      transitionDirection: 'forward',
    }));

    // Complete transition after animation duration
    const transitionDuration =
      config.behavior.animations?.timing?.questionTransition || 300;
    setTimeout(() => {
      const nextStep = state.currentStep + 1;
      setState((prev) => ({
        ...prev,
        currentStep: nextStep,
        visitedSteps: new Set([...prev.visitedSteps, nextStep]),
        isTransitioning: false,
      }));
    }, transitionDuration);
  }, [
    state.currentStep,
    visibleQuestions,
    state.answers,
    validateAnswer,
    config.behavior.animations,
  ]);

  const handleBack = useCallback(() => {
    if (state.currentStep > 0 && config.behavior.allowBack) {
      // Start transition
      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        transitionDirection: 'backward',
      }));

      // Complete transition after animation duration
      const transitionDuration =
        config.behavior.animations?.timing?.questionTransition || 300;
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentStep: prev.currentStep - 1,
          isTransitioning: false,
        }));
      }, transitionDuration);
    }
  }, [
    state.currentStep,
    config.behavior.allowBack,
    config.behavior.animations,
  ]);

  const handleLeadDataChange = useCallback(
    (field: string, value: string) => {
      setState((prev) => {
        const newLeadData = { ...prev.leadData, [field]: value };

        // Validate the specific field
        const fieldConfig = config.leadCapture.fields.find(
          (f) => f.key === field
        );
        if (fieldConfig) {
          // Apply default validation rules if none specified
          const fieldWithValidation = {
            ...fieldConfig,
            validation:
              fieldConfig.validation ||
              getDefaultValidationRules(fieldConfig.type, fieldConfig.key),
          };

          const fieldErrors = validateLeadData(
            [fieldWithValidation],
            newLeadData,
            translate
          );
          const newLeadValidationErrors = { ...prev.leadValidationErrors };

          if (fieldErrors[field]) {
            newLeadValidationErrors[field] = fieldErrors[field];
          } else {
            delete newLeadValidationErrors[field];
          }

          return {
            ...prev,
            leadData: newLeadData,
            leadValidationErrors: newLeadValidationErrors,
          };
        }

        return {
          ...prev,
          leadData: newLeadData,
        };
      });
    },
    [config.leadCapture.fields]
  );

  const calculateResult = useCallback(() => {
    const { resultLogic, results } = config;

    switch (resultLogic.type) {
      case 'scoring':
        return calculateScoringResult();
      case 'conditional':
        return calculateConditionalResult();
      case 'weighted':
        return calculateWeightedResult();
      case 'custom':
        return resultLogic.calculation
          ? resultLogic.calculation(state.answers)
          : Object.keys(results)[0];
      default:
        return Object.keys(results)[0];
    }
  }, [state.answers, config]);

  const calculateScoringResult = useCallback(() => {
    const scores: Record<string, number> = {};
    Object.keys(config.results).forEach((resultId) => {
      scores[resultId] = 0;
    });

    Object.values(state.answers).forEach((answer) => {
      if (answer.weight) {
        Object.keys(answer.weight).forEach((resultId) => {
          if (scores.hasOwnProperty(resultId)) {
            scores[resultId] += answer.weight![resultId];
          }
        });
      }
    });

    return Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );
  }, [state.answers, config.results]);

  const calculateConditionalResult = useCallback(() => {
    const answerValues = Object.values(state.answers).map((a) => a.value);

    if (
      config.resultLogic.type === 'conditional' &&
      config.resultLogic.conditions
    ) {
      for (const condition of config.resultLogic.conditions) {
        if (condition.check(answerValues)) {
          return condition.result;
        }
      }
    }

    return Object.keys(config.results)[0];
  }, [state.answers, config]);

  const calculateWeightedResult = useCallback(() => {
    const scores: Record<string, number> = {};
    const weights =
      config.resultLogic.type === 'weighted'
        ? config.resultLogic.weights || {}
        : {};

    Object.keys(config.results).forEach((resultId) => {
      scores[resultId] = 0;
    });

    Object.entries(state.answers).forEach(([questionId, answer]) => {
      const questionWeight = weights[questionId] || 1;

      if (answer.weight) {
        Object.keys(answer.weight).forEach((resultId) => {
          if (scores.hasOwnProperty(resultId)) {
            scores[resultId] += answer.weight![resultId] * questionWeight;
          }
        });
      }
    });

    return Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );
  }, [state.answers, config]);

  const handleSubmit = useCallback(() => {
    const result = calculateResult();
    config.onSubmit(state.leadData, state.answers, result);
    setState((prev) => ({
      ...prev,
      isSubmitted: true,
      currentStep: prev.currentStep + 1,
    }));

    // Clear saved progress
    if (config.behavior.saveProgress) {
      localStorage.removeItem(`quiz-${quizId}`);
    }
  }, [calculateResult, config, state.leadData, state.answers, quizId]);

  // Quiz-level timer
  const quizTimer = useTimer({
    timer: config.behavior.timer,
    onExpiry: () => {
      // Auto-submit when quiz timer expires
      if (config.behavior.timer?.autoAdvanceOnExpiry) {
        handleSubmit();
      }
    },
    isActive:
      state.currentStep > 0 &&
      state.currentStep <= visibleQuestions.length &&
      !state.isSubmitted,
  });

  const resetQuiz = useCallback(() => {
    setState({
      currentStep: 0,
      answers: {},
      visitedSteps: new Set([0]),
      leadData: {},
      isSubmitted: false,
      validationErrors: {},
      leadValidationErrors: {},
      isTransitioning: false,
      transitionDirection: 'forward',
    });
  }, []);

  const progress =
    (state.currentStep /
      (visibleQuestions.length + (config.leadCapture.enabled ? 1 : 0))) *
    100;

  return {
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
  };
};
