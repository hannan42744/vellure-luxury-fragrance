import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    language,
    navigateTo,
    t
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const cleanQuery = query.replace(/^vellure\s+/, '').trim();
  const filtered = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (cleanQuery && p.name.toLowerCase().includes(cleanQuery)) ||
          p.nameBn.includes(query) ||
          p.fragranceType.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.notes?.top?.some((n) => n.toLowerCase().includes(query) || (cleanQuery && n.toLowerCase().includes(cleanQuery))) ||
          p.notes?.heart?.some((n) => n.toLowerCase().includes(query) || (cleanQuery && n.toLowerCase().includes(cleanQuery))) ||
          p.notes?.base?.some((n) => n.toLowerCase().includes(query) || (cleanQuery && n.toLowerCase().includes(cleanQuery)))
      )
    : products.slice(0, 4); // Suggest top 4

  const handleSelect = (slug: string) => {
    setIsSearchOpen(false);
    navigateTo('product', { slug });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-20 pb-10">
        <div className="relative w-full max-w-2xl bg-[#0F0E12] border border-[#2B2932] rounded-2xl p-6 text-left shadow-2xl z-10 space-y-6">
          {/* Search Bar Input */}
          <div className="flex items-center gap-3 bg-[#17161C] border border-[#2E2C36] focus-within:border-[#D4AF37] rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-sm text-[#F3EFEA] focus:outline-none placeholder-[#6E6A63]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#8E8B83] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick family pills (interactive filter buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#7A7771] shrink-0">{language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}</span>
            {['Oud', 'Musk', 'Amber', 'Woody', 'Floral'].map((family) => (
              <button
                key={family}
                onClick={() => setSearchQuery(family)}
                className="px-2.5 py-1 bg-[#1A191F] hover:bg-[#26242D] border border-[#2D2B35] rounded-md text-[#C5A059] transition-colors shrink-0"
              >
                {family}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#8E8B83] font-semibold">
              {query ? `${filtered.length} ${language === 'bn' ? 'সুবাস পাওয়া গেছে' : 'Fragrances Found'}` : (language === 'bn' ? 'প্রস্তাবিত সিগনেচার কালেকশন' : 'Recommended Reserves')}
            </h4>

            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#7A7771]">
                {t('noProductsFound')}
              </div>
            ) : (
              <div className="divide-y divide-[#1F1E24]">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product.slug)}
                    className="py-3 px-3 hover:bg-[#16151B] rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#1A191F] shrink-0"
                      />
                      <div>
                        <h5 className="font-serif text-base text-[#F3EFEA] group-hover:text-[#D4AF37] transition-colors">
                          {language === 'bn' ? product.nameBn : product.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-[#807D77]">
                          <span>{product.fragranceType}</span>
                          <span>·</span>
                          <span>{language === 'bn' ? product.categoryBn : product.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-sm font-semibold text-[#D4AF37]">
                        {formatBDT(product.price3ml)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#5A5852] group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
