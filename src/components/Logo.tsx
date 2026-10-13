import React from 'react';
import { ASSET_IMAGES } from '../assets';

interface LogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'mobile' | 'hero' | 'icon';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'header',
  showSubtitle = true
}) => {
  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div className="absolute -inset-1 rounded-2xl bg-[#D4AF37]/30 blur-md animate-pulse"></div>
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#D4AF37]/70 shadow-[0_0_20px_rgba(212,175,55,0.4)] bg-black p-1">
          <img
            src={ASSET_IMAGES.logo}
            alt="VELLURE Luxury Attar & Perfume"
            className="w-full h-full object-contain filter brightness-[1.08] contrast-[1.15]"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`group flex flex-col items-start gap-3 select-none ${className}`}>
        <div className="flex items-center gap-4">
          {/* Logo Emblem with Ambient Glow & Gold Frame */}
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/45 via-[#F3EFEA]/20 to-[#996515]/30 blur-lg opacity-85 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.45)] bg-black p-1.5 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={ASSET_IMAGES.logo}
                alt="VELLURE Luxury Attar & Perfume"
                className="w-full h-full object-contain filter brightness-[1.1] contrast-[1.18]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6E5] via-[#D4AF37] to-[#F5D77F] drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]">
                VELLURE
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.34em] text-[#D4AF37] font-semibold flex items-center gap-2 mt-1">
              <span className="w-4 h-px bg-[#D4AF37]/70"></span>
              <span>ATTAR & PERFUME</span>
              <span className="w-4 h-px bg-[#D4AF37]/70"></span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Header / Mobile
  return (
    <div className={`group flex items-center gap-3.5 select-none transition-transform duration-300 group-hover:scale-[1.02] ${className}`}>
      {/* Golden Highlight Halo & Emblem Container */}
      <div className="relative flex-shrink-0">
        {/* Radiating ambient glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#D4AF37]/60 via-[#F5D77F]/40 to-[#D4AF37]/60 blur-md opacity-85 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse"></div>

        {/* Large, High-Resolution Sharp Container */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,0.5)] bg-black p-1 transition-all duration-300 group-hover:border-[#F5D77F]">
          <img
            src={ASSET_IMAGES.logo}
            alt="VELLURE Logo"
            className="w-full h-full object-contain filter brightness-[1.1] contrast-[1.18] transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gold shimmer bar */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
        </div>
      </div>

      {/* Brand Text with Gold Lustre */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#E8C56B] to-[#F5D77F] drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] group-hover:drop-shadow-[0_2px_16px_rgba(212,175,55,0.7)] transition-all">
            VELLURE
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span className="w-3 sm:w-4 h-px bg-[#D4AF37]/70"></span>
            <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.32em] text-[#D4AF37] font-semibold">
              ATTAR & PERFUME
            </span>
            <span className="w-3 sm:w-4 h-px bg-[#D4AF37]/70"></span>
          </div>
        )}
      </div>
    </div>
  );
};
