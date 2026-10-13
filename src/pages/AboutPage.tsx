import React from 'react';
import { useApp } from '../context/AppContext';
import { ASSET_IMAGES } from '../assets';
import { Logo } from '../components/Logo';
import { Droplets, Sparkles, Shield, Clock, Compass, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Editorial Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
        <Logo variant="footer" className="items-center mx-auto mb-2" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
          THE HOUSE OF VELLURE
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#F3EFEA] leading-tight">
          {language === 'bn'
            ? 'আভিজাত্য ও বিশুদ্ধতার শতাব্দী প্রাচীন ঐতিহ্য'
            : 'The Royal Tradition of Pure Attar & Artisanal Perfumery'}
        </h1>
        <p className="text-base text-[#B8B4AC] font-light leading-relaxed">
          {language === 'bn'
            ? 'ভ্যালুর কেবল একটি ব্র্যান্ড নয়; এটি খাঁটি সুগন্ধি তেলের আভিজাত্য, শতাব্দী প্রাচীন নির্যাস তৈরি পদ্ধতি এবং আধুনিক রুচির এক অপূর্ব সমন্বয়।'
            : 'Born from a reverence for ancient Gulf distillation rituals and modern haute perfumery. VELLURE crafts pure, unadulterated olfactory elixirs for moments that demand immortality.'}
        </p>
      </div>

      {/* Visual Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#2B2932] shadow-2xl">
          <img
            src={ASSET_IMAGES.hero}
            alt="VELLURE Atelier Extraction"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            PHILOSOPHY & SOURCING
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
            {language === 'bn'
              ? 'প্রকৃতির পবিত্র নির্যাস, শূন্য কৃত্রিম অ্যালকোহল'
              : 'Zero Synthetic Alcohols. Pure Botanical Truth.'}
        </h2>
        <p className="text-sm text-[#A8A49C] leading-relaxed">
          {language === 'bn'
            ? 'বাণিজ্যিক পারফিউমে প্রায় ৮০-৯০% সাধারণ ইথাইল অ্যালকোহল ও পানি থাকে যা স্প্রে করার অল্পক্ষণের মধ্যে উবে যায়। কিন্তু ভ্যালুর বিশ্বাস করে প্রাকৃতিক তেলের স্থায়ী ঘনত্বে। আসামের গভীর জঙ্গলের বুনো আগর কাঠ, তাঈফের ৩০ পাপড়ির তাজা গোলাপ এবং মরক্কোর খাঁটি অরেঞ্জ ব্লসম একত্রিত করে তামা পাত্রে দীর্ঘ সময় ধরে ডিস্টিল করা হয়।'
            : 'Commercial sprays evaporate within hours because they are composed of up to 85% synthetic alcohol and water. At VELLURE, our attars are pure oil concentrates. Extracted over slow embers in sacred copper stills, our formulas sink gracefully into skin temperature, unfolding an opulent fragrance narrative that lives for over 24 hours.'}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#23222A] text-xs">
          <div className="space-y-1">
            <span className="font-serif text-base text-[#F3EFEA] font-semibold">100% Halal Pure</span>
            <p className="text-[#8E8B83]">Zero chemical intoxicating alcohol. Ideal for daily prayers and spiritual gatherings.</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-base text-[#F3EFEA] font-semibold">Hand-Blended</span>
            <p className="text-[#8E8B83]">Aged in dark glass maturation vaults for a minimum of 90 days before bottling.</p>
          </div>
        </div>
      </div>
    </div>

      {/* Pillars */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
          <Award className="w-8 h-8 text-[#D4AF37]" />
          <h3 className="font-serif text-xl text-[#F3EFEA]">Ethical Wild Agarwood</h3>
          <p className="text-xs text-[#9E9B93] leading-relaxed">
            We partner with generational harvesters along the Assam and Cambodian borders, ensuring sustainable resin tapping and replanting programs.
          </p>
        </div>

        <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
          <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          <h3 className="font-serif text-xl text-[#F3EFEA]">French-Arabian Harmony</h3>
          <p className="text-xs text-[#9E9B93] leading-relaxed">
            Our master distillers merge classical Arabian ambergris and musk structures with refined floral absolutes from Grasse, France.
          </p>
        </div>

        <div className="bg-[#121116] border border-[#23222A] p-8 rounded-2xl space-y-4">
          <Shield className="w-8 h-8 text-[#D4AF37]" />
          <h3 className="font-serif text-xl text-[#F3EFEA]">Nationwide Trust</h3>
          <p className="text-xs text-[#9E9B93] leading-relaxed">
            Over 10,000 discerning patrons across Dhaka, Chattogram, Sylhet, and beyond trust VELLURE with secure cash on delivery and genuine quality assurance.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <button
          onClick={() => navigateTo('shop')}
          className="py-4 px-8 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl"
        >
          {language === 'bn' ? 'আমাদের কালেকশন দেখুন' : 'Experience The Reserve'}
        </button>
      </div>
    </div>
  );
};
