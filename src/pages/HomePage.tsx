import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CoverflowCarousel } from '../components/CoverflowCarousel';
import { BestSellingShowcase } from '../components/BestSellingShowcase';
import { ExclusiveComboSection } from '../components/ExclusiveComboSection';
import { ScentFinderQuiz } from '../components/ScentFinderQuiz';
import { ASSET_IMAGES } from '../assets';
import { ArrowRight, Sparkles, Shield, Clock, Droplets, Star, Gift, Send, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

type FilterTagId = 'all' | 'oud' | 'fresh' | 'floral' | 'woody' | 'gourmand' | '3ml' | '6ml';

export const HomePage: React.FC = () => {
  const { products, language, t, navigateTo } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // All Products Slider ref and scroll state
  const allProductsSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<FilterTagId>('all');

  // Filter tags definition
  const filterTags: { id: FilterTagId; labelEn: string; labelBn: string; icon: string }[] = [
    { id: 'all', labelEn: 'All Attars', labelBn: 'সকল আতর', icon: '✨' },
    { id: 'oud', labelEn: 'Pure Oud', labelBn: 'খাঁটি উদ', icon: '🪵' },
    { id: 'fresh', labelEn: 'Fresh / Aquatic', labelBn: 'ফ্রেশ ও অ্যাকোয়াটিক', icon: '🌊' },
    { id: 'floral', labelEn: 'Floral', labelBn: 'ফ্লোরাল', icon: '🌹' },
    { id: 'woody', labelEn: 'Woody', labelBn: 'উডি', icon: '🌲' },
    { id: 'gourmand', labelEn: 'Gourmand', labelBn: 'মিষ্টি ও অ্যাম্বার', icon: '🍯' },
    { id: '3ml', labelEn: '3ml Available', labelBn: '৩ মিলি সাইজ', icon: '💧' },
    { id: '6ml', labelEn: '6ml Available', labelBn: '৬ মিলি সাইজ', icon: '💎' }
  ];

  // Real-time filtered products for "All Products" section
  const filteredAllProducts = useMemo(() => {
    if (selectedFilter === 'all') return products;

    return products.filter((p) => {
      const type = (p.fragranceType || '').toLowerCase();
      const name = (p.name + ' ' + (p.nameBn || '')).toLowerCase();
      const desc = (p.shortDescription || '').toLowerCase();
      const notes = [
        ...(p.notes?.top || []),
        ...(p.notes?.heart || []),
        ...(p.notes?.base || [])
      ].join(' ').toLowerCase();

      if (selectedFilter === 'oud') {
        return type.includes('oud') || name.includes('oud') || notes.includes('oud') || p.category === 'royal-oud';
      }
      if (selectedFilter === 'fresh') {
        return (
          type === 'aquatic' ||
          type === 'fresh' ||
          name.includes('aqua') ||
          desc.includes('fresh') ||
          desc.includes('aquatic') ||
          notes.includes('mint') ||
          notes.includes('marine') ||
          notes.includes('sea')
        );
      }
      if (selectedFilter === 'floral') {
        return (
          type === 'floral' ||
          type === 'musk' ||
          name.includes('rose') ||
          desc.includes('rose') ||
          desc.includes('jasmine') ||
          desc.includes('floral') ||
          notes.includes('rose') ||
          notes.includes('jasmine')
        );
      }
      if (selectedFilter === 'woody') {
        return (
          type === 'woody' ||
          type === 'sandalwood' ||
          desc.includes('wood') ||
          desc.includes('cedar') ||
          desc.includes('sandal') ||
          notes.includes('cedar') ||
          notes.includes('sandalwood') ||
          notes.includes('wood')
        );
      }
      if (selectedFilter === 'gourmand') {
        return (
          type === 'amber' ||
          type === 'oriental' ||
          type === 'gourmand' ||
          desc.includes('amber') ||
          desc.includes('sweet') ||
          desc.includes('vanilla') ||
          notes.includes('amber') ||
          notes.includes('vanilla') ||
          notes.includes('sweet')
        );
      }
      if (selectedFilter === '3ml') {
        return (p.price3ml ?? 0) > 0;
      }
      if (selectedFilter === '6ml') {
        return (p.price6ml ?? 0) > 0;
      }
      return true;
    });
  }, [products, selectedFilter]);

  const checkScroll = useCallback(() => {
    if (allProductsSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = allProductsSliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const el = allProductsSliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll, filteredAllProducts]);

  const handleFilterSelect = (filterId: FilterTagId) => {
    setSelectedFilter(filterId);
    if (allProductsSliderRef.current) {
      allProductsSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setTimeout(checkScroll, 150);
  };

  const scrollProducts = (direction: 'left' | 'right') => {
    if (allProductsSliderRef.current) {
      const scrollAmount = allProductsSliderRef.current.clientWidth * 0.75;
      allProductsSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 3 Curated Luxury Hero Banner Slides (User Cover Photos)
  const heroSlides = [
    {
      id: 1,
      image: ASSET_IMAGES.hero1,
      alt: 'VELLURE Luxury Attar Cover 1'
    },
    {
      id: 2,
      image: ASSET_IMAGES.hero2,
      alt: 'VELLURE Luxury Attar Cover 2'
    },
    {
      id: 3,
      image: ASSET_IMAGES.hero3,
      alt: 'VELLURE Luxury Attar Cover 3'
    }
  ];

  // Auto-slide every 5 seconds (standard normal timing)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  const newArrivalsList = products.filter((p) => p.newArrival);
  const coverflowProducts = newArrivalsList.length >= 4
    ? newArrivalsList
    : [...newArrivalsList, ...products.filter((p) => !p.newArrival)].slice(0, 8);

  const patronReviews = [
    {
      name: 'Mohammad Rashedul Karim',
      location: 'Gulshan 2, Dhaka',
      rating: 5,
      review:
        language === 'bn'
          ? 'বাক্কারাত রুজ আতরের ঘ্রাণ সত্যিই অভূতপূর্ব। জামদানি ও পাঞ্জাবিতে দিলে দুই দিন পর্যন্ত স্নিগ্ধ রাজকীয় সুবাস পাওয়া যায়।'
          : 'Baccarat Rouge is a masterpiece. The ethereal saffron and warm amber notes lingered on my panjabi for over 48 hours.',
      product: 'Baccarat Rouge (6ml)'
    },
    {
      name: 'Farhana Chowdhury',
      location: 'Chittagong Nasirabad',
      rating: 5,
      review:
        language === 'bn'
          ? 'মাস্ক সাফি ও কুল ওয়াটারের স্নিগ্ধতা মন ছুঁয়ে গেছে। কোনো উগ্রতা নেই, একদম ফ্রেশ ও আভিজাত্যপূর্ণ।'
          : 'Musk safi and Cool Water have this sublime, uplifting freshness that calms the senses. Fast cash on delivery service in Chattogram.',
      product: 'Musk safi (6ml)'
    },
    {
      name: 'Syed Nahian Ahmed',
      location: 'Sylhet Kumarpara',
      rating: 5,
      review:
        language === 'bn'
          ? 'ব্লু ডি শ্যানেল এবং রয়েল চন্দনের ব্লেন্ড একদম লাক্সারি পারফিউমের মতো। ঢাকা থেকে সিলেটে মাত্র দুই দিনে পার্সেল পেয়েছি।'
          : 'Blue de Chanel rivals luxury niche perfumery costing ten times more. The fresh citrus and smoky cedarwood dry-down is unforgettable.',
      product: 'Blue de Chanel (6ml)'
    }
  ];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1. Hero Section - Pure Crystal-Clear Auto-Rotating Showcase with Zoom-In (No Text Overlay) */}
      <section
        className="relative w-full h-[52vh] sm:h-[62vh] md:h-[72vh] lg:h-[80vh] min-h-[380px] max-h-[820px] overflow-hidden select-none bg-[#0B0B0C] cursor-pointer group"
        onClick={() => navigateTo('shop')}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Images with Smooth 1s Cross-fade & Ken Burns Zoom-In */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center filter brightness-100 contrast-[1.02] ${
                  idx === currentSlide ? 'animate-hero-zoom' : 'scale-100'
                }`}
              />
            </div>
          ))}

          {/* Very subtle bottom edge fade into the page background */}
          <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-[#0B0B0C] to-transparent pointer-events-none opacity-80" />
        </div>

        {/* Previous Slide Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous image"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group/btn"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-0.5" />
        </button>

        {/* Next Slide Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next image"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/45 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95 group/btn"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-0.5" />
        </button>

        {/* Slide Indicators / Thumb Dots at Bottom */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl pointer-events-auto">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9)]'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
                }`}
              >
                <span className="sr-only">Image {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Value Props Bar directly underneath the Hero Photo */}
      <section className="border-y border-[#23222A] bg-[#0E0D12] py-4 sm:py-5 px-4 sm:px-6 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs text-[#C5A059]">
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Droplets className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[#F3EFEA] font-medium">{language === 'bn' ? '১০০% খাঁটি অ্যালকোহলমুক্ত আতর' : '100% Pure Alcohol-Free Attar'}</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[#F3EFEA] font-medium">{language === 'bn' ? '১৮+ ঘণ্টা দীর্ঘস্থায়ী সুবাস' : '18+ Hours Longevity'}</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[#F3EFEA] font-medium">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি সারা দেশে' : 'Nationwide Cash on Delivery'}</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="text-[#F3EFEA] font-medium">{language === 'bn' ? 'আর্টিসানাল রাজকীয় সুবাস' : 'Rare Artisanal Formulations'}</span>
          </div>
        </div>
      </section>

      {/* 2. Best Selling - Eye-Catching Showcase Section */}
      <BestSellingShowcase products={products} />

      {/* Dedicated Exclusive Combo Packs (Combo & Gift Sets) Section */}
      <ExclusiveComboSection products={products} />

      {/* Scent Finder Quiz - Luxurious Golden Banner & Interactive Concierge */}
      <ScentFinderQuiz products={products} />

      {/* 3. All Products Showcase Slider with Left & Right Navigation Arrows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/slider">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1E1D24] gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#F3EFEA] tracking-tight flex items-center gap-3">
              <span className="h-6 sm:h-8 w-1 rounded-full bg-[#D4AF37]"></span>
              <span>{language === 'bn' ? 'সকল প্রডাক্ট' : 'All Products'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* View Full Catalog Link */}
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#F3EFEA] flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
            >
              <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View Full Catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Left & Right Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollProducts('left')}
                disabled={!canScrollLeft}
                aria-label="Previous products / বামে"
                title={language === 'bn' ? 'আগের প্রডাক্ট' : 'Previous products'}
                className={`p-2.5 sm:p-3 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg ${
                  canScrollLeft
                    ? 'bg-[#18171E] hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border-[#D4AF37]/50 hover:border-[#D4AF37] hover:scale-105 active:scale-95'
                    : 'bg-[#121115] text-[#55524C] border-[#222126] cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollProducts('right')}
                disabled={!canScrollRight}
                aria-label="Next products / ডানে"
                title={language === 'bn' ? 'পরের প্রডাক্ট' : 'Next products'}
                className={`p-2.5 sm:p-3 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg ${
                  canScrollRight
                    ? 'bg-[#18171E] hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border-[#D4AF37]/50 hover:border-[#D4AF37] hover:scale-105 active:scale-95'
                    : 'bg-[#121115] text-[#55524C] border-[#222126] cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category & Note Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none -mt-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#8E8B83] font-mono mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">{language === 'bn' ? 'নোট ও সাইজ ফিল্টার:' : 'Filter:'}</span>
          </div>

          {filterTags.map((tag) => {
            const isSelected = selectedFilter === tag.id;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleFilterSelect(tag.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3DE97] to-[#D4AF37] text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.4)] border-[#D4AF37] scale-105'
                    : 'bg-[#151419] hover:bg-[#201F28] text-[#C2BDB2] hover:text-[#F3EFEA] border-[#2A2832] hover:border-[#D4AF37]/50'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{language === 'bn' ? tag.labelBn : tag.labelEn}</span>
                {isSelected && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/25 text-black font-mono font-bold">
                    {filteredAllProducts.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Horizontal Slider Track with Side Floating Arrows */}
        <div className="relative">
          {/* Floating Left Side Arrow for Desktop */}
          {canScrollLeft && filteredAllProducts.length > 0 && (
            <button
              type="button"
              onClick={() => scrollProducts('left')}
              aria-label="Scroll left"
              className="hidden xl:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-[#0F0E13]/90 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Floating Right Side Arrow for Desktop */}
          {canScrollRight && filteredAllProducts.length > 0 && (
            <button
              type="button"
              onClick={() => scrollProducts('right')}
              aria-label="Scroll right"
              className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-[#0F0E13]/90 hover:bg-[#D4AF37] text-white hover:text-[#0B0B0C] border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Products Horizontal Scroll Track or Empty State */}
          {filteredAllProducts.length === 0 ? (
            <div className="py-12 px-6 text-center rounded-2xl bg-[#141318] border border-[#23222A] w-full space-y-3">
              <p className="text-base text-[#F3EFEA] font-serif">
                {language === 'bn'
                  ? 'এই ফিল্টারে কোনো সুবাস পাওয়া যায়নি'
                  : 'No attars found in this selected note category'}
              </p>
              <button
                type="button"
                onClick={() => handleFilterSelect('all')}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-105"
              >
                {language === 'bn' ? 'সকল আতর দেখুন' : 'Show All Attars'}
              </button>
            </div>
          ) : (
            <div
              ref={allProductsSliderRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 snap-x snap-mandatory"
            >
              {filteredAllProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[240px] sm:w-[270px] md:w-[290px] shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. New Arrivals - 3D Coverflow Carousel Section */}
      <section className="relative w-full overflow-hidden pt-2 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-4 border-b border-[#1E1D24] gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#F3EFEA] tracking-tight flex items-center gap-3">
                <span className="h-6 sm:h-8 w-1 rounded-full bg-[#D4AF37]"></span>
                <span>{language === 'bn' ? 'নতুন আগমন' : 'New Arrivals'}</span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#8E8B83] hidden md:inline">
                {language === 'bn' ? 'মাউস বা টাচ দিয়ে সোয়াইপ করুন' : 'Click or swipe to rotate 3D'}
              </span>
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#F3EFEA] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{language === 'bn' ? 'সব নতুন আগমন দেখুন' : 'Explore All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D Coverflow Carousel */}
        <CoverflowCarousel products={coverflowProducts} />
      </section>



      {/* 5. Why Choose VELLURE (The VELLURE Distinction) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            UNCOMPROMISING PURITY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F3EFEA]">
            {t('whyChooseUs')}
          </h2>
          <p className="text-sm text-[#A8A49C]">
            {language === 'bn'
              ? 'আমাদের আতর তৈরিতে আপোষহীন গুণগত মান ও আভিজাত্যই আমাদের মূল শক্তি।'
              : 'Built upon centuries of Arabian craftsmanship, calibrated for modern discerning wearers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1920] border border-[#2E2C36] flex items-center justify-center text-[#D4AF37]">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#F3EFEA]">
              {language === 'bn' ? '১০০% খাঁটি অ্যালকোহলমুক্ত আতর' : 'Zero Synthetic Alcohol'}
            </h3>
            <p className="text-xs text-[#9E9B93] leading-relaxed">
              {language === 'bn'
                ? 'আমাদের আতরে কোনো ধরনের ইথাইল অ্যালকোহল বা কেমিক্যাল ডিলিউটেন্ট ব্যবহার করা হয় না। শতভাগ হালাল ও ইবাদতে ব্যবহারের উপযোগী।'
                : '100% pure concentrated oil essence. Free of chemical diluents, phthalates, and burning synthetics. Safe for prayers and daily spiritual rituals.'}
            </p>
          </div>

          <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1920] border border-[#2E2C36] flex items-center justify-center text-[#D4AF37]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#F3EFEA]">
              {language === 'bn' ? '১৮+ ঘণ্টা দীর্ঘস্থায়ী সুবাস' : 'Exceptional 18+ Hr Sillage'}
            </h3>
            <p className="text-xs text-[#9E9B93] leading-relaxed">
              {language === 'bn'
                ? 'আমাদের তেলের ঘনত্ব সর্বোচ্চ গ্রেডের হওয়ায় সাধারণ পারফিউমের তুলনায় এটি কাপড়ে ও ত্বকে বহুগুণ বেশি সময় ধরে সুবাস ছড়ায়।'
                : 'Because we use pure, viscous perfume oils rather than water-thinned solvents, VELLURE scents radiate with intense projection for up to 48 hours.'}
            </p>
          </div>

          <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A1920] border border-[#2E2C36] flex items-center justify-center text-[#D4AF37]">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#F3EFEA]">
              {language === 'bn' ? 'লাক্সারি ক্রিস্টাল প্যাকেজিং' : 'Regal Crystal Flacons'}
            </h3>
            <p className="text-xs text-[#9E9B93] leading-relaxed">
              {language === 'bn'
                ? 'প্রতিটি আতর আসে গোল্ড ফয়েল স্ট্যাম্পযুক্ত অভিজাত বক্সে, যা উপহার বা নিজের সংগ্রহের জন্য অতুলনীয়।'
                : 'Encased in custom cut-glass flacons with gold-finished caps and velveteen presentation boxes, ready for distinguished gifting.'}
            </p>
          </div>
        </div>
      </section>

      {/* 7. Patron Impressions (Customer Reviews) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            TESTIMONIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
            {t('customerReviews')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patronReviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#131217] border border-[#222129] p-7 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#C7C2B8] italic leading-relaxed">
                  "{item.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#23222A] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#F3EFEA]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#7A7771]">{item.location}</p>
                </div>
                <span className="text-[10px] text-[#D4AF37] bg-[#212028] px-2 py-0.5 rounded">
                  {item.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#121116] border border-[#26242E] p-8 sm:p-14 rounded-3xl space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            THE PRIVATE ATELIER CIRCLE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
            {t('joinClub')}
          </h2>
          <p className="text-sm text-[#A8A49C] max-w-lg mx-auto">
            {t('newsletterText')}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(
                language === 'bn'
                  ? 'ধন্যবাদ! ভ্যালুর প্রাইভেট ক্লাবে আপনাকে স্বাগতম।'
                  : 'Welcome to the VELLURE Private Circle. You will receive limited reserve updates.'
              );
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              placeholder="your.email@example.com"
              className="flex-1 bg-[#1A1920] border border-[#302E38] focus:border-[#D4AF37] text-sm text-[#F3EFEA] px-4 py-3 rounded-xl focus:outline-none placeholder-[#6E6A63]"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('subscribe')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
