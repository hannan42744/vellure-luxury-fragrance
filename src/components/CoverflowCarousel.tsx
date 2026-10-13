import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles, Star, ArrowRight } from 'lucide-react';

interface CoverflowCarouselProps {
  products: Product[];
}

export const CoverflowCarousel: React.FC<CoverflowCarouselProps> = ({ products }) => {
  const { language, addToCart, navigateTo } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Record<string, '3ml' | '6ml'>>({});
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Resize listener for fluid responsive transforms on mobile & PC
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch and drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const total = products.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval: every 4.5 seconds unless paused
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (!products || products.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
    touchEndX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    isDragging.current = false;
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    navigateTo('product', { slug: product.slug });
  };

  const handleSizeChange = (e: React.MouseEvent, productId: string, size: '3ml' | '6ml') => {
    e.stopPropagation();
    setSelectedSize((prev) => ({ ...prev, [productId]: size }));
  };

  return (
    <div
      className="relative w-full py-6 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Stage / Viewport */}
      <div
        className="relative h-[480px] sm:h-[530px] md:h-[560px] w-full flex items-center justify-center [perspective:1200px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        {products.map((product, idx) => {
          // Calculate offset relative to activeIndex (circular/wrapping offset)
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const absOffset = Math.abs(offset);
          // On mobile, show active + 1 on each side for cleaner touch viewport; on tablet/desktop show 2
          const isVisible = windowWidth < 640 ? absOffset <= 1 : absOffset <= 2;

          if (!isVisible) return null;

          const isActive = offset === 0;
          const currentSize = selectedSize[product.id] || '3ml';
          const variantStock = currentSize === '3ml'
            ? (product.stock3ml !== undefined ? product.stock3ml : product.stock)
            : (product.stock6ml !== undefined ? product.stock6ml : product.stock);
          const isOutOfStock = (variantStock ?? 0) <= 0;
          const currentPrice = currentSize === '3ml' ? product.price3ml : product.price6ml;
          const originalPrice = currentSize === '3ml' ? product.originalPrice3ml : product.originalPrice6ml;
          const currentImage = currentSize === '6ml'
            ? (product.images.find((img) => img.toLowerCase().includes('6ml')) || product.images[0])
            : (product.images.find((img) => !img.toLowerCase().includes('6ml')) || product.images[0]);

          // Compute dynamic 3D transform variables
          let tx = 0;
          let rY = 0;
          let tz = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 20 - absOffset;

          if (offset === 0) {
            tx = 0;
            tz = 60;
            rY = 0;
            scale = 1.04;
            opacity = 1;
            zIndex = 30;
          } else if (offset === 1) {
            tx = windowWidth < 640 ? 100 : windowWidth < 1024 ? 180 : 250;
            tz = -70;
            rY = -34;
            scale = 0.86;
            opacity = 0.85;
          } else if (offset === -1) {
            tx = windowWidth < 640 ? -100 : windowWidth < 1024 ? -180 : -250;
            tz = -70;
            rY = 34;
            scale = 0.86;
            opacity = 0.85;
          } else if (offset === 2) {
            tx = windowWidth < 640 ? 175 : windowWidth < 1024 ? 320 : 440;
            tz = -170;
            rY = -48;
            scale = 0.72;
            opacity = 0.45;
          } else if (offset === -2) {
            tx = windowWidth < 640 ? -175 : windowWidth < 1024 ? -320 : -440;
            tz = -170;
            rY = 48;
            scale = 0.72;
            opacity = 0.45;
          }

          return (
            <div
              key={product.id}
              onClick={() => {
                if (isActive) {
                  navigateTo('product', { slug: product.slug });
                } else {
                  setActiveIndex(idx);
                }
              }}
              style={{
                transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${rY}deg) scale(${scale})`,
                zIndex,
                opacity
              }}
              className={`absolute top-0 bottom-0 m-auto w-[270px] sm:w-[310px] md:w-[335px] h-[440px] sm:h-[485px] md:h-[515px] rounded-3xl transition-all duration-500 ease-out cursor-pointer [transform-style:preserve-3d] ${
                isActive
                  ? 'border-2 border-[#D4AF37] shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.35)] ring-1 ring-[#D4AF37]/50'
                  : 'border border-[#2D2B35] shadow-[0_15px_30px_rgba(0,0,0,0.7)] hover:border-[#D4AF37]/50'
              } bg-gradient-to-b from-[#18171E] via-[#121116] to-[#0D0C10] flex flex-col justify-between overflow-hidden group`}
            >
              {/* Product Visual Container with Aspect Ratio */}
              <div className="relative w-full h-[54%] overflow-hidden bg-[#0A0A0C] shrink-0">
                <img
                  src={currentImage}
                  alt={language === 'bn' ? product.nameBn : product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121116] via-transparent to-black/35 pointer-events-none" />

                {/* Top Badge: New Arrival */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-[#D4AF37]/60 backdrop-blur-md shadow-md">
                  <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#F5D77F]">
                    {language === 'bn' ? 'নতুন আগমন' : 'NEW ARRIVAL'}
                  </span>
                </div>

                {/* Top Right: Fragrance Family */}
                {product.fragranceType && (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#121116]/85 border border-white/10 backdrop-blur-md">
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
              </div>

              {/* Product Information Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                      {language === 'bn' ? '১০০% খাঁটি আতর' : '100% PURE ATTAR'}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating || '4.9'}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {language === 'bn' ? (product.nameBn || product.name) : product.name}
                  </h3>

                  <p className="text-[11px] text-[#8E8B83] line-clamp-2 pt-0.5 min-h-[32px] leading-relaxed">
                    {language === 'bn' && product.shortDescriptionBn
                      ? product.shortDescriptionBn
                      : product.shortDescription}
                  </p>
                </div>

                {/* Size Selector Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-[#23222A]">
                  <div className="flex items-center gap-1 bg-[#1A1920] p-1 rounded-xl border border-[#2B2934]">
                    {(['3ml', '6ml'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={(e) => handleSizeChange(e, product.id, sz)}
                        className={`py-1 px-2.5 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                          currentSize === sz
                            ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-sm'
                            : 'text-[#A8A49C] hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>

                  {/* Price Display */}
                  <div className="text-right">
                    <div className="font-mono text-sm sm:text-base font-bold text-white">
                      {formatBDT(currentPrice)}
                    </div>
                    {originalPrice && originalPrice > currentPrice && (
                      <div className="font-mono text-[10px] text-[#7A7771] line-through">
                        {formatBDT(originalPrice)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Action Button for Active Card */}
                {isActive ? (
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
                          ? 'bg-emerald-600 text-white cursor-pointer'
                          : 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] hover:shadow-[#D4AF37]/30 cursor-pointer'
                      }`}
                    >
                      <ShoppingBag className={`w-3.5 h-3.5 ${isOutOfStock ? 'text-zinc-600' : ''}`} />
                      <span>
                        {isOutOfStock
                          ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')
                          : addedAnimation === product.id
                          ? (language === 'bn' ? 'যুক্ত হয়েছে!' : 'Added!')
                          : (language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('product', { slug: product.slug });
                      }}
                      className="p-2.5 rounded-xl bg-[#1D1C24] hover:bg-[#282732] border border-[#312F3D] text-[#D4AF37] transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-[11px] text-[#8E8B83] group-hover:text-[#D4AF37] transition-colors">
                    {language === 'bn' ? 'ক্লিক করে দেখুন' : 'Click to preview'}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Previous Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous fragrance"
          className="absolute left-2 sm:left-6 md:left-10 z-40 p-3 sm:p-3.5 rounded-full bg-black/65 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group/btn"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-0.5" />
        </button>

        {/* Next Navigation Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next fragrance"
          className="absolute right-2 sm:right-6 md:right-10 z-40 p-3 sm:p-3.5 rounded-full bg-black/65 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group/btn"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* Slide Indicators & Counter at bottom */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {/* Golden Dots / Pills */}
        <div className="flex items-center gap-2 bg-[#121116] px-4 py-2 rounded-full border border-[#23222A]">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? 'w-8 h-2 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Swipe Hint on Mobile */}
        <span className="text-[11px] text-[#7A7771] flex items-center gap-1 sm:hidden">
          <span>{language === 'bn' ? '⟵ ৩ডি রোটেট করতে সোয়াইপ করুন ⟶' : '⟵ Drag or swipe to rotate 3D ⟶'}</span>
        </span>
      </div>
    </div>
  );
};
