import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../../locales/en.json";
import ptBR from "../../locales/pt-BR.json";

const LOCALE_STORAGE_KEY = "user_locale";

// Get stored locale or device locale
async function getInitialLocale(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored) return stored;

    // Fallback to device locale
    const deviceLocales = Localization.getLocales();
    const deviceLocale = deviceLocales[0]?.languageCode;
    return deviceLocale === "pt" ? "pt-BR" : "en";
  } catch {
    return "en";
  }
}

// Initialize i18next
export async function initI18n() {
  const locale = await getInitialLocale();

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      "pt-BR": { translation: ptBR },
    },
    lng: locale,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: "v4", // For React Native compatibility
  });
}

// Change language and persist
export async function changeLanguage(locale: "en" | "pt-BR") {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
