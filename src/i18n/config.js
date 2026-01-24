import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonAr from '../locales/common.ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: commonAr,
      },
    },
    lng: 'ar',
    fallbackLng: 'ar',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Set document direction to RTL when i18n is initialized
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('dir', 'rtl');
  document.documentElement.setAttribute('lang', 'ar');
}

export default i18n;

