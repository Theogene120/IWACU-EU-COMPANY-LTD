import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Phone, Mail, MapPin, Facebook, Instagram, Music2 } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_ADDRESS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

import { useShop } from '../context/ProductContext';

const Footer = () => {
  const { t } = useLanguage();
  const { siteSettings } = useShop();

  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              {siteSettings.logoUrl ? (
                <img 
                  src={siteSettings.logoUrl} 
                  alt={BUSINESS_NAME} 
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="bg-white p-2 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-900" />
                  </div>
                  <span className="text-xl font-bold">{BUSINESS_NAME}</span>
                </>
              )}
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              {t('footerAbout')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="http://web.facebook.com/profile.php?id=61582762229491" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/iwacu_eu_company_ltd?igsh=MXY5dzA1MGU0bm54Nw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://tiktok.com/@iwacu_eu_company_ltd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-orange-400 transition-all hover:scale-110"
              >
                <Music2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">{t('shop')}</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><Link to="/shop?category=Fashion" className="hover:text-orange-400 transition-colors">{t('catFashion')}</Link></li>
              <li><Link to="/shop?category=Shoes" className="hover:text-orange-400 transition-colors">{t('catShoes')}</Link></li>
              <li><Link to="/shop?category=Electronics" className="hover:text-orange-400 transition-colors">{t('catElectronics')}</Link></li>
              <li><Link to="/shop?category=Home Items" className="hover:text-orange-400 transition-colors">{t('catHomeItems')}</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">{t('informationTitle')}</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li><Link to="/about" className="hover:text-orange-400 transition-colors">{t('about')}</Link></li>
              <li><Link to="/delivery" className="hover:text-orange-400 transition-colors">{t('delivery')}</Link></li>
              <li><Link to="/order-tracking" className="hover:text-orange-400 transition-colors">{t('trackOrder')}</Link></li>
              <li><Link to="/privacy" className="hover:text-orange-400 transition-colors">{t('privacyPolicyLink')}</Link></li>
              <li><Link to="/terms" className="hover:text-orange-400 transition-colors">{t('termsLink')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-blue-800 pb-2">{t('contact')}</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 shrink-0" />
                <span>{BUSINESS_ADDRESS}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400 shrink-0" />
                <span>{BUSINESS_PHONE}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400 shrink-0" />
                <span>{BUSINESS_EMAIL}</span>
              </li>
              <li className="pt-2 border-t border-blue-800">
                <Link to="/admin/login" className="hover:text-orange-400 transition-colors text-[12px]">{t('loginAsAdmin')}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-blue-800 text-center text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} {BUSINESS_NAME}. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
