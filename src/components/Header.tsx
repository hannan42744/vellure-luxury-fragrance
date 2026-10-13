import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { HeaderInstantSearch } from './HeaderInstantSearch';
import { Search, ShoppingBag, Menu, X, Shield, Globe, Compass, ChevronDown, ChevronRight, Gift, Sun, Snowflake, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    language,
    toggleLanguage,
    t,
    navigateTo,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    currentRoute,
    isAdminAuthenticated,
    products
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isAttarDropdownOpen, setIsAttarDropdownOpen] = useState(false);
  const [mobileAttarsExpanded, setMobileAttarsExpanded] = useState(true);
  const [mobileActiveSub, setMobileActiveSub] = useState<'combo' | 'summer' | 'winter' | 'all' | null>('combo');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsAttarDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsAttarDropdownOpen(false);
    }, 200);
  };

  // Group products for submenus
  const comboProducts = useMemo(() => {
    return products.filter((p) => p.category === 'gift_set' || p.category === 'combo' || p.slug.includes('pack') || p.slug.includes('box'));
  }, [products]);

  const summerProducts = useMemo(() => {
    return products.filter((p) => p.category === 'attar' && (p.seasons?.includes('Summer') || p.seasons?.includes('Monsoon')));
  }, [products]);

  const winterProducts = useMemo(() => {
    return products.filter((p) => p.category === 'attar' && (p.seasons?.includes('Winter') || p.seasons?.includes('Autumn')));
  }, [products]);

  const allSeasonProducts = useMemo(() => {
    return products.filter((p) => p.category === 'attar' && (p.seasons?.includes('All-Season') || (!p.seasons?.length)));
  }, [products]);

  // Determine announcement bar background styling
  const getAnnouncementBgClass = () => {
    switch (settings.announcementBg) {
      case 'gold':
        return 'bg-gradient-to-r from-[#3B2306] via-[#633C0D] to-[#3B2306] border-b border-[#D4AF37]/50 text-[#FEF3C7] shadow-lg';
      case 'ruby':
        return 'bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#4C0519] border-b border-[#F43F5E]/40 text-[#FFE4E6] shadow-lg';
      case 'royal':
        return 'bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] border-b border-[#818CF8]/40 text-[#EEF2FF] shadow-lg';
      case 'amber':
        return 'bg-gradient-to-r from-[#18151D] via-[#2A1D0E] to-[#18151D] border-b border-[#D4AF37]/30 text-[#FBF6ED] shadow-inner';
      case 'emerald':
      default:
        // Luxurious emerald green gradient
        return 'bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#064E3B] border-b border-[#10B981]/40 text-[#ECFDF5] shadow-md';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/95 backdrop-blur-md border-b border-[#232226]">
      {/* Top Announcement Bar - Right-to-Left Scrolling Marquee */}
      <div className={`relative overflow-hidden ${getAnnouncementBgClass()} text-xs py-2 px-2 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Scrolling Marquee Container (Right to Left) */}
          <div className="flex-1 overflow-hidden relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/30 to-transparent z-10 hidden sm:block"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/30 to-transparent z-10 hidden sm:block"></div>

            <div
              className={`animate-marquee-rtl ${
                settings.announcementSpeed === 'slow'
                  ? 'marquee-speed-slow'
                  : settings.announcementSpeed === 'normal'
                  ? 'marquee-speed-normal'
                  : 'marquee-speed-relaxed'
              } flex items-center whitespace-nowrap cursor-default`}
            >
              {/* Track 1 */}
              <div className="flex items-center shrink-0">
                {[0, 1, 2, 3].map((idx) => {
                  const text = language === 'bn' ? settings.announcementTextBn : settings.announcementTextEn;
                  return (
                    <div key={`t1-${idx}`} className="flex items-center gap-5 px-5">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37] text-[#0B0B0C] shadow-sm">
                        {language === 'bn' ? 'স্পেশাল অফার' : 'SPECIAL OFFER'}
                      </span>
                      <span className="font-semibold tracking-wider text-white text-xs sm:text-[13px] drop-shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse inline-block shadow-[0_0_8px_#34D399]"></span>
                        {text}
                      </span>
                      <span className="text-[#FDE047] text-xs font-serif">✦</span>
                      <span className="text-[#A7F3D0] text-[11px] font-medium hidden md:inline">
                        {language === 'bn' ? '১০০% খাঁটি অ্যালকোহলমুক্ত আতর' : '100% Pure Alcohol-Free Attar'}
                      </span>
                      <span className="text-[#FDE047] text-xs font-serif">✦</span>
                    </div>
                  );
                })}
              </div>

              {/* Track 2 (Duplicate for continuous right-to-left loop) */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                {[0, 1, 2, 3].map((idx) => {
                  const text = language === 'bn' ? settings.announcementTextBn : settings.announcementTextEn;
                  return (
                    <div key={`t2-${idx}`} className="flex items-center gap-5 px-5">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#D4AF37] text-[#0B0B0C] shadow-sm">
                        {language === 'bn' ? 'স্পেশাল অফার' : 'SPECIAL OFFER'}
                      </span>
                      <span className="font-semibold tracking-wider text-white text-xs sm:text-[13px] drop-shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse inline-block shadow-[0_0_8px_#34D399]"></span>
                        {text}
                      </span>
                      <span className="text-[#FDE047] text-xs font-serif">✦</span>
                      <span className="text-[#A7F3D0] text-[11px] font-medium hidden md:inline">
                        {language === 'bn' ? '১০০% খাঁটি অ্যালকোহলমুক্ত আতর' : '100% Pure Alcohol-Free Attar'}
                      </span>
                      <span className="text-[#FDE047] text-xs font-serif">✦</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions (Track order & language toggle) */}
          <div className="hidden sm:flex items-center gap-3 text-[#E0D8C8] flex-shrink-0 pl-3 border-l border-[#D4AF37]/30">
            <button
              onClick={() => navigateTo('track-order')}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t('trackOrder')}</span>
            </button>
            <span className="text-[#D4AF37]/40">|</span>
            <button
              onClick={toggleLanguage}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer text-xs uppercase font-medium tracking-wider"
              title="Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Strictly 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[86px] sm:min-h-[98px] md:min-h-[106px] py-2.5 flex items-center justify-between">
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#C5A059] p-1.5 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="group text-left cursor-pointer focus:outline-none"
            aria-label="VELLURE Luxury Attar Home"
          >
            <Logo variant="header" />
            <span className="sr-only">VELLURE Home</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links with Rich Mega-Menu for All Attars & Seasons */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium tracking-wider uppercase text-[#C5BFB5]">
          <button
            onClick={() => navigateTo('home')}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer py-1 relative whitespace-nowrap ${
              currentRoute === 'home' ? 'text-[#D4AF37]' : ''
            }`}
          >
            {t('home')}
            {currentRoute === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></span>
            )}
          </button>

          {/* All Attars with Rich Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              onClick={() => {
                navigateTo('shop');
                setIsAttarDropdownOpen(false);
              }}
              className={`hover:text-[#D4AF37] transition-colors cursor-pointer py-1 relative whitespace-nowrap flex items-center gap-1.5 ${
                currentRoute === 'shop' || isAttarDropdownOpen ? 'text-[#D4AF37]' : ''
              }`}
              aria-expanded={isAttarDropdownOpen}
            >
              <span>{language === 'bn' ? 'সকল আতর' : 'All Attars'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAttarDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''
                }`}
              />
              {currentRoute === 'shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></span>
              )}
            </button>

            {/* Desktop Mega Dropdown (Combo Packs & Seasonal Categories) */}
            {isAttarDropdownOpen && (
              <div
                className="absolute top-full -left-20 lg:-left-32 pt-3 w-[820px] lg:w-[940px] z-50 animate-fade-in"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="bg-[#100F15]/98 backdrop-blur-2xl border border-[#2B2934] rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-left normal-case grid grid-cols-4 gap-5">
                  {/* Column 1: Combo Packs */}
                  <div className="space-y-3 bg-[#15141D] p-3.5 rounded-xl border border-[#24222E] flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => {
                          navigateTo('shop', { category: 'gift_set' });
                          setIsAttarDropdownOpen(false);
                        }}
                        className="cursor-pointer group/col flex items-start gap-2.5 pb-2.5 border-b border-[#24222E]"
                      >
                        <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] group-hover/col:bg-[#D4AF37]/20 transition-colors">
                          <Gift className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#F3EFEA] group-hover/col:text-[#D4AF37] transition-colors leading-tight">
                            {language === 'bn' ? 'কম্বো প্যাক' : 'Combo Packs'}
                          </h4>
                          <p className="text-[10px] text-[#A8A49C] tracking-normal mt-0.5">
                            {language === 'bn' ? 'গিফট ও কাস্টম বক্স' : 'Gift Sets & Boxes'}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs mt-3">
                        {comboProducts.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => {
                                navigateTo('product', { slug: p.slug });
                                setIsAttarDropdownOpen(false);
                              }}
                              className="text-left w-full py-1 px-1.5 rounded text-[#D2CFC8] hover:text-[#D4AF37] hover:bg-[#1C1B24] transition-colors truncate block"
                              title={p.name}
                            >
                              {language === 'bn' ? p.nameBn : p.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('shop', { category: 'gift_set' });
                        setIsAttarDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-1 pt-2 border-t border-[#201E28] tracking-wider uppercase"
                    >
                      <span>{language === 'bn' ? 'সকল কম্বো দেখুন' : 'All Combos'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Column 2: Summer & Monsoon */}
                  <div className="space-y-3 bg-[#15141D] p-3.5 rounded-xl border border-[#24222E] flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => {
                          navigateTo('shop', { season: 'Summer' });
                          setIsAttarDropdownOpen(false);
                        }}
                        className="cursor-pointer group/col flex items-start gap-2.5 pb-2.5 border-b border-[#24222E]"
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover/col:bg-amber-500/20 transition-colors">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#F3EFEA] group-hover/col:text-amber-400 transition-colors leading-tight">
                            {language === 'bn' ? 'গ্রীষ্ম ও বর্ষাকাল' : 'Summer & Monsoon'}
                          </h4>
                          <p className="text-[10px] text-[#A8A49C] tracking-normal mt-0.5">
                            {language === 'bn' ? 'সতেজ ও কুলিং সুবাস' : 'Aquatic & Fresh'}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs mt-3">
                        {summerProducts.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => {
                                navigateTo('product', { slug: p.slug });
                                setIsAttarDropdownOpen(false);
                              }}
                              className="text-left w-full py-1 px-1.5 rounded text-[#D2CFC8] hover:text-amber-300 hover:bg-[#1C1B24] transition-colors truncate block"
                              title={p.name}
                            >
                              {language === 'bn' ? p.nameBn : p.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('shop', { season: 'Summer' });
                        setIsAttarDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center gap-1 pt-2 border-t border-[#201E28] tracking-wider uppercase"
                    >
                      <span>{language === 'bn' ? 'গ্রীষ্মের সব আতর' : 'Summer Scents'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Column 3: Winter & Cool Season */}
                  <div className="space-y-3 bg-[#15141D] p-3.5 rounded-xl border border-[#24222E] flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => {
                          navigateTo('shop', { season: 'Winter' });
                          setIsAttarDropdownOpen(false);
                        }}
                        className="cursor-pointer group/col flex items-start gap-2.5 pb-2.5 border-b border-[#24222E]"
                      >
                        <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover/col:bg-sky-500/20 transition-colors">
                          <Snowflake className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#F3EFEA] group-hover/col:text-sky-400 transition-colors leading-tight">
                            {language === 'bn' ? 'শীত ও হেমন্তকাল' : 'Winter & Cool'}
                          </h4>
                          <p className="text-[10px] text-[#A8A49C] tracking-normal mt-0.5">
                            {language === 'bn' ? 'উষ্ণ উদ ও অ্যাম্বার' : 'Rich Warm Blends'}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs mt-3">
                        {winterProducts.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => {
                                navigateTo('product', { slug: p.slug });
                                setIsAttarDropdownOpen(false);
                              }}
                              className="text-left w-full py-1 px-1.5 rounded text-[#D2CFC8] hover:text-sky-300 hover:bg-[#1C1B24] transition-colors truncate block"
                              title={p.name}
                            >
                              {language === 'bn' ? p.nameBn : p.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('shop', { season: 'Winter' });
                        setIsAttarDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-1 pt-2 border-t border-[#201E28] tracking-wider uppercase"
                    >
                      <span>{language === 'bn' ? 'শীতের সব আতর' : 'Winter Scents'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Column 4: All-Season Wear */}
                  <div className="space-y-3 bg-[#15141D] p-3.5 rounded-xl border border-[#24222E] flex flex-col justify-between">
                    <div>
                      <div
                        onClick={() => {
                          navigateTo('shop', { season: 'All-Season' });
                          setIsAttarDropdownOpen(false);
                        }}
                        className="cursor-pointer group/col flex items-start gap-2.5 pb-2.5 border-b border-[#24222E]"
                      >
                        <div className="p-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] group-hover/col:bg-[#D4AF37]/20 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#F3EFEA] group-hover/col:text-[#D4AF37] transition-colors leading-tight">
                            {language === 'bn' ? 'সারাবছর উপযোগী' : 'All-Season Wear'}
                          </h4>
                          <p className="text-[10px] text-[#A8A49C] tracking-normal mt-0.5">
                            {language === 'bn' ? 'নিত্যদিনের সঙ্গী' : 'Daily & Versatile'}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1.5 text-xs mt-3">
                        {allSeasonProducts.map((p) => (
                          <li key={p.id}>
                            <button
                              onClick={() => {
                                navigateTo('product', { slug: p.slug });
                                setIsAttarDropdownOpen(false);
                              }}
                              className="text-left w-full py-1 px-1.5 rounded text-[#D2CFC8] hover:text-[#D4AF37] hover:bg-[#1C1B24] transition-colors truncate block"
                              title={p.name}
                            >
                              {language === 'bn' ? p.nameBn : p.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('shop');
                        setIsAttarDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-[#D4AF37] hover:underline flex items-center gap-1 pt-2 border-t border-[#201E28] tracking-wider uppercase"
                    >
                      <span>{language === 'bn' ? 'সম্পূর্ণ ক্যাটালগ' : 'Full Catalog'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="hover:text-[#D4AF37] transition-colors cursor-pointer py-1 relative whitespace-nowrap"
          >
            {t('bestSellers')}
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer py-1 relative whitespace-nowrap ${
              currentRoute === 'about' ? 'text-[#D4AF37]' : ''
            }`}
          >
            {t('aboutUs')}
            {currentRoute === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></span>
            )}
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer py-1 relative whitespace-nowrap ${
              currentRoute === 'contact' ? 'text-[#D4AF37]' : ''
            }`}
          >
            {t('contact')}
            {currentRoute === 'contact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></span>
            )}
          </button>
        </nav>

        {/* Zone 3: Real-Time Instant Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Real-Time Instant Search Bar (Desktop / Large Tablet) */}
          <div className="hidden lg:block w-52 xl:w-64">
            <HeaderInstantSearch />
          </div>

          {/* Mobile / Tablet Instant Search Toggle Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              mobileSearchOpen
                ? 'text-[#D4AF37] bg-[#1C1B24] border border-[#D4AF37]/50'
                : 'text-[#C5BFB5] hover:text-[#D4AF37] hover:bg-[#18171B]'
            }`}
            title="Search fragrances / সুবাস খুঁজুন"
            aria-label="Search Fragrances"
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="sm:hidden px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#D4AF37] bg-[#16151A] hover:bg-[#201F26] border border-[#D4AF37]/50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            title="Change language / ভাষা পরিবর্তন"
            aria-label="Change language"
          >
            <Globe className="w-3 h-3 text-[#D4AF37]" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Admin link */}
          <button
            onClick={() => navigateTo('admin')}
            className={`p-2 text-[#C5BFB5] hover:text-[#D4AF37] hover:bg-[#18171B] rounded-lg transition-colors cursor-pointer relative ${
              isAdminAuthenticated ? 'text-[#D4AF37]' : ''
            }`}
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Shield className="w-5 h-5" />
            {isAdminAuthenticated && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-[#1C1B20] hover:bg-[#25242B] border border-[#35333B] text-[#F3EFEA] rounded-lg transition-all duration-200 cursor-pointer shadow-sm group"
            aria-label="Open Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B0B0C] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-[#E5C378]">
              {t('yourBag')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Instant Search Strip (Expands right below header on mobile/tablet) */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-[#100F15] border-t border-[#23222A] shadow-2xl animate-fade-in">
          <HeaderInstantSearch
            isMobile={true}
            onCloseMobile={() => setMobileSearchOpen(false)}
          />
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="relative w-4/5 max-w-xs bg-[#0F0E12] border-r border-[#2A2830] h-full flex flex-col justify-between p-6 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#232228]">
                <button
                  onClick={() => {
                    navigateTo('home');
                    setMobileMenuOpen(false);
                  }}
                  className="cursor-pointer focus:outline-none"
                  aria-label="VELLURE Home"
                >
                  <Logo variant="mobile" />
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#9E9B95] hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {/* Home */}
                <button
                  onClick={() => {
                    navigateTo('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-md ${
                    currentRoute === 'home' ? 'text-[#D4AF37] bg-[#18171D]' : 'text-[#E5E0D8] hover:text-[#D4AF37]'
                  }`}
                >
                  {t('home')}
                </button>

                {/* All Attars & Seasonal Submenus Accordion */}
                <div className="border border-[#26242F] rounded-xl bg-[#14131A] overflow-hidden">
                  <div className="flex items-center justify-between p-2.5 bg-[#17161F]">
                    <button
                      onClick={() => {
                        navigateTo('shop');
                        setMobileMenuOpen(false);
                      }}
                      className="text-left text-xs font-semibold tracking-wide uppercase text-[#E5C378] hover:text-[#D4AF37] flex-1 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{language === 'bn' ? 'সকল আতর ও কালেকশন' : 'All Attars & Seasons'}</span>
                    </button>
                    <button
                      onClick={() => setMobileAttarsExpanded(!mobileAttarsExpanded)}
                      className="p-1 text-[#A8A49C] hover:text-[#D4AF37] rounded"
                      aria-label="Toggle attar submenus"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${mobileAttarsExpanded ? 'rotate-180 text-[#D4AF37]' : ''}`}
                      />
                    </button>
                  </div>

                  {mobileAttarsExpanded && (
                    <div className="p-2 space-y-2 border-t border-[#23212B] bg-[#0E0D13]">
                      {/* Submenu 1: Combo Packs */}
                      <div className="rounded-lg bg-[#16151D] border border-[#23212C] p-2">
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'combo' ? null : 'combo')}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#F3EFEA] hover:text-[#D4AF37] py-0.5"
                        >
                          <span className="flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{language === 'bn' ? 'কম্বো প্যাক (Combo Packs)' : 'Combo Packs'}</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#7A7771] transition-transform ${mobileActiveSub === 'combo' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                        </button>
                        {mobileActiveSub === 'combo' && (
                          <div className="pt-2 pl-2 space-y-1 border-t border-[#201F29] mt-1.5">
                            {comboProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  navigateTo('product', { slug: p.slug });
                                  setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-xs text-[#C5BFB5] hover:text-[#D4AF37] py-1 truncate"
                              >
                                • {language === 'bn' ? p.nameBn : p.name}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                navigateTo('shop', { category: 'gift_set' });
                                setMobileMenuOpen(false);
                              }}
                              className="text-[11px] font-semibold text-[#D4AF37] hover:underline pt-1 block"
                            >
                              {language === 'bn' ? 'সকল কম্বো দেখুন →' : 'View All Combos →'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submenu 2: Summer & Monsoon */}
                      <div className="rounded-lg bg-[#16151D] border border-[#23212C] p-2">
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'summer' ? null : 'summer')}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#F3EFEA] hover:text-amber-400 py-0.5"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>{language === 'bn' ? 'গ্রীষ্ম ও বর্ষাকাল (Summer)' : 'Summer & Monsoon'}</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#7A7771] transition-transform ${mobileActiveSub === 'summer' ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>
                        {mobileActiveSub === 'summer' && (
                          <div className="pt-2 pl-2 space-y-1 border-t border-[#201F29] mt-1.5">
                            {summerProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  navigateTo('product', { slug: p.slug });
                                  setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-xs text-[#C5BFB5] hover:text-amber-300 py-1 truncate"
                              >
                                • {language === 'bn' ? p.nameBn : p.name}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                navigateTo('shop', { season: 'Summer' });
                                setMobileMenuOpen(false);
                              }}
                              className="text-[11px] font-semibold text-amber-400 hover:underline pt-1 block"
                            >
                              {language === 'bn' ? 'গ্রীষ্মের সব আতর →' : 'View Summer Scents →'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submenu 3: Winter & Cool */}
                      <div className="rounded-lg bg-[#16151D] border border-[#23212C] p-2">
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'winter' ? null : 'winter')}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#F3EFEA] hover:text-sky-400 py-0.5"
                        >
                          <span className="flex items-center gap-1.5">
                            <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                            <span>{language === 'bn' ? 'শীত ও হেমন্তকাল (Winter)' : 'Winter & Cool'}</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#7A7771] transition-transform ${mobileActiveSub === 'winter' ? 'rotate-180 text-sky-400' : ''}`} />
                        </button>
                        {mobileActiveSub === 'winter' && (
                          <div className="pt-2 pl-2 space-y-1 border-t border-[#201F29] mt-1.5">
                            {winterProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  navigateTo('product', { slug: p.slug });
                                  setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-xs text-[#C5BFB5] hover:text-sky-300 py-1 truncate"
                              >
                                • {language === 'bn' ? p.nameBn : p.name}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                navigateTo('shop', { season: 'Winter' });
                                setMobileMenuOpen(false);
                              }}
                              className="text-[11px] font-semibold text-sky-400 hover:underline pt-1 block"
                            >
                              {language === 'bn' ? 'শীতের সব আতর →' : 'View Winter Scents →'}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Submenu 4: All-Season */}
                      <div className="rounded-lg bg-[#16151D] border border-[#23212C] p-2">
                        <button
                          onClick={() => setMobileActiveSub(mobileActiveSub === 'all' ? null : 'all')}
                          className="w-full flex items-center justify-between text-xs font-semibold text-[#F3EFEA] hover:text-[#D4AF37] py-0.5"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>{language === 'bn' ? 'সারাবছর উপযোগী (All-Season)' : 'All-Season Wear'}</span>
                          </span>
                          <ChevronDown className={`w-3.5 h-3.5 text-[#7A7771] transition-transform ${mobileActiveSub === 'all' ? 'rotate-180 text-[#D4AF37]' : ''}`} />
                        </button>
                        {mobileActiveSub === 'all' && (
                          <div className="pt-2 pl-2 space-y-1 border-t border-[#201F29] mt-1.5">
                            {allSeasonProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  navigateTo('product', { slug: p.slug });
                                  setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left text-xs text-[#C5BFB5] hover:text-[#D4AF37] py-1 truncate"
                              >
                                • {language === 'bn' ? p.nameBn : p.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Best Sellers */}
                <button
                  onClick={() => {
                    navigateTo('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 px-2 text-sm font-medium tracking-wide uppercase text-[#E5E0D8] hover:text-[#D4AF37] hover:bg-[#18171D] rounded-md transition-colors"
                >
                  {t('bestSellers')}
                </button>

                {/* About Us */}
                <button
                  onClick={() => {
                    navigateTo('about');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-md ${
                    currentRoute === 'about' ? 'text-[#D4AF37] bg-[#18171D]' : 'text-[#E5E0D8] hover:text-[#D4AF37]'
                  }`}
                >
                  {t('aboutUs')}
                </button>

                {/* Contact */}
                <button
                  onClick={() => {
                    navigateTo('contact');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-md ${
                    currentRoute === 'contact' ? 'text-[#D4AF37] bg-[#18171D]' : 'text-[#E5E0D8] hover:text-[#D4AF37]'
                  }`}
                >
                  {t('contact')}
                </button>

                <button
                  onClick={() => {
                    navigateTo('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-2 text-base font-medium tracking-wide uppercase text-[#D4AF37] hover:bg-[#18171D] rounded-md transition-colors flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  {t('trackOrder')}
                </button>

                <button
                  onClick={() => {
                    navigateTo('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-2 text-base font-medium tracking-wide uppercase text-[#9E9B95] hover:text-white hover:bg-[#18171D] rounded-md transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  {t('admin')}
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#232228] flex flex-col gap-3">
              <button
                onClick={toggleLanguage}
                className="w-full py-2.5 px-4 bg-[#18171D] border border-[#2E2C36] text-[#E5C378] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Language: {language === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}</span>
              </button>

              <div className="text-center text-xs text-[#7A7771]">
                <p>Hotline: {settings.phone}</p>
                <p className="mt-1">Banani, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
