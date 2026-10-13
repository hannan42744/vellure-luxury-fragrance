import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Order, OrderStatus } from '../types';
import { Search, Compass, CheckCircle2, Circle, Clock, PackageCheck, Truck, MapPin, AlertCircle } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { language, t, navigateTo } = useApp();

  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const statusSteps: OrderStatus[] = [
    'Order Received',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered'
  ];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই লিখুন।'
          : 'Please enter both your Order Reference and Phone Number.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setOrder(data.order);
      } else {
        setErrorMsg(
          data.error ||
            (language === 'bn'
              ? 'কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর ও ফোন নম্বর প্রদান করুন।'
              : 'No matching order found. Please verify your details.')
        );
      }
    } catch {
      setErrorMsg('Network error while looking up consignment.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return statusSteps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#18171D] border border-[#2B2932] flex items-center justify-center text-[#D4AF37] mx-auto">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#F3EFEA]">
          {t('trackingTitle')}
        </h1>
        <p className="text-xs text-[#9E9B93] leading-relaxed">
          {t('trackingSubtitle')}
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-[#121116] border border-[#23222A] p-6 sm:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-medium mb-1.5">
                {t('orderIdLabel')}
              </label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder={t('orderIdInputPlaceholder')}
                className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] font-mono uppercase focus:outline-none placeholder-[#66635D]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-medium mb-1.5">
                {t('mobileNumber')}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phoneInputPlaceholder')}
                className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] font-mono focus:outline-none placeholder-[#66635D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#0B0B0C] text-xs font-bold uppercase tracking-[0.16em] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <span>Locating Consignment...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t('trackNowBtn')}</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Demo Hint */}
        <div className="mt-4 pt-4 border-t border-[#23222A] text-center text-[11px] text-[#706D67]">
          <span>Test Demo Order: </span>
          <button
            onClick={() => {
              setOrderNumber('VLR-2026-000101');
              setPhone('01711223344');
            }}
            className="text-[#D4AF37] hover:underline font-mono ml-1"
          >
            VLR-2026-000101 / 01711223344
          </button>
        </div>
      </div>

      {/* Tracking Result Display */}
      {order && (
        <div className="bg-[#121116] border border-[#23222A] rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
          {/* Order Header summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#23222A] gap-4">
            <div>
              <span className="text-xs text-[#8E8B83] uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#D4AF37]">
                {order.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8E8B83]">Current Status:</span>
              <span className="px-3 py-1 bg-[#1E1D24] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold rounded-full uppercase">
                {order.status}
              </span>
            </div>
          </div>

          {/* Clean Visual Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#F3EFEA]">
              {t('statusTimeline')}
            </h3>

            {/* Step markers bar */}
            <div className="relative py-6">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-[#23222A] hidden sm:block"></div>
              <div
                className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#D4AF37] transition-all duration-500 hidden sm:block"
                style={{
                  width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%`
                }}
              ></div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-[#D4AF37] text-[#0B0B0C]'
                            : 'bg-[#1E1D24] text-[#7A7771] border border-[#2D2C34]'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <span
                          className={`text-xs font-medium block ${
                            isCurrent
                              ? 'text-[#D4AF37] font-bold'
                              : isCompleted
                              ? 'text-[#F3EFEA]'
                              : 'text-[#6E6A63]'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline details logs */}
          <div className="bg-[#16151B] border border-[#26242E] p-5 rounded-2xl space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
              Detailed Transit History
            </h4>
            <div className="divide-y divide-[#222129]">
              {order.timeline?.map((entry, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3 text-xs">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{entry.status}</span>
                      <span className="font-mono text-[11px] text-[#7A7771]">{entry.time}</span>
                    </div>
                    {entry.note && <p className="text-[#9E9B93] mt-0.5">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consignment Items & Delivery details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#23222A] text-xs">
            {/* Delivery address */}
            <div className="space-y-2">
              <span className="text-[#C5A059] uppercase tracking-wider font-semibold block">
                Destination Address
              </span>
              <p className="text-[#F3EFEA] font-medium">{order.customerName}</p>
              <p className="text-[#9E9B93]">{order.address}</p>
              <p className="text-[#9E9B93]">{order.city}{order.area ? `, ${order.area}` : ''}</p>
              <p className="text-[#9E9B93] font-mono">Mobile: {order.phone}</p>
              <p className="text-[#D4AF37]">Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</p>
            </div>

            {/* Items summary */}
            <div className="space-y-2">
              <span className="text-[#C5A059] uppercase tracking-wider font-semibold block">
                Reserved Fragrances
              </span>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[#B8B4AC]">
                    <span>{item.name} ({item.size}) × {item.quantity}</span>
                    <span className="font-mono tabular-nums text-white">{formatBDT(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#23222A] flex justify-between font-bold text-sm text-[#F3EFEA]">
                <span>Total Consignment Value</span>
                <span className="font-mono text-[#D4AF37]">{formatBDT(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
