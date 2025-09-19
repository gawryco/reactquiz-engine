import { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { TextValue } from './hooks/useQuizTranslation';

export interface QuizOption {
  value: string;
  label: TextValue;
  image?: string;
  weight?: Record<string, number>;
}

export interface QuizQuestion {
  id: string | number;
  question: TextValue;
  description?: TextValue;
  type: QuestionType;
  required?: boolean;
  options?: QuizOption[];
  placeholder?: TextValue;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  scaleMax?: number;
  scaleLabels?: {
    min: TextValue;
    max: TextValue;
  };
  scaleWeights?: Record<number, Record<string, number>>;
  valueWeights?: Record<number, Record<string, number>>;
  weight?: Record<string, number>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: TextValue;
  };
  columns?: string[];
  rows?: string[];
  minDate?: string;
  maxDate?: string;
  layout?: {
    type: 'list' | 'grid';
    columns?: number;
    gap?: 'sm' | 'md' | 'lg';
  };
  timer?: QuizTimer;
}

export type QuestionType =
  | 'single-choice'
  | 'multi-choice'
  | 'scale'
  | 'slider'
  | 'text-input'
  | 'image-selection'
  | 'date-picker'
  | 'matrix';

export interface QuizAnswer {
  value: any;
  weight?: Record<string, number>;
}

export interface QuizBranding {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon: LucideIcon;
}

export interface QuizTimer {
  enabled: boolean;
  duration: number; // in seconds
  showDisplay?: boolean;
  autoAdvanceOnExpiry?: boolean;
  warningThreshold?: number; // seconds before expiry to show warning
  onExpiry?: () => void;
}

export interface QuizAnimations {
  transitions: {
    slideLeft?: boolean;
    fadeIn?: boolean;
    bounce?: boolean;
    scale?: boolean;
    slideUp?: boolean;
  };
  timing: {
    questionTransition?: number; // milliseconds
    optionHover?: number; // milliseconds
    buttonHover?: number; // milliseconds
    progressUpdate?: number; // milliseconds
  };
  effects: {
    pulseOnSelect?: boolean;
    shakeOnError?: boolean;
    glowOnFocus?: boolean;
  };
}

export interface QuizBehavior {
  autoAdvance?: boolean;
  showProgress?: boolean;
  allowBack?: boolean;
  saveProgress?: boolean;
  shuffleOptions?: boolean;
  timer?: QuizTimer;
  animations?: QuizAnimations;
  buttonText?: {
    next?: string;
    back?: string;
    continue?: string;
    submit?: string;
    start?: string;
  };
}

export interface LeadCaptureFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
  custom?: (value: string) => string | null; // Return error message or null if valid
}

export interface LeadCaptureField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel';
  required: boolean;
  icon: LucideIcon;
  validation?: LeadCaptureFieldValidation;
  placeholder?: string;
}

export interface LeadCapture {
  enabled: boolean;
  title: TextValue;
  subtitle: TextValue;
  fields: LeadCaptureField[];
  submitText?: TextValue;
  privacyText: TextValue;
}

export interface QuizResult {
  title: TextValue;
  description: TextValue;
  recommendations?: TextValue[];
  color: string;
  cta?: TextValue;
}

export interface ConditionalLogic {
  questionId: string | number;
  dependsOn: string | number;
  operator: 'equals' | 'contains' | 'not_equals';
  value: any;
}

export interface ScoringResultLogic {
  type: 'scoring';
}

export interface ConditionalResultLogic {
  type: 'conditional';
  conditions: Array<{
    check: (answers: any[]) => boolean;
    result: string;
  }>;
}

export interface WeightedResultLogic {
  type: 'weighted';
  weights?: Record<string | number, number>;
}

export interface CustomResultLogic {
  type: 'custom';
  calculation?: (answers: Record<string, QuizAnswer>) => string;
}

export type ResultLogic =
  | ScoringResultLogic
  | ConditionalResultLogic
  | WeightedResultLogic
  | CustomResultLogic;

export interface QuizI18nConfig {
  locale?: string;
  fallbackLocale?: string;
  translations?: Record<string, any>;
}

export type ShareImageAspect = 'square' | 'story' | 'tweet';

export interface ShareImageOptions {
  aspect?: ShareImageAspect;
}

export interface ResultsViewProps {
  quizId: string;
  resultKey: string;
  result: QuizResult;
  answers: Record<string, QuizAnswer>;
  leadData: Record<string, string>;
  branding: QuizBranding;
  translateText: (value: TextValue) => string;
  resetQuiz: () => void;
  onExportImage?: (blob: Blob, options: { aspect: ShareImageAspect }) => void;
}

export interface QuizConfig {
  title: TextValue;
  subtitle: TextValue;
  startButtonText?: TextValue;
  welcomeFooter?: TextValue;
  branding: QuizBranding;
  behavior: QuizBehavior;
  questions: QuizQuestion[];
  conditionalLogic?: ConditionalLogic[];
  resultLogic: ResultLogic;
  results: Record<string, QuizResult>;
  leadCapture: LeadCapture;
  thankYouMessage?: TextValue;
  i18n?: QuizI18nConfig;
  onSubmit: (
    leadData: Record<string, string>,
    answers: Record<string, QuizAnswer>,
    result: string
  ) => void;
}

export interface QuizState {
  currentStep: number;
  answers: Record<string, QuizAnswer>;
  visitedSteps: Set<number>;
  leadData: Record<string, string>;
  isSubmitted: boolean;
  validationErrors: Record<string, string[]>;
  leadValidationErrors: Record<string, string[]>;
  isTransitioning: boolean;
  transitionDirection: 'forward' | 'backward';
}

export interface QuizProps {
  quizConfig: Partial<QuizConfig>;
  quizId?: string;
  className?: string;
  renderResults?: (props: ResultsViewProps) => ReactNode;
}
