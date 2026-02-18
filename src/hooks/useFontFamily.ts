// src/hooks/useFontFamily.ts   (یا در constants بذارید)
import { useTranslation } from 'react-i18next';
import { fontFamilies, FontWeight } from '../theme/fonts';

export function useFontFamily(weight: FontWeight = 'regular') {
  const { i18n } = useTranslation();

  const lang = i18n.language.startsWith('fa') ? 'fa' : 'en'; // fa-IR هم fa حساب میشه

  return fontFamilies[lang][weight];
}
