import i18n from 'i18next';
import { initReactI18next, Translation } from 'react-i18next';
import en from './locales/es.json';
import fa from './locales/fa.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'fa',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
