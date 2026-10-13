import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Star, Gift, ShoppingBag, Eye, ArrowRight, Zap, Check, Sparkles } from 'lucide-react';

interface ExclusiveComboSectionProps {
  products: Product[];
}

export const ExclusiveComboSection: React.FC<ExclusiveComboSectionProps> = ({ products }) => {
  const { language, addToCart, navigateTo, setIsCartOpen } = useApp();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '3ml' | '6ml'>>({});
  const [addedAnimations, setAddedAnimations] = useState<Record<string, boolean>>({});

  // Filter only combo packs and gift sets
  const comboProducts = products.filter(
    (p) =>
      p.category === 'gift_set' ||
      p.category === 'combo' ||
      p.slug.includes('pack') ||
      p.slug.includes('box') ||
      p.name.toLowerCase().includes('pack') ||
      p.name.toLowerCase().includes('gift set') ||
      p.name.toLowerCase().includes('discovery box')
  );

  if (comboProducts.length === 0) {
    return null;
  }

  const handleSizeChange = (e: React.MouseEvent, productId: string, size: '3ml' | '6ml') => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleDirectAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || '3ml';
    addToCart(product, size, 1);
    
    // Trigger visual added animation
    setAddedAnimations((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedAnimations((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);

    // Also open cart preview smoothly
    setIsCartOpen(true);
  };

  const handleInstantBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || '3ml';
    addToCart(product, size, 1);
    navigateTo('checkout');
  };

  const getComboBadge = (slug: string, index: number) => {
    if (slug.includes('signature-trio')) {
      return {
        label: language === 'bn' ? '👑 সিগনেচার ট্রায়ো' : '👑 SIGNATURE TRIO',
        bg: 'bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.6)]'
      };
    }
    if (slug.includes('gentleman')) {
      return {
        label: language === 'bn' ? '🎩 জেন্টলম্যানস এডিট' : "🎩 GENTLEMAN'S EDIT",
        bg: 'bg-gradient-to-r from-blue-900 to-indigo-700 border border-indigo-400/50 text-white font-bold shadow-md'
      };
    }
    if (slug.includes('elegant-aura')) {
      return {
        label: language === 'bn' ? '✨ এলিগ্যান্ট অরা' : '✨ ELEGANT AURA',
        bg: 'bg-gradient-to-r from-rose-900 to-amber-800 border border-amber-400/50 text-[#F5D77F] font-bold shadow-sm'
      };
    }
    if (slug.includes('discovery')) {
      return {
        label: language === 'bn' ? '💎 ৬-ইন-১ কাস্টম বক্স' : '💎 6-PIECE COFFRET',
        bg: 'bg-gradient-to-r from-purple-950 via-[#2A1B3D] to-[#D4AF37]/40 border border-[#D4AF37] text-[#FFF6E5] font-extrabold shadow-md'
      };
    }
    return {
      label: language === 'bn' ? '🎁 স্পেশাল কম্বো' : '🎁 EXCLUSIVE SET',
      bg: 'bg-[#2A2832] border border-[#D4AF37]/60 text-[#F5D77F] font-bold shadow-sm'
    };
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-hidden">
      {/* Ambient Eye-Catching Golden Halo Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D4AF37]/8 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Header Section matching Best Selling and New Arrivals */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-5 border-b border-[#23222A] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/20 to-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D77F] text-[11px] font-mono font-bold tracking-wider uppercase">
              <Gift className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span>{language === 'bn' ? 'এক্সক্লুসিভ গিফট ও কম্বো অফার' : 'LUXURY BUNDLES & GIFT SETS'}</span>
            </span>
            <span className="hidden sm:inline-block text-xs text-[#8E8B83]">
              {language === 'bn' ? '• প্রিমিয়াম উপহার বক্স সহ ২৩% সাশ্রয়' : '• Save 23% + Luxury Presentation Box'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F3EFEA] tracking-tight flex items-center gap-3">
            <span className="h-7 sm:h-9 w-1.5 rounded-full bg-gradient-to-b from-[#FFF6E5] via-[#D4AF37] to-[#996515]"></span>
            <span>
              {language === 'bn'
                ? 'এক্সক্লুসিভ কম্বো প্যাক্স (Exclusive Combo Packs)'
                : 'Exclusive Combo Packs'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49C] mt-2 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'আমাদের সর্বাধিক প্রশংসিত মাস্টারপিস সুবাসগুলোর লাক্সারি কম্বো ও গিফট সেট — প্রিয়জনকে উপহার দিতে বা নিজের সম্ভার সাজাতে সেরা প্যাকেজ।'
              : 'Curated multi-flacon masterworks and velvet-cased coffret sets at exclusive bundle privileges.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#F3EFEA] flex items-center gap-1.5 transition-colors cursor-pointer py-2 group"
          >
            <span>{language === 'bn' ? 'সব কম্বো কালেকশন' : 'View All Combos'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid Layout (Identical to Best Selling: 1 col on mobile, 2 cols on tablet, 4 cols on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {comboProducts.map((product, index) => {
          const currentSize = selectedSizes[product.id] || '3ml';
          const currentImage = product.images?.[0] || '';
          const price = currentSize === '3ml' ? product.price3ml : product.price6ml;
          const originalPrice = currentSize === '3ml' ? product.originalPrice3ml : product.originalPrice6ml;
          const badge = getComboBadge(product.slug, index);
          const variantStock = currentSize === '3ml'
            ? (product.stock3ml !== undefined ? product.stock3ml : product.stock)
            : (product.stock6ml !== undefined ? product.stock6ml : product.stock);
          const isOutOfStock = variantStock <= 0;
          const isAdded = !!addedAnimations[product.id];

          return (
            <div
              key={product.id}
              onClick={() => navigateTo('product', { slug: product.slug })}
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#16151B] via-[#121115] to-[#0D0C10] border border-[#26242E] hover:border-[#D4AF37]/70 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.2)] transition-all duration-500 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Banner Ribbon / Rank Badge */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1 ${badge.bg}`}>
                  {badge.label}
                </span>

                {product.discount && product.discount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37]/90 text-black uppercase tracking-wider shadow-md">
                    {language === 'bn' ? `${product.discount}% ছাড়` : `${product.discount}% OFF`}
                  </span>
                )}

                {isOutOfStock && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-950/90 border border-rose-500/70 text-rose-300 uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                    <span>{language === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}</span>
                  </span>
                )}
              </div>

              {/* Gift Box Indicator on Top Right */}
              <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/75 border border-white/10 backdrop-blur-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  {language === 'bn' ? 'গিফট সেট' : 'Gift Set'}
                </span>
              </div>

              {/* High-Resolution Showcase Image Frame */}
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
                  {/* Rating & Inclusions badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                      <span className="text-[#7A7771]">({product.reviewsCount || 120}+)</span>
                    </div>

                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#A88B46]">
                      {language === 'bn' ? '১০০% খাঁটি ও হালাল' : '100% PURE & HALAL'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {language === 'bn' ? (product.nameBn || product.name) : product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-[#8E8B83] line-clamp-2 leading-relaxed">
                    {language === 'bn' && product.shortDescriptionBn
                      ? product.shortDescriptionBn
                      : product.shortDescription}
                  </p>

                  {/* Included Attars pills */}
                  {product.includedItems && product.includedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.includedItems.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#1B1A22] border border-[#2B2936] text-[9px] text-[#D8D4CA] font-mono"
                        >
                          {item}
                        </span>
                      ))}
                      {product.includedItems.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#1B1A22] text-[9px] text-[#D4AF37] font-mono">
                          +{product.includedItems.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
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

                {/* Action CTA Buttons matching request: direct Add to Cart and Instant Order */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Direct Add to Cart Button */}
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => handleDirectAddToCart(e, product)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
                      isOutOfStock
                        ? 'bg-[#18171D] border border-[#272630] text-[#615E58] cursor-not-allowed opacity-50'
                        : isAdded
                        ? 'bg-emerald-600 text-white shadow-emerald-900/50 scale-[0.98] cursor-pointer'
                        : 'bg-[#D4AF37] hover:bg-[#C5A059] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'কার্টে যুক্ত হয়েছে!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className={`w-3.5 h-3.5 ${isOutOfStock ? 'text-zinc-600' : ''}`} />
                        <span>
                          {isOutOfStock
                            ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')
                            : (language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart')}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Instant Checkout / Buy Now Direct Button */}
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={(e) => handleInstantBuyNow(e, product)}
                    title={isOutOfStock ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock') : (language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Instant Buy Now')}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOutOfStock
                        ? 'bg-[#151419] border-[#222128] text-zinc-600 cursor-not-allowed opacity-40'
                        : 'bg-[#1F1E26] hover:bg-[#2A2934] border-[#3A3845] hover:border-[#D4AF37]/60 text-[#D4AF37] cursor-pointer hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isOutOfStock ? 'fill-zinc-600' : 'fill-current'}`} />
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
