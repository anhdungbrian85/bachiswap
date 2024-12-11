import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import các file ngôn ngữ
import HOME_KO from "../locales/ko/home.json";
import NODE_KO from "../locales/ko/node.json";
import AIRDROP_KO from "../locales/ko/airdrop.json";
import MENU_KO from "../locales/ko/menu.json";
import PrivacyPolicy_KO from "../locales/ko/PrivacyPolicy.json";
import Terms_KO from "../locales/ko/Terms.json";
import HOME_EN from "../locales/en/home.json";
import NODE_EN from "../locales/en/node.json";
import AIRDROP_EN from "../locales/en/airdrop.json";
import MENU_EN from "../locales/en/menu.json";
import PrivacyPolicy_EN from "../locales/en/PrivacyPolicy.json";
import Terms_EN from "../locales/en/Terms.json";
import HOME_HI from "../locales/hi/home.json";
import NODE_HI from "../locales/hi/node.json";
import AIRDROP_HI from "../locales/hi/airdrop.json";
import MENU_HI from "../locales/hi/menu.json";
import PrivacyPolicy_HI from "../locales/hi/PrivacyPolicy.json";
import Terms_HI from "../locales/hi/Terms.json";
import HOME_ARA from "../locales/ara/home.json";
import NODE_ARA from "../locales/ara/node.json";
import AIRDROP_ARA from "../locales/ara/airdrop.json";
import MENU_ARA from "../locales/ara/menu.json";
import PrivacyPolicy_ARA from "../locales/ara/PrivacyPolicy.json";
import Terms_ARA from "../locales/ara/Terms.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      home: HOME_EN,
      node: NODE_EN,
      airdrop: AIRDROP_EN,
      menu: MENU_EN,
      PrivacyPolicy: PrivacyPolicy_EN,
      Terms: Terms_EN,
    },
    ko: {
      home: HOME_KO,
      node: NODE_KO,
      airdrop: AIRDROP_KO,
      menu: MENU_KO,
      PrivacyPolicy: PrivacyPolicy_KO,
      Terms: Terms_KO,
    },
    hi: {
      home: HOME_HI,
      node: NODE_HI,
      airdrop: AIRDROP_HI,
      menu: MENU_HI,
      PrivacyPolicy: PrivacyPolicy_HI,
      Terms: Terms_HI,
    },
    ar: {
      home: HOME_ARA,
      node: NODE_ARA,
      airdrop: AIRDROP_ARA,
      menu: MENU_ARA,
      PrivacyPolicy: PrivacyPolicy_ARA,
      Terms: Terms_ARA,
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["home", "node", "airdrop", "menu", "PrivacyPolicy", "Terms"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
