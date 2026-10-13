import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { formatBDT } from '../utils/translations';
import { trackViewContent } from '../utils/analytics';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Droplets,
  Clock,
  MapPin,
  Plus,
  Minus,
  Check,
  Briefcase,
  SunMedium
} from 'lucide-react';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { products, language, t, addToCart, navigateTo, isInWishlist, toggleWishlist } = useApp();

  const product = products.find((p) =>
    p.slug === slug ||
    (slug.includes('royal-sandal') && p.slug.includes('royal-sandal')) ||
    (slug.includes('white-chandan') && p.slug.includes('white-chandan'))
  ) || products[0];
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<'3ml' | '6ml'>('3ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const price = selectedSize === '3ml' ? product.price3ml : product.price6ml;
  const originalPrice = selectedSize === '3ml' ? product.originalPrice3ml : product.originalPrice6ml;
  const inWishlist = isInWishlist(product.id);
  const stockFor3ml = product.stock3ml !== undefined ? product.stock3ml : product.stock;
  const stockFor6ml = product.stock6ml !== undefined ? product.stock6ml : product.stock;
  const currentVariantStock = selectedSize === '3ml' ? stockFor3ml : stockFor6ml;
  const isOutOfStock = currentVariantStock <= 0;

  // Track ViewContent for Meta Pixel and GA4
  useEffect(() => {
    if (product) {
      trackViewContent(product, selectedSize);
    }
  }, [product?.id, selectedSize]);

  // Auto-switch image to match selected variant (3ml vs 6ml)
  useEffect(() => {
    if (!product?.images?.length) return;
    if (selectedSize === '6ml') {
      const img6ml = product.images.find((img) => img.toLowerCase().includes('6ml'));
      if (img6ml) {
        setSelectedImage(img6ml);
        return;
      }
    } else if (selectedSize === '3ml') {
      const img3ml =
        product.images.find((img) => img.toLowerCase().includes('3ml')) ||
        product.images.find((img) => !img.toLowerCase().includes('6ml'));
      if (img3ml) {
        setSelectedImage(img3ml);
        return;
      }
    }
    // Fallback to first image
    if (!product.images.includes(selectedImage)) {
      setSelectedImage(product.images[0]);
    }
  }, [selectedSize, product]);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.fragranceType === product.fragranceType))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb unboxed */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#8E8B83]">
        <button onClick={() => navigateTo('home')} className="hover:text-white">
          {t('home')}
        </button>
        <span>/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-white">
          {t('shop')}
        </button>
        <span>/</span>
        <span className="text-[#D4AF37] font-medium line-clamp-1">
          {language === 'bn' ? product.nameBn : product.name}
        </span>
      </nav>

      {/* Main Contiguous Purchase Module & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Sticky Image Gallery (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square bg-[#141318] rounded-2xl overflow-hidden border border-[#26242E] flex items-center justify-center">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {isOutOfStock ? (
              <div className="absolute top-4 left-4 bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs font-bold px-3 py-1 rounded shadow-lg uppercase flex items-center gap-1.5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span>{language === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}</span>
              </div>
            ) : product.discount > 0 ? (
              <div className="absolute top-4 left-4 bg-[#0B0B0C]/85 border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-semibold px-2.5 py-1 rounded">
                -{product.discount}% OFF
              </div>
            ) : null}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0B0B0C]/70 backdrop-blur-md text-[#F3EFEA] hover:text-[#D4AF37] border border-[#2B2932] transition-colors"
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border transition-all cursor-pointer shrink-0 ${
                    selectedImage === img
                      ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                      : 'border-[#26242E] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#C5A059] uppercase tracking-widest font-semibold">
              <span>{language === 'bn' ? product.categoryBn : product.category}</span>
              <span>·</span>
              <span>{product.fragranceType} Reserve</span>
              <span>·</span>
              <span className="text-[#8E8B83] font-mono">{product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F3EFEA] leading-tight">
              {language === 'bn' ? product.nameBn : product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm text-[#9E9B93] pt-1">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-[#47443F]'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono tabular-nums text-white font-medium">{product.rating.toFixed(1)}</span>
              <span>({product.reviewsCount} {language === 'bn' ? 'রিভিউ' : 'verified reviews'})</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 py-3 border-y border-[#23222A]">
            <span className="font-mono tabular-nums text-3xl font-bold text-[#F3EFEA]">
              {formatBDT(price)}
            </span>
            {originalPrice > price && (
              <span className="font-mono tabular-nums text-base text-[#7A7771] line-through">
                {formatBDT(originalPrice)}
              </span>
            )}
            {isOutOfStock ? (
              <span className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 bg-rose-950/50 border border-rose-800/50 px-2.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>{language === 'bn' ? 'স্টক শেষ (Out of Stock)' : 'Out of Stock · Restocking Soon'}</span>
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{language === 'bn' ? 'স্টকে রয়েছে (In Stock)' : 'In Stock'}</span>
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-sm text-[#B8B4AC] leading-relaxed">
            {language === 'bn' ? product.shortDescriptionBn : product.shortDescription}
          </p>

          {/* Size Selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
              {t('filterSize')}: <span className="text-white font-mono">{selectedSize}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSize('3ml')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedSize === '3ml'
                    ? 'border-[#D4AF37] bg-[#1F1E24] shadow-md'
                    : 'border-[#26242E] bg-[#121116] hover:border-[#3A3842]'
                } ${stockFor3ml <= 0 ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#F3EFEA]">3ml Vial</span>
                  <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                    {formatBDT(product.price3ml)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#7A7771]">Approx. 45-60 uses</span>
                  {stockFor3ml <= 0 ? (
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">{language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                  ) : (
                    <span className="text-[9px] text-emerald-400/90 font-medium">{language === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedSize('6ml')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedSize === '6ml'
                    ? 'border-[#D4AF37] bg-[#1F1E24] shadow-md'
                    : 'border-[#26242E] bg-[#121116] hover:border-[#3A3842]'
                } ${stockFor6ml <= 0 ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#F3EFEA]">6ml Flacon</span>
                  <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                    {formatBDT(product.price6ml)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[#7A7771]">Approx. 100-120 uses</span>
                  {stockFor6ml <= 0 ? (
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">{language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                  ) : (
                    <span className="text-[9px] text-emerald-400/90 font-medium">{language === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#17161C] border border-[#2B2932] rounded-xl px-2 py-1">
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#949088] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono tabular-nums text-sm text-white font-semibold">
                  {quantity}
                </span>
                <button
                  disabled={isOutOfStock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#949088] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-[#151419] border border-[#26242C] text-[#615E58] cursor-not-allowed opacity-50'
                    : 'bg-[#1C1B22] hover:bg-[#272630] border border-[#3A3842] hover:border-[#D4AF37] text-[#F3EFEA] cursor-pointer shadow-md'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${isOutOfStock ? 'text-zinc-600' : 'text-[#D4AF37]'}`} />
                <span>
                  {isOutOfStock
                    ? (language === 'bn' ? 'স্টক শেষ' : 'Out of Stock')
                    : addedNotice
                    ? (language === 'bn' ? 'কার্টে যোগ হয়েছে ✓' : 'Added to Bag ✓')
                    : t('addToCart')}
                </span>
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`w-full py-4 px-6 font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xl ${
                isOutOfStock
                  ? 'bg-[#18171C] border border-[#24232A] text-[#615E58] cursor-not-allowed opacity-40'
                  : 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] cursor-pointer hover:shadow-[#D4AF37]/30'
              }`}
            >
              <Zap className={`w-4 h-4 ${isOutOfStock ? 'fill-zinc-600' : 'fill-current'}`} />
              <span>
                {isOutOfStock
                  ? (language === 'bn' ? 'পণ্যটি বর্তমানে স্টকে নেই' : 'Currently Out of Stock')
                  : `${t('buyNow')} (${language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'})`}
              </span>
            </button>
          </div>

          {/* Delivery & Assurance Info Card */}
          <div className="bg-[#121116] border border-[#23222A] p-4 rounded-xl space-y-2.5 text-xs text-[#A8A49C]">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  {language === 'bn' ? 'সারাদেশে দ্রুত ডেলিভারি' : 'Fast Nationwide Dispatch'}
                </span>
                <p className="text-[11px] text-[#7A7771]">
                  Dhaka: 24-48 Hours (৳70) · Outside Dhaka: 2-4 Days (৳130)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on Delivery Available'}
                </span>
                <p className="text-[11px] text-[#7A7771]">
                  Inspect packaging upon delivery before payment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  {language === 'bn' ? '১০০% বিশুদ্ধ অ্যালকোহলমুক্ত' : '100% Pure Concentrated Oil'}
                </span>
                <p className="text-[11px] text-[#7A7771]">
                  Suitable for daily prayers and religious gatherings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Notes & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-[#23222A]">
        {/* Story description (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F3EFEA]">
            {language === 'bn' ? 'সুবাসের বর্ণনা ও ইতিহাস' : 'Olfactory Composition & Heritage'}
          </h2>
          <p className="text-sm text-[#B8B4AC] leading-relaxed">
            {language === 'bn' ? product.descriptionBn : product.description}
          </p>

          {/* Best For & Best Weather Highlights */}
          {(product.bestFor || product.bestForBn || product.bestWeather || product.bestWeatherBn) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {(product.bestFor || product.bestForBn) && (
                <div className="bg-[#121116] border border-[#2B2932] hover:border-[#D4AF37]/50 transition-colors p-4 rounded-xl space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Briefcase className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {language === 'bn' ? 'কোথায় ব্যবহার করবেন (Best For)' : 'Best For / Occasions'}
                    </span>
                  </div>
                  <p className="text-xs text-[#E5E0D8] leading-relaxed">
                    {language === 'bn' ? (product.bestForBn || product.bestFor) : (product.bestFor || product.bestForBn)}
                  </p>
                </div>
              )}

              {(product.bestWeather || product.bestWeatherBn) && (
                <div className="bg-[#121116] border border-[#2B2932] hover:border-[#D4AF37]/50 transition-colors p-4 rounded-xl space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <SunMedium className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {language === 'bn' ? 'কোন আবহাওয়ায় (Best Weather)' : 'Best Weather & Season'}
                    </span>
                  </div>
                  <p className="text-xs text-[#E5E0D8] leading-relaxed">
                    {language === 'bn' ? (product.bestWeatherBn || product.bestWeather) : (product.bestWeather || product.bestWeatherBn)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl text-[#F3EFEA] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{t('howToApply')}</span>
            </h3>
            <p className="text-xs text-[#9E9B93] leading-relaxed bg-[#121116] border border-[#23222A] p-4 rounded-xl">
              {t('howToApplyText')}
            </p>
          </div>
        </div>

        {/* Notes Pyramid (col-span-5) */}
        <div className="lg:col-span-5 bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-6">
          <h3 className="font-serif text-xl text-[#F3EFEA] pb-3 border-b border-[#23222A]">
            {language === 'bn' ? 'সুগন্ধি পিরামিড নোটস' : 'The Note Architecture'}
          </h3>

          {/* Top Notes */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              {t('topNotes')}
            </span>
            <div className="flex flex-wrap gap-2">
              {(language === 'bn' && product.notes.topBn ? product.notes.topBn : product.notes.top).map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#1A1920] border border-[#2B2932] rounded-md text-xs text-[#E5E0D8]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              {t('heartNotes')}
            </span>
            <div className="flex flex-wrap gap-2">
              {(language === 'bn' && product.notes.heartBn ? product.notes.heartBn : product.notes.heart).map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#1A1920] border border-[#2B2932] rounded-md text-xs text-[#E5E0D8]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-semibold">
              {t('baseNotes')}
            </span>
            <div className="flex flex-wrap gap-2">
              {(language === 'bn' && product.notes.baseBn ? product.notes.baseBn : product.notes.base).map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#1A1920] border border-[#2B2932] rounded-md text-xs text-[#E5E0D8]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Longevity & Sillage specs */}
          <div className="pt-4 border-t border-[#23222A] grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#7A7771] block">{t('longevity')}</span>
              <span className="text-[#F3EFEA] font-medium">
                {language === 'bn' && product.longevityBn ? product.longevityBn : product.longevity}
              </span>
            </div>
            <div>
              <span className="text-[#7A7771] block">{t('sillage')}</span>
              <span className="text-[#F3EFEA] font-medium">
                {language === 'bn' && product.sillageBn ? product.sillageBn : product.sillage}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#23222A] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EFEA]">
              {t('relatedFragrances')}
            </h3>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs uppercase tracking-wider text-[#D4AF37] hover:underline"
            >
              {language === 'bn' ? 'সব দেখুন' : 'Explore All'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Buy Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-[#0F0E12]/95 backdrop-blur-md border-t border-[#232228] p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="font-mono tabular-nums text-sm font-bold text-[#F3EFEA]">
            {formatBDT(price)}
          </span>
          <span className="text-[10px] text-[#D4AF37] font-mono">{selectedSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="py-2.5 px-3 bg-[#1C1B22] border border-[#3A3842] text-[#F3EFEA] text-xs font-semibold rounded-lg"
          >
            {addedNotice ? 'Added ✓' : 'Add'}
          </button>
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-[#D4AF37] text-[#0B0B0C] text-xs font-bold uppercase rounded-lg"
          >
            {t('buyNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
