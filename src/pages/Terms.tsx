import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-blue">
      <h1 className="text-4xl font-bold mb-8">{t('termsTitle')}</h1>
      <p>{t('termsLastUpdated')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('termsSection1Title')}</h2>
      <p>{t('termsSection1Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('termsSection2Title')}</h2>
      <p>{t('termsSection2Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('termsSection3Title')}</h2>
      <p>{t('termsSection3Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('termsSection4Title')}</h2>
      <p>{t('termsSection4Desc')}</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">{t('termsSection5Title')}</h2>
      <p>{t('termsSection5Desc')}</p>
    </div>
  );
};

export default Terms;
