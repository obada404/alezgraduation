import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commonEn from '../locales/common.en';
import commonAr from '../locales/common.ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: commonEn,
      },
      ar: {
        translation: commonAr,
      },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

