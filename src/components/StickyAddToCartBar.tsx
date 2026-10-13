import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Product } from '../types';
import {
  ShoppingBag,
  Zap,
  Check,
  ChevronRight,
  X,
  Sparkles,
  Flame
} from 'lucide-react';

export const StickyAddToCartBar: React.FC = () => {
  const {
    products,
    currentRoute,
    routeParams,
    language,
    addToCart,
    navigateTo,
    setIsCartOpen,
    cartCount
  } = useApp();

  // Scroll visibility threshold
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'3ml' | '6ml'>('3ml');
  const [addedStatus, setAddedStatus] = useState<boolean>(false);
  const [activeTrendingIndex, setActiveTrendingIndex] = useState(0);

  // Monitor window scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset dismissal when route changes
  useEffect(() => {
    setIsDismissed(false);
    setSelectedSize('3ml');
  }, [currentRoute, routeParams.slug]);

  // Curated list of top signature attars for non-product pages (Home, Shop, etc.)
  const trendingProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Prioritize popular attars
    const attars = products.filter(
      (p) => p.category === 'attar' && p.price3ml > 0
    );
    return attars.length > 0 ? attars.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  // Determine active product based on page
  const isProductPage = currentRoute === 'product';

  const activeProduct: Product | undefined = useMemo(() => {
    if (isProductPage && routeParams.slug) {
      return (
        products.find((p) => p.slug === routeParams.slug) ||
        products.find(
          (p) =>
            (routeParams.slug.includes('royal-sandal') && p.slug.includes('royal-sandal')) ||
            (routeParams.slug.includes('white-chandan') && p.slug.includes('white-chandan'))
        ) ||
        products[0]
      );
    }
    // For Home, Shop, or other pages: use trending product rotator
    return trendingProducts[activeTrendingIndex % trendingProducts.length] || products[0];
  }, [isProductPage, routeParams.slug, products, trendingProducts, activeTrendingIndex]);

  if (!activeProduct || isDismissed) {
    return null;
  }

  // Stock & Price calculation
  const price = selectedSize === '3ml' ? activeProduct.price3ml : activeProduct.price6ml;
  const originalPrice = selectedSize === '3ml' ? activeProduct.originalPrice3ml : activeProduct.originalPrice6ml;
  const stockFor3ml = activeProduct.stock3ml !== undefined ? activeProduct.stock3ml : activeProduct.stock;
  const stockFor6ml = activeProduct.stock6ml !== undefined ? activeProduct.stock6ml : activeProduct.stock;
  const currentStock = selectedSize === '3ml' ? stockFor3ml : stockFor6ml;
  const isOutOfStock = currentStock <= 0;

  // Single-click Add to Cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(activeProduct, selectedSize, 1);
    setAddedStatus(true);
    setTimeout(() => {
      setAddedStatus(false);
    }, 2000);
  };

  // Direct Buy Now / Order Now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(activeProduct, selectedSize, 1);
    navigateTo('checkout');
  };

  // Cycle to next trending attar (on home/shop pages)
  const handleNextTrending = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrendingIndex((prev) => (prev + 1) % trendingProducts.length);
  };

  // Tap product thumbnail/title to view product details
  const handleViewProduct = () => {
    if (!isProductPage) {
      navigateTo('product', { slug: activeProduct.slug });
    }
  };

  // Product page variant: Full-width edge-to-edge docked bar at bottom-0
  if (isProductPage) {
    return (
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#100F15]/98 backdrop-blur-2xl border-t border-[#D4AF37]/50 shadow-[0_-10px_35px_rgba(0,0,0,0.95)] transition-all duration-400 ease-out pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2.5 px-3.5 ${
          isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Row 1: Product Thumbnail, Title, Price & Size Selector */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#D4AF37]/40 bg-[#0B0B0E] shrink-0 shadow-md">
              <img
                src={activeProduct.images?.[0]}
                alt={activeProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-serif font-bold text-[#F3EFEA] truncate leading-tight">
                {language === 'bn' ? activeProduct.nameBn : activeProduct.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-sm font-bold text-[#E5C378]">
                  {formatBDT(price)}
                </span>
                {originalPrice > price && (
                  <span className="font-mono text-[10px] text-[#7A7771] line-through">
                    {formatBDT(originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3ml / 6ml Quick Switcher */}
          <div className="flex items-center bg-[#191820] border border-[#2B2936] rounded-lg p-0.5 shrink-0">
            <button
              onClick={() => setSelectedSize('3ml')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedSize === '3ml'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-sm'
                  : 'text-[#9E9B93] hover:text-white'
              }`}
            >
              3ml
            </button>
            <button
              onClick={() => setSelectedSize('6ml')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                selectedSize === '6ml'
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-sm'
                  : 'text-[#9E9B93] hover:text-white'
              }`}
            >
              6ml
            </button>
          </div>
        </div>

        {/* Row 2: Action Buttons */}
        <div className="grid grid-cols-12 gap-2 items-center">
          {/* Cart Icon preview with count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="col-span-2 py-2.5 bg-[#17161F] hover:bg-[#201F2B] border border-[#2D2B38] text-[#D4AF37] rounded-xl flex items-center justify-center relative cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0B0B0C] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Add to Cart Button */}
          <button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`col-span-5 py-2.5 px-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-98 ${
              isOutOfStock
                ? 'bg-[#18171D] border border-[#2B2A34] text-[#636058] cursor-not-allowed opacity-50'
                : addedStatus
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-[#1F1E26] hover:bg-[#2A2934] border border-[#3A3846] hover:border-[#D4AF37] text-[#F3EFEA] cursor-pointer'
            }`}
          >
            {addedStatus ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px]">{language === 'bn' ? 'যোগ হয়েছে' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[11px] truncate">
                  {language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}
                </span>
              </>
            )}
          </button>

          {/* Buy Now / Order Now Direct Button */}
          <button
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className={`col-span-5 py-2.5 px-2 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg active:scale-98 ${
              isOutOfStock
                ? 'bg-[#18171D] border border-[#2B2A34] text-[#636058] cursor-not-allowed opacity-40'
                : 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] cursor-pointer hover:shadow-[#D4AF37]/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="text-[11px] truncate">
              {language === 'bn' ? 'অর্ডার করুন' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Non-Product pages (Home, Shop, etc.): Luxury Floating Sticky Cart Card above the Mobile Bottom Nav
  return (
    <aside
      aria-label="Quick Add to Cart Bar"
      className={`md:hidden fixed bottom-[58px] left-2.5 right-2.5 z-40 bg-[#121118]/95 backdrop-blur-2xl border border-[#D4AF37]/50 rounded-2xl p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] transition-all duration-400 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-2.5">
        {/* Product Thumbnail (clickable) */}
        <div
          onClick={handleViewProduct}
          className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#D4AF37]/40 bg-[#0B0B0E] shrink-0 cursor-pointer shadow-md group"
          title={language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
        >
          <img
            src={activeProduct.images?.[0]}
            alt={activeProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Product Info & Price */}
        <div
          onClick={handleViewProduct}
          className="flex-1 min-w-0 cursor-pointer text-left"
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>{language === 'bn' ? 'সেরা পছন্দ' : 'TOP PICK'}</span>
            </span>
            <span className="text-[9px] text-[#8C8880]">· 3ml</span>
          </div>

          <h4 className="text-xs font-serif font-bold text-[#F3EFEA] hover:text-[#D4AF37] truncate leading-tight transition-colors">
            {language === 'bn' ? activeProduct.nameBn : activeProduct.name}
          </h4>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs font-bold text-[#E5C378]">
              {formatBDT(activeProduct.price3ml)}
            </span>
            {activeProduct.originalPrice3ml > activeProduct.price3ml && (
              <span className="font-mono text-[10px] text-[#7A7771] line-through">
                {formatBDT(activeProduct.originalPrice3ml)}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Direct 1-Click Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`py-2 px-3 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
              addedStatus
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] hover:shadow-[#D4AF37]/30'
            }`}
          >
            {addedStatus ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px]">{language === 'bn' ? 'যুক্ত হয়েছে ✓' : 'Added ✓'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px]">{language === 'bn' ? 'অর্ডার করুন' : 'Add to Bag'}</span>
              </>
            )}
          </button>

          {/* Shuffle to next trending attar */}
          {trendingProducts.length > 1 && (
            <button
              onClick={handleNextTrending}
              className="p-2 text-[#9A968D] hover:text-[#D4AF37] bg-[#181720] hover:bg-[#201F2B] border border-[#282632] rounded-xl transition-colors cursor-pointer"
              title={language === 'bn' ? 'পরবর্তী সুবাস দেখুন' : 'Next Fragrance'}
              aria-label="Next fragrance"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="p-1.5 text-[#6D6A63] hover:text-[#B5B0A4] transition-colors cursor-pointer"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
            aria-label="Dismiss bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
