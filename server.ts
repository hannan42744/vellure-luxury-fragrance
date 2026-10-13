import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vellure_store.json');
const UPLOADS_DIR = path.resolve(DATA_DIR, 'uploads');

// Ensure data & uploads directory exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded product photos directly with cache and CORS headers
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// High capacity body parser for high-resolution images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to ensure any base64 image data is automatically decoded and written as a file in /uploads
function ensureSavedImage(imgStr: string, defaultName: string = 'product'): string {
  if (!imgStr || typeof imgStr !== 'string') return '';
  if (!imgStr.startsWith('data:image/')) return imgStr;

  try {
    const parts = imgStr.split(';base64,');
    if (parts.length !== 2) return imgStr;

    const mimeMatch = parts[0].match(/data:([a-zA-Z0-9\/\+\.\-]+)/);
    const mimeType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';

    const cleanBase64 = parts[1].replace(/[\r\n\s]/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0) return imgStr;

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const safeBaseName = (defaultName || 'fragrance')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 25) || 'fragrance';
    const uniqueFilename = `${safeBaseName}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    fs.writeFileSync(filePath, buffer);
    console.log(`[Auto-Saved Base64 to Uploads]: /uploads/${uniqueFilename} (${buffer.length} bytes)`);
    return `/uploads/${uniqueFilename}`;
  } catch (e) {
    console.error('Error auto-converting base64 image:', e);
    return imgStr;
  }
}

// Initial sample data structure
interface StoreData {
  products: any[];
  categories?: any[];
  orders: any[];
  settings: any;
  coupons: any[];
  orderCounter: number;
}

// Default initial state
function getDefaultData(): StoreData {
  return {
    products: [
      {
        id: 'prod-1',
        slug: 'oud-al-khaleej',
        name: 'Oud Al Khaleej',
        nameBn: 'উদ আল খালিজ',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Oud',
        shortDescription: 'Regal vintage Cambodian agarwood aged with smoky amber and golden saffron threads.',
        shortDescriptionBn: 'ভিন্টেজ ক্যাম্বোডিয়ান আগরউড, ধোঁয়াটে অ্যাম্বার ও জাফরানের রাজকীয় মিশ্রণ।',
        description: 'Oud Al Khaleej represents the crown jewel of Arabian perfumery. Distilled through slow artisanal copper hydro-distillation, this pure attar opens with an intoxicating sweep of spicy Persian saffron and dried fruit before developing into dark, resinous Cambodian agarwood. The dry-down is exceptionally warm, enveloping the wearer in smoky labdanum and royal black amber that projects authority and timeless refinement.',
        descriptionBn: 'উদ আল খালিজ আরবীয় পারফিউমারির এক অনন্য নিদর্শন। তামা পাত্রে দীর্ঘ সময় ধরে ডিস্টিল করা এই খাঁটি আতর শুরু হয় সুগন্ধি জাফরানের রাজকীয় সুবাসে, যার সাথে মেশে গাঢ় ক্যাম্বোডিয়ান আগরউডের তীব্র আকর্ষণ। এটি দীর্ঘস্থায়ী এবং আভিজাত্যের প্রতীক।',
        price3ml: 750,
        price6ml: 1350,
        originalPrice3ml: 950,
        originalPrice6ml: 1700,
        discount: 21,
        stock: 45,
        sku: 'VLR-ATT-001',
        featured: true,
        bestSeller: true,
        newArrival: false,
        rating: 4.9,
        reviewsCount: 128,
        images: [
          '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
          '/src/assets/images/hero_fragrance_showcase_1790357129004.jpg',
          '/src/assets/images/product_amber_oud_1790357176335.jpg'
        ],
        notes: {
          top: ['Persian Saffron', 'Wild Bergamot', 'Dried Dates'],
          topBn: ['জাফরান', 'বারগামট', 'মিষ্টি খেজুর'],
          heart: ['Cambodian Agarwood', 'Taif Rose', 'Nutmeg'],
          heartBn: ['ক্যাম্বোডিয়ান আগরউড', 'তাঈফ গোলাপ', 'জায়ফল'],
          base: ['Smoky Amber', 'Aged Cedarwood', 'Civet Accord'],
          baseBn: ['স্মোকি অ্যাম্বার', 'সিডারউড', 'রয়েল মাস্ক']
        },
        longevity: '14-20 Hours on Skin, 48 Hours on Garments',
        longevityBn: 'ত্বকে ১৪-২০ ঘণ্টা, কাপড়ে ৪৮ ঘণ্টা পর্যন্ত',
        sillage: 'Regal & Dominant',
        sillageBn: 'তীব্র ও চিত্তাকর্ষক',
        origin: 'Khaleej Reserve / Assam Border',
        originBn: 'উপসাগরীয় রিজার্ভ / আসাম',
        alcoholFree: true
      },
      {
        id: 'prod-2',
        slug: 'arabian-musk',
        name: 'Arabian Musk',
        nameBn: 'অ্যারাবিয়ান মাস্ক',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Musk',
        shortDescription: 'Velvety white musk interlaced with dew-drenched Moroccan orange blossoms and sweet vanilla pod.',
        shortDescriptionBn: 'মরক্কোর অরেঞ্জ ব্লসম ও ভ্যানিলার সাথে কোমল রাজকীয় হোয়াইট মাস্কের অপূর্ব সমন্বয়।',
        description: 'Soft yet deeply magnetic, Arabian Musk creates an intimate aura of purity and elegance. Blended with exquisite crystalline musk oils, Madagascar vanilla pod infusion, and powdery white blossoms, this signature blend melts effortlessly onto warm skin. Ideal for daily spiritual wear and formal evenings alike.',
        descriptionBn: 'কোমল অথচ অত্যন্ত আকর্ষণীয়, অ্যারাবিয়ান মাস্ক তৈরি করে এক পবিত্র ও শান্ত স্নিগ্ধ অনুভূতি। খাঁটি ক্রিস্টাল মাস্ক ও মাদাগাস্কার ভ্যানিলা বিনের সমন্বয়ে প্রস্তুত এই সুগন্ধি দৈনন্দিন ও বিশেষ মুহূর্তে ব্যবহারের জন্য দারুণ।',
        price3ml: 580,
        price6ml: 1050,
        originalPrice3ml: 750,
        originalPrice6ml: 1350,
        discount: 23,
        stock: 60,
        sku: 'VLR-ATT-002',
        featured: true,
        bestSeller: true,
        newArrival: false,
        rating: 4.8,
        reviewsCount: 94,
        images: [
          '/src/assets/images/product_arabian_musk_1790357154972.jpg',
          '/src/assets/images/hero_fragrance_showcase_1790357129004.jpg'
        ],
        notes: {
          top: ['White Lily', 'Neroli', 'Dewdrop Accord'],
          topBn: ['সাদা লিলি', 'নেরোলি', 'শিশির কণা'],
          heart: ['Pure Crystalline Musk', 'Powdery Iris', 'Honeyed Jasmine'],
          heartBn: ['পবিত্র মাস্ক', 'আইরিস', 'মধুর জুঁই'],
          base: ['Madagascar Vanilla', 'Soft Sandalwood', 'White Amber'],
          baseBn: ['ভ্যানিলা', 'শ্বেত চন্দন', 'সাদা অ্যাম্বার']
        },
        longevity: '10-14 Hours on Skin, 24 Hours on Fabric',
        longevityBn: 'ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা',
        sillage: 'Subtle & Sophisticated',
        sillageBn: 'মার্জিত ও স্নিগ্ধ',
        origin: 'Dubai Special Artisanal Blend',
        originBn: 'দুবাই স্পেশাল আর্টিশানাল ব্লেন্ড',
        alcoholFree: true
      },
      {
        id: 'prod-3',
        slug: 'dark-knight',
        name: 'Dark Knight',
        nameBn: 'ডার্ক নাইট',
        category: 'perfume',
        categoryBn: 'পারফিউম',
        fragranceType: 'Woody',
        shortDescription: 'Intense birch tar, Tuscan black leather, crushed peppercorn, and smoked Haitian vetiver.',
        shortDescriptionBn: 'টাস্কান ব্ল্যাক লেদার, বার্চ টার ও ব্ল্যাক পেপারের বোল্ড এবং মিস্টেরিয়াস মেলবন্ধন।',
        description: 'Unapologetically bold and intensely masculine. Dark Knight was formulated for those who leave an indelible presence. Opening with sharp pink peppercorn and smoky Italian leather, it settles into an intoxicating dry-down of earthy vetiver, rich patchouli, and midnight birch wood. A modern masterpiece for colder nights and distinguished gatherings.',
        descriptionBn: 'সাহসী এবং অতুলনীয় আভিজাত্যের প্রতীক। ডার্ক নাইট তৈরি করা হয়েছে বিশেষ উপস্থিতির জন্য। ব্ল্যাক পেপার ও টাস্কান লেদারের চমৎকার সূচনার পর ভেটিভার ও প্যাচুলির আবেশ দীর্ঘ সময় বজায় থাকে।',
        price3ml: 690,
        price6ml: 1250,
        originalPrice3ml: 890,
        originalPrice6ml: 1600,
        discount: 22,
        stock: 35,
        sku: 'VLR-PRF-003',
        featured: true,
        bestSeller: false,
        newArrival: true,
        rating: 4.9,
        reviewsCount: 81,
        images: [
          '/src/assets/images/product_dark_knight_1790357165463.jpg',
          '/src/assets/images/hero_fragrance_showcase_1790357129004.jpg'
        ],
        notes: {
          top: ['Pink Peppercorn', 'Grapefruit Zest', 'Smoked Cardamom'],
          topBn: ['গোলাপী গোলমরিচ', 'গ্রেপফ্রুট', 'এলাচ'],
          heart: ['Tuscan Leather', 'Clary Sage', 'Cypress Leaf'],
          heartBn: ['টাস্কান লেদার', 'সেজ', 'সাইপ্রেস'],
          base: ['Haitian Vetiver', 'Smoked Birch', 'Black Amber', 'Patchouli'],
          baseBn: ['ভেটিভার', 'বার্চ উড', 'ব্ল্যাক অ্যাম্বার', 'প্যাচুলি']
        },
        longevity: '12-16 Hours Longevity',
        longevityBn: '১২-১৬ ঘণ্টা দীর্ঘস্থায়ী',
        sillage: 'Heavy & Mysterious',
        sillageBn: 'ভারী ও রহস্যময়',
        origin: 'Grasse Heritage Laboratory',
        originBn: 'গ্রাস হেরিটেজ ল্যাবরেটরি, ফ্রান্স',
        alcoholFree: true
      },
      {
        id: 'prod-4',
        slug: 'amber-oud',
        name: 'Amber Oud',
        nameBn: 'অ্যাম্বার উদ',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Amber',
        shortDescription: 'Golden molten amber drops enriched with aged Hindi agarwood and honeyed cinnamon.',
        shortDescriptionBn: 'স্বর্ণালি অ্যাম্বার, খাঁটি ভারতীয় আগরউড ও দারুচিনির উষ্ণ ও মিষ্টি কম্বিনেশন।',
        description: 'A warm, radiant celebration of golden amber resin married to centuries-old oud tradition. The sweetness of caramelized honey and Sri Lankan cinnamon harmonizes effortlessly with dense, earthy oud and rich benzoin tears, providing a regal cocoon of warmth during cooler weather.',
        descriptionBn: 'উষ্ণ এবং রাজকীয় এক আতর যা খাঁটি অ্যাম্বার এবং ভারতীয় আগরউডের সুষম রসায়নে তৈরি। মধু ও দারুচিনির মিষ্টি ছোঁয়া একে যেকোনো শীতকালীন বা সন্ধ্যার অনুষ্ঠানের জন্য অনবদ্য করে তোলে।',
        price3ml: 720,
        price6ml: 1290,
        originalPrice3ml: 900,
        originalPrice6ml: 1650,
        discount: 20,
        stock: 40,
        sku: 'VLR-ATT-004',
        featured: true,
        bestSeller: true,
        newArrival: false,
        rating: 5.0,
        reviewsCount: 110,
        images: [
          '/src/assets/images/product_amber_oud_1790357176335.jpg',
          '/src/assets/images/hero_fragrance_showcase_1790357129004.jpg'
        ],
        notes: {
          top: ['Ceylon Cinnamon', 'Bitter Orange', 'Cardamom'],
          topBn: ['দারুচিনি', 'কমলার খোসা', 'এলাচ'],
          heart: ['Golden Amber Resin', 'Incense Smoke', 'Praline Accord'],
          heartBn: ['গোল্ডেন অ্যাম্বার', 'লোবান', 'প্রালিন'],
          base: ['Hindi Agarwood', 'Benzoin Siam', 'Tonka Bean'],
          baseBn: ['হিন্দি আগরউড', 'বেঞ্জোইন', 'টঙ্কা বিন']
        },
        longevity: '14-18 Hours on Skin',
        longevityBn: '১৪-১৮ ঘণ্টা পর্যন্ত কার্যকর',
        sillage: 'Warm & Enveloping',
        sillageBn: 'উষ্ণ ও মিষ্টি সুবাস',
        origin: 'Artisanal Gulf Reserve',
        originBn: 'গালফ রিজার্ভ ব্লেন্ড',
        alcoholFree: true
      },
      {
        id: 'prod-5',
        slug: 'royal-oud',
        name: 'Royal Oud',
        nameBn: 'রয়েল উদ',
        category: 'perfume',
        categoryBn: 'পারফিউম',
        fragranceType: 'Oud',
        shortDescription: 'Aristocratic cedarwood, aged Dehn Al Oud, Calabrian lemon, and angelica root.',
        shortDescriptionBn: 'অভিজাত সিডারউড, দেহন আল উদ ও লেবুর রিফ্রেশিং রাজকীয় ব্লেন্ড।',
        description: 'Created for sovereigns and dignitaries. Royal Oud blends the sparkling zest of Mediterranean citrus with the solemn, deep grandeur of Dehn Al Oud and Lebanese cedar. Clean, dry, and commanding, this fragrance whispers opulence without ever shouting.',
        descriptionBn: 'রাজকীয় ব্যক্তিত্বদের জন্য বিশেষভাবে প্রস্তুত। ভূমধ্যসাগরীয় সাইট্রাসের সতেজতার সাথে লেবানিজ সিডার ও দেহন আল উদের গভীর সুবাস যুক্ত হয়ে সৃষ্টি করেছে এক অবিস্মরণীয় অনুভূতি।',
        price3ml: 820,
        price6ml: 1490,
        originalPrice3ml: 1050,
        originalPrice6ml: 1900,
        discount: 22,
        stock: 28,
        sku: 'VLR-PRF-005',
        featured: false,
        bestSeller: false,
        newArrival: true,
        rating: 4.9,
        reviewsCount: 65,
        images: [
          '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
          '/src/assets/images/product_dark_knight_1790357165463.jpg'
        ],
        notes: {
          top: ['Calabrian Lemon', 'Pink Berry', 'Sicilian Bergamot'],
          topBn: ['লেবু', 'গোলাপী বেরি', 'বারগামট'],
          heart: ['Lebanese Cedar', 'Galbanum', 'Angelica Root'],
          heartBn: ['সিডারউড', 'গ্যালবানাম', 'অ্যাঞ্জেলিকা'],
          base: ['Dehn Al Oud', 'Indian Sandalwood', 'Musk'],
          baseBn: ['দেহন আল উদ', 'চন্দন কাঠ', 'কস্তুরী']
        },
        longevity: '12-16 Hours',
        longevityBn: '১২-১৬ ঘণ্টা',
        sillage: 'Regal Sillage',
        sillageBn: 'রাজকীয় বিস্তার',
        origin: 'Haute Parfumerie, Grasse',
        originBn: 'ফ্রান্স ও অ্যারাবিয়ান ব্লেন্ড',
        alcoholFree: true
      },
      {
        id: 'prod-6',
        slug: 'white-musk',
        name: 'White Musk',
        nameBn: 'হোয়াইট মাস্ক',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Musk',
        shortDescription: 'Pristine, clean cotton softness infused with crystalline floral hints and subtle powdered vanilla.',
        shortDescriptionBn: 'ধবধবে সাদা তুলার মতো স্নিগ্ধ, হালকা ফুলের মিষ্টি ও ফ্রেশ প্রশান্তিদায়ক আতর।',
        description: 'The epitome of tranquility. White Musk envelopes you in a pristine veil of clean, airy softness reminiscent of white linen dried under gentle sunshine. Subtle hints of lily of the valley and baby powder accord make it the ultimate fragrance for Jummah, prayers, and calming everyday wear.',
        descriptionBn: 'প্রশান্তির শ্রেষ্ঠ উদাহরণ। হোয়াইট মাস্ক অত্যন্ত পরিচ্ছন্ন, হালকা এবং স্নিগ্ধ অনুভূতির সৃষ্টি করে। জুমার নামাজ, ইবাদত এবং দৈনন্দিন কাজের জন্য এটি একটি আদর্শ পছন্দ।',
        price3ml: 490,
        price6ml: 890,
        originalPrice3ml: 650,
        originalPrice6ml: 1150,
        discount: 25,
        stock: 80,
        sku: 'VLR-ATT-006',
        featured: false,
        bestSeller: true,
        newArrival: false,
        rating: 4.8,
        reviewsCount: 142,
        images: [
          '/src/assets/images/product_arabian_musk_1790357154972.jpg',
          '/src/assets/images/product_amber_oud_1790357176335.jpg'
        ],
        notes: {
          top: ['Clean Cotton', 'Aldehydic Mist', 'Dewy Violet'],
          topBn: ['ক্লিন কটন', 'ভায়োলেট ফুল', 'শিশির'],
          heart: ['Lily of the Valley', 'Cotton Flower', 'Soft Jasmine'],
          heartBn: ['লিলি ফুল', 'কটন ফ্লাওয়ার', 'জুঁই'],
          base: ['White Musk Pure', 'Powdered Sandalwood', 'Ambergris Light'],
          baseBn: ['হোয়াইট মাস্ক', 'পাউডার চন্দন', 'অ্যাম্বারগ্রিস']
        },
        longevity: '8-12 Hours on Skin',
        longevityBn: '৮-১২ ঘণ্টা ত্বকে',
        sillage: 'Gentle & Close',
        sillageBn: 'শান্ত ও মোহময়',
        origin: 'Swiss Alpine Musk Accord',
        originBn: 'সুইস আলপাইন ব্লেন্ড',
        alcoholFree: true
      },
      {
        id: 'prod-7',
        slug: 'rose-oud',
        name: 'Rose Oud',
        nameBn: 'রোজ উদ',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Floral',
        shortDescription: 'Velvety Damask roses steeped in smoky agarwood smoke and crimson saffron drops.',
        shortDescriptionBn: 'রক্তিম দামাস্ক গোলাপ এবং ধোঁয়াটে আগরউডের রোমান্টিক রাজকীয় সুবাস।',
        description: 'An ancient oriental romance captured in pure fragrance oil. Crimson Damascus rose petals, harvested at dawn in high-altitude orchards, meet the mysterious depth of aged Assam agarwood. Sweet, romantic, yet profoundly dark and luxurious.',
        descriptionBn: 'প্রাচ্যের প্রাচীন প্রেমের মেলবন্ধন। ভোরের আলোয় সংগৃহীত দামেস্কের তাজা গোলাপ এবং গভীর আসাম আগরউডের সমন্বয়ে তৈরি। চমৎকার মিষ্টি ও রোমান্টিক সুবাস যা সবাইকে মুগ্ধ করে।',
        price3ml: 680,
        price6ml: 1220,
        originalPrice3ml: 850,
        originalPrice6ml: 1550,
        discount: 20,
        stock: 50,
        sku: 'VLR-ATT-007',
        featured: false,
        bestSeller: false,
        newArrival: true,
        rating: 4.9,
        reviewsCount: 58,
        images: [
          '/src/assets/images/product_amber_oud_1790357176335.jpg',
          '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg'
        ],
        notes: {
          top: ['Damask Rose Water', 'Bergamot Zest', 'Cardamom'],
          topBn: ['দামাস্ক গোলাপ জল', 'বারগামট', 'এলাচ'],
          heart: ['Crimson Rose Otto', 'Clove Bud', 'Praline'],
          heartBn: ['রোজ অটো', 'লবঙ্গ', 'প্রালিন'],
          base: ['Assam Agarwood', 'Dark Amber', 'Vanilla Absolute'],
          baseBn: ['আসাম আগরউড', 'ডার্ক অ্যাম্বার', 'ভ্যানিলা']
        },
        longevity: '12-16 Hours',
        longevityBn: '১২-১৬ ঘণ্টা',
        sillage: 'Warm Floral & Woody',
        sillageBn: 'মিষ্টি গোলাপ ও কাষ্ঠল সুবাস',
        origin: 'Ispahan Rose Valley & Assam',
        originBn: 'ইস্পাহান ও আসাম',
        alcoholFree: true
      },
      {
        id: 'prod-8',
        slug: 'arabic-taif',
        name: 'Arabic Taif',
        nameBn: 'অ্যারাবিক তাঈফ',
        category: 'attar',
        categoryBn: 'আতর',
        fragranceType: 'Floral',
        shortDescription: 'Prized mountain Ward Taifi roses distilled in sacred copper stills with royal ambergris.',
        shortDescriptionBn: 'তাঈফের পবিত্র পাহাড়ের দুর্লভ তাঈফি গোলাপ ও রয়েল অ্যাম্বারগ্রিসের অমূল্য আতর।',
        description: 'Distilled from the legendary 30-petal Ward Taifi rose cultivated in the high altitudes of Taif, Saudi Arabia. This attar is revered by kings and perfume connoisseurs for its honeyed rose nectar, herbal tea nuances, and crystalline dry-down of ambergris and royal white musk.',
        descriptionBn: 'সৌদি আরবের তাঈফের উঁচু পাহাড়ে উৎপাদিত ৩০ পাপড়ির বিখ্যাত তাঈফি গোলাপ থেকে সংগৃহীত। এর মধুর মতো মিষ্টি গোলাপের সুবাস ও অ্যাম্বারগ্রিসের পরশ এক অতুলনীয় স্বর্গীয় অনুভূতি উপহার দেয়।',
        price3ml: 890,
        price6ml: 1650,
        originalPrice3ml: 1150,
        originalPrice6ml: 2100,
        discount: 22,
        stock: 30,
        sku: 'VLR-ATT-008',
        featured: true,
        bestSeller: false,
        newArrival: true,
        rating: 5.0,
        reviewsCount: 77,
        images: [
          '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
          '/src/assets/images/product_arabian_musk_1790357154972.jpg'
        ],
        notes: {
          top: ['Ward Taifi Petals', 'Morning Dew Accord', 'Pink Pepper'],
          topBn: ['তাঈফি গোলাপের পাপড়ি', 'শিশির বিন্দু', 'গোলাপী গোলমরিচ'],
          heart: ['Rose Centifolia', 'Geranium Leaf', 'Wild Honey'],
          heartBn: ['গোলাপ', 'জেরানিয়াম', 'বুনো মধু'],
          base: ['Natural Ambergris', 'Mysore Sandalwood', 'White Cedar'],
          baseBn: ['অ্যাম্বারগ্রিস', 'মহীশুর চন্দন', 'সাদা সিডার']
        },
        longevity: '14-18 Hours Longevity',
        longevityBn: '১৪-১৮ ঘণ্টা পর্যন্ত সুবাস',
        sillage: 'Regal Flower Sillage',
        sillageBn: 'রাজকীয় গোলাপ সুবাস',
        origin: 'Taif Highlands, Saudi Arabia',
        originBn: 'তাঈফ পাহাড়, সৌদি আরব',
        alcoholFree: true
      }
    ],
    orders: [
      {
        id: 'VLR-2026-000101',
        customerName: 'Tanvir Hossain',
        phone: '01711223344',
        email: 'tanvir.h@example.com',
        address: 'Flat 4B, House 12, Road 4, Sector 7, Uttara',
        city: 'Dhaka',
        area: 'Uttara',
        deliveryNote: 'Please deliver after 3:00 PM',
        items: [
          {
            productId: 'prod-1',
            name: 'Oud Al Khaleej',
            nameBn: 'উদ আল খালিজ',
            image: '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
            size: '6ml',
            price: 1350,
            quantity: 1
          },
          {
            productId: 'prod-2',
            name: 'Arabian Musk',
            nameBn: 'অ্যারাবিয়ান মাস্ক',
            image: '/src/assets/images/product_arabian_musk_1790357154972.jpg',
            size: '3ml',
            price: 580,
            quantity: 1
          }
        ],
        subtotal: 1930,
        deliveryCharge: 70,
        discount: 100,
        couponCode: 'VELLURE10',
        totalAmount: 1900,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'Shipped',
        timeline: [
          {
            status: 'Order Received',
            time: '2026-09-24 11:20 AM',
            note: 'Order placed by customer via Cash on Delivery'
          },
          {
            status: 'Processing',
            time: '2026-09-24 01:15 PM',
            note: 'Artisanal bottling and quality inspection verified'
          },
          {
            status: 'Packed',
            time: '2026-09-24 05:40 PM',
            note: 'Sealed with luxury gold-stamped box packaging'
          },
          {
            status: 'Shipped',
            time: '2026-09-25 09:30 AM',
            note: 'Handed over to Steadfast Express (Consignment ID: ST-99214)'
          }
        ],
        createdAt: '2026-09-24T11:20:00.000Z'
      },
      {
        id: 'VLR-2026-000102',
        customerName: 'Sabrina Rahman',
        phone: '01899887766',
        email: 'sabrina.r@example.com',
        address: 'GEC Circle, Nasirabad Housing Society, Road 3',
        city: 'Chattogram',
        area: 'Nasirabad',
        items: [
          {
            productId: 'prod-4',
            name: 'Amber Oud',
            nameBn: 'অ্যাম্বার উদ',
            image: '/src/assets/images/product_amber_oud_1790357176335.jpg',
            size: '6ml',
            price: 1290,
            quantity: 1
          }
        ],
        subtotal: 1290,
        deliveryCharge: 130,
        discount: 0,
        totalAmount: 1420,
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        status: 'Processing',
        timeline: [
          {
            status: 'Order Received',
            time: '2026-09-25 08:15 AM',
            note: 'Payment verified via bKash Merchant TrxID: BK92881A'
          },
          {
            status: 'Processing',
            time: '2026-09-25 10:00 AM',
            note: 'Order sent to perfumery lab for packaging'
          }
        ],
        createdAt: '2026-09-25T08:15:00.000Z'
      }
    ],
    settings: {
      whatsappNumber: '+8801712345678',
      phone: '+880 1712-345678',
      email: 'concierge@vellurebd.com',
      address: 'Level 4, House 54, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
      addressBn: 'লেভেল ৪, হাউস ৫৪, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
      facebook: 'https://facebook.com/vellure.fragrance.bd',
      instagram: 'https://instagram.com/vellure.bd',
      deliveryFeeDhaka: 70,
      deliveryFeeOutside: 130,
      freeDeliveryThreshold: 2000,
      announcementTextEn: 'Premium Attar & Fragrance | Cash on Delivery Available Nationwide',
      announcementTextBn: 'প্রিমিয়াম আতর ও সুগন্ধি | সারাদেশে ক্যাশ অন ডেলিভারি ও দ্রুত ডেলিভারি',
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
      telegramNotifyAddToCart: true,
      telegramNotifyNewOrder: true,
      metaPixelId: process.env.VITE_META_PIXEL_ID || '',
      ga4MeasurementId: process.env.VITE_GA4_MEASUREMENT_ID || '',
      enableAnalytics: true,
      googleSheetName: process.env.GOOGLE_SHEET_NAME || 'Vellure Fragrances - Inventory',
      googleSheetEmail: process.env.GOOGLE_SHEET_EMAIL || 'info.vellurefragrances@gmail.com',
      googleSheetId: process.env.GOOGLE_SHEET_ID || '',
      googleSheetRange: process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A2:E',
      googleSheetWebhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
      googleSheetSyncEnabled: true,
      googleSheetLastSync: '',
      googleSheetSyncStatus: 'connected',
      googleSheetSyncMessage: 'Configured for sheet: Vellure Fragrances - Inventory'
    },
    coupons: [
      {
        code: 'VELLURE10',
        discountType: 'percentage',
        discountValue: 10,
        minOrder: 1000,
        active: true
      },
      {
        code: 'EIDSPECIAL',
        discountType: 'fixed',
        discountValue: 150,
        minOrder: 1500,
        active: true
      },
      {
        code: 'FIRSTORDER',
        discountType: 'percentage',
        discountValue: 15,
        minOrder: 800,
        active: true
      }
    ],
    orderCounter: 103
  };
}

// Read database
function readData(): StoreData {
  let data: StoreData;
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      data = JSON.parse(content);
    } else {
      data = getDefaultData();
      writeData(data);
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
    data = getDefaultData();
    writeData(data);
  }

  // Ensure default categories exist if not defined
  if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
    data.categories = [
      {
        id: 'cat-attar',
        slug: 'attar',
        name: 'Attar',
        nameBn: 'খাঁটি আতর',
        description: '100% Pure Alcohol-Free Concentrated Attar Oils',
        descriptionBn: '১০০% বিশুদ্ধ অ্যালকোহলমুক্ত কনসেনট্রেটেড আতর তেল'
      },
      {
        id: 'cat-gift-set',
        slug: 'gift_set',
        name: 'Gift Sets',
        nameBn: 'গিফট সেট',
        description: 'Luxury Gift Sets & Coffrets',
        descriptionBn: 'প্রিমিয়াম গিফট বক্স ও উপহার সেট'
      }
    ];
    writeData(data);
  }

  return data;
}

// Write database
function writeData(data: StoreData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// In-memory valid admin session tokens
const validAdminSessions = new Set<string>();

// Middleware to protect admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication token required.' });
  }
  const token = authHeader.substring(7);
  if (!validAdminSessions.has(token)) {
    return res.status(403).json({ error: 'Forbidden. Invalid or expired admin session.' });
  }
  next();
}

// ================= API ROUTES =================

// 1. Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const configuredPassword = process.env.ADMIN_PASSWORD || 'Kr100300500';

  if (!password || password !== configuredPassword) {
    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }

  // Generate secure random session token
  const token = 'vlr_' + crypto.randomBytes(32).toString('hex');
  validAdminSessions.add(token);

  return res.json({
    success: true,
    token,
    admin: {
      name: 'VELLURE Master Admin',
      role: 'superadmin'
    }
  });
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.substring(7);
  if (validAdminSessions.has(token)) {
    return res.json({ valid: true, admin: { name: 'VELLURE Master Admin', role: 'superadmin' } });
  }
  return res.status(401).json({ valid: false });
});

app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    validAdminSessions.delete(authHeader.substring(7));
  }
  return res.json({ success: true });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  const data = readData();
  const { category, search, fragranceType } = req.query;
  let products = [...data.products];

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  if (fragranceType && fragranceType !== 'all') {
    products = products.filter(p => p.fragranceType.toLowerCase() === (fragranceType as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameBn && p.nameBn.includes(q)) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.fragranceType.toLowerCase().includes(q)
    );
  }

  res.json({ products });
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const data = readData();
  const product = data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

// Create product (Admin only)
app.post('/api/products', requireAdminAuth, (req, res) => {
  const data = readData();
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.price3ml) {
    return res.status(400).json({ error: 'Product name and 3ml price are required' });
  }

  const slug = (newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) + '-' + Date.now().toString().slice(-4);
  const id = 'prod-' + Date.now();

  const rawImages: string[] = Array.isArray(newProduct.images)
    ? newProduct.images
    : (newProduct.images ? [newProduct.images] : ['/src/assets/images/product_oud_al_khaleej_1790357142489.jpg']);

  const processedImages = rawImages
    .filter(Boolean)
    .map((img: string, idx: number) => ensureSavedImage(img, `${newProduct.name || 'product'}_${idx}`));

  const product = {
    ...newProduct,
    id,
    slug: newProduct.slug || slug,
    rating: newProduct.rating || 5.0,
    reviewsCount: newProduct.reviewsCount || 0,
    images: processedImages.length > 0 ? processedImages : ['/src/assets/images/product_oud_al_khaleej_1790357142489.jpg']
  };

  data.products.unshift(product);
  writeData(data);

  res.status(201).json({ success: true, product });
});

// Update product (Admin only)
app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = data.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatePayload = { ...req.body };
  if (updatePayload.images && Array.isArray(updatePayload.images)) {
    updatePayload.images = updatePayload.images
      .filter(Boolean)
      .map((img: string, idx: number) =>
        ensureSavedImage(img, `${updatePayload.name || data.products[index].name || 'product'}_${idx}`)
      );
  }

  data.products[index] = { ...data.products[index], ...updatePayload, id };
  writeData(data);

  res.json({ success: true, product: data.products[index] });
});

// Delete product (Admin only)
app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const initialLen = data.products.length;
  data.products = data.products.filter(p => p.id !== id);

  if (data.products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeData(data);
  res.json({ success: true, message: 'Product deleted' });
});

// 2b. Categories API
app.get('/api/categories', (req, res) => {
  const data = readData();
  const categories = (data.categories || []).map(cat => ({
    ...cat,
    count: data.products.filter(p => p.category === cat.slug || p.category === cat.id).length
  }));
  res.json({ categories });
});

// Create Category (Admin only)
app.post('/api/categories', requireAdminAuth, (req, res) => {
  const data = readData();
  const { name, nameBn, slug, description, descriptionBn } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = 'cat-' + Date.now();

  const newCategory = {
    id,
    slug: generatedSlug,
    name: name.trim(),
    nameBn: (nameBn || name).trim(),
    description: description || '',
    descriptionBn: descriptionBn || ''
  };

  if (!data.categories) {
    data.categories = [];
  }

  // Check duplicate slug
  const existingIdx = data.categories.findIndex(c => c.slug === generatedSlug);
  if (existingIdx !== -1) {
    return res.status(400).json({ error: 'A category with this identifier already exists' });
  }

  data.categories.push(newCategory);
  writeData(data);

  res.status(201).json({ success: true, category: newCategory });
});

// Update Category (Admin only)
app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = (data.categories || []).findIndex(c => c.id === id || c.slug === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const oldSlug = data.categories![index].slug;
  const newSlug = req.body.slug || oldSlug;

  data.categories![index] = {
    ...data.categories![index],
    ...req.body,
    id: data.categories![index].id,
    slug: newSlug
  };

  // If slug changed, update products that had this category
  if (newSlug !== oldSlug) {
    data.products = data.products.map(p => {
      if (p.category === oldSlug) {
        return { ...p, category: newSlug, categoryBn: req.body.nameBn || p.categoryBn };
      }
      return p;
    });
  }

  writeData(data);
  res.json({ success: true, category: data.categories![index] });
});

// Delete Category (Admin only)
app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const cat = (data.categories || []).find(c => c.id === id || c.slug === id);

  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Protect default 'attar' category from deletion
  if (cat.slug === 'attar') {
    return res.status(400).json({ error: 'Default Attar category cannot be deleted' });
  }

  data.categories = (data.categories || []).filter(c => c.id !== cat.id && c.slug !== cat.slug);

  // Reassign any products in this category back to 'attar'
  data.products = data.products.map(p => {
    if (p.category === cat.slug || p.category === cat.id) {
      return { ...p, category: 'attar', categoryBn: 'খাঁটি আতর' };
    }
    return p;
  });

  writeData(data);
  res.json({ success: true, message: 'Category deleted and products reassigned' });
});

// 2c. Image Upload API (Admin only)
app.post('/api/upload', requireAdminAuth, (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // If it is already a web URL or existing path, return it directly
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/uploads/') || image.startsWith('/src/assets/')) {
      return res.json({ success: true, url: image });
    }

    let mimeType = 'image/jpeg';
    let base64String = image;

    if (image.includes(';base64,')) {
      const parts = image.split(';base64,');
      const header = parts[0];
      const mimeMatch = header.match(/data:([a-zA-Z0-9\/\+\.\-]+)/);
      if (mimeMatch) {
        mimeType = mimeMatch[1].toLowerCase();
      }
      base64String = parts[1];
    }

    // Clean whitespace and newlines
    const cleanBase64 = base64String.replace(/[\r\n\s]/g, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Decoded image is empty' });
    }

    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('gif')) ext = 'gif';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (filename && filename.includes('.')) {
      const parts = filename.split('.');
      ext = parts[parts.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const safeBaseName = (filename || 'fragrance')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 30) || 'fragrance';
    const uniqueFilename = `${safeBaseName}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(targetFilePath, buffer);
    const publicUrl = `/uploads/${uniqueFilename}`;

    console.log(`[Image Uploaded]: Successfully saved ${uniqueFilename} (${buffer.length} bytes) -> ${publicUrl}`);
    return res.json({ success: true, url: publicUrl, filename: uniqueFilename, size: buffer.length });
  } catch (err: any) {
    console.error('Error in /api/upload:', err);
    return res.status(500).json({ error: 'Failed to save uploaded picture: ' + (err.message || 'Server error') });
  }
});

// Helper to deduct stock from Google Sheet (Vellure Fragrances - Inventory)
async function syncDeductWithGoogleSheet(items: any[], orderRef: string, source: string = 'website') {
  const data = readData();
  const webhookUrl = data.settings?.googleSheetWebhookUrl || 'https://script.google.com/macros/s/AKfycbyi2tSRCnHp2SV1XTMorD9miR0rV3CN1HPvVgCQeWOxNwDG11IxqnZdIdgEO2oawXe9sQ/exec';
  const sheetName = data.settings?.googleSheetName || 'Vellure Fragrances - Inventory';
  const email = data.settings?.googleSheetEmail || 'info.vellurefragrances@gmail.com';

  data.settings.googleSheetLastSync = new Date().toISOString();
  data.settings.googleSheetSyncStatus = 'connected';
  writeData(data);

  if (!webhookUrl) {
    console.log(`[Google Sheet Inventory] Deducted stock for ${items.length} items (Order: ${orderRef}, Source: ${source}). Sheet: "${sheetName}" (${email}).`);
    return {
      success: true,
      mode: 'local_synchronized',
      sheetName,
      email,
      orderRef,
      message: `Stock deducted locally and marked for sync with "${sheetName}"`
    };
  }

  try {
    const payload = {
      action: 'deduct_stock',
      sheetName,
      email,
      orderRef,
      source,
      timestamp: new Date().toISOString(),
      items: items.map(it => ({
        id: it.productId || it.id,
        sku: it.sku || '',
        name: it.name || '',
        size: it.size || '3ml',
        quantity: Number(it.quantity) || 1
      }))
    };

    // Attempt POST to Webhook
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('[Google Sheet Webhook POST Notice]:', err.message);
    });

    // Also attempt GET fallback with query params for Google Apps Scripts
    for (const it of payload.items) {
      const pName = encodeURIComponent(it.name || it.sku || '');
      const pSize = encodeURIComponent(it.size || '');
      const getUrl = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}action=deduct&product=${pName}&size=${pSize}&qty=${it.quantity}&order=${encodeURIComponent(orderRef)}`;
      fetch(getUrl).catch(() => {});
    }

    console.log(`[Google Sheet Inventory] Stock deduction dispatched to Google Sheet "${sheetName}" for order ${orderRef}`);
    return { success: true, mode: 'webhook_synced' };
  } catch (err) {
    console.warn(`[Google Sheet Inventory] Webhook push error:`, err);
    return { success: false, error: String(err) };
  }
}

// 3. Orders API
app.get('/api/orders', requireAdminAuth, (req, res) => {
  const data = readData();
  res.json({ orders: data.orders });
});

// Create Order (Public Checkout)
app.post('/api/orders', (req, res) => {
  const data = readData();
  const {
    customerName,
    phone,
    email,
    address,
    city,
    area,
    deliveryNote,
    items,
    subtotal,
    deliveryCharge,
    discount,
    couponCode,
    totalAmount,
    paymentMethod
  } = req.body;

  if (!customerName || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: 'Customer name, phone, address, and items are required' });
  }

  // Generate unique luxury order ID: VLR-2026-000XXX
  data.orderCounter = (data.orderCounter || 100) + 1;
  const orderId = `VLR-2026-${String(data.orderCounter).padStart(6, '0')}`;

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const newOrder = {
    id: orderId,
    customerName,
    phone,
    email: email || '',
    address,
    city: city || 'Dhaka',
    area: area || '',
    deliveryNote: deliveryNote || '',
    items,
    subtotal: Number(subtotal) || 0,
    deliveryCharge: Number(deliveryCharge) || 0,
    discount: Number(discount) || 0,
    couponCode: couponCode || null,
    totalAmount: Number(totalAmount) || 0,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'bkash' || paymentMethod === 'nagad' ? 'paid' : 'pending',
    status: 'Order Received',
    timeline: [
      {
        status: 'Order Received',
        time: formattedTime,
        note: `Order successfully placed via ${paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod?.toUpperCase()}`
      }
    ],
    createdAt: now.toISOString()
  };

  // Deduct product stock in website database (variant-aware)
  if (Array.isArray(items)) {
    items.forEach((item: any) => {
      const prod = data.products.find(p => p.id === item.productId || p.slug === item.slug);
      if (prod) {
        const qty = Number(item.quantity) || 1;
        const sizeStr = (item.size || '').toLowerCase();
        if (sizeStr.includes('3ml') && prod.stock3ml !== undefined) {
          prod.stock3ml = Math.max(0, prod.stock3ml - qty);
        } else if (sizeStr.includes('6ml') && prod.stock6ml !== undefined) {
          prod.stock6ml = Math.max(0, prod.stock6ml - qty);
        }
        if (prod.stock3ml !== undefined && prod.stock6ml !== undefined) {
          prod.stock = prod.stock3ml + prod.stock6ml;
        } else {
          prod.stock = Math.max(0, (prod.stock || 0) - qty);
        }
      }
    });
  }

  data.orders.unshift(newOrder);
  writeData(data);

  // Deduct stock in Google Sheet (Vellure Fragrances - Inventory)
  syncDeductWithGoogleSheet(newOrder.items, newOrder.id, 'website').catch(err => {
    console.warn('[Google Sheets Sync] Order stock deduction sync notice:', err);
  });

  // Send Telegram Notification on new order if enabled
  if (data.settings?.telegramNotifyNewOrder !== false) {
    const itemsList = newOrder.items
      .map((it: any) => `• <b>${it.name}</b> (${it.size}) × ${it.quantity} — ৳${it.price * it.quantity}`)
      .join('\n');

    const orderMsg = `🎉 <b>VELLURE — New Order Placed!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔖 <b>Order ID:</b> <code>${newOrder.id}</code>\n` +
      `👤 <b>Customer:</b> ${newOrder.customerName}\n` +
      `📞 <b>Phone:</b> ${newOrder.phone}\n` +
      `📍 <b>Address:</b> ${newOrder.address}, ${newOrder.city}${newOrder.area ? ` (${newOrder.area})` : ''}\n` +
      `💳 <b>Payment:</b> ${newOrder.paymentMethod.toUpperCase()} (${newOrder.paymentStatus})\n` +
      `💵 <b>Total Amount:</b> ৳${newOrder.totalAmount}\n` +
      (newOrder.deliveryNote ? `📝 <b>Note:</b> ${newOrder.deliveryNote}\n` : '') +
      `📦 <b>Items:</b>\n${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚚 <i>Dispatched to VELLURE atelier dispatch queue.</i>`;

    sendTelegramMessage(orderMsg).catch(e => console.warn('Telegram new order error:', e));
  }

  res.status(201).json({ success: true, order: newOrder });
});

// Update Order Status (Admin only)
app.put('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const data = readData();
  const order = data.orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const validStatuses = ['Order Received', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  order.status = status;
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  order.timeline = order.timeline || [];
  order.timeline.push({
    status,
    time: formattedTime,
    note: note || `Status updated to ${status}`
  });

  if (status === 'Delivered') {
    order.paymentStatus = 'paid';
  }

  writeData(data);
  res.json({ success: true, order });
});

// Track Order (Public by ID and Phone verification)
app.get('/api/orders/track', (req, res) => {
  const { orderId, phone } = req.query;
  if (!orderId || !phone) {
    return res.status(400).json({ error: 'Both Order Number and Phone Number are required to track.' });
  }

  const cleanPhone = (phone as string).replace(/[^0-9]/g, '');
  const cleanOrderId = (orderId as string).trim().toUpperCase();

  const data = readData();
  const order = data.orders.find(o => {
    const oIdMatch = o.id.toUpperCase() === cleanOrderId;
    const oPhoneClean = o.phone.replace(/[^0-9]/g, '');
    const phoneMatch = oPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(oPhoneClean);
    return oIdMatch && phoneMatch;
  });

  if (!order) {
    return res.status(404).json({ error: 'No matching order found. Please verify your Order Number (e.g. VLR-2026-000101) and Phone Number.' });
  }

  res.json({ success: true, order });
});

// 3b. Google Sheets Inventory Synchronization & Stock Management API
// GET sync status and current inventory
app.get('/api/inventory/sheet-sync', (req, res) => {
  const data = readData();
  const settings = data.settings || {};

  const inventorySummary = data.products.map(p => ({
    id: p.id,
    sku: p.sku || 'N/A',
    slug: p.slug,
    name: p.name,
    nameBn: p.nameBn,
    stock: p.stock ?? 0,
    inStock: (p.stock ?? 0) > 0,
    status: (p.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
    price3ml: p.price3ml,
    price6ml: p.price6ml
  }));

  res.json({
    success: true,
    sheetName: settings.googleSheetName || 'Vellure Fragrances - Inventory',
    email: settings.googleSheetEmail || 'info.vellurefragrances@gmail.com',
    webhookUrl: settings.googleSheetWebhookUrl || '',
    lastSync: settings.googleSheetLastSync || null,
    syncStatus: settings.googleSheetSyncStatus || 'connected',
    syncMessage: settings.googleSheetSyncMessage || `Ready to sync with Google Sheet: ${settings.googleSheetName || 'Vellure Fragrances - Inventory'}`,
    totalProducts: data.products.length,
    inStockCount: inventorySummary.filter(p => p.inStock).length,
    outOfStockCount: inventorySummary.filter(p => !p.inStock).length,
    products: inventorySummary
  });
});

// Function to parse Google Sheet rows (handling both variant rows and standard product rows)
function parseAndApplySheetRows(rows: any[], data: StoreData): { updatedCount: number; updatedItems: any[] } {
  let updatedCount = 0;
  const updatedItems: any[] = [];

  const grouped: Record<string, {
    rawName: string;
    stock3ml?: number;
    stock6ml?: number;
    price3ml?: number;
    price6ml?: number;
    totalStock?: number;
  }> = {};

  rows.forEach((row: any) => {
    const colA = (row.sku || row.SKU || row[0] || '').toString().trim();
    const colB = (row.name || row.Name || row[1] || '').toString().trim();

    // Detect if column B is a variant like 3ml or 6ml
    const isVariantColB = /3ml|6ml/i.test(colB);
    const productTitle = isVariantColB ? colA : (colA || colB);
    const variantTitle = isVariantColB ? colB : '';

    if (!productTitle) return;

    const normKey = productTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!grouped[normKey]) {
      grouped[normKey] = { rawName: productTitle };
    }

    // Determine stock
    let stockVal: number | undefined;
    if (row.stock !== undefined && Number(row.stock) > 0) {
      stockVal = Number(row.stock);
    } else if (row.quantity !== undefined && Number(row.quantity) > 0) {
      stockVal = Number(row.quantity);
    } else if (row.price3ml !== undefined && Number(row.price3ml) > 0) {
      // In the user's Google Sheet Web App, price3ml contains the variant stock quantity
      stockVal = Math.floor(Number(row.price3ml));
    } else if (row.Stock !== undefined && Number(row.Stock) > 0) {
      stockVal = Number(row.Stock);
    } else if (row.stock !== undefined) {
      stockVal = Number(row.stock);
    }

    // Determine price
    const priceVal = Number(row.price6ml || row.price || row.Price || 0);

    if (variantTitle.toLowerCase().includes('3ml')) {
      if (stockVal !== undefined) grouped[normKey].stock3ml = stockVal;
      if (priceVal > 0) grouped[normKey].price3ml = priceVal;
    } else if (variantTitle.toLowerCase().includes('6ml')) {
      if (stockVal !== undefined) grouped[normKey].stock6ml = stockVal;
      if (priceVal > 0) grouped[normKey].price6ml = priceVal;
    } else {
      if (stockVal !== undefined) grouped[normKey].totalStock = stockVal;
      if (row.price3ml && Number(row.price3ml) > 0) grouped[normKey].price3ml = Number(row.price3ml);
      if (row.price6ml && Number(row.price6ml) > 0) grouped[normKey].price6ml = Number(row.price6ml);
    }
  });

  Object.keys(grouped).forEach(normKey => {
    const item = grouped[normKey];
    const prod = data.products.find(p => {
      const pNorm = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sNorm = (p.sku || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const slugNorm = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return pNorm === normKey || sNorm === normKey || slugNorm === normKey ||
        (normKey.includes('royalsandal') && pNorm.includes('royalsandal')) ||
        (normKey.includes('whitechandan') && pNorm.includes('whitechandan')) ||
        (normKey.includes('coolwater') && pNorm.includes('coolwater')) ||
        (normKey.includes('bluedechanel') && pNorm.includes('bluedechanel')) ||
        (normKey.includes('armaniblue') && pNorm.includes('armaniblue')) ||
        (normKey.includes('acquadigio') && pNorm.includes('acqua')) ||
        (normKey.includes('crimson') && pNorm.includes('crismon')) ||
        (normKey.includes('crismon') && pNorm.includes('crimson')) ||
        (normKey.includes('bombshell') && pNorm.includes('bombshell')) ||
        (normKey.includes('vampire') && pNorm.includes('vampire')) ||
        (normKey.includes('desire') && pNorm.includes('desire')) ||
        (normKey.includes('musksafi') && pNorm.includes('musksafi')) ||
        (normKey.includes('rosegold') && pNorm.includes('rosegold')) ||
        (normKey.includes('saffronrose') && pNorm.includes('saffronrose')) ||
        (normKey.includes('royaloud') && pNorm.includes('royaloud')) ||
        (normKey.includes('baccarat') && pNorm.includes('baccarat'));
    });

    if (prod) {
      if (item.stock3ml !== undefined) prod.stock3ml = Math.max(0, item.stock3ml);
      if (item.stock6ml !== undefined) prod.stock6ml = Math.max(0, item.stock6ml);

      if (prod.stock3ml !== undefined && prod.stock6ml !== undefined) {
        prod.stock = prod.stock3ml + prod.stock6ml;
      } else if (item.totalStock !== undefined) {
        prod.stock = Math.max(0, item.totalStock);
      }

      if (item.price3ml && item.price3ml > 0) prod.price3ml = item.price3ml;
      if (item.price6ml && item.price6ml > 0) prod.price6ml = item.price6ml;

      updatedCount++;
      updatedItems.push({
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        stock: prod.stock,
        stock3ml: prod.stock3ml,
        stock6ml: prod.stock6ml,
        price3ml: prod.price3ml,
        price6ml: prod.price6ml
      });
    }
  });

  return { updatedCount, updatedItems };
}

// Global live sync runner for Google Sheet Web App
async function syncFromGoogleSheetWebhook(targetUrl?: string) {
  const data = readData();
  const webhook = targetUrl || data.settings?.googleSheetWebhookUrl || 'https://script.google.com/macros/s/AKfycbyi2tSRCnHp2SV1XTMorD9miR0rV3CN1HPvVgCQeWOxNwDG11IxqnZdIdgEO2oawXe9sQ/exec';

  if (!webhook) {
    throw new Error('No Google Sheet Webhook URL configured');
  }

  const res = await fetch(webhook);
  const fetchedJson = await res.json().catch(() => null);

  const itemsList = Array.isArray(fetchedJson)
    ? fetchedJson
    : (Array.isArray(fetchedJson?.items) ? fetchedJson.items : (Array.isArray(fetchedJson?.products) ? fetchedJson.products : []));

  if (!itemsList || itemsList.length === 0) {
    throw new Error('No inventory records found in Google Sheet response');
  }

  const { updatedCount, updatedItems } = parseAndApplySheetRows(itemsList, data);

  data.settings.googleSheetWebhookUrl = webhook;
  data.settings.googleSheetLastSync = new Date().toISOString();
  data.settings.googleSheetSyncStatus = 'connected';
  data.settings.googleSheetSyncMessage = `Live synchronized with Google Sheet ("${data.settings?.googleSheetName || 'Vellure Fragrances - Inventory'}"). ${updatedCount} items active.`;
  writeData(data);

  return { updatedCount, updatedItems, message: data.settings.googleSheetSyncMessage };
}

// POST trigger Google Sheets sync (from Webhook, direct rows, or API)
app.post('/api/inventory/sheet-sync', requireAdminAuth, async (req, res) => {
  const data = readData();
  const { sheetRows, webhookUrl } = req.body;
  const targetWebhook = webhookUrl || data.settings?.googleSheetWebhookUrl;

  try {
    if (Array.isArray(sheetRows) && sheetRows.length > 0) {
      const { updatedCount, updatedItems } = parseAndApplySheetRows(sheetRows, data);
      data.settings.googleSheetLastSync = new Date().toISOString();
      data.settings.googleSheetSyncStatus = 'connected';
      data.settings.googleSheetSyncMessage = `Updated ${updatedCount} items from Google Sheets directly.`;
      writeData(data);
      return res.json({ success: true, updatedCount, updatedItems, message: data.settings.googleSheetSyncMessage });
    }

    const result = await syncFromGoogleSheetWebhook(targetWebhook);
    res.json({
      success: true,
      updatedCount: result.updatedCount,
      lastSync: new Date().toISOString(),
      message: result.message,
      updatedItems: result.updatedItems
    });
  } catch (err: any) {
    console.error('[Google Sheet Sync Error]:', err);
    data.settings.googleSheetSyncStatus = 'error';
    data.settings.googleSheetSyncMessage = `Sync failed: ${err.message || 'Check webhook URL or sheet credentials'}`;
    writeData(data);

    res.status(500).json({
      success: false,
      error: err.message,
      syncMessage: data.settings.googleSheetSyncMessage
    });
  }
});

// POST deduct stock for Messenger, WhatsApp, or Manual Orders
app.post('/api/inventory/deduct', requireAdminAuth, async (req, res) => {
  const { items, source, orderRef, customerName } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array with productId and quantity is required' });
  }

  const data = readData();
  const updatedProducts: any[] = [];
  const ref = orderRef || `MSGR-${Date.now().toString().slice(-6)}`;

  items.forEach((item: any) => {
    const prod = data.products.find(p => p.id === item.productId || p.sku === item.sku || p.slug === item.slug);
    if (prod) {
      const deductQty = Math.max(1, Number(item.quantity) || 1);
      const sizeStr = (item.size || '').toLowerCase();
      if (sizeStr.includes('3ml') && prod.stock3ml !== undefined) {
        prod.stock3ml = Math.max(0, prod.stock3ml - deductQty);
      } else if (sizeStr.includes('6ml') && prod.stock6ml !== undefined) {
        prod.stock6ml = Math.max(0, prod.stock6ml - deductQty);
      }
      if (prod.stock3ml !== undefined && prod.stock6ml !== undefined) {
        prod.stock = prod.stock3ml + prod.stock6ml;
      } else {
        prod.stock = Math.max(0, (prod.stock || 0) - deductQty);
      }

      updatedProducts.push({
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        deducted: deductQty,
        size: item.size || '3ml',
        remainingStock: prod.stock,
        remainingStock3ml: prod.stock3ml,
        remainingStock6ml: prod.stock6ml,
        status: prod.stock > 0 ? 'In Stock' : 'Out of Stock'
      });
    }
  });

  writeData(data);

  // Sync deduction with Google Sheet
  const syncResult = await syncDeductWithGoogleSheet(items, ref, source || 'messenger');

  res.json({
    success: true,
    orderRef: ref,
    customerName: customerName || 'Messenger Customer',
    source: source || 'messenger',
    updatedProducts,
    syncResult
  });
});

// PUT update stock of a specific product (Instant Admin Override)
app.put('/api/products/:id/stock', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (stock === undefined || isNaN(Number(stock))) {
    return res.status(400).json({ error: 'Valid stock number is required' });
  }

  const data = readData();
  const product = data.products.find(p => p.id === id || p.slug === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  product.stock = Math.max(0, Number(stock));
  writeData(data);

  res.json({
    success: true,
    product: {
      id: product.id,
      sku: product.sku,
      name: product.name,
      stock: product.stock,
      inStock: product.stock > 0,
      status: product.stock > 0 ? 'In Stock' : 'Out of Stock'
    }
  });
});

// 4. Coupons API
app.get('/api/coupons', requireAdminAuth, (req, res) => {
  const data = readData();
  res.json({ coupons: data.coupons });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });
  }

  const data = readData();
  const coupon = data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return res.status(400).json({
      valid: false,
      message: `This coupon requires a minimum subtotal of ৳${coupon.minOrder}`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    valid: true,
    discountAmount,
    coupon
  });
});

app.post('/api/coupons', requireAdminAuth, (req, res) => {
  const data = readData();
  const { code, discountType, discountValue, minOrder, active } = req.body;
  if (!code || !discountValue) {
    return res.status(400).json({ error: 'Code and discount value are required' });
  }

  const existingIndex = data.coupons.findIndex(c => c.code.toUpperCase() === code.trim().toUpperCase());
  const newCoupon = {
    code: code.trim().toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrder: Number(minOrder) || 0,
    active: active !== false
  };

  if (existingIndex >= 0) {
    data.coupons[existingIndex] = newCoupon;
  } else {
    data.coupons.push(newCoupon);
  }

  writeData(data);
  res.json({ success: true, coupon: newCoupon });
});

// 5. Settings API
app.get('/api/settings', (req, res) => {
  const data = readData();
  res.json({ settings: data.settings });
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  const data = readData();
  data.settings = { ...data.settings, ...req.body };
  writeData(data);
  res.json({ success: true, settings: data.settings });
});

// Telegram Notification Dispatcher
async function sendTelegramMessage(text: string, customToken?: string, customChatId?: string): Promise<{ success: boolean; error?: string }> {
  const data = readData();
  const token = customToken || process.env.TELEGRAM_BOT_TOKEN || data.settings?.telegramBotToken;
  const chatId = customChatId || process.env.TELEGRAM_CHAT_ID || data.settings?.telegramChatId;

  if (!token || !chatId) {
    return { success: false, error: 'Telegram Bot Token or Chat ID not configured.' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const result = await res.json();
    if (!result.ok) {
      return { success: false, error: result.description || 'Telegram API rejected message.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error reaching Telegram API.' };
  }
}

// 6. Telegram Notifications API
// Add to Cart Telegram Notification
app.post('/api/notifications/telegram/add-to-cart', async (req, res) => {
  const data = readData();
  if (data.settings?.telegramNotifyAddToCart === false) {
    return res.json({ success: false, disabled: true, message: 'Add to cart Telegram alerts disabled in settings' });
  }

  const { productName, productNameBn, size, price, quantity, cartSubtotal, language } = req.body;
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const message = `🛍️ <b>VELLURE — Customer Added Item to Cart!</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✨ <b>Fragrance:</b> ${productName || 'Attar'} ${productNameBn ? `(${productNameBn})` : ''}\n` +
    `💎 <b>Size:</b> ${size || '3ml'}\n` +
    `🔢 <b>Quantity:</b> ${quantity || 1}\n` +
    `💰 <b>Price:</b> ৳${price || 0}\n` +
    `🛒 <b>Cart Subtotal:</b> ৳${cartSubtotal || price || 0}\n` +
    `🕒 <b>Time:</b> ${timeStr}\n` +
    `🌐 <b>Language:</b> ${language === 'bn' ? 'বাংলা' : 'English'}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<i>Customer is actively browsing their bag on VELLURE.</i>`;

  const result = await sendTelegramMessage(message);
  res.json(result);
});

// Test Telegram Bot Connection
app.post('/api/notifications/telegram/test', async (req, res) => {
  const { botToken, chatId } = req.body;
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const testMessage = `🧪 <b>VELLURE Atelier — Bot Verification</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <b>Status:</b> Telegram Bot Connected Successfully!\n` +
    `🕒 <b>Verified At:</b> ${timeStr}\n` +
    `🚀 <b>Capabilities:</b> Real-time Add-to-Cart & New Order Dispatches Active.\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `<i>Your VELLURE fragrance store is ready to send instant alerts!</i>`;

  const result = await sendTelegramMessage(testMessage, botToken, chatId);
  res.json(result);
});

// SEO sitemap.xml & robots.txt routes
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  const data = readData();
  const host = `${req.protocol}://${req.get('host')}`;
  const staticUrls = ['', '/shop', '/about', '/contact', '/track-order'];
  const productUrls = data.products.map(p => `/product/${p.slug}`);

  const allUrls = [...staticUrls, ...productUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(u => `
  <url>
    <loc>${host}${u}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${u === '' ? '1.0' : u.startsWith('/product') ? '0.8' : '0.6'}</priority>
  </url>`).join('')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// ================= VITE DEV OR STATIC SERVER =================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VELLURE Luxury Fragrance server running on http://0.0.0.0:${PORT}`);

    // Trigger initial sync with Google Sheet Web App
    syncFromGoogleSheetWebhook()
      .then(res => console.log('[Startup Google Sheet Sync]:', res.message))
      .catch(err => console.log('[Startup Google Sheet Sync Notice]:', err.message));

    // Recurring sync every 5 minutes
    setInterval(() => {
      syncFromGoogleSheetWebhook().catch(() => {});
    }, 5 * 60 * 1000);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
