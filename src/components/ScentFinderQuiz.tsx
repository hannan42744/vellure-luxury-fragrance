import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { 
  Sparkles, 
  Compass, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  Clock, 
  ShieldCheck,
  Flame,
  Droplets,
  Heart
} from 'lucide-react';

interface ScentFinderQuizProps {
  products: Product[];
}

interface Question {
  id: number;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  options: {
    id: string;
    labelEn: string;
    labelBn: string;
    descEn: string;
    descBn: string;
    icon: string;
    tag: string;
  }[];
}

export const ScentFinderQuiz: React.FC<ScentFinderQuizProps> = ({ products }) => {
  const { language, addToCart, navigateTo } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2, or 3 (results)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Quiz answers
  const [answers, setAnswers] = useState<{
    occasion?: string;
    notes?: string;
    intensity?: string;
  }>({});

  const [selectedSizes, setSelectedSizes] = useState<Record<string, '3ml' | '6ml'>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      titleEn: 'What occasion are you choosing for?',
      titleBn: 'আপনি কোন উপলক্ষে আতর পছন্দ করছেন?',
      subtitleEn: 'Select the primary setting for your new signature fragrance',
      subtitleBn: 'আপনার আতরটি প্রধানত কোন পরিবেশে ব্যবহার করতে চান তা নির্বাচন করুন',
      options: [
        {
          id: 'occas_daily',
          labelEn: 'Daily Wear & Prayers',
          labelBn: 'প্রতিদিনের ব্যবহার ও ইবাদত',
          descEn: 'Clean, serene, non-intrusive spiritual presence',
          descBn: 'স্নিগ্ধ, সতেজ ও শান্তিপূর্ণ পরিবেশের জন্য',
          icon: '🕌',
          tag: 'daily'
        },
        {
          id: 'occas_royal',
          labelEn: 'Royal Evenings & Weddings',
          labelBn: 'বিয়ে ও বিশেষ অনুষ্ঠান',
          descEn: 'Commanding, rich, opulent agarwood sillage',
          descBn: 'আভিজাত্যপূর্ণ, রাজকীয় ও দীর্ঘস্থায়ী উপস্থিতির জন্য',
          icon: '👑',
          tag: 'royal'
        },
        {
          id: 'occas_office',
          labelEn: 'Office & Professional',
          labelBn: 'অফিস ও কর্পোরেট মিটিং',
          descEn: 'Sophisticated, modern, fresh and crisp aura',
          descBn: 'মার্জিত, সতেজ ও আধুনিক ব্যক্তিত্ব প্রকাশের জন্য',
          icon: '💼',
          tag: 'office'
        },
        {
          id: 'occas_gift',
          labelEn: 'Luxury Gift for Someone Special',
          labelBn: 'প্রিয়জনকে উপহার',
          descEn: 'Universally loved bestsellers with prestige appeal',
          descBn: 'সর্বজনপ্রিয় ও আকর্ষণীয় প্রিমিয়াম আতর',
          icon: '🎁',
          tag: 'gift'
        }
      ]
    },
    {
      id: 2,
      titleEn: 'What scent notes do you naturally prefer?',
      titleBn: 'আপনার কোন ধরণের সুবাসের নোট সবচেয়ে প্রিয়?',
      subtitleEn: 'Choose the aromatic family that resonates with your senses',
      subtitleBn: 'আপনার ভালো লাগার সুগন্ধি পরিবারটি নির্বাচন করুন',
      options: [
        {
          id: 'notes_oud',
          labelEn: 'Royal Oud & Aged Woods',
          labelBn: 'রয়েল উদ ও চন্দন কাঠ',
          descEn: 'Deep agarwood, smoky resin, Mysore sandalwood',
          descBn: 'খাঁটি আগরউড, চন্দন ও অরণ্যের গভীর সুবাস',
          icon: '🪵',
          tag: 'oud'
        },
        {
          id: 'notes_fresh',
          labelEn: 'Fresh, Crisp & Aquatic',
          labelBn: 'সতেজ ও অ্যাকোয়াটিক',
          descEn: 'Ocean breeze, cool amber, Italian bergamot',
          descBn: 'সমুদ্রের সতেজ হাওয়া ও প্রাণবন্ত রিফ্রেশিং নোটস',
          icon: '🌊',
          tag: 'fresh'
        },
        {
          id: 'notes_floral',
          labelEn: 'Velvet Rose & Exotic Florals',
          labelBn: 'স্নিগ্ধ গোলাপ ও ফ্লোরাল',
          descEn: 'Damask rose, white jasmine, crystalline musk',
          descBn: 'দামাস্ক গোলাপ, জুঁই ও মৃদু কস্তুরির স্নিগ্ধতা',
          icon: '🌹',
          tag: 'floral'
        },
        {
          id: 'notes_sweet',
          labelEn: 'Warm Amber & Sweet Gourmand',
          labelBn: 'মিষ্টি অ্যাম্বার ও ভ্যানিলা মাস্ক',
          descEn: 'Golden amber, Madagascar vanilla, soft musk',
          descBn: 'উষ্ণ অ্যাম্বার, মিষ্টি ভ্যানিলা ও অভিজাত মাস্ক',
          icon: '🍯',
          tag: 'sweet'
        }
      ]
    },
    {
      id: 3,
      titleEn: 'Preferred longevity and sillage strength?',
      titleBn: 'আপনার পছন্দের সুবাসের তীব্রতা ও স্থায়িত্ব কেমন?',
      subtitleEn: 'How powerful would you like your fragrance trail to be?',
      subtitleBn: 'আতরটি কতটা দূরত্ব পর্যন্ত সুবাস ছড়াবে তা নির্ধারণ করুন',
      options: [
        {
          id: 'int_subtle',
          labelEn: 'Soft & Intimate Presence',
          labelBn: 'স্নিগ্ধ ও মৃদু সুবাস',
          descEn: 'Gentle 2-3 ft halo, calming and personal',
          descBn: 'কাছাকাছি মৃদু স্নিগ্ধ আভা, শান্ত ও মার্জিত',
          icon: '🍃',
          tag: 'subtle'
        },
        {
          id: 'int_balanced',
          labelEn: 'Balanced All-Day Allure',
          labelBn: 'ব্যালান্সড ও আকর্ষণীয় উপস্থিতি',
          descEn: 'Noticeable 4-6 ft projection, lasts 12+ hours',
          descBn: 'সবার নজর কাড়বে, সারাদিন ১২+ ঘণ্টা সতেজ থাকবে',
          icon: '✨',
          tag: 'balanced'
        },
        {
          id: 'int_commanding',
          labelEn: 'Heavy & Commanding (18+ Hours)',
          labelBn: 'তীব্র ও দীর্ঘস্থায়ী (১৮+ ঘণ্টা)',
          descEn: 'Royal sillage that lingers in the room long after',
          descBn: 'যে ঘরে যাবেন সুবাস ছড়িয়ে থাকবে, পোশাকে দিনভর রাজকীয় স্থায়ীত্ব',
          icon: '👑',
          tag: 'commanding'
        }
      ]
    }
  ];

  const handleSelectOption = (questionKey: 'occasion' | 'notes' | 'intensity', value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));

    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final question answered, run matching animation
      setIsAnalyzing(true);
      setCurrentStep(3);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 700);
    }
  };

  // Algorithmic Matcher based on answers
  const recommendedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const scored = products.map((product) => {
      let score = 50; // base score

      // Occasion matching
      if (answers.occasion === 'occas_royal') {
        if (product.fragranceType === 'Oud' || product.fragranceType === 'Amber' || product.fragranceType === 'Woody') score += 30;
        if (product.bestSeller) score += 15;
      } else if (answers.occasion === 'occas_daily') {
        if (product.fragranceType === 'Musk' || product.fragranceType === 'Floral' || product.fragranceType === 'Fresh') score += 30;
      } else if (answers.occasion === 'occas_office') {
        if (product.fragranceType === 'Aquatic' || product.fragranceType === 'Fresh' || product.fragranceType === 'Musk') score += 35;
      } else if (answers.occasion === 'occas_gift') {
        if (product.bestSeller) score += 35;
        if (product.rating >= 4.9) score += 15;
      }

      // Notes matching
      if (answers.notes === 'notes_oud') {
        if (product.fragranceType === 'Oud' || product.fragranceType === 'Woody' || product.fragranceType === 'Sandalwood') score += 40;
        const text = (product.name + product.description + product.notes.top.join(' ') + product.notes.base.join(' ')).toLowerCase();
        if (text.includes('oud') || text.includes('agarwood') || text.includes('sandalwood')) score += 20;
      } else if (answers.notes === 'notes_fresh') {
        if (product.fragranceType === 'Aquatic' || product.fragranceType === 'Fresh') score += 40;
        const text = (product.name + product.description).toLowerCase();
        if (text.includes('water') || text.includes('fresh') || text.includes('ocean') || text.includes('sea')) score += 20;
      } else if (answers.notes === 'notes_floral') {
        if (product.fragranceType === 'Floral' || product.fragranceType === 'Musk') score += 40;
        const text = (product.name + product.description).toLowerCase();
        if (text.includes('rose') || text.includes('jasmine') || text.includes('floral')) score += 20;
      } else if (answers.notes === 'notes_sweet') {
        if (product.fragranceType === 'Amber' || product.fragranceType === 'Musk' || product.fragranceType === 'Oriental') score += 40;
        const text = (product.name + product.description).toLowerCase();
        if (text.includes('amber') || text.includes('vanilla') || text.includes('sweet') || text.includes('honey')) score += 20;
      }

      // Intensity matching
      if (answers.intensity === 'int_commanding') {
        if (product.sillage === 'Enormous' || product.sillage === 'Heavy') score += 25;
        if (product.fragranceType === 'Oud') score += 15;
      } else if (answers.intensity === 'int_subtle') {
        if (product.fragranceType === 'Musk' || product.fragranceType === 'Fresh') score += 25;
      } else if (answers.intensity === 'int_balanced') {
        score += 20;
      }

      // Ratings boost
      score += (product.rating || 4.5) * 5;

      return { product, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((item, idx) => ({
      ...item.product,
      matchPercentage: Math.min(99, 98 - idx * 3)
    }));
  }, [products, answers]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const size = selectedSizes[product.id] || '3ml';
    addToCart(product, size);
    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  const handleSizeChange = (e: React.MouseEvent, productId: string, size: '3ml' | '6ml') => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsAnalyzing(false);
  };

  return (
    <>
      {/* 1. LUXURIOUS GOLDEN HOMEPAGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-12 bg-gradient-to-br from-[#1B1922] via-[#131217] to-[#0A090D] border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.2)]">
          {/* Ambient Background Gold Mesh & Light Glow */}
          <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-gradient-to-bl from-[#D4AF37]/18 via-[#F5D77F]/8 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-[#996515]/15 blur-2xl pointer-events-none" />

          {/* Golden Corner Accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            {/* Left Copy & Value Proposition */}
            <div className="max-w-2xl space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/60 shadow-inner">
                <Compass className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#F5D77F]">
                  {language === 'bn' ? 'আর্টিসানাল সুবাস পরামর্শক' : 'PERSONALIZED SCENT CONCIERGE'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F3EFEA] tracking-tight leading-tight">
                {language === 'bn' ? (
                  <>
                    আপনার ব্যক্তিত্বের উপযোগী <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6E5] via-[#D4AF37] to-[#F5D77F]">নিখুঁত আতর</span> খুঁজে নিন
                  </>
                ) : (
                  <>
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6E5] via-[#D4AF37] to-[#F5D77F]">Signature Scent</span> in 30 Seconds
                  </>
                )}
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-[#C2BDB2] font-light leading-relaxed max-w-xl">
                {language === 'bn'
                  ? 'কোন আতরটি আপনার ব্যক্তিত্ব ও ব্যবহারের সাথে মিলবে তা নিয়ে ভাবছেন? মাত্র ৩টি সহজ প্রশ্নের উত্তর দিয়ে পেয়ে যান আপনার জন্য বিশেষভাবে নির্বাচিত পারফেক্ট আতরের তালিকা।'
                  : 'Not sure which artisanal attar suits you best? Answer 3 sensory questions to uncover tailored attar recommendations calibrated to your personal style.'}
              </p>

              {/* Quick Feature Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#A8A49C]">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{language === 'bn' ? '১০০% খাঁটি অ্যালকোহলমুক্ত' : '100% Pure Alcohol-Free'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{language === 'bn' ? '১৮+ ঘণ্টা স্থায়িত্ব' : '18+ Hours Sillage'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{language === 'bn' ? 'ব্যক্তিগত পছন্দ অনুযায়ী' : 'Tailored Recommendations'}</span>
                </div>
              </div>
            </div>

            {/* Right Action Button & Visual */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetQuiz();
                  setIsOpen(true);
                }}
                className="group px-8 py-4 sm:py-5 bg-gradient-to-r from-[#D4AF37] via-[#F3DE97] to-[#D4AF37] hover:from-[#E5BE4A] hover:to-[#C5A059] text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{language === 'bn' ? 'সেন্ট ফাইন্ডার কুইজ শুরু করুন' : 'Start Scent Finder Quiz'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MODAL COMPONENT */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-gradient-to-b from-[#18161F] via-[#121115] to-[#0A090D] border-2 border-[#D4AF37] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.3)] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#26242E] flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#F3EFEA]">
                    {language === 'bn' ? 'সেন্ট ফাইন্ডার কুইজ' : 'Scent Finder Quiz'}
                  </h4>
                  <p className="text-[11px] text-[#A8A49C]">
                    {language === 'bn' ? 'আপনার আদর্শ আতর খুঁজে নেওয়ার ৩টি সহজ ধাপ' : '3 simple steps to your perfect match'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-[#A8A49C] hover:text-white bg-[#1A1920] hover:bg-[#2A2832] border border-[#2B2934] transition-colors cursor-pointer"
                aria-label="Close Quiz"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress Bar (for Steps 0, 1, 2) */}
            {currentStep < 3 && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center justify-between text-xs text-[#D4AF37] font-mono mb-2">
                  <span>{language === 'bn' ? `ধাপ ${currentStep + 1} / ৩` : `Step ${currentStep + 1} of 3`}</span>
                  <span className="text-[#8E8B83]">
                    {currentStep === 0 && (language === 'bn' ? 'উপলক্ষ' : 'Occasion')}
                    {currentStep === 1 && (language === 'bn' ? 'সুবাসের নোট' : 'Scent Notes')}
                    {currentStep === 2 && (language === 'bn' ? 'স্থায়িত্ব ও তীব্রতা' : 'Intensity')}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#201E26] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77F] transition-all duration-500 rounded-full"
                    style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Question Slides (Step 0, 1, 2) */}
              {currentStep < 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-normal text-[#F3EFEA]">
                      {language === 'bn' ? questions[currentStep].titleBn : questions[currentStep].titleEn}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A8A49C] mt-1.5">
                      {language === 'bn' ? questions[currentStep].subtitleBn : questions[currentStep].subtitleEn}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {questions[currentStep].options.map((opt) => {
                      const questionKey = currentStep === 0 ? 'occasion' : currentStep === 1 ? 'notes' : 'intensity';
                      const isSelected = answers[questionKey] === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(questionKey, opt.id)}
                          className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 flex items-start gap-4 cursor-pointer group ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#201D28] to-[#17151E] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]'
                              : 'bg-[#141318] hover:bg-[#1A1922] border-[#2B2934] hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 group-hover:scale-110 transition-transform">
                            {opt.icon}
                          </span>
                          <div className="flex-1 space-y-1">
                            <h5 className="font-serif text-base sm:text-lg font-bold text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors">
                              {language === 'bn' ? opt.labelBn : opt.labelEn}
                            </h5>
                            <p className="text-xs text-[#8E8B83] leading-relaxed">
                              {language === 'bn' ? opt.descBn : opt.descEn}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Back button if past step 0 */}
                  {currentStep > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="text-xs uppercase tracking-wider text-[#A8A49C] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'আগের প্রশ্ন' : 'Previous Question'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Results Slide */}
              {currentStep === 3 && (
                <div>
                  {isAnalyzing ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="relative w-16 h-16 mx-auto">
                        <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
                        <Sparkles className="w-6 h-6 text-[#D4AF37] absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <h4 className="font-serif text-xl sm:text-2xl text-[#F3EFEA]">
                        {language === 'bn' ? 'আপনার জন্য সেরা আতর নির্বাচন করা হচ্ছে...' : 'Formulating Your Bespoke Matches...'}
                      </h4>
                      <p className="text-xs text-[#8E8B83]">
                        {language === 'bn' ? 'আমাদের আতর সম্ভার থেকে সেরা ফর্মুলেশন বিশ্লেষণ হচ্ছে' : 'Analyzing pure notes, sillage, and longevity profiles'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Results Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#26242E] gap-3">
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                            {language === 'bn' ? '✨ নির্বাচিত সুবাস ফলাফল' : '✨ CURATED MATCHES FOR YOU'}
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F3EFEA]">
                            {language === 'bn' ? 'আপনার পছন্দের সেরা আতর' : 'Your Perfect Attar Matches'}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={resetQuiz}
                          className="px-3.5 py-1.5 rounded-xl bg-[#1A1920] hover:bg-[#25232D] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'আবার শুরু করুন' : 'Retake Quiz'}</span>
                        </button>
                      </div>

                      {/* 2-3 Matched Attar Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recommendedProducts.map((product, idx) => {
                          const currentSize = selectedSizes[product.id] || '3ml';
                          const price = currentSize === '3ml' ? product.price3ml : product.price6ml;
                          const isTop = idx === 0;

                          return (
                            <div
                              key={product.id}
                              onClick={() => {
                                setIsOpen(false);
                                navigateTo('product', { slug: product.slug });
                              }}
                              className={`relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#18171E] via-[#121115] to-[#0A090D] border transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                                isTop
                                  ? 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]/50'
                                  : 'border-[#26242E] hover:border-[#D4AF37]/50 shadow-lg'
                              }`}
                            >
                              {/* Match Percentage Badge */}
                              <div className="absolute top-2.5 left-2.5 z-20">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 via-[#D4AF37] to-amber-600 text-black shadow-md flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{product.matchPercentage}% {language === 'bn' ? 'ম্যাচ' : 'Match'}</span>
                                </span>
                              </div>

                              {/* Bottle Image Frame */}
                              <div className="relative aspect-square bg-[#0B0B0C] overflow-hidden flex items-center justify-center">
                                <img
                                  src={product.images[0]}
                                  alt={language === 'bn' ? (product.nameBn || product.name) : product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#121115] via-transparent to-transparent pointer-events-none" />
                              </div>

                              {/* Card Content */}
                              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[10px] text-[#A88B46] font-mono">
                                    <span>{product.fragranceType}</span>
                                    <div className="flex items-center gap-1 text-amber-400">
                                      <Star className="w-3 h-3 fill-amber-400" />
                                      <span>{product.rating || '5.0'}</span>
                                    </div>
                                  </div>

                                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F3EFEA] line-clamp-1">
                                    {language === 'bn' ? (product.nameBn || product.name) : product.name}
                                  </h4>

                                  <p className="text-[11px] text-[#8E8B83] line-clamp-1">
                                    {language === 'bn' && product.shortDescriptionBn
                                      ? product.shortDescriptionBn
                                      : product.shortDescription}
                                  </p>
                                </div>

                                {/* Size Toggle & Price */}
                                <div className="pt-2 border-t border-[#23222A] flex items-center justify-between">
                                  <div className="flex items-center gap-1 bg-[#1A1920] p-0.5 rounded-lg border border-[#2B2934]">
                                    {(['3ml', '6ml'] as const).map((sz) => (
                                      <button
                                        key={sz}
                                        type="button"
                                        onClick={(e) => handleSizeChange(e, product.id, sz)}
                                        className={`py-0.5 px-2 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                          currentSize === sz
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'text-[#8E8B83] hover:text-white'
                                        }`}
                                      >
                                        {sz}
                                      </button>
                                    ))}
                                  </div>

                                  <span className="font-mono text-sm font-bold text-white">
                                    {formatBDT(price)}
                                  </span>
                                </div>

                                {/* Direct Add to Cart Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToCart(e, product)}
                                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                                    addedItem === product.id
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#D4AF37] hover:bg-[#C5A059] text-black hover:scale-[1.02] active:scale-95'
                                  }`}
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>
                                    {addedItem === product.id
                                      ? (language === 'bn' ? 'যুক্ত হয়েছে!' : 'Added!')
                                      : (language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart')}
                                  </span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Modal Footer Bottom Banner */}
                      <div className="p-4 rounded-2xl bg-[#141318] border border-[#26242E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-[#C2BDB2]">
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                          <span>
                            {language === 'bn'
                              ? '১০০% খাঁটি অ্যালকোহলমুক্ত আতর • সারা দেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি'
                              : '100% Pure Alcohol-Free Attars • Nationwide Cash on Delivery'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigateTo('shop');
                          }}
                          className="text-[#D4AF37] hover:text-[#F3EFEA] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{language === 'bn' ? 'সব আতর দেখুন' : 'Explore All Products'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
