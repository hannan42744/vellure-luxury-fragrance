import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, ShoppingBag, Search, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentRoute, navigateTo, cartCount, setIsCartOpen, setIsSearchOpen, t } = useApp();

  // On product detail page, the sticky add-to-cart bar is active at bottom
  if (currentRoute === 'product') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F0E12]/95 backdrop-blur-lg border-t border-[#232228] px-3 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer transition-colors ${
          currentRoute === 'home' ? 'text-[#D4AF37]' : 'text-[#8E8A83]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">{t('home')}</span>
      </button>

      <button
        onClick={() => navigateTo('shop')}
        className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer transition-colors ${
          currentRoute === 'shop' ? 'text-[#D4AF37]' : 'text-[#8E8A83]'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">{t('shop')}</span>
      </button>

      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2 cursor-pointer text-[#8E8A83] hover:text-[#D4AF37] transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Search</span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2 cursor-pointer text-[#8E8A83] hover:text-[#D4AF37] transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-[#0B0B0C] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight">Bag</span>
      </button>

      <button
        onClick={() => navigateTo('track-order')}
        className={`flex flex-col items-center gap-1 py-1 px-2 cursor-pointer transition-colors ${
          currentRoute === 'track-order' ? 'text-[#D4AF37]' : 'text-[#8E8A83]'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight">Track</span>
      </button>
    </div>
  );
};
