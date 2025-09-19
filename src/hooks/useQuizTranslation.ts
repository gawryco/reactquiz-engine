import { useTranslation as useI18nTranslation } from 'react-i18next';

export interface TranslatableText {
  key: string;
  params?: Record<string, any>;
}

export type TextValue = string | TranslatableText;

export const useQuizTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const translate = (key: string, params?: Record<string, any>) => {
    return t(key, params);
  };

  const translateText = (text: TextValue): string => {
    if (typeof text === 'string') return text;
    return t(text.key, text.params);
  };

  const changeLanguage = (locale: string) => {
    return i18n.changeLanguage(locale);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return Object.keys(i18n.options.resources || {});
  };

  return {
    translate,
    translateText,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    i18n,
  };
};
