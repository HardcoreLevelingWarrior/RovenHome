// src/hooks/usePersistedLanguage.ts
import { useState, useEffect } from 'react';
import { MMKV, useMMKV, createMMKV } from 'react-native-mmkv';
import { useTranslation } from 'react-i18next';
import { storage } from '../services/storage/storage';

// ساخت instance (یکی از دو روش زیر کافیه)

// روش ۱: ساده‌ترین (پیشنهاد اول – بدون تنظیمات خاص)

// روش ۲: با تنظیمات (id یا رمزنگاری)
// const storage = MMKV.create({
//   id: 'language-storage',           // اختیاری – برای جداسازی چند دیتابیس
//   encryptionKey: 'my-secret-key-123', // اختیاری – اگر امنیت مهم باشه
// });
// const storage = MMKV({
//   id: 'language-storage',           // جدا کردن از بقیه داده‌ها
//   // encryptionKey: 'my-secret-key', // اگر امنیت می‌خوای
// });

const LANGUAGE_KEY = 'app_language';

export function usePersistedLanguage() {
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // چون MMKV کاملاً synchronous است، async لازم نیست
    const loadLanguage = () => {
      try {
        const savedLang = storage.getString(LANGUAGE_KEY);

        if (savedLang) {
          i18n.changeLanguage(savedLang);
        } else {
          i18n.changeLanguage('fa');
          storage.set(LANGUAGE_KEY, 'fa');
        }
      } catch (err) {
        // console.error('خطا در بارگذاری زبان از MMKV:', err);
        i18n.changeLanguage('fa');
      } finally {
        setIsReady(true);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = (lng: string) => {
    try {
      i18n.changeLanguage(lng);
      storage.set(LANGUAGE_KEY, lng);
    } catch (err) {
      console.error('خطا در ذخیره زبان:', err);
    }
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isLanguageReady: isReady,
  };
}
// import { useState, useEffect } from 'react';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useTranslation } from 'react-i18next';

// const LANGUAGE_KEY = '@app_language'; // کلید ذخیره در AsyncStorage

// export function usePersistedLanguage() {
//   const { i18n } = useTranslation();
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const loadLanguage = async () => {
//       try {
//         const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
//         if (savedLang) {
//           await i18n.changeLanguage(savedLang);
//         } else {
//           // اگر چیزی ذخیره نشده، پیش‌فرض فارسی
//           await i18n.changeLanguage('fa');
//           await AsyncStorage.setItem(LANGUAGE_KEY, 'fa');
//         }
//       } catch (err) {
//         console.error('خطا در بارگذاری زبان:', err);
//         // fallback به فارسی
//         await i18n.changeLanguage('fa');
//       } finally {
//         setIsReady(true);
//       }
//     };

//     loadLanguage();
//   }, []);

//   // تابع تغییر زبان + ذخیره
//   const changeLanguage = async (lng: string) => {
//     try {
//       await i18n.changeLanguage(lng);
//       // await AsyncStorage.setItem(LANGUAGE_KEY, lng);
//     } catch (err) {
//       console.error('خطا در ذخیره زبان:', err);
//     }
//   };

//   return {
//     currentLanguage: i18n.language,
//     changeLanguage,
//     isLanguageReady: isReady,
//   };
// }
