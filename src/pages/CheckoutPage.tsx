import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { trackInitiateCheckout, trackPurchase } from '../utils/analytics';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { BkashLogo, NagadLogo, CodLogo } from '../components/PaymentLogos';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, navigateTo, language, t, settings } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'online'>('cod');
  const [trxId, setTrxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Read saved region from cart session if any
  useEffect(() => {
    const savedRegion = sessionStorage.getItem('vellure_checkout_region');
    if (savedRegion === 'outside') {
      setCity('Chattogram');
    }
  }, []);

  const isDhaka = city.toLowerCase().includes('dhaka');
  const deliveryCharge =
    cartSubtotal >= settings.freeDeliveryThreshold
      ? 0
      : isDhaka
      ? settings.deliveryFeeDhaka
      : settings.deliveryFeeOutside;

  // Read applied coupon from session
  let discount = 0;
  let couponCode = '';
  try {
    const savedCoupon = sessionStorage.getItem('vellure_checkout_coupon');
    if (savedCoupon) {
      const parsed = JSON.parse(savedCoupon);
      discount = parsed.discountAmount || 0;
      couponCode = parsed.code || '';
    }
  } catch {}

  const totalAmount = Math.max(0, cartSubtotal + deliveryCharge - discount);

  // Track InitiateCheckout on page mount
  useEffect(() => {
    if (cart.length > 0) {
      trackInitiateCheckout(cart, totalAmount);
    }
  }, []);

  // If cart is empty, prompt user
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#F3EFEA]">{t('bagEmpty')}</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="py-2.5 px-6 bg-[#D4AF37] text-[#0B0B0C] text-xs font-bold uppercase rounded-lg"
        >
          {t('shopNow')}
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation for Bangladesh phone number (11 digits e.g. 017..., 018..., 019..., 013..., 014..., 016...)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
          : 'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX)'
      );
      return;
    }

    if (!customerName.trim() || !address.trim()) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে নাম এবং সম্পূর্ণ ঠিকানা লিখুন।'
          : 'Please enter your full name and complete street delivery address.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        address: address.trim(),
        city,
        area: area.trim(),
        deliveryNote: deliveryNote.trim() + (trxId ? ` | TrxID: ${trxId}` : ''),
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          nameBn: item.nameBn,
          image: item.image,
          size: item.size,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: cartSubtotal,
        deliveryCharge,
        discount,
        couponCode: couponCode || null,
        totalAmount,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        // Track Purchase conversion event for Meta Pixel and GA4
        trackPurchase(data.order);

        clearCart();
        sessionStorage.removeItem('vellure_checkout_coupon');
        sessionStorage.removeItem('vellure_checkout_region');
        navigateTo('order-confirmed', { orderId: data.order.id });
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please try again.');
      }
    } catch {
      setErrorMsg('Network error. Please try placing your order again.');
    } finally {
      setSubmitting(false);
    }
  };

  const bdDivisions = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
    'Gazipur',
    'Narayanganj',
    'Cumilla'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs text-[#8E8B83] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'শপিং ব্যাগে ফিরে যান' : 'Back to Shopping Bag'}</span>
        </button>
      </div>

      <div className="border-b border-[#23222A] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
          CONFIRM DISPATCH
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
          {t('checkoutTitle')}
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery Address & Payment (col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Details */}
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4">
            <h2 className="font-serif text-lg text-[#F3EFEA] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'bn' ? '১. ডেলিভারির তথ্য' : '1. Delivery Details'}</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-medium mb-1">
                  {t('fullName')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">
                    {t('mobileNumber')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#706D66] mt-0.5 block">
                    11-digit mobile phone number for order verification
                  </span>
                </div>

                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">
                    {t('city')} <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none cursor-pointer"
                  >
                    {bdDivisions.map((c) => (
                      <option key={c} value={c} className="bg-[#18171D]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">
                    {t('area')}
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Banani / Uttara / Dhanmondi"
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C5A059] font-medium mb-1">
                  {t('streetAddress')} <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, road number, block, flat / apartment details"
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] font-medium mb-1">
                  {t('orderNotes')}
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Please call before delivery, deliver in evening"
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-[#F3EFEA] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4">
            <h2 className="font-serif text-lg text-[#F3EFEA] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'bn' ? '২. পেমেন্ট পদ্ধতি' : '2. Payment Method'}</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-[#D4AF37] bg-[#1B1A22]'
                    : 'border-[#26242E] bg-[#16151B] hover:border-[#383640]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#D4AF37] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <CodLogo className="h-5 w-auto" />
                      <span className="text-sm font-semibold text-[#F3EFEA]">
                        {t('cod')}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E8B83] mt-1.5">
                    {language === 'bn'
                      ? 'ডেলিভারি ম্যানের কাছ থেকে পার্সেল বুঝে পেয়ে মূল্য পরিশোধ করুন।'
                      : 'Pay in cash directly to the courier agent when your parcel is delivered to your doorstep.'}
                  </p>
                </div>
              </label>

              {/* bKash */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'bkash'
                    ? 'border-[#D4AF37] bg-[#1B1A22]'
                    : 'border-[#26242E] bg-[#16151B] hover:border-[#383640]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-[#D4AF37] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <BkashLogo className="h-5 w-auto" />
                      <span className="text-sm font-semibold text-[#F3EFEA]">
                        {t('bkash')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8E8B83] mt-1.5">
                    Send Money / Payment to Merchant Number: <span className="font-mono text-[#D4AF37] font-semibold">{settings.phone}</span>
                  </p>
                  {paymentMethod === 'bkash' && (
                    <div className="mt-3 pt-3 border-t border-[#2A2932]">
                      <label className="text-[11px] text-[#A8A49C] block mb-1">
                        bKash Transaction ID (TrxID):
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. BK9X28A4"
                        className="bg-[#121116] border border-[#33313B] rounded-lg px-3 py-1.5 text-xs text-white font-mono w-full max-w-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Nagad */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  paymentMethod === 'nagad'
                    ? 'border-[#D4AF37] bg-[#1B1A22]'
                    : 'border-[#26242E] bg-[#16151B] hover:border-[#383640]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="accent-[#D4AF37] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <NagadLogo className="h-5 w-auto" />
                      <span className="text-sm font-semibold text-[#F3EFEA]">
                        {t('nagad')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#8E8B83] mt-1.5">
                    Nagad Merchant: <span className="font-mono text-[#D4AF37]">{settings.phone}</span>
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary: Item list & Place Order (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-5 sticky top-28">
            <h2 className="font-serif text-lg text-[#F3EFEA] pb-3 border-b border-[#23222A]">
              {language === 'bn' ? 'অর্ডার সারসংক্ষেপ' : 'Your Fragrance Reservation'}
            </h2>

            {/* Line items */}
            <div className="divide-y divide-[#1F1E24] max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-[#18171D] shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-sm text-[#F3EFEA] line-clamp-1">
                        {language === 'bn' ? item.nameBn : item.name}
                      </h4>
                      <span className="text-[#8E8B83] font-mono">
                        {item.size} × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono tabular-nums text-white font-medium">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-3 border-t border-[#23222A] text-xs text-[#A8A49C]">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-mono tabular-nums text-white">{formatBDT(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryCharge')} ({isDhaka ? 'Dhaka' : 'Outside Dhaka'})</span>
                <span className="font-mono tabular-nums">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-400 font-semibold uppercase">Free</span>
                  ) : (
                    formatBDT(deliveryCharge)
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Voucher Discount ({couponCode})</span>
                  <span className="font-mono tabular-nums">-{formatBDT(discount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#23222A] flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-[#F3EFEA]">{t('total')}</span>
              <span className="font-mono tabular-nums text-2xl font-bold text-[#D4AF37]">
                {formatBDT(totalAmount)}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#0B0B0C] font-bold text-xs uppercase tracking-[0.16em] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-[#D4AF37]/30"
            >
              {submitting ? (
                <span>{language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Reserving your fragrance...'}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('confirmOrderBtn')}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7771]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Secure Checkout · Discreet Luxury Packing</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
