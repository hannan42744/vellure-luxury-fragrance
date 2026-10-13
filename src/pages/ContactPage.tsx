import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, language, t } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
          CONCIERGE & ATELIER
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#F3EFEA]">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Connect With VELLURE'}
        </h1>
        <p className="text-xs text-[#9E9B93]">
          {language === 'bn'
            ? 'পণ্য সম্পর্কিত যেকোনো তথ্য, বিশেষ অর্ডার বা সহায়তার জন্য আমাদের কন্সিয়ার্জ টিম সার্বক্ষণিক প্রস্তুত।'
            : 'For bespoke scent consultations, corporate gifting, or dispatch inquiries, our fragrance advisors are at your service.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121116] border border-[#23222A] p-6 sm:p-8 rounded-2xl space-y-6">
            <h2 className="font-serif text-xl text-[#F3EFEA] pb-3 border-b border-[#23222A]">
              {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Atelier Information'}
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Atelier & Showroom</span>
                  <p className="text-[#9E9B93] mt-0.5">
                    {language === 'bn' ? settings.addressBn : settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Hotline & Phone Orders</span>
                  <p className="font-mono text-[#F3EFEA] mt-0.5">{settings.phone}</p>
                  <p className="text-[#7A7771]">Daily 10:00 AM – 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">WhatsApp Live Support</span>
                  <p className="font-mono text-[#F3EFEA] mt-0.5">{settings.whatsappNumber}</p>
                  <a
                    href={`https://wa.me/${cleanNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline mt-0.5 inline-block font-medium"
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Concierge Email</span>
                  <p className="text-[#9E9B93] mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Atelier Hours</span>
                  <p className="text-[#9E9B93] mt-0.5">Saturday – Thursday: 10:00 AM – 9:30 PM</p>
                  <p className="text-[#9E9B93]">Friday: 02:30 PM – 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form (col-span-7) */}
        <div className="lg:col-span-7 bg-[#121116] border border-[#23222A] p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="font-serif text-xl text-[#F3EFEA] pb-3 border-b border-[#23222A]">
            {language === 'bn' ? 'বার্তা পাঠান' : 'Send an Inquiry'}
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-[#18171E] rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-xl text-white">Thank You for Your Message</h3>
              <p className="text-xs text-[#9E9B93]">
                Our fragrance concierge will reach back to you via phone or WhatsApp shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asif Mahmud"
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A059] font-medium mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B83] font-medium mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#C5A059] font-medium mb-1">Inquiry or Order Note *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the scent profile or order assistance you need..."
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl px-4 py-3 text-sm text-[#F3EFEA] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
