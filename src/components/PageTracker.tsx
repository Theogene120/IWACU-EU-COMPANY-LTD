import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ProductContext';

export default function PageTracker() {
  const location = useLocation();
  const { trackPageView } = useShop();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
}
