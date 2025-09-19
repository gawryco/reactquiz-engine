import { LeadCaptureField, LeadCaptureFieldValidation } from '../types';
import type { QuizAnswer } from '../types';

// Question-level validation utilities
export function validateQuestionAnswer(
  question: any,
  answer: QuizAnswer,
  translate: (key: string, params?: any) => string,
  translateText: (value: any) => string
): string[] {
  const errors: string[] = [];

  // Matrix question special handling
  if (question?.type === 'matrix') {
    if (question.required) {
      const hasAnswer = !!(
        answer &&
        answer.value &&
        typeof answer.value === 'object'
      );
      if (!hasAnswer) {
        errors.push(translate('validation.matrixRequired'));
        return errors;
      }
      const answeredRows = Object.keys(answer.value);
      const totalRows = question.rows?.length || 0;
      if (answeredRows.length < totalRows) {
        errors.push(
          translate('validation.matrixRequiredCount', { count: totalRows })
        );
      }
    }
    return errors;
  }

  // Presence validation (non-matrix)
  const hasAnswer = !!(
    answer &&
    ((typeof answer.value === 'string' && answer.value.trim() !== '') ||
      typeof answer.value === 'number' ||
      (Array.isArray(answer.value) && answer.value.length > 0) ||
      (typeof answer.value === 'object' && answer.value !== null))
  );

  if (question?.required && !hasAnswer) {
    errors.push(translate('validation.questionRequired'));
    return errors;
  }

  // Field-level validation rules
  if (question?.validation && answer && (answer as any).value) {
    const value = (answer as any).value;
    if (
      question.validation.minLength &&
      typeof value === 'string' &&
      value.length < question.validation.minLength
    ) {
      errors.push(
        translate('validation.minCharacters', {
          count: question.validation.minLength,
        })
      );
    }
    if (
      question.validation.maxLength &&
      typeof value === 'string' &&
      value.length > question.validation.maxLength
    ) {
      errors.push(
        translate('validation.maxCharacters', {
          count: question.validation.maxLength,
        })
      );
    }
    if (
      question.validation.pattern &&
      typeof value === 'string' &&
      !new RegExp(question.validation.pattern).test(value)
    ) {
      const message = question.validation.message
        ? translateText(question.validation.message)
        : translate('validation.pattern');
      errors.push(message);
    }
  }

  return errors;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  phoneUS: /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  phoneInternational: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s'-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};

// Default validation messages (fallback for when translations are not available)
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  phoneUS: 'Please enter a valid US phone number (e.g., (555) 123-4567)',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  pattern: 'Invalid format',
  name: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
  alphanumeric: 'Please use only letters and numbers',
  url: 'Please enter a valid URL',
};

// Function to get translated validation messages
export const getValidationMessages = (
  translate: (key: string, params?: any) => string
) => ({
  required: translate('validation.required'),
  email: translate('validation.email'),
  phone: translate('validation.phone'),
  phoneUS: translate('validation.phoneUS'),
  minLength: (min: number) => translate('validation.minLength', { count: min }),
  maxLength: (max: number) => translate('validation.maxLength', { count: max }),
  pattern: translate('validation.pattern'),
  name: translate('validation.name'),
  alphanumeric: translate('validation.alphanumeric'),
  url: translate('validation.url'),
  questionRequired: translate('validation.questionRequired'),
  matrixRequired: translate('validation.matrixRequired'),
  matrixRequiredCount: (count: number) =>
    translate('validation.matrixRequiredCount', { count }),
  minCharacters: (count: number) =>
    translate('validation.minCharacters', { count }),
  maxCharacters: (count: number) =>
    translate('validation.maxCharacters', { count }),
});

/**
 * Validates a single lead capture field value
 */
export function validateLeadField(
  field: LeadCaptureField,
  value: string,
  translate?: (key: string, params?: any) => string
): string[] {
  const errors: string[] = [];
  const messages = translate
    ? getValidationMessages(translate)
    : VALIDATION_MESSAGES;

  // Check if required field is empty
  if (field.required && (!value || value.trim() === '')) {
    errors.push(messages.required);
    return errors; // Return early if required field is empty
  }

  // Skip validation if field is empty and not required
  if (!value || value.trim() === '') {
    return errors;
  }

  const trimmedValue = value.trim();

  // Apply validation rules (either custom or type-specific defaults)
  if (field.validation) {
    // Use custom validation rules
    const validationErrors = validateFieldWithRules(
      trimmedValue,
      field.validation,
      messages
    );
    errors.push(...validationErrors);
  } else {
    // Apply type-specific default validation
    if (field.type === 'email') {
      if (!VALIDATION_PATTERNS.email.test(trimmedValue)) {
        errors.push(messages.email);
      }
    } else if (field.type === 'tel') {
      // Default to international phone validation
      if (!VALIDATION_PATTERNS.phone.test(trimmedValue)) {
        errors.push(messages.phone);
      }
    }
  }

  return errors;
}

/**
 * Validates a field value against specific validation rules
 */
function validateFieldWithRules(
  value: string,
  rules: LeadCaptureFieldValidation,
  messages: any
): string[] {
  const errors: string[] = [];

  // Length validation
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(messages.minLength(rules.minLength));
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(messages.maxLength(rules.maxLength));
  }

  // Pattern validation
  if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
    errors.push(rules.message || messages.pattern);
  }

  // Custom validation function
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return errors;
}

/**
 * Validates all lead capture fields
 */
export function validateLeadData(
  fields: LeadCaptureField[],
  leadData: Record<string, string>,
  translate?: (key: string, params?: any) => string
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  fields.forEach((field) => {
    const fieldErrors = validateLeadField(
      field,
      leadData[field.key] || '',
      translate
    );
    if (fieldErrors.length > 0) {
      errors[field.key] = fieldErrors;
    }
  });

  return errors;
}

/**
 * Checks if lead data is valid (no validation errors)
 */
export function isLeadDataValid(
  fields: LeadCaptureField[],
  leadData: Record<string, string>,
  translate?: (key: string, params?: any) => string
): boolean {
  const errors = validateLeadData(fields, leadData, translate);
  return Object.keys(errors).length === 0;
}

/**
 * Gets default validation rules for common field types
 */
export function getDefaultValidationRules(
  fieldType: 'text' | 'email' | 'tel',
  fieldKey: string
): LeadCaptureFieldValidation | undefined {
  switch (fieldType) {
    case 'email':
      // Email validation is handled by type-specific validation, no additional rules needed
      return undefined;

    case 'tel':
      // Phone validation is handled by type-specific validation, no additional rules needed
      return undefined;

    case 'text':
      // Apply specific rules based on common field keys
      if (fieldKey.toLowerCase().includes('name')) {
        return {
          pattern: VALIDATION_PATTERNS.name.source,
          message: VALIDATION_MESSAGES.name,
          minLength: 2,
          maxLength: 50,
        };
      }

      if (
        fieldKey.toLowerCase().includes('url') ||
        fieldKey.toLowerCase().includes('website')
      ) {
        return {
          pattern: VALIDATION_PATTERNS.url.source,
          message: VALIDATION_MESSAGES.url,
        };
      }

      // Default text validation
      return {
        minLength: 1,
        maxLength: 100,
      };

    default:
      return undefined;
  }
}
