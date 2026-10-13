import { Product, SiteSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "prod-armani-blue",
    "slug": "armani-blue",
    "name": "Vellure Armani Blue",
    "nameBn": "ভ্যালুর আরমানি ব্লু",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Aquatic",
    "shortDescription": "A mysterious and magnetic blend. A refreshing wave of citrus balanced with deep, masculine woods to keep you energized all day.",
    "shortDescriptionBn": "এক রহস্যময় ও আকর্ষণীয় ঘ্রাণ। সিট্রাস ও স্নিগ্ধ কাঠের নিখুঁত মিশ্রণ যা আপনাকে সারাদিন সতেজ ও প্রাণবন্ত রাখবে।",
    "description": "A mysterious and magnetic blend. A refreshing wave of citrus balanced with deep, masculine woods to keep you energized all day.",
    "descriptionBn": "এক রহস্যময় ও আকর্ষণীয় ঘ্রাণ। সিট্রাস ও স্নিগ্ধ কাঠের নিখুঁত মিশ্রণ যা আপনাকে সারাদিন সতেজ ও প্রাণবন্ত রাখবে।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 50,
    "stock3ml": 25,
    "stock6ml": 25,
    "sku": "VLR-ATT-ARM01",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.9,
    "reviewsCount": 48,
    "images": [
      "/src/assets/images/product_vellure_armani_blue_1.jpg",
      "/src/assets/images/product_vellure_armani_blue_6ml.jpg",
      "/src/assets/images/product_vellure_armani_blue_3.jpg"
    ],
    "notes": {
      "top": [
        "Bergamot",
        "Mandarin"
      ],
      "topBn": [
        "বার্গামট",
        "ম্যান্ডারিন"
      ],
      "heart": [
        "Rosemary",
        "Lavender"
      ],
      "heartBn": [
        "রোজমেরি",
        "ল্যাভেন্ডার"
      ],
      "base": [
        "Tonka Bean",
        "Cedarwood"
      ],
      "baseBn": [
        "টংকা বিন",
        "সিডারউড"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা পর্যন্ত স্থায়ী",
    "sillage": "Luminous & Clean Projection",
    "sillageBn": "উজ্জ্বল ও স্নিগ্ধ সুবাস",
    "origin": "VELLURE Artisanal Reserve",
    "originBn": "ভেল্যুর আর্টিশানাল রিজার্ভ ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Daily casual wear, university & hangout",
    "bestForBn": "ডেইলি ক্যাজুয়াল ওয়্যার, বন্ধুদের সাথে আড্ডা বা ইউনিভার্সিটিতে যাওয়ার সময়।",
    "bestWeather": "Summer & Humid/Monsoon",
    "bestWeatherBn": "গরমের দিন এবং আর্দ্র (Humid/Monsoon) আবহাওয়ায় এটি সারাদিন সতেজ রাখবে।",
    "seasons": [
      "Summer",
      "Monsoon"
    ]
  },
  {
    "id": "prod-blue-de-chanel",
    "slug": "blue-de-chanel",
    "name": "Vellure Blue De Chanel",
    "nameBn": "ভ্যালুর ব্লু ডি চ্যানেল",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Fresh",
    "shortDescription": "Step into a world of confident elegance. A timeless, woody-aromatic scent for the modern man who defies convention.",
    "shortDescriptionBn": "আত্মবিশ্বাসী ও আধুনিক পুরুষের জন্য এক অনন্য সুগন্ধি। উডি-অ্যারোমেটিক সুবাস আপনাকে দেবে আভিজাত্যের ছোঁয়া।",
    "description": "Step into a world of confident elegance. A timeless, woody-aromatic scent for the modern man who defies convention.",
    "descriptionBn": "আত্মবিশ্বাসী ও আধুনিক পুরুষের জন্য এক অনন্য সুগন্ধি। উডি-অ্যারোমেটিক সুবাস আপনাকে দেবে আভিজাত্যের ছোঁয়া।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 50,
    "stock3ml": 25,
    "stock6ml": 25,
    "sku": "VLR-ATT-BDC01",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.9,
    "reviewsCount": 68,
    "images": [
      "/src/assets/images/product_vellure_blue_de_chanel_1.png",
      "/src/assets/images/product_vellure_blue_de_chanel_6ml.png",
      "/src/assets/images/product_vellure_blue_de_chanel_3.png"
    ],
    "notes": {
      "top": [
        "Grapefruit",
        "Lemon",
        "Mint"
      ],
      "topBn": [
        "গ্রেপফ্রুট",
        "লেবু",
        "পুদিনা"
      ],
      "heart": [
        "Ginger",
        "Jasmine",
        "Nutmeg"
      ],
      "heartBn": [
        "আদা",
        "জুঁই",
        "জয়ফল"
      ],
      "base": [
        "Incense",
        "Cedar",
        "Sandalwood"
      ],
      "baseBn": [
        "লোবান",
        "সিডারউড",
        "চন্দন"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা পর্যন্ত স্থায়ী",
    "sillage": "Magnetic & Sophisticated",
    "sillageBn": "আকর্ষণীয় ও আভিজাত্যপূর্ণ",
    "origin": "VELLURE Artisanal Reserve",
    "originBn": "ভেল্যুর আর্টিশানাল রিজার্ভ ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Office, corporate meetings & professional wear",
    "bestForBn": "অফিস, কর্পোরেট মিটিং, প্রেজেন্টেশন এবং প্রফেশনাল জায়গা। এটি আপনাকে খুব কনফিডেন্ট একটি ভাইব দেবে।",
    "bestWeather": "All-season (Spring/Summer preferred)",
    "bestWeatherBn": "সব আবহাওয়াতেই (All-season) দারুণ, তবে স্প্রিং এবং গরমের দিনগুলোতে সবচেয়ে বেশি মানানসই।",
    "seasons": [
      "All-Season",
      "Spring",
      "Summer"
    ]
  },
  {
    "id": "prod-royal-sandal",
    "slug": "royal-sandal",
    "name": "Vellure Royal Sandal",
    "nameBn": "ভ্যালুর রয়েল চন্দন",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Sandalwood",
    "shortDescription": "The essence of pure majesty. A creamy, rich, and deeply woody sandalwood scent that grounds the soul and exudes royal power.",
    "shortDescriptionBn": "রাজকীয় আভিজাত্যের প্রতীক। চন্দন কাঠের ক্রিমি ও গভীর সুবাস মনকে শান্ত করবে এবং ঐতিহ্যবাহী অনুভূতি দেবে।",
    "description": "The essence of pure majesty. A creamy, rich, and deeply woody sandalwood scent that grounds the soul and exudes royal power.",
    "descriptionBn": "রাজকীয় আভিজাত্যের প্রতীক। চন্দন কাঠের ক্রিমি ও গভীর সুবাস মনকে শান্ত করবে এবং ঐতিহ্যবাহী অনুভূতি দেবে।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-RS11",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.8,
    "reviewsCount": 82,
    "images": [
      "/src/assets/images/product_vellure_royal_sandal_official.jpg",
      "/src/assets/images/product_vellure_royal_sandal_6ml_official.jpg",
      "/src/assets/images/product_vellure_royal_sandal_portrait.png"
    ],
    "notes": {
      "top": [
        "Subtle Citrus"
      ],
      "topBn": [
        "হালকা সিট্রাস"
      ],
      "heart": [
        "Creamy Sandalwood"
      ],
      "heartBn": [
        "ক্রিমি চন্দন"
      ],
      "base": [
        "Amber",
        "Earthy Woody Notes"
      ],
      "baseBn": [
        "অ্যাম্বার",
        "মাটির স্নিগ্ধতা"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা",
    "sillage": "Velvety & Soothing",
    "sillageBn": "কোমল ও প্রশান্তিদায়ক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Weddings, family gatherings & formal meetings with elders",
    "bestWeather": "Winter & Monsoon",
    "seasons": [
      "Winter",
      "Monsoon"
    ]
  },
  {
    "id": "prod-white-chandan",
    "slug": "white-chandan",
    "name": "Vellure White Chandan",
    "nameBn": "ভ্যালুর শ্বেত চন্দন",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Sandalwood",
    "shortDescription": "Heavenly and soothing. A delicate, soft expression of sandalwood, perfect for spiritual calmness and everyday elegance.",
    "shortDescriptionBn": "স্বর্গীয় এবং স্নিগ্ধ। শ্বেত চন্দনের কোমল ঘ্রাণ প্রতিদিনের ব্যবহার এবং মনের প্রশান্তির জন্য একদম পারফেক্ট।",
    "description": "Heavenly and soothing. A delicate, soft expression of sandalwood, perfect for spiritual calmness and everyday elegance.",
    "descriptionBn": "স্বর্গীয় এবং স্নিগ্ধ। শ্বেত চন্দনের কোমল ঘ্রাণ প্রতিদিনের ব্যবহার এবং মনের প্রশান্তির জন্য একদম পারফেক্ট।",
    "price3ml": 200,
    "price6ml": 380,
    "originalPrice3ml": 260,
    "originalPrice6ml": 494,
    "discount": 23,
    "stock": 25,
    "stock3ml": 5,
    "stock6ml": 20,
    "sku": "VLR-ATT-WC14",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.9,
    "reviewsCount": 124,
    "images": [
      "/src/assets/images/product_vellure_white_chandan_official.jpg",
      "/src/assets/images/product_vellure_white_chandan_6ml_official.jpg",
      "/src/assets/images/product_vellure_white_chandan_portrait.png"
    ],
    "notes": {
      "top": [
        "Floral hints"
      ],
      "topBn": [
        "হালকা ফ্লোরাল"
      ],
      "heart": [
        "White Sandalwood"
      ],
      "heartBn": [
        "শ্বেত চন্দন"
      ],
      "base": [
        "White Musk",
        "Powdery Woods"
      ],
      "baseBn": [
        "হোয়াইট মাস্ক",
        "পাউডারি উডস"
      ]
    },
    "longevity": "12-15 Hours",
    "longevityBn": "১২-১৫ ঘণ্টা স্থায়ী",
    "sillage": "Serene & Gentle",
    "sillageBn": "শান্ত ও স্নিগ্ধ",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Prayer, meditation & relaxing at home",
    "bestWeather": "All weather (Cooling feel in Summer)",
    "seasons": [
      "All-Season",
      "Summer"
    ]
  },
  {
    "id": "prod-acqua-digio",
    "slug": "acqua-digio",
    "name": "Vellure Acqua Digio",
    "nameBn": "ভ্যালুর অ্যাকোয়া ডি জিও",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Fresh",
    "shortDescription": "A splash of Mediterranean breeze. Light, aquatic, and deeply refreshing, capturing the pure essence of nature.",
    "shortDescriptionBn": "প্রকৃতির স্নিগ্ধতা আর সামুদ্রিক হাওয়ার এক নিখুঁত মেলবন্ধন। হালকা ও সতেজ এই সুগন্ধি মনকে একদম শান্ত করে দেয়।",
    "description": "A splash of Mediterranean breeze. Light, aquatic, and deeply refreshing, capturing the pure essence of nature. Vellure Acqua Digio combines sun-drenched Calabrian bergamot, green tangerine, and crystalline marine ozone notes with a floral heart of delicate jasmine and rosemary. The base gently settles into Indonesian patchouli, white cedarwood, and mineral amber, crafting an airy and revitalizing presence. 100% pure concentrated non-alcoholic artisanal attar.",
    "descriptionBn": "প্রকৃতির স্নিগ্ধতা আর সামুদ্রিক হাওয়ার এক নিখুঁত মেলবন্ধন। হালকা ও সতেজ এই সুগন্ধি মনকে একদম শান্ত করে দেয়। ক্যালাব্রিয়ান বারগামট, সবুজ ট্যানজারিন ও সামুদ্রিক জলজ সুবাসের সাথে মৃদু জুঁই ফুল ও রোজমেরির স্নিগ্ধ স্পর্শ এনে দেয় অভূতপূর্ব এক প্রশান্তি। শেষভাগে সাদা সিডারউড ও প্যাচৌলির নরম ও দীর্ঘস্থায়ী আবেশ মনকে প্রফুল্ল রাখে। বাংলাদেশের তীব্র গরম এবং বর্ষাকালে সারাদিন সতেজ থাকার জন্য এটি এক অনন্য পছন্দ। ১০০% খাঁটি ও অ্যালকোহলমুক্ত সুগন্ধি আতর।",
    "price3ml": 200,
    "price6ml": 380,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-ADG02",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 5,
    "reviewsCount": 54,
    "images": [
      "/src/assets/images/product_vellure_acqua_digio_1.jpg",
      "/src/assets/images/product_vellure_acqua_digio_6ml.jpg",
      "/src/assets/images/product_vellure_acqua_digio_3.jpg"
    ],
    "notes": {
      "top": [
        "Calabrian Bergamot",
        "Green Tangerine",
        "Marine Ozone"
      ],
      "topBn": [
        "ক্যালাব্রিয়ান বারগামট",
        "সবুজ ট্যানজারিন",
        "সামুদ্রিক ওজোন"
      ],
      "heart": [
        "Rosemary",
        "Jasmine",
        "Neroli"
      ],
      "heartBn": [
        "রোজমেরি",
        "জুঁই ফুল",
        "নেরোলি"
      ],
      "base": [
        "Patchouli",
        "White Cedarwood",
        "Mineral Amber"
      ],
      "baseBn": [
        "প্যাচৌলি",
        "সাদা সিডারউড",
        "অ্যাম্বার"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Day-outs, tours, beach vacations, relaxed travel, and casual gatherings.",
    "bestForBn": "ডে-আউট, ট্যুর, বিচ হলিডে বা যেকোনো হালকা আয়োজনে।",
    "bestWeather": "Severe summer heat and monsoon weather in Bangladesh, keeping the mind calm and serene.",
    "bestWeatherBn": "বাংলাদেশের তীব্র গরম এবং বর্ষাকালে (Summer & Monsoon) এর অ্যাকোয়াটিক ঘ্রাণ মনকে শান্ত রাখে।",
    "seasons": [
      "Summer",
      "Monsoon"
    ],
    "seasonsBn": [
      "গ্রীষ্মকাল",
      "বর্ষাকাল"
    ]
  },
  {
    "id": "prod-vampire-blood",
    "slug": "vampire-blood",
    "name": "Vellure Vampire Blood",
    "nameBn": "ভ্যালুর ভ্যাম্পায়ার ব্লাড",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Oriental",
    "shortDescription": "Dark, fruity, and dangerously addictive. A mesmerizing blend of sweet red berries and mysterious floral undertones.",
    "shortDescriptionBn": "গাঢ়, মিষ্টি এবং তীব্র আকর্ষণীয়। লাল বেরি আর মিষ্টি ফুলের মায়াবী মিশ্রণ যা সহজেই মন কেড়ে নেয়।",
    "description": "Dark, fruity, and dangerously addictive. A mesmerizing blend of sweet red berries and mysterious floral undertones.",
    "descriptionBn": "গাঢ়, মিষ্টি এবং তীব্র আকর্ষণীয়। লাল বেরি আর মিষ্টি ফুলের মায়াবী মিশ্রণ যা সহজেই মন কেড়ে নেয়।",
    "price3ml": 200,
    "price6ml": 380,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 25,
    "stock3ml": 5,
    "stock6ml": 20,
    "sku": "VLR-ATT-VB13",
    "featured": true,
    "bestSeller": true,
    "newArrival": false,
    "rating": 4.8,
    "reviewsCount": 92,
    "images": [
      "/src/assets/images/product_vellure_vampire_blood_1.jpg",
      "/src/assets/images/product_vellure_vampire_blood_2.jpg",
      "/src/assets/images/product_vellure_vampire_blood_3.jpg"
    ],
    "notes": {
      "top": [
        "Blood Plum",
        "Strawberry"
      ],
      "topBn": [
        "প্লাম",
        "স্ট্রবেরি"
      ],
      "heart": [
        "Red Jasmine",
        "Sweet Floral"
      ],
      "heartBn": [
        "লাল জুঁই",
        "মিষ্টি ফুল"
      ],
      "base": [
        "Dark Sandalwood",
        "Musk"
      ],
      "baseBn": [
        "গাঢ় চন্দন",
        "মাস্ক"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা",
    "sillage": "Intense & Seductive",
    "sillageBn": "তীব্র ও সম্মোহনী",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Evening parties, night-outs & special date nights",
    "bestWeather": "Winter & Cool Nights",
    "seasons": [
      "Winter"
    ]
  },
  {
    "id": "prod-saffron-rose",
    "slug": "saffron-rose",
    "name": "Vellure Saffron Rose",
    "nameBn": "ভ্যালুর জাফরান রোজ",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Floral",
    "shortDescription": "An opulent Middle Eastern romance. The golden warmth of rare saffron intertwined with velvet dark red rose petals.",
    "shortDescriptionBn": "এক রাজকীয় মধ্যপ্রাচ্যের ঘ্রাণ। মূল্যবান জাফরান আর গাঢ় লাল গোলাপের মিশ্রণ আপনাকে দেবে এক্সক্লুসিভ অনুভূতি।",
    "description": "An opulent Middle Eastern romance. The golden warmth of rare saffron intertwined with velvet dark red rose petals.",
    "descriptionBn": "এক রাজকীয় মধ্যপ্রাচ্যের ঘ্রাণ। মূল্যবান জাফরান আর গাঢ় লাল গোলাপের মিশ্রণ আপনাকে দেবে এক্সক্লুসিভ অনুভূতি।",
    "price3ml": 250,
    "price6ml": 450,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-SR12",
    "featured": true,
    "bestSeller": false,
    "newArrival": false,
    "rating": 4.9,
    "reviewsCount": 112,
    "images": [
      "/src/assets/images/product_vellure_saffron_rose_1.jpg",
      "/src/assets/images/product_vellure_saffron_rose_2.jpg",
      "/src/assets/images/product_vellure_saffron_rose_3.jpg"
    ],
    "notes": {
      "top": [
        "Saffron",
        "Bergamot"
      ],
      "topBn": [
        "জাফরান",
        "বার্গামট"
      ],
      "heart": [
        "Damask Rose",
        "Geranium"
      ],
      "heartBn": [
        "দামাস্ক রোজ",
        "জেরানিয়াম"
      ],
      "base": [
        "Patchouli",
        "Amber",
        "Sandalwood"
      ],
      "baseBn": [
        "প্যাচৌলি",
        "অ্যাম্বার",
        "চন্দন"
      ]
    },
    "longevity": "14-18 Hours",
    "longevityBn": "১৪-১৮ ঘণ্টা পর্যন্ত",
    "sillage": "Warm Oriental Radiance",
    "sillageBn": "উষ্ণ প্রাচ্য সুবাস",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Eid, Holud, Mehendi & traditional grand events",
    "bestWeather": "Winter & Cool Climates",
    "seasons": [
      "Winter"
    ]
  },
  {
    "id": "prod-royal-oud",
    "slug": "royal-oud",
    "name": "Vellure Royal Oud",
    "nameBn": "ভ্যালুর রয়েল উদ",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Oud",
    "shortDescription": "Powerful, smoky, and deeply prestigious. A majestic blend of precious agarwood (oud) and rich spices for the ultimate VIP aura.",
    "shortDescriptionBn": "শক্তিশালী, রাজকীয় এবং মর্যাদাপূর্ণ। মূল্যবান আগরউড (উদ) এবং মশলার মিশ্রণ আপনাকে দেবে ভিআইপি (VIP) ভাইব।",
    "description": "Powerful, smoky, and deeply prestigious. A majestic blend of precious agarwood (oud) and rich spices for the ultimate VIP aura.",
    "descriptionBn": "শক্তিশালী, রাজকীয় এবং মর্যাদাপূর্ণ। মূল্যবান আগরউড (উদ) এবং মশলার মিশ্রণ আপনাকে দেবে ভিআইপি (VIP) ভাইব।",
    "price3ml": 330,
    "price6ml": 600,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-RO10",
    "featured": true,
    "bestSeller": false,
    "newArrival": false,
    "rating": 4.9,
    "reviewsCount": 135,
    "images": [
      "/src/assets/images/product_vellure_royal_oud_1.jpg",
      "/src/assets/images/product_vellure_royal_oud_2.png",
      "/src/assets/images/product_vellure_royal_oud_3.jpg"
    ],
    "notes": {
      "top": [
        "Lemon",
        "Pink Pepper"
      ],
      "topBn": [
        "লেবু",
        "পিংক পেপার"
      ],
      "heart": [
        "Angelica",
        "Cedar"
      ],
      "heartBn": [
        "অ্যাঞ্জেলিকা",
        "সিডার"
      ],
      "base": [
        "Rich Agarwood",
        "Musk",
        "Sandalwood"
      ],
      "baseBn": [
        "আগরউড",
        "মাস্ক",
        "চন্দন"
      ]
    },
    "longevity": "14-20 Hours",
    "longevityBn": "১৪-২০ ঘণ্টা পর্যন্ত কার্যকর",
    "sillage": "Commanding & Majestic",
    "sillageBn": "প্রভাবশালী ও রাজকীয়",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "VIP meetings, executive events & boardrooms",
    "bestWeather": "Winter & AC Environments",
    "seasons": [
      "Winter"
    ]
  },
  {
    "id": "prod-rose-gold",
    "slug": "rose-gold",
    "name": "Vellure Rose Gold",
    "nameBn": "ভ্যালুর রোজ গোল্ড",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Floral",
    "shortDescription": "Elegance in a bottle. A luxurious and radiant blend of sweet blooming roses and delicate metallic warmth.",
    "shortDescriptionBn": "ঠিক যেন বোতলে বন্দি আভিজাত্য! মিষ্টি গোলাপ আর উষ্ণতার চমৎকার মিশ্রণ যা যেকোনো পার্টি বা উৎসবের জন্য মানানসই।",
    "description": "Elegance in a bottle. A luxurious and radiant blend of sweet blooming roses and delicate metallic warmth.",
    "descriptionBn": "ঠিক যেন বোতলে বন্দি আভিজাত্য! মিষ্টি গোলাপ আর উষ্ণতার চমৎকার মিশ্রণ যা যেকোনো পার্টি বা উৎসবের জন্য মানানসই।",
    "price3ml": 250,
    "price6ml": 450,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-RG09",
    "featured": false,
    "bestSeller": false,
    "newArrival": false,
    "rating": 4.8,
    "reviewsCount": 78,
    "images": [
      "/src/assets/images/product_vellure_rose_gold_1.jpg",
      "/src/assets/images/product_vellure_rose_gold_2.jpg",
      "/src/assets/images/product_vellure_rose_gold_3.jpg"
    ],
    "notes": {
      "top": [
        "Fruity Citrus",
        "Pear"
      ],
      "topBn": [
        "ফলের সিট্রাস",
        "নাশপাতি"
      ],
      "heart": [
        "Rose",
        "Jasmine",
        "Peony"
      ],
      "heartBn": [
        "গোলাপ",
        "জুঁই",
        "পিওনি"
      ],
      "base": [
        "White Musk",
        "Warm Amber"
      ],
      "baseBn": [
        "হোয়াইট মাস্ক",
        "উষ্ণ অ্যাম্বার"
      ]
    },
    "longevity": "12-15 Hours",
    "longevityBn": "১২-১৫ ঘণ্টা",
    "sillage": "Regal Floral Glow",
    "sillageBn": "রাজকীয় ফুলের মোহনীয় বিস্তার",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Exclusive parties, bridal showers & luxury gatherings",
    "bestWeather": "All-season (Spring & Early Winter best)",
    "seasons": [
      "All-Season",
      "Spring",
      "Winter"
    ]
  },
  {
    "id": "prod-musk-safi",
    "slug": "musk-safi",
    "name": "Vellure Musk Safi",
    "nameBn": "ভ্যালুর মাস্ক সাফি",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Musk",
    "shortDescription": "Pure, velvety, and deeply comforting. A clean, luxurious white musk that melts into the skin like soft silk.",
    "shortDescriptionBn": "একদম খাঁটি, কোমল এবং প্রশান্তিদায়ক। হোয়াইট মাস্কের স্নিগ্ধ ও রাজকীয় সুবাস ত্বকের সাথে মিশে তৈরি করে মায়াবী অনুভূতি।",
    "description": "Pure, velvety, and deeply comforting. A clean, luxurious white musk that melts into the skin like soft silk.",
    "descriptionBn": "একদম খাঁটি, কোমল এবং প্রশান্তিদায়ক। হোয়াইট মাস্কের স্নিগ্ধ ও রাজকীয় সুবাস ত্বকের সাথে মিশে তৈরি করে মায়াবী অনুভূতি।",
    "price3ml": 330,
    "price6ml": 600,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-MS08",
    "featured": false,
    "bestSeller": false,
    "newArrival": false,
    "rating": 4.9,
    "reviewsCount": 160,
    "images": [
      "/src/assets/images/product_vellure_musk_safi_1.jpg",
      "/src/assets/images/product_vellure_musk_safi_2.jpg",
      "/src/assets/images/product_vellure_musk_safi_3.jpg"
    ],
    "notes": {
      "top": [
        "White Flowers"
      ],
      "topBn": [
        "সাদা ফুল"
      ],
      "heart": [
        "Pure White Musk"
      ],
      "heartBn": [
        "খাঁটি হোয়াইট মাস্ক"
      ],
      "base": [
        "Powdery notes",
        "Vanilla"
      ],
      "baseBn": [
        "পাউডারি নোটস",
        "ভ্যানিলা"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা স্থায়ী",
    "sillage": "Peaceful & Intimate",
    "sillageBn": "শান্ত ও পবিত্র স্নিগ্ধতা",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Jummah prayers, religious events, after-bath & daily freshness",
    "bestWeather": "All-year round",
    "seasons": [
      "All-Season"
    ]
  },
  {
    "id": "prod-desire-red",
    "slug": "desire-red",
    "name": "Vellure Desire Red",
    "nameBn": "ভ্যালুর ডিজায়ার রেড",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Oriental",
    "shortDescription": "Ignite the passion within. A vibrant and sweet oriental scent driven by crisp apple, warm vanilla, and exotic woods.",
    "shortDescriptionBn": "মিষ্টি আপেল আর উষ্ণ ভ্যানিলার জাদুকরী ছোঁয়া। এই ওরিয়েন্টাল ঘ্রাণটি ব্যক্তিত্বে যোগ করবে দারুণ আবেদন।",
    "description": "Ignite the passion within. A vibrant and sweet oriental scent driven by crisp apple, warm vanilla, and exotic woods.",
    "descriptionBn": "মিষ্টি আপেল আর উষ্ণ ভ্যানিলার জাদুকরী ছোঁয়া। এই ওরিয়েন্টাল ঘ্রাণটি ব্যক্তিত্বে যোগ করবে দারুণ আবেদন।",
    "price3ml": 250,
    "price6ml": 450,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-DR06",
    "featured": false,
    "bestSeller": false,
    "newArrival": true,
    "rating": 4.8,
    "reviewsCount": 95,
    "images": [
      "/src/assets/images/product_vellure_desire_red_1.jpg",
      "/src/assets/images/product_vellure_desire_red_2.jpg",
      "/src/assets/images/product_vellure_desire_red_3.jpg"
    ],
    "notes": {
      "top": [
        "Apple",
        "Lemon",
        "Neroli"
      ],
      "topBn": [
        "আপেল",
        "লেবু",
        "নেরোলি"
      ],
      "heart": [
        "Rose",
        "Teak Wood",
        "Patchouli"
      ],
      "heartBn": [
        "গোলাপ",
        "সেগুন কাঠ",
        "প্যাচৌলি"
      ],
      "base": [
        "Vanilla",
        "Musk"
      ],
      "baseBn": [
        "ভ্যানিলা",
        "মাস্ক"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা",
    "sillage": "Magnetic & Warm",
    "sillageBn": "উষ্ণ ও মনোমুগ্ধকর",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Romantic dates, dinner parties & intimate moments",
    "bestWeather": "Winter & Rainy Season",
    "seasons": [
      "Winter",
      "Monsoon"
    ]
  },
  {
    "id": "prod-crimson",
    "slug": "crimson",
    "name": "Vellure Crismon",
    "nameBn": "ভ্যালুর ক্রিমসন",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Woody",
    "shortDescription": "Intense, passionate, and unforgettable. A rich symphony of warm spices and deep amber that leaves a striking trail.",
    "shortDescriptionBn": "তীব্র, আবেগপূর্ণ এবং অবিস্মরণীয়। উষ্ণ মশলা আর অ্যাম্বারের রাজকীয় সুবাস উপস্থিতিকে দারুণভাবে জানান দেবে।",
    "description": "Intense, passionate, and unforgettable. A rich symphony of warm spices and deep amber that leaves a striking trail.",
    "descriptionBn": "তীব্র, আবেগপূর্ণ এবং অবিস্মরণীয়। উষ্ণ মশলা আর অ্যাম্বারের রাজকীয় সুবাস উপস্থিতিকে দারুণভাবে জানান দেবে।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-CR05",
    "featured": false,
    "bestSeller": false,
    "newArrival": true,
    "rating": 4.8,
    "reviewsCount": 103,
    "images": [
      "/src/assets/images/product_vellure_crismon_1.jpg",
      "/src/assets/images/product_vellure_crismon_2.jpg",
      "/src/assets/images/product_vellure_crismon_3.jpg"
    ],
    "notes": {
      "top": [
        "Saffron",
        "Pink Pepper"
      ],
      "topBn": [
        "জাফরান",
        "পিংক পেপার"
      ],
      "heart": [
        "Rose",
        "Oud"
      ],
      "heartBn": [
        "গোলাপ",
        "উদ"
      ],
      "base": [
        "Amber",
        "Dark Patchouli",
        "Leather"
      ],
      "baseBn": [
        "অ্যাম্বার",
        "প্যাচৌলি",
        "লেদার"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Weddings, premium parties & exclusive formal events",
    "bestWeather": "Fall & Winter Evenings",
    "seasons": [
      "Winter",
      "Autumn"
    ]
  },
  {
    "id": "prod-cool-water",
    "slug": "cool-water",
    "name": "Vellure Cool Water",
    "nameBn": "ভ্যালুর কুল ওয়াটার",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Fresh",
    "shortDescription": "Experience the rush of the ocean. An ultra-fresh aquatic scent bringing sheer energy and vitality to your day.",
    "shortDescriptionBn": "সাগরের বিশালতা আর সতেজতার এক অপূর্ব অনুভূতি। আইকনিক এই অ্যাকোয়াটিক সুবাস দিনটিকে করে তুলবে সতেজ।",
    "description": "Experience the rush of the ocean. An ultra-fresh aquatic scent bringing sheer energy and vitality to your day.",
    "descriptionBn": "সাগরের বিশালতা আর সতেজতার এক অপূর্ব অনুভূতি। আইকনিক এই অ্যাকোয়াটিক সুবাস দিনটিকে করে তুলবে সতেজ।",
    "price3ml": 330,
    "price6ml": 600,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 45,
    "stock3ml": 25,
    "stock6ml": 20,
    "sku": "VLR-ATT-CW01",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.9,
    "reviewsCount": 142,
    "images": [
      "/src/assets/images/product_vellure_cool_water_1.jpg",
      "/src/assets/images/product_vellure_cool_water_6ml.jpg",
      "/src/assets/images/product_vellure_cool_water_3.jpg"
    ],
    "notes": {
      "top": [
        "Seawater",
        "Lavender",
        "Mint"
      ],
      "topBn": [
        "সামুদ্রিক জল",
        "ল্যাভেন্ডার",
        "পুদিনা"
      ],
      "heart": [
        "Sandalwood",
        "Jasmine"
      ],
      "heartBn": [
        "চন্দন",
        "জুঁই"
      ],
      "base": [
        "Musk",
        "Oakmoss",
        "Cedar"
      ],
      "baseBn": [
        "মাস্ক",
        "ওকমস",
        "সিডার"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা",
    "sillage": "Fresh & Clean Projection",
    "sillageBn": "সতেজ ও দীর্ঘস্থায়ী সুবাস",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Gym, sports & outdoor sun exposure",
    "bestForBn": "জিম (Gym), খেলাধুলা, বা রোদে বাইরে বের হওয়ার সময়। এটি ঘামের দুর্গন্ধ দূর করে রিফ্রেশিং অনুভূতি দেয়।",
    "bestWeather": "High Summer & Sunny days",
    "bestWeatherBn": "প্রচণ্ড গরম (High Summer) এবং রোদ ঝলমলে দিনে এটি সবচেয়ে পারফেক্ট।",
    "seasons": [
      "Summer",
      "Monsoon"
    ],
    "seasonsBn": [
      "গ্রীষ্মকাল",
      "বর্ষাকাল"
    ]
  },
  {
    "id": "prod-signature-trio-pack",
    "slug": "signature-trio-pack",
    "name": "Signature Trio Pack (Gift Set)",
    "nameBn": "সিগনেচার ট্রায়ো প্যাক (গিফট সেট)",
    "category": "gift_set",
    "categoryBn": "গিফট সেট",
    "fragranceType": "Oriental",
    "shortDescription": "A luxurious 3-in-1 golden-flacon gift set featuring Royal Oud, Musk Safi, and Saffron Rose.",
    "shortDescriptionBn": "রয়্যাল উদ, মাস্ক সাফি ও জাফরান রোজে সাজানো গোল্ডেন ফ্লাকনের ৩-ইন-১ লাক্সারি গিফট সেট।",
    "description": "A luxurious 3-in-1 golden-flacon gift set featuring Royal Oud, Musk Safi, and Saffron Rose.",
    "descriptionBn": "রয়্যাল উদ, মাস্ক সাফি ও জাফরান রোজে সাজানো গোল্ডেন ফ্লাকনের ৩-ইন-১ লাক্সারি গিফট সেট।",
    "price3ml": 850,
    "price6ml": 1550,
    "originalPrice3ml": 1105,
    "originalPrice6ml": 2015,
    "discount": 23,
    "stock": 25,
    "stock3ml": 15,
    "stock6ml": 10,
    "sku": "VLR-SET-STP16",
    "featured": false,
    "bestSeller": true,
    "newArrival": true,
    "rating": 5,
    "reviewsCount": 117,
    "images": [
      "/src/assets/images/combo_signature_trio_1.jpg",
      "/src/assets/images/combo_signature_trio_2.jpg",
      "/src/assets/images/combo_signature_trio_3.jpg"
    ],
    "notes": {
      "top": [
        "Bergamot",
        "Saffron"
      ],
      "topBn": [
        "বারগামট",
        "জাফরান"
      ],
      "heart": [
        "Amber",
        "Rose Petals"
      ],
      "heartBn": [
        "অ্যাম্বার",
        "গোলাপ"
      ],
      "base": [
        "Sandalwood",
        "White Musk"
      ],
      "baseBn": [
        "চন্দন",
        "শুভ্র কস্তুরী"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "packaging": "Golden-flacon 3-in-1 luxury box",
    "packagingBn": "গোল্ডেন ফ্লাকন ৩-ইন-১ লাক্সারি বক্স",
    "includedItems": [
      "Royal Oud",
      "Musk Safi",
      "Saffron Rose"
    ]
  },
  {
    "id": "prod-gentleman-s-edit-pack",
    "slug": "gentleman-s-edit-pack",
    "name": "Gentleman's Edit Pack (Gift Set)",
    "nameBn": "জেন্টলম্যানস এডিট প্যাক (গিফট সেট)",
    "category": "gift_set",
    "categoryBn": "গিফট সেট",
    "fragranceType": "Woody",
    "shortDescription": "A powerful masculine triple combo featuring Cool Water, Crimson, and Royal Sandal.",
    "shortDescriptionBn": "কুল ওয়াটার, ক্রিমসন ও রয়্যাল চন্দনের সমন্বয়ে আত্মবিশ্বাসী পুরুষের মাসকুলিন কম্বো।",
    "description": "A powerful masculine triple combo featuring Cool Water, Crimson, and Royal Sandal.",
    "descriptionBn": "কুল ওয়াটার, ক্রিমসন ও রয়্যাল চন্দনের সমন্বয়ে আত্মবিশ্বাসী পুরুষের মাসকুলিন কম্বো।",
    "price3ml": 750,
    "price6ml": 1350,
    "originalPrice3ml": 975,
    "originalPrice6ml": 1755,
    "discount": 23,
    "stock": 25,
    "stock3ml": 15,
    "stock6ml": 10,
    "sku": "VLR-SET-GEP17",
    "featured": false,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.8,
    "reviewsCount": 124,
    "images": [
      "/src/assets/images/combo_gentlemans_edit_1.jpg",
      "/src/assets/images/combo_gentlemans_edit_2.jpg",
      "/src/assets/images/combo_gentlemans_edit_3.jpg"
    ],
    "notes": {
      "top": [
        "Bergamot",
        "Saffron"
      ],
      "topBn": [
        "বারগামট",
        "জাফরান"
      ],
      "heart": [
        "Amber",
        "Rose Petals"
      ],
      "heartBn": [
        "অ্যাম্বার",
        "গোলাপ"
      ],
      "base": [
        "Sandalwood",
        "White Musk"
      ],
      "baseBn": [
        "চন্দন",
        "শুভ্র কস্তুরী"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "packaging": "Masculine triple combo packaging",
    "packagingBn": "মাসকুলিন ট্রিপল কম্বো প্যাকেজিং",
    "includedItems": [
      "Cool Water",
      "Crimson",
      "Royal Sandal"
    ]
  },
  {
    "id": "prod-elegant-aura-pack",
    "slug": "elegant-aura-pack",
    "name": "Elegant Aura Pack (Gift Set)",
    "nameBn": "এলিগ্যান্ট অরা প্যাক (গিফট সেট)",
    "category": "gift_set",
    "categoryBn": "গিফট সেট",
    "fragranceType": "Floral",
    "shortDescription": "A soft, serene velvet-cased trio of Rose Gold, White Chandan, and Acqua Digio.",
    "shortDescriptionBn": "রোজ গোল্ড, হোয়াইট চন্দন ও আকুয়া ডি জিও নিয়ে তৈরি স্নিগ্ধ ও প্রশান্তিদায়ক কালেকশন।",
    "description": "A soft, serene velvet-cased trio of Rose Gold, White Chandan, and Acqua Digio.",
    "descriptionBn": "রোজ গোল্ড, হোয়াইট চন্দন ও আকুয়া ডি জিও নিয়ে তৈরি স্নিগ্ধ ও প্রশান্তিদায়ক কালেকশন।",
    "price3ml": 780,
    "price6ml": 1400,
    "originalPrice3ml": 1014,
    "originalPrice6ml": 1820,
    "discount": 23,
    "stock": 25,
    "stock3ml": 15,
    "stock6ml": 10,
    "sku": "VLR-SET-EAP18",
    "featured": false,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.8999999999999995,
    "reviewsCount": 131,
    "images": [
      "/src/assets/images/combo_elegant_aura_1.jpg",
      "/src/assets/images/combo_elegant_aura_2.jpg",
      "/src/assets/images/combo_elegant_aura_3.jpg"
    ],
    "notes": {
      "top": [
        "Bergamot",
        "Saffron"
      ],
      "topBn": [
        "বারগামট",
        "জাফরান"
      ],
      "heart": [
        "Amber",
        "Rose Petals"
      ],
      "heartBn": [
        "অ্যাম্বার",
        "গোলাপ"
      ],
      "base": [
        "Sandalwood",
        "White Musk"
      ],
      "baseBn": [
        "চন্দন",
        "শুভ্র কস্তুরী"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "packaging": "Velvet cased soft collection",
    "packagingBn": "ভেলভেট কেসড সফট কালেকশন",
    "includedItems": [
      "Rose Gold",
      "White Chandan",
      "Acqua Digio"
    ]
  },
  {
    "id": "prod-discovery-box",
    "slug": "discovery-box",
    "name": "Discovery Box (Custom 6-Piece Master Coffret)",
    "nameBn": "ডিসকভারি বক্স (কাস্টম ৬-পিস মাস্টার কফ্রেট)",
    "category": "gift_set",
    "categoryBn": "গিফট সেট",
    "fragranceType": "Oriental",
    "shortDescription": "Exclusive 6-attar luxury coffret featuring Vellure Vampire Blood, Vellure Bombshell, Vellure Cool Water, Vellure Blue De Chanel, Vellure Musk Safi, and Vellure Baccarat Rouge.",
    "shortDescriptionBn": "৬টি জনপ্রিয় আতরের প্রিমিয়াম কম্বো বক্স — ভ্যালুর ভ্যাম্পায়ার ব্লাড, ভ্যালুর বম্বশেল, ভ্যালুর কুল ওয়াটার, ভ্যালুর ব্লু দ্য শ্যানেল, ভ্যালুর মাস্ক সাফি ও ভ্যালুর ব্যাকারাত রুজ।",
    "description": "Exclusive 6-attar luxury coffret featuring Vellure Vampire Blood, Vellure Bombshell, Vellure Cool Water, Vellure Blue De Chanel, Vellure Musk Safi, and Vellure Baccarat Rouge in an artisanal velvet presentation box.",
    "descriptionBn": "৬টি জনপ্রিয় আতরের প্রিমিয়াম কম্বো বক্স — ভ্যালুর ভ্যাম্পায়ার ব্লাড, ভ্যালুর বম্বশেল, ভ্যালুর কুল ওয়াটার, ভ্যালুর ব্লু দ্য শ্যানেল, ভ্যালুর মাস্ক সাফি ও ভ্যালুর ব্যাকারাত রুজ। প্রতিটি আতর ১০০% খাঁটি, দীর্ঘস্থায়ী ও অ্যালকোহলমুক্ত।",
    "price3ml": 1250,
    "price6ml": 2200,
    "originalPrice3ml": 1625,
    "originalPrice6ml": 2860,
    "discount": 23,
    "stock": 18,
    "stock3ml": 10,
    "stock6ml": 8,
    "sku": "VLR-SET-DBX19",
    "featured": false,
    "bestSeller": true,
    "newArrival": true,
    "rating": 5,
    "reviewsCount": 138,
    "images": [
      "/src/assets/images/combo_discovery_box_1.jpg",
      "/src/assets/images/combo_discovery_box_2.jpg",
      "/src/assets/images/combo_discovery_box_3.jpg"
    ],
    "notes": {
      "top": [
        "Bergamot",
        "Saffron"
      ],
      "topBn": [
        "বারগামট",
        "জাফরান"
      ],
      "heart": [
        "Amber",
        "Rose Petals"
      ],
      "heartBn": [
        "অ্যাম্বার",
        "গোলাপ"
      ],
      "base": [
        "Sandalwood",
        "White Musk"
      ],
      "baseBn": [
        "চন্দন",
        "শুভ্র কস্তুরী"
      ]
    },
    "longevity": "10-14 Hours on Skin, 24 Hours on Garments",
    "longevityBn": "ত্বকে ১০-১৪ ঘণ্টা, পোশাকে ২৪ ঘণ্টা পর্যন্ত",
    "sillage": "Regal & Captivating",
    "sillageBn": "তীব্র ও চিত্তাকর্ষক",
    "origin": "VELLURE Artisanal Atelier",
    "originBn": "ভেল্যুর আর্টিশানাল আতর ব্লেন্ড",
    "alcoholFree": true,
    "packaging": "Premium velvet presentation case",
    "packagingBn": "লাক্সারি ভেলভেট প্রেজেন্টেশন কেস",
    "includedItems": [
      "Vellure Vampire Blood",
      "Vellure Bombshell",
      "Vellure Cool Water",
      "Vellure Blue De Chanel",
      "Vellure Musk Safi",
      "Vellure Baccarat Rouge"
    ]
  },
  {
    "id": "prod-bombshell",
    "slug": "bombshell",
    "name": "Vellure Bombshell",
    "nameBn": "ভ্যালুর বমশেল",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Floral",
    "shortDescription": "Bold, floral, and fiercely glamorous. A sparkling mix of fresh peonies and exotic fruits for the ultimate showstopper.",
    "shortDescriptionBn": "সাহসী, গ্ল্যামারাস এবং ফ্লোরাল। মিষ্টি ফল আর ফুলের এই স্পার্কলিং ঘ্রাণ আপনাকে করে তুলবে সবার চেয়ে আলাদা ও আকর্ষণীয়।",
    "description": "Bold, floral, and fiercely glamorous. A sparkling mix of fresh peonies and exotic fruits for the ultimate showstopper.",
    "descriptionBn": "সাহসী, গ্ল্যামারাস এবং ফ্লোরাল। মিষ্টি ফল আর ফুলের এই স্পার্কলিং ঘ্রাণ আপনাকে করে তুলবে সবার চেয়ে আলাদা ও আকর্ষণীয়।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 50,
    "stock3ml": 25,
    "stock6ml": 25,
    "sku": "VLR-ATT-BS01",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 4.9,
    "reviewsCount": 74,
    "images": [
      "/src/assets/images/product_vellure_bombshell_1.png",
      "/src/assets/images/product_vellure_bombshell_2.png",
      "/src/assets/images/product_vellure_bombshell_3.png"
    ],
    "notes": {
      "top": [
        "Passionfruit",
        "Grapefruit",
        "Pineapple"
      ],
      "topBn": [
        "প্যাশনফ্রুট",
        "গ্রেপফ্রুট",
        "আনারস"
      ],
      "heart": [
        "Peony",
        "Vanilla Orchid"
      ],
      "heartBn": [
        "পিওনি ফুল",
        "ভ্যানিলা অর্কিড"
      ],
      "base": [
        "Musk",
        "Woody notes"
      ],
      "baseBn": [
        "মাস্ক",
        "উডি নোটস"
      ]
    },
    "longevity": "12-16 Hours",
    "longevityBn": "১২-১৬ ঘণ্টা পর্যন্ত স্থায়ী",
    "sillage": "Radiant & Glamorous",
    "sillageBn": "উজ্জ্বল ও মোহময় সুবাস",
    "origin": "VELLURE Artisanal Reserve",
    "originBn": "ভেল্যুর আর্টিশানাল রিজার্ভ ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Parties, shopping, girls' get-togethers & date nights",
    "bestWeather": "Spring & Early Summer",
    "seasons": [
      "Spring",
      "Summer"
    ]
  },
  {
    "id": "prod-baccarat-rouge",
    "slug": "baccarat-rouge",
    "name": "Vellure Baccarat Rouge",
    "nameBn": "ভ্যালুর বাকারাত রুজ",
    "category": "attar",
    "categoryBn": "খাঁটি আতর",
    "fragranceType": "Oriental",
    "shortDescription": "A luminous and sophisticated masterpiece. An airy, sweet, and woody floral scent settling like glowing amber on the skin.",
    "shortDescriptionBn": "আভিজাত্য আর স্নিগ্ধতার মাস্টারপিস। মিষ্টি, ফ্লোরাল এবং উডি এই সুবাস ত্বকে ছড়াবে জাদুকরী ও দীর্ঘস্থায়ী মুগ্ধতা।",
    "description": "A luminous and sophisticated masterpiece. An airy, sweet, and woody floral scent settling like glowing amber on the skin.",
    "descriptionBn": "আভিজাত্য আর স্নিগ্ধতার মাস্টারপিস। মিষ্টি, ফ্লোরাল এবং উডি এই সুবাস ত্বকে ছড়াবে জাদুকরী ও দীর্ঘস্থায়ী মুগ্ধতা।",
    "price3ml": 220,
    "price6ml": 400,
    "originalPrice3ml": 286,
    "originalPrice6ml": 520,
    "discount": 23,
    "stock": 50,
    "stock3ml": 25,
    "stock6ml": 25,
    "sku": "VLR-ATT-BCR01",
    "featured": true,
    "bestSeller": true,
    "newArrival": true,
    "rating": 5,
    "reviewsCount": 96,
    "images": [
      "/src/assets/images/product_vellure_baccarat_rouge_1.png",
      "/src/assets/images/product_vellure_baccarat_rouge_2.png",
      "/src/assets/images/product_vellure_baccarat_rouge_3.png"
    ],
    "notes": {
      "top": [
        "Saffron",
        "Jasmine"
      ],
      "topBn": [
        "জাফরান",
        "জুঁই"
      ],
      "heart": [
        "Amberwood",
        "Ambergris"
      ],
      "heartBn": [
        "অ্যাম্বারউড",
        "অ্যাম্বারগ্রিস"
      ],
      "base": [
        "Fir Resin",
        "Cedar"
      ],
      "baseBn": [
        "ফার রেজিন",
        "সিডারউড"
      ]
    },
    "longevity": "14-18 Hours",
    "longevityBn": "১৪-১৮ ঘণ্টা পর্যন্ত স্থায়ী",
    "sillage": "Magnetic & Prestigious",
    "sillageBn": "অসম্ভব আকর্ষণীয় ও আভিজাত্যপূর্ণ",
    "origin": "VELLURE Artisanal Reserve",
    "originBn": "ভেল্যুর আর্টিশানাল রিজার্ভ ব্লেন্ড",
    "alcoholFree": true,
    "bestFor": "Signature wear, high-end parties & special celebrations",
    "bestWeather": "Fall, Winter & Spring",
    "seasons": [
      "Autumn",
      "Winter",
      "Spring"
    ]
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  "whatsappNumber": "+880 1820-032330",
  "phone": "+880 1820-032330",
  "email": "concierge@vellurebd.com",
  "address": "Level 4, House 54, Road 11, Block D, Banani, Dhaka-1213, Bangladesh",
  "addressBn": "লেভেল ৪, হাউস ৫৪, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩, বাংলাদেশ",
  "facebook": "https://www.facebook.com/vellurefragrance/",
  "instagram": "https://www.instagram.com/vellure.fragrances/",
  "deliveryFeeDhaka": 70,
  "deliveryFeeOutside": 130,
  "freeDeliveryThreshold": 2000,
  "announcementTextEn": "Free Delivery on any combo",
  "announcementTextBn": "যে কোনো কম্বোতে ফ্রি ডেলিভারি!",
  "announcementBg": "emerald",
  "announcementSpeed": "relaxed",
  "telegramBotToken": "",
  "telegramChatId": "",
  "telegramNotifyAddToCart": true,
  "telegramNotifyNewOrder": true,
  "googleSheetId": "1C7BUzrO8G65qZKLrMgQfH6Okinv57gXdbCov2PjTaIA",
  "googleSheetName": "Vellure Fragrances - Inventory",
  "googleSheetEmail": "info.vellurefragrances@gmail.com",
  "googleSheetWebhookUrl": "https://script.google.com/macros/s/AKfycbyi2tSRCnHp2SV1XTMorD9miR0rV3CN1HPvVgCQeWOxNwDG11IxqnZdIdgEO2oawXe9sQ/exec",
  "googleSheetRange": "Vellure Fragrances - Inventory!A2:E",
  "googleSheetLastSync": "2026-10-11T17:12:07.182Z",
  "googleSheetSyncStatus": "connected",
  "googleSheetSyncMessage": "Live synchronized with Google Sheet (\"Vellure Fragrances - Inventory\"). 15 items active."
};
