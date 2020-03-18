import i18n from 'i18next';
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
const resource =  {
    en: {
        translation: {
            title: 'Covid-19 Stats',
            lastUpdated: 'Last updated: ',
            affected: 'Affected',
            activeCase: 'Active Case',
            recovered: 'Recovered',
            death: 'Death',
            overall: 'Overall',
            regionalActiveCases: 'Regional Active Cases',
            countryList: {
                title: 'Country List',
                country: 'Country',
                countryCode: 'Country Code',
                region: 'Region',
            }
        }
    },
    tr: {
        translation: {
            title: 'Korona Stats',
            lastUpdated: 'Son güncelleme: ',
            affected: 'Toplam Vaka',
            activeCase: 'Aktif Vaka',
            recovered: 'İyileşen',
            death: 'Ölen',
            overall: 'Genel',
            regionalActiveCases: 'Bölgesel Aktif Vakalar',
            countryList: {
                title: 'Ülke Listesi',
                country: 'Ülke',
                countryCode: 'Ülke Kodu',
                region: 'Bölge',
            }
        }
    }
};

i18n.use(LanguageDetector).use(initReactI18next).init(
    {
        resources: resource,
        fallbackLng: 'en'
    }
);

export default i18n;
