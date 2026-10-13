import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { GoogleSheetsInventoryPanel } from '../components/GoogleSheetsInventoryPanel';
import { Product, Order, OrderStatus, SiteSettings, Coupon } from '../types';
import { formatBDT } from '../utils/translations';
import { getEventCount, getAnalyticsEvents, AnalyticsEvent } from '../utils/analytics';
import {
  Shield,
  Lock,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Settings,
  Tag,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Save,
  AlertCircle,
  MessageCircle,
  Bell,
  Send,
  Layers,
  Image as ImageIcon,
  Upload,
  ExternalLink,
  Check,
  FileSpreadsheet,
  Sun,
  Snowflake,
  Sparkles,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';

import { resolveImage } from '../utils/resolveImage';

const PRESET_GALLERY_IMAGES_RAW = [
  { name: 'Oud Al Khaleej', url: '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg' },
  { name: 'Dark Knight', url: '/src/assets/images/product_dark_knight_1790357165463.jpg' },
  { name: 'Amber Oud', url: '/src/assets/images/product_amber_oud_1790357176335.jpg' },
  { name: 'Velvet Rose', url: '/src/assets/images/product_velvet_rose_1790357187126.jpg' },
  { name: 'Royal Leather', url: '/src/assets/images/product_royal_leather_1790357199464.jpg' },
  { name: 'Royal Sandal 6ml Flacon', url: '/src/assets/images/product_vellure_royal_sandal_6ml_official.jpg' },
  { name: 'VELLURE Royal Sandal 3ml', url: '/src/assets/images/product_vellure_royal_sandal_official.jpg' },
  { name: 'Royal Sandal Portrait Reserve', url: '/src/assets/images/product_vellure_royal_sandal_portrait.png' },
  { name: 'Vellure White Chandan 6ml', url: '/src/assets/images/product_vellure_white_chandan_6ml_official.jpg' },
  { name: 'Vellure White Chandan 3ml', url: '/src/assets/images/product_vellure_white_chandan_official.jpg' },
  { name: 'Vellure White Chandan Portrait', url: '/src/assets/images/product_vellure_white_chandan_portrait.png' },
  { name: 'Vellure Blue De Chanel Flacon 1', url: '/src/assets/images/product_vellure_blue_de_chanel_1.png' },
  { name: 'Vellure Blue De Chanel 6ml', url: '/src/assets/images/product_vellure_blue_de_chanel_6ml.png' },
  { name: 'Vellure Blue De Chanel Flacon 3', url: '/src/assets/images/product_vellure_blue_de_chanel_3.png' },
  { name: 'Vellure Armani Blue 3ml / Flacon 1', url: '/src/assets/images/product_vellure_armani_blue_1.jpg' },
  { name: 'Vellure Armani Blue 6ml', url: '/src/assets/images/product_vellure_armani_blue_6ml.jpg' },
  { name: 'Vellure Armani Blue Flacon 3', url: '/src/assets/images/product_vellure_armani_blue_3.jpg' },
  { name: 'Vellure Cool Water 3ml / Flacon 1', url: '/src/assets/images/product_vellure_cool_water_1.jpg' },
  { name: 'Vellure Cool Water 6ml', url: '/src/assets/images/product_vellure_cool_water_6ml.jpg' },
  { name: 'Vellure Cool Water Flacon 3', url: '/src/assets/images/product_vellure_cool_water_3.jpg' },
  { name: 'Vellure Acqua Digio 3ml / Flacon 1', url: '/src/assets/images/product_vellure_acqua_digio_1.jpg' },
  { name: 'Vellure Acqua Digio 6ml', url: '/src/assets/images/product_vellure_acqua_digio_6ml.jpg' },
  { name: 'Vellure Acqua Digio Flacon 3', url: '/src/assets/images/product_vellure_acqua_digio_3.jpg' },
  { name: 'Vellure Bombshell 3ml / Flacon 1', url: '/src/assets/images/product_vellure_bombshell_1.png' },
  { name: 'Vellure Bombshell 6ml', url: '/src/assets/images/product_vellure_bombshell_2.png' },
  { name: 'Vellure Bombshell Flacon 3', url: '/src/assets/images/product_vellure_bombshell_3.png' },
  { name: 'Vellure Vampire Blood 3ml / Flacon 1', url: '/src/assets/images/product_vellure_vampire_blood_1.jpg' },
  { name: 'Vellure Vampire Blood 6ml', url: '/src/assets/images/product_vellure_vampire_blood_2.jpg' },
  { name: 'Vellure Vampire Blood Flacon 3', url: '/src/assets/images/product_vellure_vampire_blood_3.jpg' },
  { name: 'Vellure Crismon 3ml / Flacon 1', url: '/src/assets/images/product_vellure_crismon_1.jpg' },
  { name: 'Vellure Crismon 6ml', url: '/src/assets/images/product_vellure_crismon_2.jpg' },
  { name: 'Vellure Crismon Flacon 3', url: '/src/assets/images/product_vellure_crismon_3.jpg' },
  { name: 'Vellure Desire Red 3ml / Flacon 1', url: '/src/assets/images/product_vellure_desire_red_1.jpg' },
  { name: 'Vellure Desire Red 6ml', url: '/src/assets/images/product_vellure_desire_red_2.jpg' },
  { name: 'Vellure Desire Red Flacon 3', url: '/src/assets/images/product_vellure_desire_red_3.jpg' },
  { name: 'Vellure Musk Safi 3ml / Flacon 1', url: '/src/assets/images/product_vellure_musk_safi_1.jpg' },
  { name: 'Vellure Musk Safi 6ml', url: '/src/assets/images/product_vellure_musk_safi_2.jpg' },
  { name: 'Vellure Musk Safi Flacon 3', url: '/src/assets/images/product_vellure_musk_safi_3.jpg' },
  { name: 'Vellure Rose Gold 3ml / Flacon 1', url: '/src/assets/images/product_vellure_rose_gold_1.jpg' },
  { name: 'Vellure Rose Gold 6ml', url: '/src/assets/images/product_vellure_rose_gold_2.jpg' },
  { name: 'Vellure Rose Gold Flacon 3', url: '/src/assets/images/product_vellure_rose_gold_3.jpg' },
  { name: 'Vellure Saffron Rose 3ml / Flacon 1', url: '/src/assets/images/product_vellure_saffron_rose_1.jpg' },
  { name: 'Vellure Saffron Rose 6ml', url: '/src/assets/images/product_vellure_saffron_rose_2.jpg' },
  { name: 'Vellure Saffron Rose Flacon 3', url: '/src/assets/images/product_vellure_saffron_rose_3.jpg' },
  { name: 'Vellure Royal Oud 3ml / Flacon 1', url: '/src/assets/images/product_vellure_royal_oud_1.jpg' },
  { name: 'Vellure Royal Oud 6ml', url: '/src/assets/images/product_vellure_royal_oud_2.png' },
  { name: 'Vellure Royal Oud Flacon 3', url: '/src/assets/images/product_vellure_royal_oud_3.jpg' },
  { name: 'Vellure Baccarat Rouge 3ml / Flacon 1', url: '/src/assets/images/product_vellure_baccarat_rouge_1.png' },
  { name: 'Vellure Baccarat Rouge 6ml', url: '/src/assets/images/product_vellure_baccarat_rouge_2.png' },
  { name: 'Vellure Baccarat Rouge Flacon 3', url: '/src/assets/images/product_vellure_baccarat_rouge_3.png' },
  { name: 'Imperial Sandalwood', url: '/src/assets/images/product_vellure_royal_sandal_1790802312562.jpg' },
  { name: 'Musk Supreme', url: '/src/assets/images/product_musk_supreme_1790357220268.jpg' },
  { name: 'Golden Amber Bottle', url: '/src/assets/images/fragrance_bottle_feature_1790357242137.jpg' }
];

const PRESET_GALLERY_IMAGES = PRESET_GALLERY_IMAGES_RAW.map(item => ({
  ...item,
  url: resolveImage(item.url)
}));


export const AdminDashboard: React.FC = () => {
  const {
    adminToken,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    products,
    refreshProducts,
    categories,
    refreshCategories,
    settings,
    refreshSettings,
    language
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active admin tab: 'overview' | 'orders' | 'products' | 'categories' | 'seasons' | 'sheets' | 'coupons' | 'settings'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'seasons' | 'sheets' | 'coupons' | 'settings'>('overview');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Seasonal guide filter and inline update state
  const [seasonTableFilter, setSeasonTableFilter] = useState<string>('all');
  const [seasonTableSearch, setSeasonTableSearch] = useState<string>('');
  const [updatingProductSeasonId, setUpdatingProductSeasonId] = useState<string | null>(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Image upload state for product modal
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);

  // Category management state
  const [newCatName, setNewCatName] = useState('');
  const [newCatNameBn, setNewCatNameBn] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState('');
  const [catErrorMsg, setCatErrorMsg] = useState('');

  // Inline quick-add category in Product modal
  const [showInlineAddCat, setShowInlineAddCat] = useState(false);
  const [inlineCatName, setInlineCatName] = useState('');
  const [inlineCatNameBn, setInlineCatNameBn] = useState('');

  // Product form data
  const [productForm, setProductForm] = useState({
    name: '',
    nameBn: '',
    category: 'attar',
    categoryBn: 'আতর',
    fragranceType: 'Oud',
    shortDescription: '',
    shortDescriptionBn: '',
    description: '',
    descriptionBn: '',
    price3ml: 700,
    price6ml: 1250,
    originalPrice3ml: 900,
    originalPrice6ml: 1600,
    stock: 50,
    sku: 'VLR-ATT-NEW',
    discount: 20,
    featured: true,
    bestSeller: false,
    newArrival: true,
    alcoholFree: true,
    topNotes: 'Persian Saffron, Bergamot',
    heartNotes: 'Agarwood, Damask Rose',
    baseNotes: 'Smoky Amber, Mysore Sandalwood',
    images: '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
    galleryImages: [] as string[],
    seasons: ['All-Season'] as string[],
    bestWeather: '',
    bestWeatherBn: '',
    bestFor: '',
    bestForBn: ''
  });

  // Additional Gallery Images State for Product Form
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState('');
  const [showGalleryPresets, setShowGalleryPresets] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      const res = await fetch('/api/notifications/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: settingsForm.telegramBotToken,
          chatId: settingsForm.telegramChatId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramTestResult({
          success: true,
          message: 'Success! Test notification was delivered to your Telegram.'
        });
      } else {
        setTelegramTestResult({
          success: false,
          message: data.error || 'Failed to send test notification. Check token & chat ID.'
        });
      }
    } catch {
      setTelegramTestResult({
        success: false,
        message: 'Network error connecting to Telegram service.'
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  // Engagement Analytics State
  const [whatsappClicks, setWhatsappClicks] = useState<number>(() => getEventCount('whatsapp_click'));
  const [recentAnalytics, setRecentAnalytics] = useState<AnalyticsEvent[]>(() => getAnalyticsEvents());

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1000);

  // Load orders and coupons when authenticated
  const fetchOrders = async () => {
    if (!adminToken) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCoupons = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/coupons', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
      fetchCoupons();
      setSettingsForm(settings);
    }

    const handleAnalyticsUpdate = () => {
      setWhatsappClicks(getEventCount('whatsapp_click'));
      setRecentAnalytics(getAnalyticsEvents());
    };

    window.addEventListener('vellure_analytics', handleAnalyticsUpdate);
    return () => window.removeEventListener('vellure_analytics', handleAnalyticsUpdate);
  }, [isAdminAuthenticated, adminToken, settings]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const res = await loginAdmin(passwordInput);
    setLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    } else {
      setPasswordInput('');
    }
  };

  // Status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          note: `Status updated by Admin to ${status}`
        })
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          const updated = await res.json();
          setSelectedOrder(updated.order);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Inline toggle single season on a product with instant auto-save
  const handleToggleProductSeason = async (prod: Product, seasonToToggle: string) => {
    setUpdatingProductSeasonId(prod.id);
    const current = prod.seasons || [];
    let updated: string[];
    if (current.includes(seasonToToggle)) {
      updated = current.filter((s) => s !== seasonToToggle);
      if (updated.length === 0) {
        updated = ['All-Season'];
      }
    } else {
      updated = [...current, seasonToToggle];
    }

    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          seasons: updated
        })
      });
      if (res.ok) {
        await refreshProducts();
      }
    } catch (e) {
      console.error('Failed to update season:', e);
    } finally {
      setUpdatingProductSeasonId(null);
    }
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setImageUploadError('');
    setShowGalleryPicker(false);
    setShowInlineAddCat(false);
    setProductForm({
      name: prod.name,
      nameBn: prod.nameBn,
      category: prod.category,
      categoryBn: prod.categoryBn,
      fragranceType: prod.fragranceType,
      shortDescription: prod.shortDescription,
      shortDescriptionBn: prod.shortDescriptionBn || prod.shortDescription,
      description: prod.description,
      descriptionBn: prod.descriptionBn || prod.description,
      price3ml: prod.price3ml,
      price6ml: prod.price6ml,
      originalPrice3ml: prod.originalPrice3ml,
      originalPrice6ml: prod.originalPrice6ml,
      stock: prod.stock,
      sku: prod.sku,
      discount: prod.discount,
      featured: prod.featured,
      bestSeller: prod.bestSeller,
      newArrival: prod.newArrival,
      alcoholFree: prod.alcoholFree,
      topNotes: prod.notes.top.join(', '),
      heartNotes: prod.notes.heart.join(', '),
      baseNotes: prod.notes.base.join(', '),
      images: prod.images[0] || '',
      galleryImages: prod.images.slice(1) || [],
      seasons: prod.seasons && prod.seasons.length > 0 ? prod.seasons : ['All-Season'],
      bestWeather: prod.bestWeather || '',
      bestWeatherBn: prod.bestWeatherBn || '',
      bestFor: prod.bestFor || '',
      bestForBn: prod.bestForBn || ''
    });
    setNewGalleryImageUrl('');
    setGalleryUploadError('');
    setShowGalleryPresets(false);
    setIsProductModalOpen(true);
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setImageUploadError('');
    setGalleryUploadError('');
    setNewGalleryImageUrl('');
    setShowGalleryPicker(false);
    setShowGalleryPresets(false);
    setShowInlineAddCat(false);
    const defaultCat = categories.length > 0 ? categories[0].slug : 'attar';
    const defaultCatBn = categories.length > 0 ? categories[0].nameBn : 'আতর';
    setProductForm({
      name: '',
      nameBn: '',
      category: defaultCat,
      categoryBn: defaultCatBn,
      fragranceType: 'Aquatic',
      shortDescription: '',
      shortDescriptionBn: '',
      description: '',
      descriptionBn: '',
      price3ml: 220,
      price6ml: 400,
      originalPrice3ml: 286,
      originalPrice6ml: 520,
      stock: 50,
      sku: `VLR-ATT-${Date.now().toString().slice(-4)}`,
      discount: 23,
      featured: true,
      bestSeller: false,
      newArrival: true,
      alcoholFree: true,
      topNotes: 'Calabrian Bergamot, Marine Ozone',
      heartNotes: 'Rosemary, White Jasmine',
      baseNotes: 'Patchouli, Mineral Amber, Cedar',
      images: '/src/assets/images/product_vellure_cool_water_1.jpg',
      galleryImages: [],
      seasons: ['Summer', 'Monsoon'],
      bestWeather: 'High Summer and Humid Weather',
      bestWeatherBn: 'প্রচণ্ড গরম ও আর্দ্র আবহাওয়ায়',
      bestFor: 'Daily casual wear & campus',
      bestForBn: 'দৈনন্দিন ব্যবহার ও আড্ডা'
    });
    setIsProductModalOpen(true);
  };

  // Handle local image file upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError('');
    setUploadingImage(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      // Instant preview
      setProductForm((prev) => ({ ...prev, images: base64Data }));

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          setProductForm((prev) => ({ ...prev, images: data.url }));
        } else {
          setImageUploadError(data.error || 'ছবি সার্ভারে আপলোড ব্যর্থ হয়েছে');
        }
      } catch (err: any) {
        setImageUploadError('সার্ভারে ছবি পাঠাতে সমস্যা হয়েছে: ' + (err.message || 'Network error'));
      } finally {
        setUploadingImage(false);
      }
    };
    reader.onerror = () => {
      setImageUploadError('ফাইল পড়তে সমস্যা হয়েছে');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Add single image URL to gallery
  const handleAddGalleryUrl = () => {
    const url = newGalleryImageUrl.trim();
    if (!url) return;
    setProductForm((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), url]
    }));
    setNewGalleryImageUrl('');
  };

  // Remove single image from gallery
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setProductForm((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Promote gallery image to primary cover
  const handleMakePrimaryImage = (indexToPromote: number) => {
    const currentPrimary = productForm.images;
    const selected = (productForm.galleryImages || [])[indexToPromote];
    if (!selected) return;
    const newGallery = (productForm.galleryImages || []).filter((_, idx) => idx !== indexToPromote);
    if (currentPrimary && currentPrimary !== selected) {
      newGallery.unshift(currentPrimary);
    }
    setProductForm((prev) => ({
      ...prev,
      images: selected,
      galleryImages: newGallery
    }));
  };

  // Multi-file upload for gallery images
  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGalleryImages(true);
    setGalleryUploadError('');

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name
            })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            uploadedUrls.push(data.url);
          } else {
            console.error('Gallery image upload notice:', data);
          }
        } catch (fetchErr) {
          console.error('Upload network error:', fetchErr);
        }
      }

      if (uploadedUrls.length > 0) {
        setProductForm((prev) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...uploadedUrls]
        }));
      } else {
        setGalleryUploadError('ছবি আপলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setGalleryUploadError('গ্যালারি ছবি আপলোড ব্যর্থ: ' + (err.message || 'Error'));
    } finally {
      setUploadingGalleryImages(false);
      e.target.value = '';
    }
  };

  // Add preset photo to gallery
  const handleAddPresetToGallery = (presetUrl: string) => {
    setProductForm((prev) => {
      const exists = (prev.galleryImages || []).includes(presetUrl) || prev.images === presetUrl;
      if (exists) return prev;
      return {
        ...prev,
        galleryImages: [...(prev.galleryImages || []), presetUrl]
      };
    });
  };

  // Create Category Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatErrorMsg('');
    setCatSuccessMsg('');
    if (!newCatName.trim()) {
      setCatErrorMsg('Category name is required');
      return;
    }

    setCreatingCategory(true);
    const slug = newCatSlug.trim()
      ? newCatSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-')
      : newCatName.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          nameBn: newCatNameBn.trim() || newCatName.trim(),
          slug,
          description: newCatDesc.trim()
        })
      });

      if (res.ok) {
        await refreshCategories();
        setCatSuccessMsg('Category added successfully! নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে।');
        setNewCatName('');
        setNewCatNameBn('');
        setNewCatSlug('');
        setNewCatDesc('');
        setTimeout(() => setCatSuccessMsg(''), 4000);
      } else {
        const err = await res.json();
        setCatErrorMsg(err.error || 'Failed to add category');
      }
    } catch (err: any) {
      setCatErrorMsg(err.message || 'Error adding category');
    } finally {
      setCreatingCategory(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId: string, catSlug: string) => {
    if (catSlug === 'attar') {
      alert('The core Attar (আতর) category cannot be removed.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this category? Products in this category will keep their tags.')) return;
    try {
      const res = await fetch(`/api/categories/${catId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await refreshCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Inline Category Add in Product Modal
  const handleQuickAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineCatName.trim()) return;
    const slug = inlineCatName.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: inlineCatName.trim(),
          nameBn: inlineCatNameBn.trim() || inlineCatName.trim(),
          slug
        })
      });
      if (res.ok) {
        await refreshCategories();
        setProductForm((prev) => ({
          ...prev,
          category: slug,
          categoryBn: inlineCatNameBn.trim() || inlineCatName.trim()
        }));
        setInlineCatName('');
        setInlineCatNameBn('');
        setShowInlineAddCat(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCategory = categories.find(
      (c) => c.slug === productForm.category || c.id === productForm.category
    );
    const categoryBn = matchedCategory ? matchedCategory.nameBn : (productForm.categoryBn || 'আতর');

    const payload = {
      name: productForm.name,
      nameBn: productForm.nameBn || productForm.name,
      category: productForm.category,
      categoryBn: categoryBn,
      fragranceType: productForm.fragranceType,
      shortDescription: productForm.shortDescription,
      shortDescriptionBn: productForm.shortDescriptionBn || productForm.shortDescription,
      description: productForm.description,
      descriptionBn: productForm.descriptionBn || productForm.description,
      price3ml: Number(productForm.price3ml),
      price6ml: Number(productForm.price6ml),
      originalPrice3ml: Number(productForm.originalPrice3ml),
      originalPrice6ml: Number(productForm.originalPrice6ml),
      stock: Number(productForm.stock),
      sku: productForm.sku,
      discount: Number(productForm.discount),
      featured: Boolean(productForm.featured),
      bestSeller: Boolean(productForm.bestSeller),
      newArrival: Boolean(productForm.newArrival),
      alcoholFree: Boolean(productForm.alcoholFree),
      notes: {
        top: productForm.topNotes.split(',').map((s) => s.trim()),
        heart: productForm.heartNotes.split(',').map((s) => s.trim()),
        base: productForm.baseNotes.split(',').map((s) => s.trim())
      },
      images: Array.from(new Set([
        (productForm.images || '').trim() || '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg',
        ...(productForm.galleryImages || []).map((img) => img.trim()).filter((img) => img.length > 0)
      ])),
      seasons: productForm.seasons && productForm.seasons.length > 0 ? productForm.seasons : ['All-Season'],
      bestWeather: productForm.bestWeather,
      bestWeatherBn: productForm.bestWeatherBn,
      bestFor: productForm.bestFor,
      bestForBn: productForm.bestForBn
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await refreshProducts();
        setIsProductModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fragrance?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        refreshProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        await refreshSettings();
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Add Coupon
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          code: newCouponCode,
          discountType: newCouponType,
          discountValue: newCouponDiscount,
          minOrder: newCouponMinOrder,
          active: true
        })
      });
      if (res.ok) {
        setNewCouponCode('');
        fetchCoupons();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Overview stats calculation
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Order Received' || o.status === 'Processing').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // If not authenticated, render secure login view
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#121116] border border-[#26242E] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-1">
              <Logo variant="footer" className="items-center" />
            </div>
            <p className="text-xs text-[#8E8B83]">
              Restricted management console for product & dispatch operations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C5A059] font-medium mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A7771] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-[#18171D] border border-[#2B2932] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F3EFEA] focus:outline-none placeholder-[#66635D]"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#0B0B0C] text-xs font-bold uppercase tracking-[0.16em] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              {loggingIn ? 'Authenticating...' : 'Enter Atelier Console'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-[#706D67]">
            <span>Secured with server-side environment authentication.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo variant="header" />
          <div className="h-10 w-px bg-[#26242E] hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#D4AF37] uppercase tracking-widest font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Master Atelier Operations</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl text-[#F3EFEA] mt-0.5">
              Management Console
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchOrders();
              refreshProducts();
              refreshCategories();
              refreshSettings();
            }}
            className="p-2.5 bg-[#18171D] hover:bg-[#222129] border border-[#2B2932] text-[#A8A49C] hover:text-white rounded-xl transition-colors text-xs flex items-center gap-1.5"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="py-2.5 px-4 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#23222A]">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Fragrances (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'seasons', label: `Seasonal Guide / ঋতুভিত্তিক (${products.filter(p => p.category === 'attar').length})`, icon: Sun },
          { id: 'sheets', label: 'Live Inventory (Google Sheet)', icon: FileSpreadsheet },
          { id: 'coupons', label: 'Vouchers & Coupons', icon: Tag },
          { id: 'settings', label: 'Storefront Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#D4AF37] text-[#0B0B0C] shadow-md'
                  : 'text-[#8E8B83] hover:text-white hover:bg-[#16151B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key metrics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#121116] border border-[#23222A] p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8E8B83] font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span>Total Revenue</span>
              </span>
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#F3EFEA]">
                {formatBDT(totalSales)}
              </div>
              <span className="text-[11px] text-emerald-400">Cash on Delivery & bKash</span>
            </div>

            <div className="bg-[#121116] border border-[#23222A] p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8E8B83] font-medium flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Total Orders</span>
              </span>
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#F3EFEA]">
                {orders.length}
              </div>
              <span className="text-[11px] text-[#A8A49C]">All time dispatches</span>
            </div>

            <div className="bg-[#121116] border border-[#23222A] p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8E8B83] font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pending Orders</span>
              </span>
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-amber-400">
                {pendingOrders}
              </div>
              <span className="text-[11px] text-[#A8A49C]">Needs packaging/dispatch</span>
            </div>

            <div className="bg-[#121116] border border-[#23222A] p-5 sm:p-6 rounded-2xl space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#8E8B83] font-medium flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#D4AF37]" />
                <span>Active Products</span>
              </span>
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-[#F3EFEA]">
                {products.length}
              </div>
              <span className="text-[11px] text-[#A8A49C]">Pure Attar inventory</span>
            </div>

            <div className="bg-[#121116] border border-[#23222A] p-5 sm:p-6 rounded-2xl space-y-2 col-span-2 lg:col-span-1">
              <span className="text-xs uppercase tracking-wider text-[#8E8B83] font-medium flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Clicks</span>
              </span>
              <div className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-emerald-400">
                {whatsappClicks}
              </div>
              <span className="text-[11px] text-[#A8A49C]">Live inquiry engagement</span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#23222A]">
              <h2 className="font-serif text-lg text-[#F3EFEA]">Recent Consignments</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#23222A] text-[#8E8B83] uppercase tracking-wider">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">City</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1C22]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#18171D]">
                      <td className="py-3 px-2 font-mono font-bold text-[#D4AF37]">{ord.id}</td>
                      <td className="py-3 px-2 font-medium text-white">{ord.customerName}</td>
                      <td className="py-3 px-2 text-[#9E9B93]">{ord.city}</td>
                      <td className="py-3 px-2 font-mono tabular-nums text-white">
                        {formatBDT(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 bg-[#1F1E26] rounded text-[11px] text-[#E5C378]">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveTab('orders');
                          }}
                          className="text-[#D4AF37] hover:underline"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engagement & Marketing Activity */}
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#23222A]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <h2 className="font-serif text-lg text-[#F3EFEA]">WhatsApp Engagement Analytics</h2>
              </div>
              <span className="text-xs text-[#8E8B83] font-mono">
                {whatsappClicks} Total Recorded Inquiries
              </span>
            </div>

            {recentAnalytics.filter(e => e.name === 'whatsapp_click').length === 0 ? (
              <p className="text-xs text-[#7A7771] py-4 text-center">
                No WhatsApp clicks logged yet. Click the floating WhatsApp button to register mock analytics events.
              </p>
            ) : (
              <div className="divide-y divide-[#1D1C22]">
                {recentAnalytics.filter(e => e.name === 'whatsapp_click').slice(0, 5).map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <div>
                        <span className="font-mono text-[#D4AF37] font-semibold">whatsapp_click</span>
                        <span className="text-[#8E8B83] ml-2">via Floating Concierge</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[#8E8B83] text-[11px] font-mono">
                      <span>{new Date(evt.timestamp).toLocaleTimeString()} · {new Date(evt.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#8E8B83] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID, customer name or phone..."
                  className="w-full bg-[#141318] border border-[#2B2932] text-xs text-[#F3EFEA] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="admin-order-status-filter" className="text-xs text-[#8E8B83]">Status Filter:</label>
              <select
                id="admin-order-status-filter"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-[#141318] border border-[#2B2932] text-xs text-[#E5E0D8] py-2 px-3 rounded-lg focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="Order Received">Order Received</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Orders Table (col-span-8) */}
            <div className="lg:col-span-8 bg-[#121116] border border-[#23222A] rounded-2xl p-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#23222A] text-[#8E8B83] uppercase tracking-wider">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Mobile</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1D24]">
                  {filteredOrders.map((ord) => (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`hover:bg-[#18171E] cursor-pointer ${
                        selectedOrder?.id === ord.id ? 'bg-[#1C1B24]' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-mono font-bold text-[#D4AF37]">{ord.id}</td>
                      <td className="py-3 px-2 font-medium text-white">{ord.customerName}</td>
                      <td className="py-3 px-2 font-mono text-[#A8A49C]">{ord.phone}</td>
                      <td className="py-3 px-2 font-mono tabular-nums text-white">
                        {formatBDT(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 bg-[#23222C] text-[#D4AF37] rounded text-[11px] font-medium">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(ord);
                          }}
                          className="p-1 hover:text-[#D4AF37] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Order Details Panel (col-span-4) */}
            <div className="lg:col-span-4 bg-[#121116] border border-[#23222A] rounded-2xl p-6 space-y-5">
              {selectedOrder ? (
                <>
                  <div className="pb-3 border-b border-[#23222A] flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8E8B83]">
                        Order Selected
                      </span>
                      <h3 className="font-mono text-xl font-bold text-[#D4AF37]">
                        {selectedOrder.id}
                      </h3>
                    </div>
                    <span className="text-xs text-[#8E8B83]">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Dropdown Changer */}
                  <div className="space-y-1.5">
                    <label htmlFor="admin-change-order-status" className="text-xs uppercase tracking-wider text-[#C5A059] font-medium block">
                      Change Status:
                    </label>
                    <select
                      id="admin-change-order-status"
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)
                      }
                      className="w-full bg-[#18171D] border border-[#2B2932] text-xs text-[#F3EFEA] py-2 px-3 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Order Received">Order Received</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-1 text-xs text-[#A8A49C]">
                    <span className="font-semibold text-white block">Client Information:</span>
                    <p className="text-white">{selectedOrder.customerName}</p>
                    <p className="font-mono">{selectedOrder.phone}</p>
                    {selectedOrder.email && <p>{selectedOrder.email}</p>}
                    <p className="text-[#9E9B93] pt-1">{selectedOrder.address}, {selectedOrder.city}</p>
                    {selectedOrder.deliveryNote && (
                      <p className="text-amber-300 italic pt-1">Note: {selectedOrder.deliveryNote}</p>
                    )}
                  </div>

                  {/* Order items */}
                  <div className="space-y-2 pt-2 border-t border-[#23222A] text-xs">
                    <span className="font-semibold text-white block">Order Items:</span>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[#B8B4AC]">
                          <span>{it.name} ({it.size}) × {it.quantity}</span>
                          <span className="font-mono tabular-nums text-white">
                            {formatBDT(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1 pt-2 border-t border-[#23222A] text-xs">
                    <div className="flex justify-between text-[#8E8B83]">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">{formatBDT(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#8E8B83]">
                      <span>Delivery Fee:</span>
                      <span className="font-mono text-white">{formatBDT(selectedOrder.deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-[#F3EFEA] pt-1 border-t border-[#23222A]">
                      <span>Total:</span>
                      <span className="font-mono text-[#D4AF37]">{formatBDT(selectedOrder.totalAmount)}</span>
                    </div>
                    <p className="text-[11px] text-[#A8A49C] pt-1">
                      Payment Method: {selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-[#7A7771]">
                  Select an order from the table to view full details and update dispatch tracking.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#F3EFEA]">
              Fragrance Reserve Catalog ({products.length})
            </h2>

            <button
              onClick={handleOpenAddProduct}
              className="py-2.5 px-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fragrance</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-[#121116] border border-[#23222A] rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-xl bg-[#18171E] shrink-0"
                    />
                    <div>
                      <h3 className="font-serif text-base text-[#F3EFEA] font-semibold">{p.name}</h3>
                      <p className="text-xs text-[#D4AF37]">{p.nameBn}</p>
                      <span className="text-[10px] text-[#8E8B83] font-mono">{p.sku}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#9E9B93] line-clamp-2">{p.shortDescription}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#23222A]">
                    <div>
                      <span className="text-[#7A7771] block">3ml Price:</span>
                      <span className="font-mono text-white font-medium">{formatBDT(p.price3ml)}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7771] block">6ml Price:</span>
                      <span className="font-mono text-white font-medium">{formatBDT(p.price6ml)}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7771] block">Stock:</span>
                      <span className="font-mono text-white">{p.stock} units</span>
                    </div>
                    <div>
                      <span className="text-[#7A7771] block">Family:</span>
                      <span className="text-[#D4AF37]">{p.fragranceType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#23222A]">
                  <button
                    onClick={() => handleOpenEditProduct(p)}
                    className="py-1.5 px-3 bg-[#1A1920] hover:bg-[#25242D] border border-[#2D2B35] text-xs text-[#F3EFEA] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="py-1.5 px-3 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-xs text-red-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3b. CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#F3EFEA]">
                Product Categories / পণ্যের ক্যাটাগরি ({categories.length})
              </h2>
              <p className="text-xs text-[#8E8B83] mt-1">
                Manage your fragrance categories. Any new category added here will instantly appear in the shop catalog filter and product creator.
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <form
            onSubmit={handleCreateCategory}
            className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4 max-w-3xl"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                Add New Category / নতুন ক্যাটাগরি যুক্ত করুন
              </h3>
            </div>

            {catSuccessMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{catSuccessMsg}</span>
              </div>
            )}

            {catErrorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{catErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-medium mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Combo Offers, Artisanal Reserve, Musk"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C5A059] font-medium mb-1">
                  ক্যাটাগরির নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={newCatNameBn}
                  onChange={(e) => setNewCatNameBn(e.target.value)}
                  placeholder="যেমন: কম্বো অফার, স্পেশাল আতর, মাস্ক"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] font-medium mb-1">
                  URL Slug (Auto-generated or custom)
                </label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. combo-offers"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] font-medium mb-1">
                  Description / বিবরণ (Optional)
                </label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Exclusive gift sets & value combos"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={creatingCategory}
                className="py-2.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#0B0B0C] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{creatingCategory ? 'Creating Category...' : 'Create New Category'}</span>
              </button>
            </div>
          </form>

          {/* Active Categories Cards */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#8E8B83] font-semibold">
              Current Categories List ({categories.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug || p.category === cat.id).length;
                const isCoreAttar = cat.slug === 'attar';
                return (
                  <div
                    key={cat.id}
                    className="bg-[#121116] border border-[#23222A] p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#D4AF37]/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
                          {cat.slug}
                        </span>
                        <span className="text-xs font-mono text-[#A8A49C] bg-[#1A1920] px-2 py-0.5 rounded-md">
                          {count} {count === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg text-white font-semibold flex items-baseline gap-2">
                        <span>{cat.name}</span>
                        {cat.nameBn && (
                          <span className="text-sm font-sans text-[#D4AF37] font-normal">
                            ({cat.nameBn})
                          </span>
                        )}
                      </h4>
                      {cat.description && (
                        <p className="text-xs text-[#8E8B83] line-clamp-2">{cat.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#23222A] text-xs text-[#7A7771]">
                      <span>{isCoreAttar ? 'Primary Core Category' : 'Storefront Category'}</span>
                      {!isCoreAttar && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.slug)}
                          className="py-1 px-2.5 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-red-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3c. SEASONAL ATTARS MANAGEMENT TAB */}
      {activeTab === 'seasons' && (
        <div className="space-y-8 animate-fade-in">
          {/* Header & Stats Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#23222A]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sun className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-xl sm:text-2xl text-[#F3EFEA]">
                  Seasonal Attars Guide & Suitability Table / ঋতুভিত্তিক আতর ব্যবস্থাপনা
                </h2>
              </div>
              <p className="text-xs text-[#A8A49C]">
                কোন ঋতু ও আবহাওয়ায় কোন আতরটি ব্যবহার উপযোগী তা পরিচালনা করুন। এখানে পরিবর্তন করলে তা স্বয়ংক্রিয়ভাবে নেভিগেশন সাবমেনু ও শপ ফিল্টারে যুক্ত হবে।
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="py-2.5 px-4 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Fragrance / নতুন আতর যুক্ত করুন</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#14131A] border border-amber-500/20 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E8B83] block">Summer / Monsoon</span>
                <span className="font-serif text-lg text-[#F3EFEA] font-semibold">
                  {products.filter((p) => p.category === 'attar' && (p.seasons?.includes('Summer') || p.seasons?.includes('Monsoon'))).length}
                </span>
                <span className="text-[10px] text-amber-400 block">গ্রীষ্ম ও বর্ষা</span>
              </div>
            </div>

            <div className="p-4 bg-[#14131A] border border-sky-500/20 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                <Snowflake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E8B83] block">Winter / Cool</span>
                <span className="font-serif text-lg text-[#F3EFEA] font-semibold">
                  {products.filter((p) => p.category === 'attar' && (p.seasons?.includes('Winter') || p.seasons?.includes('Autumn'))).length}
                </span>
                <span className="text-[10px] text-sky-400 block">শীত ও হেমন্ত</span>
              </div>
            </div>

            <div className="p-4 bg-[#14131A] border border-[#D4AF37]/20 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E8B83] block">All-Season Wear</span>
                <span className="font-serif text-lg text-[#F3EFEA] font-semibold">
                  {products.filter((p) => p.category === 'attar' && (p.seasons?.includes('All-Season') || !p.seasons?.length)).length}
                </span>
                <span className="text-[10px] text-[#D4AF37] block">সারাবছর উপযোগী</span>
              </div>
            </div>

            <div className="p-4 bg-[#14131A] border border-[#2B2932] rounded-2xl flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#222129] text-[#E5C378]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8E8B83] block">Total Fragrances</span>
                <span className="font-serif text-lg text-[#F3EFEA] font-semibold">
                  {products.filter((p) => p.category === 'attar').length}
                </span>
                <span className="text-[10px] text-[#8E8B83] block">মোট আতর</span>
              </div>
            </div>
          </div>

          {/* Search and Season Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#131218] p-3 rounded-2xl border border-[#24222E]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E8B83] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attar by English or Bangla name, SKU..."
                value={seasonTableSearch}
                onChange={(e) => setSeasonTableSearch(e.target.value)}
                className="w-full bg-[#1A1921] border border-[#2D2B36] pl-9 pr-3 py-2 text-xs text-white rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C5A059]" />
              <select
                value={seasonTableFilter}
                onChange={(e) => setSeasonTableFilter(e.target.value)}
                className="bg-[#1A1921] border border-[#2D2B36] text-xs text-[#E5C378] py-2 px-3 rounded-xl focus:outline-none focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="all">All Seasons (সকল ঋতু)</option>
                <option value="Summer">Summer (গ্রীষ্মকাল)</option>
                <option value="Monsoon">Monsoon (বর্ষাকাল)</option>
                <option value="Winter">Winter (শীতকাল)</option>
                <option value="Autumn">Autumn (হেমন্ত/শরৎ)</option>
                <option value="Spring">Spring (বসন্তকাল)</option>
                <option value="All-Season">All-Season (সারাবছর)</option>
              </select>
            </div>
          </div>

          {/* Seasonal Management Table */}
          <div className="bg-[#121116] border border-[#222129] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#17161E] border-b border-[#23222A] text-[#C5A059] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Fragrance / আতর</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-4 min-w-[320px]">
                      Suitable Seasons / উপযোগী ঋতু (Click to Toggle)
                    </th>
                    <th className="py-3 px-4 min-w-[220px]">Best Weather / আবহাওয়া</th>
                    <th className="py-3 px-4 min-w-[220px]">Best For / কোথায় ব্যবহার</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1E26]">
                  {products
                    .filter((p) => p.category === 'attar')
                    .filter((p) => {
                      if (!seasonTableSearch.trim()) return true;
                      const q = seasonTableSearch.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        p.nameBn.includes(q) ||
                        p.sku.toLowerCase().includes(q)
                      );
                    })
                    .filter((p) => {
                      if (seasonTableFilter === 'all') return true;
                      return (
                        p.seasons?.includes(seasonTableFilter) ||
                        p.bestWeather?.toLowerCase().includes(seasonTableFilter.toLowerCase())
                      );
                    })
                    .map((prod) => {
                      const seasonsList = prod.seasons || ['All-Season'];
                      const isSavingThis = updatingProductSeasonId === prod.id;

                      const seasonOptions = [
                        { key: 'Summer', label: 'গ্রীষ্ম (Summer)', color: 'amber' },
                        { key: 'Monsoon', label: 'বর্ষা (Monsoon)', color: 'teal' },
                        { key: 'Winter', label: 'শীত (Winter)', color: 'sky' },
                        { key: 'Autumn', label: 'হেমন্ত (Autumn)', color: 'orange' },
                        { key: 'Spring', label: 'বসন্ত (Spring)', color: 'emerald' },
                        { key: 'All-Season', label: 'সারাবছর (All-Season)', color: 'gold' }
                      ];

                      return (
                        <tr key={prod.id} className="hover:bg-[#16151D] transition-colors">
                          {/* Fragrance Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0] || '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg'}
                                alt={prod.name}
                                className="w-11 h-11 rounded-lg object-cover border border-[#2D2B35] shrink-0"
                              />
                              <div>
                                <h4 className="font-serif font-semibold text-[#F3EFEA] text-sm leading-tight">
                                  {prod.name}
                                </h4>
                                <span className="text-[11px] text-[#A8A49C] block mt-0.5">
                                  {prod.nameBn}
                                </span>
                                <span className="text-[10px] font-mono text-[#7A7771]">
                                  {prod.sku}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Scent Type */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1F1E27] text-[#D2CFC8] border border-[#2C2B36]">
                              {prod.fragranceType}
                            </span>
                          </td>

                          {/* Clickable Seasons Toggle Grid */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {seasonOptions.map((opt) => {
                                const isSelected = seasonsList.includes(opt.key);
                                return (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    disabled={isSavingThis}
                                    onClick={() => handleToggleProductSeason(prod, opt.key)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#D4AF37]/20 text-[#E5C378] border border-[#D4AF37]/60 shadow-sm font-semibold'
                                        : 'bg-[#181720] text-[#7A7771] border border-[#262530] hover:text-[#C5BFB5] hover:border-[#383745]'
                                    }`}
                                    title={`Click to ${isSelected ? 'remove' : 'add'} ${opt.key}`}
                                  >
                                    {isSelected ? (
                                      <CheckSquare className="w-3 h-3 text-[#D4AF37]" />
                                    ) : (
                                      <Square className="w-3 h-3 opacity-40" />
                                    )}
                                    <span>{opt.label}</span>
                                  </button>
                                );
                              })}
                              {isSavingThis && (
                                <span className="text-[10px] text-[#D4AF37] animate-pulse ml-1">
                                  Saving...
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Best Weather */}
                          <td className="py-3.5 px-4 text-[11px]">
                            {prod.bestWeatherBn || prod.bestWeather ? (
                              <div className="space-y-0.5">
                                <span className="text-[#E0DCD3] font-medium block">
                                  {prod.bestWeatherBn || prod.bestWeather}
                                </span>
                                {prod.bestWeather && prod.bestWeatherBn && (
                                  <span className="text-[#7A7771] text-[10px] block italic">
                                    {prod.bestWeather}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#65635E] italic">আবহাওয়া নির্ধারিত নেই</span>
                            )}
                          </td>

                          {/* Best For */}
                          <td className="py-3.5 px-4 text-[11px]">
                            {prod.bestForBn || prod.bestFor ? (
                              <div className="space-y-0.5">
                                <span className="text-[#E0DCD3] block">
                                  {prod.bestForBn || prod.bestFor}
                                </span>
                                {prod.bestFor && prod.bestForBn && (
                                  <span className="text-[#7A7771] text-[10px] block italic">
                                    {prod.bestFor}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#65635E] italic">ব্যবহার ক্ষেত্র নির্ধারিত নেই</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="py-1 px-2.5 bg-[#1C1B24] hover:bg-[#252430] border border-[#2E2C3A] text-[#E5C378] hover:text-[#D4AF37] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                              title="Edit all product & seasonal details"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informational Guidance Box */}
          <div className="bg-[#14131B] border border-[#2B2936] p-5 rounded-2xl flex items-start gap-3.5 text-xs text-[#A8A49C]">
            <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-[#F3EFEA]">
                পরবর্তীতে যেকোনো নতুন আতর যোগ বা পরিবর্তনের নিয়ম (Next Time Attar Addition):
              </h4>
              <p className="leading-relaxed">
                পরের বার যেকোনো নতুন আতর যুক্ত করার সময় "Add New Fragrance" মোডালে আপনি কোন কোন ঋতুতে আতরটি ব্যবহার করা যায় তা সিলেক্ট করে দিতে পারবেন। সেই সাথে "Best Weather (কোন আবহাওয়ায়)" এবং "Best For (কোথায় ব্যবহার করবেন)" লিখে সেভ করলেই স্বয়ংক্রিয়ভাবে এই টেবিলে এবং ওয়েবসাইটের নেভিগেশন সাবমেনু ও শপ ফিল্টারে যুক্ত হয়ে যাবে।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. GOOGLE SHEETS LIVE INVENTORY TAB */}
      {activeTab === 'sheets' && (
        <GoogleSheetsInventoryPanel />
      )}

      {/* 5. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 max-w-4xl">
          <h2 className="font-serif text-xl text-[#F3EFEA]">Promotional Vouchers</h2>

          {/* Add coupon form */}
          <form
            onSubmit={handleAddCoupon}
            className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4"
          >
            <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
              Create New Voucher Code
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[#8E8B83] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER15"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="admin-voucher-discount-type" className="block text-[#8E8B83] mb-1">Discount Type</label>
                <select
                  id="admin-voucher-discount-type"
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed BDT (৳)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Min Order (৳)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
            >
              Add Voucher
            </button>
          </form>

          {/* Active coupons list */}
          <div className="bg-[#121116] border border-[#23222A] rounded-2xl p-6 divide-y divide-[#222129]">
            {coupons.map((c) => (
              <div key={c.code} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">{c.code}</span>
                  <span className="text-[#8E8B83] ml-3">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `৳${c.discountValue} OFF`}
                  </span>
                  <span className="text-[#6B6862] ml-3 font-mono">Min Order: ৳{c.minOrder}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded text-[10px]">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STOREFRONT SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#F3EFEA]">Storefront & Contact Settings</h2>
            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-6 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#0B0B0C] text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4 text-xs">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
              Contact & Hotline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B83] mb-1">WhatsApp Number (e.g. +8801712345678)</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Hotline Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Atelier Address (English)</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4 text-xs">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
              Delivery Fees & Thresholds (BDT)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#8E8B83] mb-1">Inside Dhaka Fee (৳)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeDhaka}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, deliveryFeeDhaka: Number(e.target.value) })
                  }
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Outside Dhaka Fee (৳)</label>
                <input
                  type="number"
                  value={settingsForm.deliveryFeeOutside}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, deliveryFeeOutside: Number(e.target.value) })
                  }
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">Free Delivery Minimum (৳)</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-4 text-xs">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-medium">
              Announcement Bar Text
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[#8E8B83] mb-1">English Announcement</label>
                <input
                  type="text"
                  value={settingsForm.announcementTextEn}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementTextEn: e.target.value })
                  }
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">বাংলা ঘোষণা</label>
                <input
                  type="text"
                  value={settingsForm.announcementTextBn}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementTextBn: e.target.value })
                  }
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1.5">
                  Announcement Bar Background Color / ঘোষণার ব্যাকগ্রাউন্ড কালার
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'emerald', label: 'Emerald Green', bgClass: 'from-[#064E3B] to-[#047857]' },
                    { id: 'gold', label: 'Royal Amber Gold', bgClass: 'from-[#3B2306] to-[#633C0D]' },
                    { id: 'ruby', label: 'Velvet Ruby Red', bgClass: 'from-[#4C0519] to-[#881337]' },
                    { id: 'royal', label: 'Midnight Blue', bgClass: 'from-[#1E1B4B] to-[#312E81]' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, announcementBg: color.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        (settingsForm.announcementBg || 'emerald') === color.id
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] bg-[#1F1E26]'
                          : 'border-[#2B2932] bg-[#18171D] hover:border-[#3E3C47]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${color.bgClass} inline-block border border-white/20 shadow-sm`}></span>
                        <span className="text-white text-xs font-medium">{color.label}</span>
                      </div>
                      {(settingsForm.announcementBg || 'emerald') === color.id && (
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1.5">
                  Scrolling Speed / লেখার স্ক্রোলিং স্পিড (গতি)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'relaxed', label: 'Relaxed & Smooth (ধীর ও আরামদায়ক - 55s)', desc: 'সহজে পড়ার উপযোগী' },
                    { id: 'slow', label: 'Very Slow (খুব ধীর গতি - 75s)', desc: 'বেশি সময় নিয়ে চলবে' },
                    { id: 'normal', label: 'Medium (মিডিয়াম - 40s)', desc: 'স্বাভাবিক গতি' }
                  ].map((spd) => (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, announcementSpeed: spd.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        (settingsForm.announcementSpeed || 'relaxed') === spd.id
                          ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] bg-[#1F1E26]'
                          : 'border-[#2B2932] bg-[#18171D] hover:border-[#3E3C47]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-semibold">{spd.label}</span>
                        {(settingsForm.announcementSpeed || 'relaxed') === spd.id && (
                          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#8E8B83] block mt-0.5">{spd.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Bot Live Notification Settings */}
          <div className="bg-[#121116] border border-[#23222A] p-6 rounded-2xl space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23222A] gap-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                  Telegram Bot Live Notifications
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                Real-time Add to Cart & New Order Alerts
              </span>
            </div>

            <div className="bg-[#17161C] border border-[#26242E] p-4 rounded-xl text-[11px] text-[#A8A49C] space-y-1">
              <p className="font-semibold text-white">How to connect your Telegram Bot:</p>
              <p>1. Open Telegram and search for <span className="text-[#D4AF37] font-mono">@BotFather</span></p>
              <p>2. Send <span className="text-[#D4AF37] font-mono">/newbot</span> and follow prompts to obtain your HTTP API Token.</p>
              <p>3. Message your new bot or add it to your channel/group, then find your Chat ID (e.g. using <span className="text-[#D4AF37] font-mono">@userinfobot</span>).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B83] mb-1">
                  Telegram Bot Token (from @BotFather)
                </label>
                <input
                  type="password"
                  value={settingsForm.telegramBotToken || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telegramBotToken: e.target.value })
                  }
                  placeholder="e.g. 7123456789:AAHkL789..."
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] mb-1">
                  Telegram Chat ID (User or Group ID)
                </label>
                <input
                  type="text"
                  value={settingsForm.telegramChatId || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telegramChatId: e.target.value })
                  }
                  placeholder="e.g. 123456789 or -100123456789"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.telegramNotifyAddToCart !== false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telegramNotifyAddToCart: e.target.checked })
                  }
                  className="accent-[#D4AF37] w-4 h-4 rounded"
                />
                <span className="text-[#F3EFEA] font-medium">Send Telegram Alert on "Add to Cart"</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.telegramNotifyNewOrder !== false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, telegramNotifyNewOrder: e.target.checked })
                  }
                  className="accent-[#D4AF37] w-4 h-4 rounded"
                />
                <span className="text-[#F3EFEA] font-medium">Send Telegram Alert on New Order Placed</span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={testingTelegram}
                className="py-2.5 px-4 bg-[#1F2C24] hover:bg-[#25382B] border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testingTelegram ? 'Testing Telegram...' : 'Send Test Notification'}</span>
              </button>

              {telegramTestResult && (
                <span
                  className={`text-xs ${
                    telegramTestResult.success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {telegramTestResult.message}
                </span>
              )}
            </div>
          </div>

          {/* Meta Pixel & Google Analytics 4 (GA4) Configuration */}
          <div className="bg-[#121116] border border-[#2B2934] p-6 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23222A] gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif text-lg text-[#F3EFEA] font-medium">
                  Meta Pixel (Facebook) & Google Analytics 4 (GA4)
                </h3>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    settingsForm.metaPixelId
                      ? 'bg-blue-500/15 border border-blue-500/40 text-blue-400'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${settingsForm.metaPixelId ? 'bg-blue-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span>Meta: {settingsForm.metaPixelId ? 'Connected' : 'Not Set'}</span>
                </span>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                    settingsForm.ga4MeasurementId
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${settingsForm.ga4MeasurementId ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span>GA4: {settingsForm.ga4MeasurementId ? 'Connected' : 'Not Set'}</span>
                </span>
              </div>
            </div>

            <div className="bg-[#17161C] border border-[#26242E] p-4 rounded-xl text-[11px] text-[#A8A49C] space-y-1.5">
              <p className="font-semibold text-white">Automated E-Commerce Tracking Active:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[#C2BDB2]">
                <li><strong className="text-[#D4AF37]">PageView</strong>: Fired automatically on navigation between Home, Shop, Products, Cart, and Checkout.</li>
                <li><strong className="text-[#D4AF37]">ViewContent</strong>: Fired whenever a customer views an attar's detail page with item name, ID, category, and price.</li>
                <li><strong className="text-[#D4AF37]">AddToCart</strong>: Fired when an attar (3ml / 6ml) is added to the shopping bag.</li>
                <li><strong className="text-[#D4AF37]">InitiateCheckout</strong>: Fired when a customer enters the checkout flow with item breakdown and cart total.</li>
                <li><strong className="text-[#D4AF37]">Purchase</strong>: Fired on order completion with order number and revenue value in BDT.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Meta Pixel (Facebook Pixel) ID
                </label>
                <input
                  type="text"
                  value={settingsForm.metaPixelId || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, metaPixelId: e.target.value.trim() })
                  }
                  placeholder="e.g. 1234567890123456"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-[#7A7771] block mt-1">
                  Obtain from Meta Business Suite / Events Manager (or set via <code className="text-[#D4AF37]">VITE_META_PIXEL_ID</code> in .env).
                </span>
              </div>

              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Google Analytics 4 (GA4) Measurement ID
                </label>
                <input
                  type="text"
                  value={settingsForm.ga4MeasurementId || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, ga4MeasurementId: e.target.value.trim() })
                  }
                  placeholder="e.g. G-XXXXXXXXXX"
                  className="w-full bg-[#18171D] border border-[#2B2932] px-3.5 py-2.5 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-[10px] text-[#7A7771] block mt-1">
                  Obtain from Google Analytics Admin &gt; Data Streams (or set via <code className="text-[#D4AF37]">VITE_GA4_MEASUREMENT_ID</code> in .env).
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.enableAnalytics !== false}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, enableAnalytics: e.target.checked })
                  }
                  className="accent-[#D4AF37] w-4 h-4 rounded"
                />
                <span className="text-[#F3EFEA] text-sm font-medium">Enable Event Tracking (Meta Pixel & GA4)</span>
              </label>

              <span className="text-xs text-[#8E8B83] font-mono">
                Currency: <span className="text-[#D4AF37] font-bold">BDT (৳)</span>
              </span>
            </div>
          </div>

          {/* Google Sheets Inventory Integration Settings Card */}
          <div className="bg-[#18171D] border border-[#2B2932] p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#23222A]">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
                  <span>Google Sheets Live Inventory Synchronization</span>
                </h3>
                <p className="text-xs text-[#8E8B83] mt-0.5">
                  Connected Sheet: <strong className="text-white">Vellure Fragrances - Inventory</strong> (<span className="text-[#D4AF37] font-mono">info.vellurefragrances@gmail.com</span>)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('sheets')}
                className="py-1.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-xs transition-colors cursor-pointer"
              >
                Open Live Sync Console →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Google Sheet Name
                </label>
                <input
                  type="text"
                  value={settingsForm.googleSheetName || 'Vellure Fragrances - Inventory'}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, googleSheetName: e.target.value })
                  }
                  className="w-full bg-[#121116] border border-[#2B2932] px-3.5 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Google Account Email
                </label>
                <input
                  type="text"
                  value={settingsForm.googleSheetEmail || 'info.vellurefragrances@gmail.com'}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, googleSheetEmail: e.target.value })
                  }
                  className="w-full bg-[#121116] border border-[#2B2932] px-3.5 py-2 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Google Sheet ID or URL
                </label>
                <input
                  type="text"
                  value={settingsForm.googleSheetId || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, googleSheetId: e.target.value })
                  }
                  placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs..."
                  className="w-full bg-[#121116] border border-[#2B2932] px-3.5 py-2 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#8E8B83] text-xs mb-1.5">
                  Apps Script Webhook URL (Optional 2-Way Live Sync)
                </label>
                <input
                  type="text"
                  value={settingsForm.googleSheetWebhookUrl || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, googleSheetWebhookUrl: e.target.value })
                  }
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-[#121116] border border-[#2B2932] px-3.5 py-2 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative w-full max-w-3xl bg-[#121116] border border-[#2B2932] rounded-3xl p-6 sm:p-8 space-y-6 z-10 shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-[#23222A]">
                <h3 className="font-serif text-xl text-[#F3EFEA]">
                  {editingProduct ? 'Edit Fragrance Details' : 'Add New Fragrance'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-[#8E8B83] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
                {/* 1. Fragrance Image / Picture Upload Section */}
                <div className="bg-[#18171D] border border-[#2B2932] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[#C5A059] font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Fragrance Picture / পণ্যের ছবি *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGalleryPicker(!showGalleryPicker)}
                      className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showGalleryPicker ? 'Close Preset Gallery' : 'Choose Preset Bottle Photo'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Image Preview Thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-[#3E3C47] bg-[#0E0D12] overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                      {productForm.images ? (
                        <img
                          src={productForm.images}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg';
                          }}
                        />
                      ) : (
                        <div className="text-center text-[#706D67] text-[10px] p-2">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span>No Image</span>
                        </div>
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[#D4AF37] text-[11px] font-semibold">
                          Uploading...
                        </div>
                      )}
                    </div>

                    {/* Upload & URL Controls */}
                    <div className="flex-1 w-full space-y-2">
                      <div>
                        <label className="block text-[11px] text-[#A8A49C] mb-1">
                          Upload picture from computer or mobile (JPG, PNG, WebP):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={uploadingImage}
                          className="w-full text-xs text-[#A8A49C] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2A2832] file:text-[#F3EFEA] hover:file:bg-[#383643] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#A8A49C] mb-1">
                          Or enter image URL / local file path:
                        </label>
                        <input
                          type="text"
                          value={productForm.images}
                          onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                          placeholder="e.g. /uploads/... or https://..."
                          className="w-full bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {imageUploadError && (
                        <p className="text-red-400 text-[11px]">{imageUploadError}</p>
                      )}
                    </div>
                  </div>

                  {/* Preset Luxury Gallery Picker */}
                  {showGalleryPicker && (
                    <div className="pt-3 border-t border-[#26242E] space-y-2">
                      <span className="text-[11px] text-[#8E8B83] block">
                        Select a luxury attar presentation bottle from atelier vault:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {PRESET_GALLERY_IMAGES.map((img) => (
                          <button
                            key={img.name}
                            type="button"
                            onClick={() => {
                              setProductForm({ ...productForm, images: img.url });
                              setShowGalleryPicker(false);
                            }}
                            className={`group relative rounded-lg border overflow-hidden aspect-square transition-all cursor-pointer ${
                              productForm.images === img.url
                                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]'
                                : 'border-[#2D2B35] hover:border-[#D4AF37]/50'
                            }`}
                            title={img.name}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-white p-0.5 truncate text-center">
                              {img.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 1b. Additional Gallery Images Section (একধিক ছবি / গ্যালারি) */}
                <div className="bg-[#18171D] border border-[#2B2932] p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[#C5A059] font-medium flex items-center gap-1.5 text-sm">
                        <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                        <span>Additional Gallery Images / অতিরিক্ত গ্যালারি ছবি</span>
                      </label>
                      <p className="text-[11px] text-[#8E8B83] mt-0.5">
                        প্রডাক্ট পেজে কাস্টমারদের দেখানোর জন্য একাধিক ছবি যোগ করুন ({(productForm.galleryImages || []).length} টি ছবি যুক্ত আছে)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGalleryPresets(!showGalleryPresets)}
                      className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer bg-[#24222B] px-2.5 py-1 rounded-lg border border-[#353340]"
                    >
                      <span>{showGalleryPresets ? 'Close Presets' : '+ Presets থেকে ছবি নিন'}</span>
                    </button>
                  </div>

                  {/* Existing Gallery Images Previews Grid */}
                  {(productForm.galleryImages && productForm.galleryImages.length > 0) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                      {productForm.galleryImages.map((imgUrl, gIdx) => (
                        <div
                          key={`gallery-${gIdx}-${imgUrl}`}
                          className="group relative rounded-xl border border-[#33313E] bg-[#0E0D12] overflow-hidden aspect-square flex flex-col shadow-md"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${gIdx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/src/assets/images/product_oud_al_khaleej_1790357142489.jpg';
                            }}
                          />
                          <span className="absolute top-1.5 left-1.5 bg-black/80 text-[9px] font-mono text-[#D4AF37] px-1.5 py-0.5 rounded">
                            #{gIdx + 2}
                          </span>

                          {/* Action overlay buttons */}
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                            <button
                              type="button"
                              onClick={() => handleMakePrimaryImage(gIdx)}
                              className="w-full py-1 px-1.5 bg-[#D4AF37] text-black text-[10px] font-bold rounded hover:bg-[#C5A059] transition-colors"
                              title="Set as Main Cover Photo"
                            >
                              প্রধান ছবি করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(gIdx)}
                              className="w-full py-1 px-1.5 bg-red-600/90 text-white text-[10px] font-medium rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                              title="Delete from Gallery"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>মুছুন</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center border border-dashed border-[#2F2D38] rounded-xl text-[#7A7770] text-xs">
                      এখনও কোনো অতিরিক্ত গ্যালারি ছবি যোগ করা হয়নি। নিচে ফাইল আপলোড বা URL দিয়ে ছবি যোগ করুন।
                    </div>
                  )}

                  {/* Add Image Inputs: File Upload & URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#26242E]">
                    {/* Multi-file Upload */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#A8A49C] font-medium">
                        কম্পিউটার বা মোবাইল থেকে একাধিক ছবি আপলোড (Multiple Files):
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFilesUpload}
                        disabled={uploadingGalleryImages}
                        className="w-full text-xs text-[#A8A49C] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2A2832] file:text-[#F3EFEA] hover:file:bg-[#383643] cursor-pointer"
                      />
                      {uploadingGalleryImages && (
                        <p className="text-[#D4AF37] text-[11px] animate-pulse">গ্যালারি ছবি আপলোড হচ্ছে...</p>
                      )}
                    </div>

                    {/* Image URL Input + Add Button */}
                    <div className="space-y-1">
                      <label className="block text-[11px] text-[#A8A49C] font-medium">
                        অথবা ছবির লিঙ্ক / পাথ (URL) দিন:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGalleryImageUrl}
                          onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGalleryUrl();
                            }
                          }}
                          placeholder="/src/assets/... বা https://..."
                          className="flex-1 bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryUrl}
                          disabled={!newGalleryImageUrl.trim()}
                          className="px-3 py-1.5 bg-[#2B2934] hover:bg-[#D4AF37] text-white hover:text-black font-semibold rounded-lg text-xs transition-colors shrink-0 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                        >
                          + ছবি যোগ
                        </button>
                      </div>
                    </div>
                  </div>

                  {galleryUploadError && (
                    <p className="text-red-400 text-[11px]">{galleryUploadError}</p>
                  )}

                  {/* Preset Gallery Picker for Additional Photos */}
                  {showGalleryPresets && (
                    <div className="pt-3 border-t border-[#26242E] space-y-2">
                      <span className="text-[11px] text-[#8E8B83] block">
                        যেকোনো প্রেজেন্টেশন বোতলে ক্লিক করলে তা সরাসরি গ্যালারিতে যোগ হবে:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {PRESET_GALLERY_IMAGES.map((img) => (
                          <button
                            key={`preset-gal-${img.name}`}
                            type="button"
                            onClick={() => handleAddPresetToGallery(img.url)}
                            className="group relative rounded-lg border border-[#2D2B35] hover:border-[#D4AF37] overflow-hidden aspect-square transition-all cursor-pointer hover:scale-105"
                            title={`Click to add ${img.name} to gallery`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-white p-0.5 truncate text-center">
                              + {img.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Product Name and Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">Fragrance Name (English) *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Oud Al Khaleej"
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={productForm.nameBn}
                      onChange={(e) => setProductForm({ ...productForm, nameBn: e.target.value })}
                      placeholder="যেমন: উদ আল খালিজ"
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Category Selection with Quick Add */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="admin-product-category" className="block text-[#C5A059] font-medium">Category / ক্যাটাগরি *</label>
                      <button
                        type="button"
                        onClick={() => setShowInlineAddCat(!showInlineAddCat)}
                        className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{showInlineAddCat ? 'Cancel' : '+ New Category'}</span>
                      </button>
                    </div>

                    {showInlineAddCat ? (
                      <div className="p-3 bg-[#16151D] border border-[#D4AF37]/40 rounded-xl space-y-2 mb-2">
                        <span className="text-[11px] text-[#D4AF37] font-semibold block">Quick Add New Category</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Category Name (e.g. Combo Offers)"
                            value={inlineCatName}
                            onChange={(e) => setInlineCatName(e.target.value)}
                            className="bg-[#121116] border border-[#2B2932] px-2.5 py-1.5 rounded-lg text-white text-xs"
                          />
                          <input
                            type="text"
                            placeholder="নাম বাংলায় (যেমন: কম্বো অফার)"
                            value={inlineCatNameBn}
                            onChange={(e) => setInlineCatNameBn(e.target.value)}
                            className="bg-[#121116] border border-[#2B2932] px-2.5 py-1.5 rounded-lg text-white text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowInlineAddCat(false)}
                            className="px-2.5 py-1 text-xs text-[#8E8B83] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleQuickAddCategory}
                            className="px-3 py-1 bg-[#D4AF37] text-[#0B0B0C] font-semibold text-xs rounded-lg hover:bg-[#C5A059]"
                          >
                            Save & Select
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        id="admin-product-category"
                        value={productForm.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          const found = categories.find((c) => c.slug === val || c.id === val);
                          setProductForm({
                            ...productForm,
                            category: val,
                            categoryBn: found ? found.nameBn : val
                          });
                        }}
                        className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        {categories.map((c) => (
                          <option key={c.id || c.slug} value={c.slug}>
                            {c.name} {c.nameBn ? `(${c.nameBn})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label htmlFor="admin-fragrance-family" className="block text-[#C5A059] font-medium mb-1">Fragrance Family</label>
                    <select
                      id="admin-fragrance-family"
                      value={productForm.fragranceType}
                      onChange={(e) => setProductForm({ ...productForm, fragranceType: e.target.value as any })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Aquatic">Aquatic (অ্যাকোয়াটিক)</option>
                      <option value="Fresh">Fresh (ফ্রেশ)</option>
                      <option value="Oud">Oud (উদ)</option>
                      <option value="Musk">Musk (মাস্ক)</option>
                      <option value="Sandalwood">Sandalwood (চন্দন)</option>
                      <option value="Amber">Amber (অ্যাম্বার)</option>
                      <option value="Woody">Woody (উডি)</option>
                      <option value="Floral">Floral (ফ্লোরাল)</option>
                      <option value="Oriental">Oriental (ওরিয়েন্টাল)</option>
                    </select>
                  </div>

                  {/* 3. Pricing Section */}
                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">3ml Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price3ml}
                      onChange={(e) => setProductForm({ ...productForm, price3ml: Number(e.target.value) })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">6ml Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price6ml}
                      onChange={(e) => setProductForm({ ...productForm, price6ml: Number(e.target.value) })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8B83] font-medium mb-1">Original 3ml Price (৳)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice3ml}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice3ml: Number(e.target.value) })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8B83] font-medium mb-1">Original 6ml Price (৳)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice6ml}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice6ml: Number(e.target.value) })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8B83] font-medium mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E8B83] font-medium mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 4. Descriptions Section (Both English and Bengali) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">Short Description (English)</label>
                    <input
                      type="text"
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      placeholder="e.g. Crisp oceanic breeze combined with zesty Italian lemon"
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                    <input
                      type="text"
                      value={productForm.shortDescriptionBn}
                      onChange={(e) => setProductForm({ ...productForm, shortDescriptionBn: e.target.value })}
                      placeholder="যেমন: সতেজ সামুদ্রিক বাতাস ও লেবুর প্রাণবন্ত সুবাস"
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">Full Luxury Description (English)</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Detailed fragrance composition, craftsmanship and character..."
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] font-medium mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
                    <textarea
                      rows={3}
                      value={productForm.descriptionBn}
                      onChange={(e) => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                      placeholder="আতরটির বিস্তারিত বর্ণনা, সুবাসের মাত্রা ও বিশেষত্ব..."
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#8E8B83] mb-1">Top Notes (comma-separated)</label>
                    <input
                      type="text"
                      value={productForm.topNotes}
                      onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8B83] mb-1">Heart Notes</label>
                    <input
                      type="text"
                      value={productForm.heartNotes}
                      onChange={(e) => setProductForm({ ...productForm, heartNotes: e.target.value })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8B83] mb-1">Base Notes</label>
                    <input
                      type="text"
                      value={productForm.baseNotes}
                      onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                      className="w-full bg-[#18171D] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* 5. Seasonal Suitability & Weather Guide */}
                <div className="bg-[#18171E] border border-[#2B2936] p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <label className="text-[#C5A059] font-medium text-xs sm:text-sm">
                      Seasonal Suitability & Weather / কোন কোন ঋতু ও আবহাওয়ায় ব্যবহার উপযোগী *
                    </label>
                  </div>
                  <p className="text-[11px] text-[#A8A49C]">
                    এখানে নির্বাচিত ঋতু অনুযায়ী আতরটি হোমপেজ, নেভিগেশন সাবমেনু ও শপ পেজের ফিল্টারে স্বয়ংক্রিয়ভাবে দেখাবে।
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {[
                      { key: 'Summer', label: 'গ্রীষ্মকাল (Summer)', icon: '☀️' },
                      { key: 'Monsoon', label: 'বর্ষাকাল (Monsoon)', icon: '🌧️' },
                      { key: 'Winter', label: 'শীতকাল (Winter)', icon: '❄️' },
                      { key: 'Autumn', label: 'হেমন্ত ও শরৎকাল (Autumn)', icon: '🍂' },
                      { key: 'Spring', label: 'বসন্তকাল (Spring)', icon: '🌸' },
                      { key: 'All-Season', label: 'সারাবছর উপযোগী (All-Season)', icon: '✨' }
                    ].map((seasonOpt) => {
                      const isChecked = (productForm.seasons || []).includes(seasonOpt.key);
                      return (
                        <label
                          key={seasonOpt.key}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F3EFEA] font-semibold'
                              : 'bg-[#121116] border-[#292732] text-[#8E8B83] hover:text-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const current = productForm.seasons || [];
                              if (current.includes(seasonOpt.key)) {
                                const next = current.filter((s) => s !== seasonOpt.key);
                                setProductForm({ ...productForm, seasons: next.length ? next : ['All-Season'] });
                              } else {
                                setProductForm({ ...productForm, seasons: [...current, seasonOpt.key] });
                              }
                            }}
                            className="accent-[#D4AF37] w-3.5 h-3.5"
                          />
                          <span>{seasonOpt.icon} {seasonOpt.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[#C5A059] font-medium mb-1">
                        Best Weather (English)
                      </label>
                      <input
                        type="text"
                        value={productForm.bestWeather}
                        onChange={(e) => setProductForm({ ...productForm, bestWeather: e.target.value })}
                        placeholder="e.g. Summer & Humid Monsoon"
                        className="w-full bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C5A059] font-medium mb-1">
                        কোন আবহাওয়ায় (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={productForm.bestWeatherBn}
                        onChange={(e) => setProductForm({ ...productForm, bestWeatherBn: e.target.value })}
                        placeholder="যেমন: গরমের দিন এবং আর্দ্র আবহাওয়া"
                        className="w-full bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#C5A059] font-medium mb-1">
                        Best For / Occasion (English)
                      </label>
                      <input
                        type="text"
                        value={productForm.bestFor}
                        onChange={(e) => setProductForm({ ...productForm, bestFor: e.target.value })}
                        placeholder="e.g. Daily casual wear, gym, campus, evenings"
                        className="w-full bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C5A059] font-medium mb-1">
                        কোথায় ব্যবহার করবেন (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={productForm.bestForBn}
                        onChange={(e) => setProductForm({ ...productForm, bestForBn: e.target.value })}
                        placeholder="যেমন: ডেইলি ক্যাজুয়াল ওয়্যার, বন্ধুদের সাথে আড্ডা বা ক্লাসে"
                        className="w-full bg-[#121116] border border-[#2B2932] px-3 py-1.5 rounded-lg text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span>Featured in Showcase</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.bestSeller}
                      onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span>Best Seller Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.newArrival}
                      onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                      className="accent-[#D4AF37]"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#23222A] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="py-2 px-4 bg-[#1A1920] border border-[#2D2B36] text-[#F3EFEA] rounded-xl hover:bg-[#25242D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0B0C] font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    Save Fragrance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
