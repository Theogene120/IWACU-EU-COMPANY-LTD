import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useShop, Product } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { BUSINESS_PHONE } from '../constants';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const whatsappLink = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Hello, I want to order this product: ${product.title} (Price: ${formatPrice(product.price)})`;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.oldPrice && (
            <div className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
          )}
          {isLowStock && (
            <div className="bg-yellow-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg animate-pulse">
              LOW STOCK
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
              OUT OF STOCK
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <Link
            to={`/product/${product.id}`}
            className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Eye className="h-5 w-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={cn(
              "p-3 bg-white rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors",
              isOutOfStock && "opacity-50 cursor-not-allowed"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">{product.category}</p>
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full",
            product.stock > 10 ? "bg-green-50 text-green-600" : 
            product.stock > 0 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
          )}>
            {product.stock} IN STOCK
          </span>
        </div>
        
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-gray-900 font-bold mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
            />
          ))}
          <span className="text-[10px] text-gray-400 font-bold">({product.rating})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-lg font-black text-blue-900">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through font-bold">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={cn(
              "bg-blue-600 text-white text-[10px] font-black py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-1 shadow-lg shadow-blue-100",
              isOutOfStock && "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white text-[10px] font-black py-3 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center space-x-1 shadow-lg shadow-green-100"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
