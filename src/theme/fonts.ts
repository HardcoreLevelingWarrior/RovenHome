// src/constants/fonts.ts
export const fontFamilies = {
  fa: { regular: 'Vazirmatn-Regular', bold: 'Vazirmatn-Bold' },
  en: { regular: 'Poppins-Regular', bold: 'Poppins-Bold-copy' },
} as const;

export type FontWeight = 'regular' | 'bold';
