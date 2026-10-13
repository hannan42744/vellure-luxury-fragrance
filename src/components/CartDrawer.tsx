import React from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { trackInitiateCheckout } from '../utils/analytics';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    language,
    t,
    settings
  } = useApp();

  if (!isCartOpen) return null;

  const threshold = settings.freeDeliveryThreshold;
  const progressToFree = Math.min(100, Math.round((cartSubtotal / threshold) * 100));
  const amountNeeded = Math.max(0, threshold - cartSubtotal);

  const handleCheckout = () => {
    if (cart.length > 0) {
      trackInitiateCheckout(cart, cartSubtotal);
    }
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0E12] border-l border-[#24232A] flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#24232A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-xl font-medium text-[#F3EFEA]">
                {t('yourBag')}
              </h2>
              <span className="text-xs text-[#8E8B83] font-mono">({cart.length})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8E8B83] hover:text-white rounded-lg hover:bg-[#1A191F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-[#141318] px-6 py-3 border-b border-[#24232A] text-xs">
            <div className="flex items-center justify-between mb-1.5 text-[#C5BFB5]">
              <span>
                {amountNeeded === 0 ? (
                  <span className="text-emerald-400 font-medium">
                    ✓ {language === 'bn' ? 'আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : 'Complimentary Nationwide Shipping Unlocked!'}
                  </span>
                ) : (
                  <span>
                    {language === 'bn'
                      ? `আর ${formatBDT(amountNeeded)} শপ করলেই ফ্রি ডেলিভারি!`
                      : `Add ${formatBDT(amountNeeded)} more for Free Delivery!`}
                  </span>
                )}
              </span>
              <span className="font-mono tabular-nums text-[#8E8B83]">{progressToFree}%</span>
            </div>
            <div className="w-full bg-[#25242D] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#18171C] border border-[#27262E] flex items-center justify-center text-[#706D67]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-[#A6A29A]">{t('bagEmpty')}</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'সুবাস দেখুন' : 'Explore Reserve'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 bg-[#141318] p-3.5 rounded-xl border border-[#232229]"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-[#1B1A20] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base text-[#F3EFEA] line-clamp-1">
                          {language === 'bn' ? item.nameBn : item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-[#6E6A63] hover:text-red-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] font-mono text-[#D4AF37] bg-[#232128] px-2 py-0.5 rounded uppercase mt-0.5 inline-block">
                        {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-[#1D1C22] border border-[#2B2A32] rounded-md">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1 hover:text-white text-[#949088] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1 hover:text-white text-[#949088] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total line price */}
                      <span className="font-mono tabular-nums text-sm font-semibold text-[#F3EFEA]">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#24232A] bg-[#121116] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#A6A29A]">
                  <span>{t('subtotal')}</span>
                  <span className="font-mono tabular-nums text-white font-medium">
                    {formatBDT(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#7A7771]">
                  <span>{t('deliveryCharge')}</span>
                  <span>
                    {cartSubtotal >= threshold ? (
                      <span className="text-emerald-400 font-semibold uppercase">Free</span>
                    ) : (
                      'Calculated at checkout (৳70/৳130)'
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-sm uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/20"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#78756F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Cash on Delivery & Instant Confirmation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
