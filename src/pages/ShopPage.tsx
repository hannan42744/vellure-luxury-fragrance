import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { FragranceCategory, FragranceType } from '../types';
import { formatBDT } from '../utils/translations';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories: appCategories, language, t, routeParams } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Sync with routeParams when navigating from Header submenus
  React.useEffect(() => {
    if (routeParams?.category) {
      setSelectedCategory(routeParams.category);
    }
    if (routeParams?.season) {
      setSelectedSeason(routeParams.season);
    }
  }, [routeParams]);

  const categories = useMemo(() => {
    const list: { label: string; value: string }[] = [
      { label: language === 'bn' ? 'সকল আতর' : 'All Attars', value: 'all' }
    ];
    if (appCategories && appCategories.length > 0) {
      appCategories.forEach(cat => {
        list.push({
          label: language === 'bn' ? (cat.nameBn || cat.name) : cat.name,
          value: cat.slug
        });
      });
    } else {
      list.push(
        { label: language === 'bn' ? 'খাঁটি আতর' : 'Pure Attar', value: 'attar' },
        { label: language === 'bn' ? 'কম্বো ও গিফট সেট' : 'Gift Sets', value: 'gift_set' }
      );
    }
    return list;
  }, [appCategories, language]);

  const seasons: { label: string; value: string; icon: string }[] = [
    { label: language === 'bn' ? 'সকল ঋতু' : 'All Seasons', value: 'all', icon: '✦' },
    { label: language === 'bn' ? 'গ্রীষ্মকাল (Summer)' : 'Summer', value: 'Summer', icon: '☀️' },
    { label: language === 'bn' ? 'বর্ষাকাল (Monsoon)' : 'Monsoon', value: 'Monsoon', icon: '🌧️' },
    { label: language === 'bn' ? 'শীতকাল (Winter)' : 'Winter', value: 'Winter', icon: '❄️' },
    { label: language === 'bn' ? 'সারাবছর (All-Season)' : 'All-Season', value: 'All-Season', icon: '✨' },
  ];

  const families: { label: string; value: string }[] = [
    { label: language === 'bn' ? 'সকল ধরন' : 'All Families', value: 'all' },
    { label: language === 'bn' ? 'অ্যাকোয়াটিক ও ফ্রেশ' : 'Aquatic / Fresh', value: 'Aquatic' },
    { label: language === 'bn' ? 'উদ' : 'Oud', value: 'Oud' },
    { label: language === 'bn' ? 'মাস্ক' : 'Musk', value: 'Musk' },
    { label: language === 'bn' ? 'চন্দন' : 'Sandalwood', value: 'Sandalwood' },
    { label: language === 'bn' ? 'অ্যাম্বার' : 'Amber', value: 'Amber' },
    { label: language === 'bn' ? 'উডি' : 'Woody', value: 'Woody' },
    { label: language === 'bn' ? 'ফ্লোরাল' : 'Floral', value: 'Floral' },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Season filter
    if (selectedSeason !== 'all') {
      result = result.filter((p) => {
        if (p.category === 'gift_set' || p.category === 'combo') return false;
        return (
          p.seasons?.some((s) => s.toLowerCase() === selectedSeason.toLowerCase()) ||
          p.bestWeather?.toLowerCase().includes(selectedSeason.toLowerCase())
        );
      });
    }

    // Fragrance family
    if (selectedFamily !== 'all') {
      result = result.filter(
        (p) => p.fragranceType.toLowerCase() === selectedFamily.toLowerCase()
      );
    }

    // Price max filter (based on 3ml base price)
    result = result.filter((p) => p.price3ml <= maxPrice);

    // Stock filter
    if (onlyInStock) {
      result = result.filter((p) => (p.stock > 0) || (p.stock3ml !== undefined && p.stock3ml > 0) || (p.stock6ml !== undefined && p.stock6ml > 0));
    }

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn.includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.fragranceType.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price3ml - b.price3ml);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price3ml - a.price3ml);
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else {
      // featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSeason,
    selectedFamily,
    maxPrice,
    onlyInStock,
    searchFilter,
    sortBy
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSeason('all');
    setSelectedFamily('all');
    setSelectedSize('all');
    setMaxPrice(2000);
    setSearchFilter('');
    setSortBy('featured');
    setOnlyInStock(false);
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedSeason !== 'all' ||
    selectedFamily !== 'all' ||
    maxPrice < 2000 ||
    searchFilter !== '' ||
    onlyInStock;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#23222A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
            PURE ARTISANAL ATTAR COLLECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F3EFEA]">
            {language === 'bn' ? 'সকল প্রিমিয়াম আতর' : 'Pure Attar Collection'}
          </h1>
          <p className="text-xs text-[#9E9B93] mt-2">
            {language === 'bn'
              ? '১০০% বিশুদ্ধ অ্যালকোহলমুক্ত কনসেনট্রেটেড আতর তেল কালেকশন।'
              : 'Hand-distilled concentrated pure attar oils. 100% alcohol-free.'}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick search inside shop */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-[#8E8B83] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#141318] border border-[#2B2932] focus:border-[#D4AF37] text-xs text-[#F3EFEA] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort" className="text-xs text-[#8E8B83] hidden sm:inline">
              {t('sortBy')}:
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#141318] border border-[#2B2932] text-xs text-[#E5E0D8] py-2.5 px-3 rounded-lg focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="best-selling">{t('sortBestSelling')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden p-2.5 bg-[#17161C] border border-[#2B2932] text-[#D4AF37] rounded-lg flex items-center gap-1.5 text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters on Desktop / Slide on Mobile */}
        <aside
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } lg:block lg:col-span-1 bg-[#121116] border border-[#222129] p-6 rounded-2xl space-y-6 h-fit`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#23222A]">
            <h3 className="font-serif text-lg text-[#F3EFEA] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>Filters</span>
            </h3>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
              {t('allCategories')}
            </span>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.value
                      ? 'bg-[#23222A] text-[#D4AF37] font-semibold'
                      : 'text-[#9E9B93] hover:text-white hover:bg-[#18171D]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Season Filter */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
              {language === 'bn' ? 'আবহাওয়া ও ঋতুভিত্তিক' : 'Season Suitability'}
            </span>
            <div className="space-y-1.5">
              {seasons.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedSeason(s.value)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedSeason === s.value
                      ? 'bg-[#23222A] text-[#D4AF37] font-semibold border border-[#D4AF37]/40'
                      : 'text-[#9E9B93] hover:text-white hover:bg-[#18171D]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </span>
                  {selectedSeason === s.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fragrance Family */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
              {t('fragranceType')}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {families.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedFamily(f.value)}
                  className={`px-2.5 py-1.5 text-xs rounded-md border text-center transition-colors ${
                    selectedFamily === f.value
                      ? 'bg-[#222129] border-[#D4AF37] text-[#D4AF37] font-medium'
                      : 'border-[#26242E] text-[#9E9B93] hover:text-white hover:bg-[#18171E]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-[#C5A059] font-medium">
                {t('priceRange')}
              </span>
              <span className="font-mono tabular-nums text-[#F3EFEA]">
                Up to {formatBDT(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D4AF37] bg-[#222129] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#706D67] font-mono">
              <span>৳ 400</span>
              <span>৳ 2,000</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-[#23222A]">
            <label className="flex items-center gap-2.5 text-xs text-[#C7C2B8] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4 rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Season Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {seasons.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedSeason(s.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedSeason === s.value
                    ? 'bg-[#D4AF37] text-[#0B0B0C] font-semibold shadow-md'
                    : 'bg-[#15141B] text-[#A8A49C] border border-[#26242F] hover:text-white hover:border-[#D4AF37]/40'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#8E8B83] px-1">
            <span>
              Showing <span className="font-mono text-white">{filteredProducts.length}</span> luxury fragrances
              {selectedSeason !== 'all' && (
                <span className="ml-2 text-[#D4AF37] font-semibold">
                  • {language === 'bn' ? 'নির্বাচিত ঋতু:' : 'Season:'} {selectedSeason}
                </span>
              )}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-[#121116] border border-[#222129] p-16 rounded-2xl text-center space-y-4">
              <p className="text-base text-[#C7C2B8]">
                {t('noProductsFound')}
              </p>
              <button
                onClick={resetFilters}
                className="py-2 px-5 bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
