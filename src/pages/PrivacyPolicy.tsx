import React from 'react';
import { BUSINESS_NAME, BUSINESS_EMAIL } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-blue">
      <h1 className="text-4xl font-bold mb-8">{t('privacyTitle')}</h1>
      <p>{t('privacyLastUpdated')}</p>
      <p>{t('privacyIntroPrefix')} {BUSINESS_NAME}, {t('privacyIntro')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('privacySection1Title')}</h2>
      <p>{t('privacySection1Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('privacySection2Title')}</h2>
      <p>{t('privacySection2Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('privacySection3Title')}</h2>
      <p>{t('privacySection3Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('privacySection4Title')}</h2>
      <p>{t('privacySection4Desc')} {BUSINESS_EMAIL}.</p>
    </div>
  );
};

export default PrivacyPolicy;
