import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/translations';
import { Order } from '../types';
import { CheckCircle2, Compass, ArrowRight, Package, Calendar, Phone, MapPin } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId }) => {
  const { navigateTo, language, t } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch fresh order from server tracking endpoint or fallback
    const fetchOrder = async () => {
      try {
        // Query server directly
        const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=`);
        // If query needs phone or is unrestricted, fallback to tracking
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      {/* Thank you card */}
      <div className="bg-[#121116] border border-[#26242E] rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            {language === 'bn' ? 'অর্ডার গ্রহণ সম্পন্ন' : 'RESERVATION CONFIRMED'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F3EFEA]">
            {t('thankYouTitle')}
          </h1>
          <p className="text-sm text-[#A8A49C] max-w-lg mx-auto">
            {t('orderSuccessMsg')}
          </p>
        </div>

        {/* Highlighted Order ID */}
        <div className="bg-[#18171D] border border-[#2B2932] p-4 rounded-2xl max-w-md mx-auto">
          <span className="text-xs text-[#8E8B83] uppercase tracking-wider block mb-1">
            {t('orderIdLabel')}
          </span>
          <span className="font-mono text-2xl font-bold tracking-wider text-[#D4AF37]">
            {orderId}
          </span>
        </div>

        {/* Expected dispatch timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left max-w-md mx-auto pt-2">
          <div className="bg-[#16151B] border border-[#26242E] p-3.5 rounded-xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="text-[#8E8B83] block">{t('estimatedDelivery')}</span>
              <span className="font-medium text-[#F3EFEA]">
                {language === 'bn' ? '২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি' : '24 to 48 Hours'}
              </span>
            </div>
          </div>

          <div className="bg-[#16151B] border border-[#26242E] p-3.5 rounded-xl flex items-center gap-3">
            <Package className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <div>
              <span className="text-[#8E8B83] block">Status</span>
              <span className="font-medium text-emerald-400">Order Received</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('track-order')}
            className="w-full sm:w-auto py-3.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>{t('trackOrder')}</span>
          </button>

          <button
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto py-3.5 px-6 bg-[#18171D] hover:bg-[#222129] border border-[#302E38] text-[#F3EFEA] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t('continueShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
