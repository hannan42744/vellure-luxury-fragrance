import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Heart, Star, ShoppingBag, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, addToCart, navigateTo, isInWishlist, toggleWishlist } = useApp();
  const [selectedSize, setSelectedSize] = useState<'3ml' | '6ml'>('3ml');
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = React.useMemo(() => {
    if (selectedSize === '6ml') {
      const img6ml = product.images.find((img) => img.toLowerCase().includes('6ml'));
      if (img6ml) return img6ml;
    } else if (selectedSize === '3ml') {
      const img3ml =
        product.images.find((img) => img.toLowerCase().includes('3ml')) ||
        product.images.find((img) => !img.toLowerCase().includes('6ml'));
      if (img3ml) return img3ml;
    }
    return product.images[0];
  }, [product.images, selectedSize]);

  const price = selectedSize === '3ml' ? product.price3ml : product.price6ml;
  const originalPrice = selectedSize === '3ml' ? product.originalPrice3ml : product.originalPrice6ml;
  const inWishlist = isInWishlist(product.id);
  const currentVariantStock = selectedSize === '3ml'
    ? (product.stock3ml !== undefined ? product.stock3ml : product.stock)
    : (product.stock6ml !== undefined ? product.stock6ml : product.stock);
  const isOutOfStock = currentVariantStock <= 0;
  const isCompletelyOutOfStock = (product.stock <= 0) || (product.stock3ml !== undefined && product.stock6ml !== undefined && product.stock3ml <= 0 && product.stock6ml <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('product', { slug: product.slug });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('product', { slug: product.slug });
  };

  const handleCardClick = () => {
    navigateTo('product', { slug: product.slug });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#121215] border border-[#222126] hover:border-[#D4AF37]/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] cursor-pointer"
    >
      {/* Product Image Frame (65-75% height proportion) */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#161519] overflow-hidden flex items-center justify-center">
        {/* Fallback container with domain SVG icon while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#141317] to-[#1E1D22] flex items-center justify-center">
            <span className="font-display text-sm uppercase tracking-widest text-[#66635C]">VELLURE</span>
          </div>
        )}

        <img
          src={currentImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 cursor-pointer ${
            inWishlist
              ? 'bg-[#D4AF37] text-[#0B0B0C]'
              : 'bg-[#0B0B0C]/60 text-[#DCD8D0] hover:text-[#D4AF37] hover:bg-[#0B0B0C]'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Badge: max 1 quiet text badge or Out of Stock indicator */}
        {isOutOfStock ? (
          <div className="absolute top-3 left-3 bg-rose-950/90 border border-rose-500/70 text-rose-200 text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded shadow-lg uppercase flex items-center gap-1 z-10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            <span>{language === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}</span>
          </div>
        ) : product.discount > 0 ? (
          <div className="absolute top-3 left-3 bg-[#0B0B0C]/80 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded uppercase">
            -{product.discount}% OFF
          </div>
        ) : null}

        {/* Quick View Hover Overlay on desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2 pointer-events-none">
          <span className="bg-[#0B0B0C]/90 text-[#F3EFEA] border border-[#3A3840] px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Flacon'}</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        {/* Unboxed clean metadata with typographic separators */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#8E8B83] uppercase tracking-wider">
          <span className="truncate max-w-[70px] sm:max-w-none">{language === 'bn' ? product.categoryBn : product.category}</span>
          <span aria-hidden="true" className="text-[#4A4740]">·</span>
          <span className="truncate max-w-[70px] sm:max-w-none">{product.fragranceType}</span>
          {product.alcoholFree && (
            <>
              <span aria-hidden="true" className="text-[#4A4740] hidden xs:inline">·</span>
              <span className="text-[#C5A059] hidden xs:inline">{language === 'bn' ? 'অ্যালকোহলমুক্ত' : 'Pure Oil'}</span>
            </>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-serif text-base sm:text-xl font-medium text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {language === 'bn' ? product.nameBn : product.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#9E9B93] line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
            {language === 'bn' ? product.shortDescriptionBn : product.shortDescription}
          </p>
        </div>

        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between text-xs text-[#9E9B93]">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-[#D4AF37]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="font-mono tabular-nums text-white text-[11px] sm:text-xs font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] sm:text-[11px] text-[#706D66]">({product.reviewsCount})</span>
          </div>

          {/* Live In Stock / Out of Stock status */}
          <div className="text-[10px] font-mono">
            {isOutOfStock ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>{language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{language === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Size Selection Segmented Control & Price */}
        <div className="pt-1 flex items-center justify-between gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center p-0.5 bg-[#18171C] border border-[#27262D] rounded-lg">
            <button
              onClick={() => setSelectedSize('3ml')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedSize === '3ml'
                  ? 'bg-[#2A2930] text-[#D4AF37] shadow-sm'
                  : 'text-[#8E8B83] hover:text-[#F3EFEA]'
              }`}
            >
              3ml
            </button>
            <button
              onClick={() => setSelectedSize('6ml')}
              className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedSize === '6ml'
                  ? 'bg-[#2A2930] text-[#D4AF37] shadow-sm'
                  : 'text-[#8E8B83] hover:text-[#F3EFEA]'
              }`}
            >
              6ml
            </button>
          </div>

          {/* Pricing with Tabular numbers */}
          <div className="text-right">
            <div className="font-mono tabular-nums text-sm sm:text-lg font-semibold text-[#F3EFEA]">
              {formatBDT(price)}
            </div>
            {originalPrice > price && (
              <div className="font-mono tabular-nums text-[10px] sm:text-xs text-[#6B6862] line-through">
                {formatBDT(originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Dual Actions: Add to Cart & Buy Now */}
        <div className="pt-2 grid grid-cols-2 gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`w-full py-2 px-1.5 sm:px-3 text-[10px] sm:text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-h-[36px] ${
              isOutOfStock
                ? 'bg-[#151418] border border-[#26242C] text-[#615E58] cursor-not-allowed opacity-50'
                : 'bg-[#1A191E] hover:bg-[#25242B] border border-[#33313A] hover:border-[#D4AF37]/50 text-[#F3EFEA] cursor-pointer active:scale-95'
            }`}
            title={isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : t('addToCart')}
          >
            <ShoppingBag className={`w-3.5 h-3.5 shrink-0 ${isOutOfStock ? 'text-zinc-600' : 'text-[#D4AF37]'}`} />
            <span className="truncate">{isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : t('addToCart')}</span>
          </button>

          <button
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className={`w-full py-2 px-1.5 sm:px-3 text-[10px] sm:text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap shadow-sm min-h-[36px] ${
              isOutOfStock
                ? 'bg-[#18171C] text-[#615E58] border border-[#24232A] cursor-not-allowed opacity-40'
                : 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] cursor-pointer active:scale-95'
            }`}
            title={isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : t('buyNow')}
          >
            <Zap className={`w-3.5 h-3.5 shrink-0 ${isOutOfStock ? 'fill-zinc-600' : 'fill-current'}`} />
            <span className="truncate">{isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : t('buyNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
