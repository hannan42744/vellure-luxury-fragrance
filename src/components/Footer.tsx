import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Compass, Shield, Facebook, Instagram } from 'lucide-react';
import { PaymentBadges } from './PaymentLogos';

export const Footer: React.FC = () => {
  const { settings, language, t, navigateTo } = useApp();

  const facebookUrl = settings?.facebook || 'https://www.facebook.com/vellurefragrance/';
  const instagramUrl = settings?.instagram || 'https://www.instagram.com/vellure.fragrances/';
  const whatsappRaw = settings?.whatsappNumber || '+880 1820-032330';
  const whatsappClean = whatsappRaw.replace(/[^0-9]/g, '') || '8801820032330';
  const whatsappUrl = `https://wa.me/${whatsappClean}`;

  return (
    <footer className="bg-[#080809] border-t border-[#1F1E24] text-[#A6A29A] pt-16 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#1C1B20]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigateTo('home')}
              className="text-left cursor-pointer focus:outline-none"
              aria-label="VELLURE Home"
            >
              <Logo variant="footer" />
            </button>
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              <span>Haute Parfumerie & Pure Attar House</span>
            </p>
            <p className="text-sm text-[#949088] max-w-sm leading-relaxed">
              {language === 'bn'
                ? 'অনবদ্য সুবাস, খাঁটি তেলের ঘনত্ব ও আভিজাত্যের স্পর্শে তৈরি প্রিমিয়াম আতর ও সুগন্ধি।'
                : 'Luxury fragrance, crafted for your signature. Distilled with rare agarwood, pure rose, and ancient oriental resins for timeless sophistication.'}
            </p>

            {/* Social Media Links with Official Logos */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#141317] border border-[#26242E] hover:border-[#1877F2] hover:bg-[#1877F2]/10 flex items-center justify-center text-[#C5A059] hover:text-[#1877F2] transition-all duration-300 shadow-sm hover:scale-110 group"
                aria-label="Follow VELLURE on Facebook"
                title="Facebook: @vellurefragrance"
              >
                <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>

              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#141317] border border-[#26242E] hover:border-[#E4405F] hover:bg-[#E4405F]/10 flex items-center justify-center text-[#C5A059] hover:text-[#E4405F] transition-all duration-300 shadow-sm hover:scale-110 group"
                aria-label="Follow VELLURE on Instagram"
                title="Instagram: @vellure.fragrances"
              >
                <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#141317] border border-[#26242E] hover:border-[#25D366] hover:bg-[#25D366]/10 flex items-center justify-center text-[#C5A059] hover:text-[#25D366] transition-all duration-300 shadow-sm hover:scale-110 group"
                aria-label="Chat with VELLURE on WhatsApp (+880 1820-032330)"
                title="WhatsApp: +880 1820-032330"
              >
                <svg
                  className="w-4 h-4 fill-current transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#F3EFEA]">
              {language === 'bn' ? 'কুইক লিংক' : 'Explore'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('shop')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('aboutUs')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  {t('contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('track-order')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1.5 text-[#D4AF37]"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t('trackOrder')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#F3EFEA]">
              {language === 'bn' ? 'গ্রাহক সেবা' : 'Client Care'}
            </h3>
            <ul className="space-y-2 text-sm text-[#949088]">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#D4AF37] transition-colors">
                  {language === 'bn' ? 'ডেলিভারি তথ্য' : 'Shipping Information'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#D4AF37] transition-colors">
                  {language === 'bn' ? 'রিটার্ন পলিসি' : 'Exchange & Returns'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#D4AF37] transition-colors">
                  {language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#D4AF37] transition-colors">
                  {language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 text-[#8C8880]"
                >
                  <Shield className="w-3 h-3" />
                  <span>{t('admin')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#F3EFEA]">
              {language === 'bn' ? 'হেড অফিস ও যোগাযোগ' : 'Head Atelier'}
            </h3>
            <div className="space-y-2.5 text-xs text-[#949088]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{language === 'bn' ? settings.addressBn : settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A059] block mb-1 font-medium">
                {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Assurance'}
              </span>
              <PaymentBadges variant="footer" />
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706D67]">
          <p>© 2026 VELLURE Fragrance House Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Dhaka · Chittagong · Sylhet</span>
            <span>·</span>
            <span>Pure Oil Distillation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
