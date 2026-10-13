import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Star, Flame, ShoppingBag, Eye, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface BestSellingShowcaseProps {
  products: Product[];
}

export const BestSellingShowcase: React.FC<BestSellingShowcaseProps> = ({ products }) => {
  const { language, addToCart, navigateTo } = useApp();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '3ml' | '6ml'>>({});
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Best selling products (up to 8, display 4 by default)
  const allBestSellers = products.filter((p) => p.bestSeller);
  const displayProducts = showAll ? allBestSellers.slice(0, 8) : allBestSellers.slice(0, 4);

  const handleSizeChange = (e: React.MouseEvent, productId: string, size: '3ml' | '6ml') => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    navigateTo('product', { slug: product.slug });
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return {
          label: language === 'bn' ? '👑 #১ শীর্ষ বিক্রিত' : '👑 #1 TOP SELLER',
          bg: 'bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.6)]'
        };
      case 1:
        return {
          label: language === 'bn' ? '✨ #২ সর্বাধিক প্রশংসিত' : '✨ #2 MOST LOVED',
          bg: 'bg-gradient-to-r from-[#F5D77F] to-[#C5A059] text-black font-bold shadow-md'
        };
      case 2:
        return {
          label: language === 'bn' ? '🔥 #৩ গ্রাহক পছন্দ' : '🔥 #3 PATRON CHOICE',
          bg: 'bg-[#2A2832] border border-[#D4AF37]/60 text-[#F5D77F] font-bold shadow-sm'
        };
      default:
        return {
          label: language === 'bn' ? `⭐️ #${index + 1} বেস্টসেলার` : `⭐️ #${index + 1} BESTSELLER`,
          bg: 'bg-[#1C1B22] border border-[#3A3844] text-[#E0DCD3] font-medium'
        };
    }
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-hidden">
      {/* Ambient Eye-Catching Golden Halo Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-5 border-b border-[#23222A] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{language === 'bn' ? 'হাজারো ক্রেতার পছন্দের শীর্ষে' : 'TOP RATED & MOST PURCHASED'}</span>
            </span>
            <span className="hidden sm:inline-block text-xs text-[#8E8B83]">
              {language === 'bn' ? '• ১৮+ ঘণ্টা স্থায়ী নিখুঁত সুবাস' : '• 18+ Hours Sillage'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F3EFEA] tracking-tight flex items-center gap-3">
            <span className="h-7 sm:h-9 w-1.5 rounded-full bg-gradient-to-b from-[#FFF6E5] via-[#D4AF37] to-[#996515]"></span>
            <span>{language === 'bn' ? 'বেস্ট সেলিং (Best Selling)' : 'Best Selling'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49C] mt-2 max-w-xl">
            {language === 'bn'
              ? 'আমাদের সর্বাধিক বিক্রিত এবং গ্রাহকদের মুখে মুখে ছড়িয়ে পড়া সিগনেচার মাস্টারপিস আতরসমূহ।'
              : 'Our highest-demanded artisanal formulas, proven across thousands of connoisseurs.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {allBestSellers.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] bg-[#16151B] hover:bg-[#201F26] border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl transition-all duration-300 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              {showAll
                ? (language === 'bn' ? 'কম দেখুন (Top 4)' : 'Show Less (Top 4)')
                : (language === 'bn' ? 'সব বেস্ট সেলার (View All 8)' : 'View All 8')}
            </button>
          )}

          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#F3EFEA] flex items-center gap-1.5 transition-colors cursor-pointer py-2"
          >
            <span>{language === 'bn' ? 'সব ক্যাটালগ' : 'Explore All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Eye-Catching Cards Grid (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {displayProducts.map((product, index) => {
          const currentSize = selectedSizes[product.id] || '3ml';
          const currentImage = currentSize === '6ml'
            ? (product.images.find((img) => img.toLowerCase().includes('6ml')) || product.images[0])
            : (product.images.find((img) => !img.toLowerCase().includes('6ml')) || product.images[0]);
          const price = currentSize === '3ml' ? product.price3ml : product.price6ml;
          const originalPrice = currentSize === '3ml' ? product.originalPrice3ml : product.originalPrice6ml;
          const badge = getRankBadge(index);
          const isTopOne = index === 0;
          const variantStock = currentSize === '3ml'
            ? (product.stock3ml !== undefined ? product.stock3ml : product.stock)
            : (product.stock6ml !== undefined ? product.stock6ml : product.stock);
          const isOutOfStock = variantStock <= 0;

          return (
            <div
              key={product.id}
              onClick={() => navigateTo('product', { slug: product.slug })}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#16151B] via-[#121115] to-[#0D0C10] border transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between ${
                isTopOne
                  ? 'border-[#D4AF37] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/40'
                  : 'border-[#26242E] hover:border-[#D4AF37]/60 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.15)]'
              }`}
            >
              {/* Top Banner Ribbon / Rank Badge */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1 ${badge.bg}`}>
                  {badge.label}
                </span>

                {isOutOfStock && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950/90 border border-rose-500/70 text-rose-300 uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    <span>{language === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}</span>
                  </span>
                )}
              </div>

              {/* Fragrance Type on Top Right */}
              {product.fragranceType && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    {language === 'bn' ? (
                      product.fragranceType === 'Aquatic' ? 'অ্যাকোয়াটিক' :
                      product.fragranceType === 'Oud' ? 'উদ' :
                      product.fragranceType === 'Floral' ? 'ফ্লোরাল' :
                      product.fragranceType === 'Woody' ? 'উডি' :
                      product.fragranceType === 'Musk' ? 'মাস্ক' :
                      product.fragranceType
                    ) : product.fragranceType}
                  </span>
                </div>
              )}

              {/* High-Resolution Flacon Showcase Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-square bg-[#0B0B0C] overflow-hidden flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={language === 'bn' ? (product.nameBn || product.name) : product.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-108 filter brightness-[0.98] group-hover:brightness-105"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121115] via-transparent to-black/30 pointer-events-none" />

                {/* Quick Buy hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                  </span>
                </div>
              </div>

              {/* Information Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                <div className="space-y-1">
                  {/* Rating & Authenticity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{product.rating || '5.0'}</span>
                      <span className="text-[#7A7771]">({product.reviewsCount || 450}+)</span>
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#A88B46]">
                      {language === 'bn' ? '১০০% খাঁটি আতর' : '100% PURE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {language === 'bn' ? (product.nameBn || product.name) : product.name}
                  </h3>

                  {/* Description / Notes snippet */}
                  <p className="text-[11px] text-[#8E8B83] line-clamp-1 leading-relaxed">
                    {language === 'bn' && product.shortDescriptionBn
                      ? product.shortDescriptionBn
                      : product.shortDescription}
                  </p>
                </div>

                {/* Sizing & Pricing Box */}
                <div className="pt-2 border-t border-[#23222A] flex items-center justify-between">
                  {/* Size buttons */}
                  <div className="flex items-center gap-1 bg-[#18171E] p-1 rounded-xl border border-[#2B2934]">
                    {(['3ml', '6ml'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={(e) => handleSizeChange(e, product.id, sz)}
                        className={`py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          currentSize === sz
                            ? 'bg-[#D4AF37] text-black shadow-sm'
                            : 'text-[#A8A49C] hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="font-mono text-base font-bold text-white tracking-tight">
                      {formatBDT(price)}
                    </div>
                    {originalPrice && originalPrice > price && (
                      <div className="font-mono text-[10px] text-[#7A7771] line-through">
                        {formatBDT(originalPrice)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      if (isOutOfStock) return;
                      handleAddToCart(e, product);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      isOutOfStock
                        ? 'bg-[#18171D] border border-[#272630] text-[#615E58] cursor-not-allowed opacity-50'
                        : addedAnimation === product.id
                        ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-[0.98] cursor-pointer'
                        : 'bg-[#D4AF37] hover:bg-[#C5A059] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className={`w-3.5 h-3.5 ${isOutOfStock ? 'text-zinc-600' : ''}`} />
                    <span>
                      {isOutOfStock
                        ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')
                        : addedAnimation === product.id
                        ? (language === 'bn' ? 'কার্টে যুক্ত হয়েছে!' : 'Added to Cart!')
                        : (language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart')}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOutOfStock) return;
                      addToCart(product, currentSize, 1);
                      navigateTo('checkout');
                    }}
                    title={isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : (language === 'bn' ? 'সরাসরি কিনুন' : 'Instant Checkout')}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOutOfStock
                        ? 'bg-[#151419] border-[#222128] text-zinc-600 cursor-not-allowed opacity-40'
                        : 'bg-[#1F1E26] hover:bg-[#2A2934] border-[#3A3845] hover:border-[#D4AF37]/60 text-[#D4AF37] cursor-pointer hover:scale-105'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isOutOfStock ? 'fill-zinc-600' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
