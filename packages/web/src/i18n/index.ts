import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import zhTW from 'antd/locale/zh_TW';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const ALL_LANGUAGES = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文（臺灣）', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
];

export const ANTD_LANG_MAP = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['zh-CN', 'zh-TW', 'en-US'],
    fallbackLng: 'zh-CN',
  });

export function getCurrentLanguage() {
  return i18n.language || localStorage.getItem('i18nextLng') || 'zh-CN';
}

export default i18n;
