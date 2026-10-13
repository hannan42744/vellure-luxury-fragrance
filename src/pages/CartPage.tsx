import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, CheckCircle } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    language,
    t,
    settings
  } = useApp();

  const [deliveryRegion, setDeliveryRegion] = useState<'dhaka' | 'outside'>('dhaka');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const baseDeliveryCharge =
    cartSubtotal >= settings.freeDeliveryThreshold
      ? 0
      : deliveryRegion === 'dhaka'
      ? settings.deliveryFeeDhaka
      : settings.deliveryFeeOutside;

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal + baseDeliveryCharge - discount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount
        });
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid voucher code');
      }
    } catch {
      setCouponError('Unable to validate voucher code right now');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    sessionStorage.setItem('vellure_checkout_region', deliveryRegion);
    if (appliedCoupon) {
      sessionStorage.setItem('vellure_checkout_coupon', JSON.stringify(appliedCoupon));
    }
    navigateTo('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#141318] border border-[#26242E] flex items-center justify-center text-[#7A7771] mx-auto">
          <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
          {t('bagEmpty')}
        </h1>
        <p className="text-sm text-[#9E9B93] max-w-md mx-auto">
          {language === 'bn'
            ? 'আপনার শপিং ব্যাগে কোনো আতর যোগ করা হয়নি।'
            : 'Your fragrance bag is empty. Explore our signature pure artisanal attar reserve.'}
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="py-3 px-8 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
        >
          {t('exploreCollection')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
          CHECKOUT REVIEW
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
          {t('yourBag')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart items list (col-span-8) */}
        <div className="lg:col-span-8 bg-[#121116] border border-[#23222A] rounded-2xl p-6 divide-y divide-[#222128]">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-[#1A1920] shrink-0"
                />
                <div>
                  <h3 className="font-serif text-lg text-[#F3EFEA]">
                    {language === 'bn' ? item.nameBn : item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#8E8B83] mt-0.5">
                    <span className="font-mono text-[#D4AF37] bg-[#1E1D24] px-2 py-0.5 rounded">
                      {item.size}
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{formatBDT(item.price)} each</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Quantity stepper */}
                <div className="flex items-center bg-[#18171D] border border-[#2E2C36] rounded-lg">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.size, item.quantity - 1)}
                    className="p-1.5 text-[#8E8B83] hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono tabular-nums text-white font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                    className="p-1.5 text-[#8E8B83] hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[90px]">
                  <span className="font-mono tabular-nums text-base font-semibold text-[#F3EFEA]">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId, item.size)}
                  className="text-[#6B6862] hover:text-red-400 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Delivery Selector (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-5">
            <h2 className="font-serif text-xl text-[#F3EFEA] pb-3 border-b border-[#23222A]">
              {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between text-sm text-[#A8A49C]">
              <span>{t('subtotal')}</span>
              <span className="font-mono tabular-nums text-white font-medium">
                {formatBDT(cartSubtotal)}
              </span>
            </div>

            {/* Delivery Destination selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
                {t('deliveryLocation')}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setDeliveryRegion('dhaka')}
                  className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                    deliveryRegion === 'dhaka'
                      ? 'border-[#D4AF37] bg-[#1F1E24] text-[#D4AF37] font-semibold'
                      : 'border-[#26242E] text-[#8E8B83] hover:text-white'
                  }`}
                >
                  {t('insideDhaka')}
                </button>
                <button
                  onClick={() => setDeliveryRegion('outside')}
                  className={`p-2.5 rounded-lg border text-center transition-colors cursor-pointer ${
                    deliveryRegion === 'outside'
                      ? 'border-[#D4AF37] bg-[#1F1E24] text-[#D4AF37] font-semibold'
                      : 'border-[#26242E] text-[#8E8B83] hover:text-white'
                  }`}
                >
                  {t('outsideDhaka')}
                </button>
              </div>
            </div>

            {/* Delivery Charge Line */}
            <div className="flex justify-between text-sm text-[#A8A49C]">
              <span>{t('deliveryCharge')}</span>
              <span className="font-mono tabular-nums">
                {baseDeliveryCharge === 0 ? (
                  <span className="text-emerald-400 font-semibold uppercase">Free</span>
                ) : (
                  formatBDT(baseDeliveryCharge)
                )}
              </span>
            </div>

            {/* Voucher / Coupon form */}
            <div className="pt-2 border-t border-[#23222A] space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder={t('couponPlaceholder')}
                  className="flex-1 bg-[#18171D] border border-[#2B2932] text-xs text-[#F3EFEA] px-3 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37] uppercase font-mono"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="py-2 px-3.5 bg-[#25242C] hover:bg-[#302F38] text-xs font-semibold text-[#D4AF37] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {validatingCoupon ? '...' : t('apply')}
                </button>
              </form>

              {couponError && <p className="text-xs text-red-400">{couponError}</p>}

              {appliedCoupon && (
                <div className="flex items-center justify-between bg-[#19241C] border border-emerald-500/30 p-2 rounded-lg text-xs text-emerald-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">{appliedCoupon.code}</span>
                  </div>
                  <span className="font-mono font-bold">-{formatBDT(appliedCoupon.discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Discount row if applicable */}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-400 font-medium">
                <span>Voucher Discount</span>
                <span className="font-mono tabular-nums">-{formatBDT(discount)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-4 border-t border-[#23222A] flex justify-between items-baseline">
              <span className="font-serif text-lg text-[#F3EFEA] font-semibold">{t('total')}</span>
              <span className="font-mono tabular-nums text-2xl font-bold text-[#D4AF37]">
                {formatBDT(grandTotal)}
              </span>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 px-6 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-[#D4AF37]/30"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#78756F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Cash on Delivery available nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
