export interface TranslationDictionary {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const UI_TRANSLATIONS: TranslationDictionary = {
  // Navigation
  home: { en: 'Home', bn: 'হোম' },
  shop: { en: 'Shop', bn: 'শপ' },
  attar: { en: 'Attar', bn: 'আতর' },
  perfume: { en: 'Perfume', bn: 'পারফিউম' },
  bestSellers: { en: 'Best Sellers', bn: 'বেস্ট সেলার' },
  aboutUs: { en: 'About Us', bn: 'আমাদের সম্পর্কে' },
  contact: { en: 'Contact', bn: 'যোগাযোগ' },
  trackOrder: { en: 'Track Order', bn: 'অর্ডার ট্র্যাক করুন' },
  admin: { en: 'Admin', bn: 'অ্যাডমিন' },
  searchPlaceholder: { en: 'Search pure attars, ouds, notes...', bn: 'খাঁটি আতর, উদ বা সুবাস খুঁজুন...' },

  // Hero & CTA
  heroHeadline: { en: 'A Fragrance That Defines You', bn: 'একটি সুবাস যা প্রকাশ করে আপনার পরিচয়' },
  heroSubtitle: { en: 'Discover premium artisanal attar and luxury fragrances crafted for unforgettable moments.', bn: 'অবিস্মরণীয় মুহূর্তের জন্য তৈরি প্রিমিয়াম আতর ও লাক্সারি পারফিউমের অনন্য কালেকশন।' },
  shopNow: { en: 'Shop Now', bn: 'শপ করুন' },
  exploreCollection: { en: 'Explore Collection', bn: 'কালেকশন দেখুন' },
  addToCart: { en: 'Add to Cart', bn: 'অর্ডার করুন' },
  buyNow: { en: 'Buy Now', bn: 'এখনই কিনুন' },
  addedToCart: { en: 'Added to Cart', bn: 'কার্টে যোগ হয়েছে' },

  // Sections
  featuredCategories: { en: 'Curated Categories', bn: 'বিশেষ ক্যাটাগরি' },
  bestSellingHeadline: { en: 'Signature Best Sellers', bn: 'সর্বোচ্চ বিক্রিত সিগনেচার সুবাস' },
  newArrivalsHeadline: { en: 'Artisanal New Arrivals', bn: 'নতুন আগমন' },
  whyChooseUs: { en: 'The VELLURE Distinction', bn: 'কেন ভ্যালুর বেছে নেবেন' },
  customerReviews: { en: 'Patron Impressions', bn: 'সম্মানিত ক্রেতাদের মতামত' },
  joinClub: { en: 'Join The VELLURE Circle', bn: 'ভ্যালুর সার্কেলে যুক্ত হোন' },
  newsletterText: { en: 'Subscribe to receive invitations to private batches, limited reserves, and complimentary samples.', bn: 'প্রাইভেট রিজার্ভ ব্যাচ ও বিশেষ অফারের আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।' },
  subscribe: { en: 'Subscribe', bn: 'সাবস্ক্রাইব' },

  // Shop Filters
  allCategories: { en: 'All Categories', bn: 'সব ক্যাটাগরি' },
  fragranceType: { en: 'Fragrance Family', bn: 'সুগন্ধির ধরণ' },
  priceRange: { en: 'Price Range', bn: 'মূল্যের পরিসর' },
  filterSize: { en: 'Size Options', bn: 'বটলের মাপ' },
  sortBy: { en: 'Sort By', bn: 'সাজান' },
  sortFeatured: { en: 'Featured Reserve', bn: 'ফিচার্ড' },
  sortPriceAsc: { en: 'Price: Low to High', bn: 'দাম: কম থেকে বেশি' },
  sortPriceDesc: { en: 'Price: High to Low', bn: 'দাম: বেশি থেকে কম' },
  sortBestSelling: { en: 'Best Selling', bn: 'বেস্ট সেলার' },
  sortNewest: { en: 'Newest Additions', bn: 'নতুন কালেকশন' },
  clearFilters: { en: 'Clear Filters', bn: 'ফিল্টার মুছুন' },
  showingProducts: { en: 'Showing Luxury Fragrances', bn: 'পণ্যসমূহ দেখানো হচ্ছে' },
  noProductsFound: { en: 'No fragrances matched your selection.', bn: 'আপনার পছন্দের সাথে কোনো সুবাস মিল পাওয়া যায়নি।' },

  // Product Details
  size3ml: { en: '3ml Glass Vial', bn: '৩ মিলি গ্লাস ভায়াল' },
  size6ml: { en: '6ml Crystal Flacon', bn: '৬ মিলি ক্রিস্টাল ফ্লাকন' },
  topNotes: { en: 'Top Notes', bn: 'টপ নোটস' },
  heartNotes: { en: 'Heart Notes', bn: 'হার্ট নোটস' },
  baseNotes: { en: 'Base Notes', bn: 'বেস নোটস' },
  longevity: { en: 'Longevity', bn: 'স্থায়িত্বকাল' },
  sillage: { en: 'Projection & Sillage', bn: 'সুগন্ধির বিস্তৃতি' },
  origin: { en: 'Distillation Origin', bn: 'উৎস ও ব্লেন্ড' },
  codAvailable: { en: 'Cash on Delivery Available Nationwide', bn: 'সারাদেশে ক্যাশ অন ডেলিভারি প্রযোজ্য' },
  fastDelivery: { en: 'Dhaka: 24-48 Hours | Outside Dhaka: 2-4 Days', bn: 'ঢাকা: ২৪-৪৮ ঘণ্টা | ঢাকার বাইরে: ২-৪ দিন' },
  genuineGuarantee: { en: '100% Pure Alcohol-Free Concentrated Perfume Oil', bn: '১০০% বিশুদ্ধ অ্যালকোহলমুক্ত কনসেনট্রেটেড আতর তেল' },
  howToApply: { en: 'Application Ritual', bn: 'ব্যবহারের নিয়ম' },
  howToApplyText: { en: 'Apply gently using the glass rod to pulse points: wrists, behind earlobes, collarbones, and traditional garments for exceptional scent diffusion.', bn: 'হাতের কব্জি, কানের পেছনের অংশে এবং পাঞ্জাবি বা পোশাকে গ্লাস ড্রপার দিয়ে আলতো করে ব্যবহার করুন।' },
  relatedFragrances: { en: 'You May Also Desire', bn: 'আপনার আরো পছন্দ হতে পারে' },

  // Cart & Checkout
  yourBag: { en: 'Your Fragrance Bag', bn: 'আপনার শপিং ব্যাগ' },
  bagEmpty: { en: 'Your fragrance bag is empty.', bn: 'আপনার শপিং ব্যাগ খালি।' },
  subtotal: { en: 'Subtotal', bn: 'সাবটোটাল' },
  deliveryCharge: { en: 'Delivery Fee', bn: 'ডেলিভারি চার্জ' },
  total: { en: 'Total Amount', bn: 'সর্বমোট' },
  proceedToCheckout: { en: 'Proceed to Checkout', bn: 'অর্ডার করতে এগিয়ে যান' },
  deliveryLocation: { en: 'Delivery Destination', bn: 'ডেলিভারি এলাকা' },
  insideDhaka: { en: 'Inside Dhaka (৳70)', bn: 'ঢাকার ভেতরে (৳৭০)' },
  outsideDhaka: { en: 'Outside Dhaka (৳১৩০)', bn: 'ঢাকার বাইরে (৳১৩০)' },
  freeDeliveryEligible: { en: 'Complimentary Delivery Qualified', bn: 'ফ্রি ডেলিভারি প্রযোজ্য' },
  applyCoupon: { en: 'Apply Voucher', bn: 'কুপন কোড' },
  couponPlaceholder: { en: 'Enter coupon (e.g. VELLURE10)', bn: 'কুপন কোড দিন (যেমন VELLURE10)' },
  apply: { en: 'Apply', bn: 'প্রয়োগ' },

  // Checkout Fields
  checkoutTitle: { en: 'Complete Your Order', bn: 'অর্ডার সম্পন্ন করুন' },
  fullName: { en: 'Full Name', bn: 'আপনার পুরো নাম' },
  mobileNumber: { en: 'Mobile Phone Number', bn: '১১ ডিজিটের মোবাইল নম্বর' },
  emailAddress: { en: 'Email Address (Optional)', bn: 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' },
  streetAddress: { en: 'Full Delivery Address', bn: 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)' },
  city: { en: 'City / Division', bn: 'শহর / বিভাগ' },
  area: { en: 'Thana / Sub-district', bn: 'থানা / উপজেলা' },
  orderNotes: { en: 'Delivery Instructions / Notes', bn: 'ডেলিভারি নির্দেশিকা বা বিশেষ নোট' },
  paymentMethod: { en: 'Payment Method', bn: 'পেমেন্ট পদ্ধতি' },
  cod: { en: 'Cash on Delivery (COD)', bn: 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে মূল্য পরিশোধ)' },
  bkash: { en: 'bKash Merchant Payment', bn: 'বিকাশ পেমেন্ট' },
  nagad: { en: 'Nagad Payment', bn: 'নগদ পেমেন্ট' },
  onlinePay: { en: 'Online Card / Net Banking', bn: 'অনলাইন কার্ড / ব্যাংক' },
  confirmOrderBtn: { en: 'Confirm Order (ক্যাশ অন ডেলিভারি)', bn: 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)' },

  // Order Confirmed
  thankYouTitle: { en: 'Thank You for Your Order', bn: 'আপনার অর্ডারের জন্য ধন্যবাদ!' },
  orderSuccessMsg: { en: 'Your bespoke VELLURE fragrance selection has been reserved and sent to our atelier for packaging.', bn: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে এবং প্যাকিংয়ের জন্য প্রক্রিয়াধীন রয়েছে।' },
  orderIdLabel: { en: 'Order Reference', bn: 'অর্ডার নম্বর' },
  estimatedDelivery: { en: 'Estimated Delivery', bn: 'সম্ভাব্য ডেলিভারি' },
  continueShopping: { en: 'Continue Shopping', bn: 'আরও কেনাকাটা করুন' },

  // Tracking
  trackingTitle: { en: 'Track Your Fragrance Parcel', bn: 'আপনার পার্সেল ট্র্যাক করুন' },
  trackingSubtitle: { en: 'Enter your VELLURE Order Reference Number and Phone Number to inspect live dispatch status.', bn: 'লাইভ ডেলিভারি স্ট্যাটাস জানতে আপনার অর্ডার রেফারেন্স নম্বর ও ফোন নম্বর প্রদান করুন।' },
  orderIdInputPlaceholder: { en: 'e.g. VLR-2026-000101', bn: 'যেমন: VLR-2026-000101' },
  phoneInputPlaceholder: { en: 'e.g. 01711223344', bn: 'যেমন: 01711223344' },
  trackNowBtn: { en: 'Track Order', bn: 'অর্ডার ট্র্যাক করুন' },
  statusTimeline: { en: 'Consignment Progress', bn: 'ডেলিভারির অগ্রগতি' }
};

export function formatBDT(amount: number): string {
  return '৳ ' + Math.round(amount).toLocaleString('en-US');
}
