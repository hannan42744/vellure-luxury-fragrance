import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { formatBDT } from '../utils/translations';
import { trackViewContent } from '../utils/analytics';
import { Search, X, Sparkles, ArrowRight, ShoppingBag, Star, Flame } from 'lucide-react';

interface HeaderInstantSearchProps {
  className?: string;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const HeaderInstantSearch: React.FC<HeaderInstantSearchProps> = ({
  className = '',
  isMobile = false,
  onCloseMobile
}) => {
  const { products, language, navigateTo, addToCart } = useApp();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products in real time
  const trimmedQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmedQuery) {
      // If empty and focused, show top recommended bestsellers
      return products.filter((p) => p.bestSeller || p.featured).slice(0, 5);
    }

    const cleanQ = trimmedQuery.replace(/^vellure\s+/, '').trim();

    return products.filter((p) => {
      const matchNameEn = p.name.toLowerCase().includes(trimmedQuery) || (cleanQ ? p.name.toLowerCase().includes(cleanQ) : false);
      const matchNameBn = (p.nameBn || '').toLowerCase().includes(trimmedQuery);
      const matchType = (p.fragranceType || '').toLowerCase().includes(trimmedQuery);
      const matchDesc = (p.shortDescription || '').toLowerCase().includes(trimmedQuery);
      const matchNotes = [
        ...(p.notes?.top || []),
        ...(p.notes?.heart || []),
        ...(p.notes?.base || [])
      ].some((n) => n.toLowerCase().includes(trimmedQuery) || (cleanQ && n.toLowerCase().includes(cleanQ)));

      return matchNameEn || matchNameBn || matchType || matchDesc || matchNotes;
    }).slice(0, 6);
  }, [products, trimmedQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleSelectProduct(searchResults[selectedIndex]);
      } else if (trimmedQuery) {
        handleViewAll();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
      if (onCloseMobile) onCloseMobile();
    }
  };

  const handleSelectProduct = (product: Product) => {
    trackViewContent(product);
    setIsFocused(false);
    setQuery('');
    if (onCloseMobile) onCloseMobile();
    navigateTo('product', { slug: product.slug });
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, '3ml', 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1400);
  };

  const handleViewAll = () => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    navigateTo('shop');
  };

  const showDropdown = isFocused;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Bar */}
      <div
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-300 border ${
          isFocused
            ? 'bg-[#15141A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/50'
            : 'bg-[#16151A]/90 hover:bg-[#1C1B22] border-[#2A2832] hover:border-[#3E3C48]'
        }`}
      >
        <Search className={`w-4 h-4 transition-colors shrink-0 ${isFocused ? 'text-[#D4AF37]' : 'text-[#8E8B83]'}`} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            language === 'bn'
              ? 'আতর, উদ বা সুবাসের নোট খুঁজুন...'
              : 'Search attar, oud, floral notes...'
          }
          className="w-full bg-transparent text-xs sm:text-sm text-[#F3EFEA] focus:outline-none placeholder-[#7A7771] tracking-wide"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="text-[#8E8B83] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Real-time Instant Search Dropdown Preview */}
      {showDropdown && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-gradient-to-b from-[#16151B] via-[#121116] to-[#0A090D] border border-[#D4AF37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.2)] overflow-hidden animate-fade-in ${
            isMobile ? 'max-h-[75vh]' : 'w-[360px] sm:w-[420px] md:w-[480px] max-h-[480px]'
          } flex flex-col`}
        >
          {/* Header pill */}
          <div className="px-4 py-2.5 bg-black/40 border-b border-[#23222A] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#D4AF37] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>
                {trimmedQuery
                  ? (language === 'bn' ? `ফলাফল (${searchResults.length})` : `Live Results (${searchResults.length})`)
                  : (language === 'bn' ? '🔥 জনপ্রিয় সাজেশন্স' : '🔥 Popular Suggestions')}
              </span>
            </span>

            {trimmedQuery && (
              <span className="text-[#8E8B83] text-[10px]">
                {language === 'bn' ? 'ক্লিক করে সরাসরি দেখুন' : 'Click to view'}
              </span>
            )}
          </div>

          {/* Quick Filter Tags in Dropdown */}
          {!trimmedQuery && (
            <div className="px-4 py-2.5 bg-[#141318] border-b border-[#201F26] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-[#7A7771] shrink-0 text-[10px] uppercase font-mono">
                {language === 'bn' ? 'ট্রেন্ডিং:' : 'Trends:'}
              </span>
              {['Oud', 'Aquatic', 'Floral', 'Musk', 'Amber'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(tag);
                  }}
                  className="px-2 py-0.5 rounded-md bg-[#1F1E26] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#2B2934] transition-all shrink-0 cursor-pointer text-[10px] font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="overflow-y-auto max-h-[340px] divide-y divide-[#1F1E26] p-1.5">
            {searchResults.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-2">
                <p className="text-sm text-[#F3EFEA] font-medium">
                  {language === 'bn' ? 'কোনো সুবাস পাওয়া যায়নি' : 'No matching fragrances found'}
                </p>
                <p className="text-xs text-[#8E8B83]">
                  {language === 'bn'
                    ? `"${query}" এর পরিবর্তে Oud, Musk বা Floral লিখে দেখতে পারেন`
                    : `Try searching for "Oud", "Musk", or "Fresh"`}
                </p>
              </div>
            ) : (
              searchResults.map((product, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={product.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectProduct(product);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#22202A] ring-1 ring-[#D4AF37]/50'
                        : 'hover:bg-[#1A1920]'
                    }`}
                  >
                    {/* Thumbnail Bottle Photo */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black border border-[#2A2832] group-hover:border-[#D4AF37] shrink-0 transition-colors">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors truncate">
                          {language === 'bn' ? (product.nameBn || product.name) : product.name}
                        </h5>
                        {product.bestSeller && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                            ★ BEST
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8E8B83]">
                        <span className="font-mono text-[#D4AF37]">
                          {product.fragranceType}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[#E0DCD3]">
                          3ml: {formatBDT(product.price3ml)}
                        </span>
                        <span className="hidden sm:inline text-[#7A7771]">|</span>
                        <span className="hidden sm:inline font-mono text-[#E0DCD3]">
                          6ml: {formatBDT(product.price6ml)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleQuickAdd(e, product);
                      }}
                      title={language === 'bn' ? '৩ মিলি কার্টে যোগ করুন' : 'Add 3ml to Cart'}
                      className={`p-2 rounded-lg border transition-all shrink-0 cursor-pointer ${
                        addedItem === product.id
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-[#18171E] hover:bg-[#D4AF37] border-[#2E2C36] text-[#A8A49C] hover:text-black'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All Link */}
          <div className="p-2.5 bg-black/50 border-t border-[#23222A] flex items-center justify-between text-xs">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleViewAll();
              }}
              className="text-[#D4AF37] hover:text-[#F3EFEA] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{language === 'bn' ? 'সকল আতর ক্যাটালগ দেখুন' : 'Explore Full Catalog'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <span className="text-[10px] text-[#7A7771] font-mono hidden sm:inline">
              ESC to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
