export type FragranceCategory = 'attar' | 'gift_set' | string;
export type FragranceType = 'Oud' | 'Musk' | 'Oriental' | 'Woody' | 'Floral' | 'Amber' | 'Aquatic' | 'Fresh' | 'Sandalwood';

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  description?: string;
  descriptionBn?: string;
  count?: number;
}

export interface ProductNotes {
  top: string[];
  topBn?: string[];
  heart: string[];
  heartBn?: string[];
  base: string[];
  baseBn?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  category: FragranceCategory;
  categoryBn: string;
  fragranceType: FragranceType;
  shortDescription: string;
  shortDescriptionBn: string;
  description: string;
  descriptionBn: string;
  price3ml: number;
  price6ml: number;
  originalPrice3ml: number;
  originalPrice6ml: number;
  discount: number;
  stock: number;
  stock3ml?: number;
  stock6ml?: number;
  sku: string;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  notes: ProductNotes;
  longevity: string;
  longevityBn?: string;
  sillage: string;
  sillageBn?: string;
  origin: string;
  originBn?: string;
  alcoholFree: boolean;
  bestFor?: string;
  bestForBn?: string;
  bestWeather?: string;
  bestWeatherBn?: string;
  seasons?: string[];
  seasonsBn?: string[];
  includedItems?: string[];
  packaging?: string;
  packagingBn?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  nameBn: string;
  image: string;
  size: '3ml' | '6ml';
  price: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  nameBn?: string;
  image: string;
  size: '3ml' | '6ml';
  price: number;
  quantity: number;
}

export type OrderStatus = 'Order Received' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderTimeline {
  status: OrderStatus;
  time: string;
  note?: string;
}

export interface Order {
  id: string; // VLR-2026-000101
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  area: string;
  deliveryNote?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'online';
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  active: boolean;
}

export interface SiteSettings {
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  addressBn: string;
  facebook: string;
  instagram: string;
  deliveryFeeDhaka: number;
  deliveryFeeOutside: number;
  freeDeliveryThreshold: number;
  announcementTextEn: string;
  announcementTextBn: string;
  announcementBg?: string;
  announcementSpeed?: 'slow' | 'relaxed' | 'normal';
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramNotifyAddToCart?: boolean;
  telegramNotifyNewOrder?: boolean;
  metaPixelId?: string;
  ga4MeasurementId?: string;
  enableAnalytics?: boolean;
  googleSheetName?: string;
  googleSheetEmail?: string;
  googleSheetId?: string;
  googleSheetRange?: string;
  googleSheetWebhookUrl?: string;
  googleSheetSyncEnabled?: boolean;
  googleSheetLastSync?: string;
  googleSheetSyncStatus?: 'connected' | 'syncing' | 'error' | 'idle';
  googleSheetSyncMessage?: string;
}

export type Language = 'en' | 'bn';
