import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, SiteSettings, Language, Order, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialProducts';
import { UI_TRANSLATIONS } from '../utils/translations';
import { analytics, trackPageView, trackAddToCart, trackInitiateCheckout } from '../utils/analytics';
import { resolveImage } from '../utils/resolveImage';

// Helper function to normalize product images using Vite bundled assets
const normalizeProducts = (items: Product[]): Product[] => {
  if (!Array.isArray(items)) return [];
  return items.map(product => ({
    ...product,
    images: Array.isArray(product.images)
      ? product.images.map(img => resolveImage(img))
      : []
  }));
};

interface AppContextType {
  products: Product[];
  categories: ProductCategory[];
  settings: SiteSettings;
  cart: CartItem[];
  wishlist: string[];
  language: Language;
  currentRoute: string;
  routeParams: Record<string, string>;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  analytics: typeof analytics;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  navigateTo: (path: string, params?: Record<string, string>) => void;
  addToCart: (product: Product, size: '3ml' | '6ml', quantity?: number) => void;
  updateCartQuantity: (productId: string, size: '3ml' | '6ml', quantity: number) => void;
  removeFromCart: (productId: string, size: '3ml' | '6ml') => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Cart calculations
  cartCount: number;
  cartSubtotal: number;
  
  // Admin auth
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => normalizeProducts(INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<ProductCategory[]>([
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
  ]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('vellure_lang') as Language) || 'en';
  });
  
  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vellure_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map(item => ({
        ...item,
        image: resolveImage(item.image)
      }));
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vellure_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('vellure_admin_tok');
  });

  // Fetch initial data from server API
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          setProducts(normalizeProducts(data.products));
        }
      }
    } catch (e) {
      console.warn('Using client-side fallback products:', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (e) {
      console.warn('Using client-side fallback categories:', e);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (e) {
      console.warn('Using client-side fallback settings:', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshCategories();
    refreshSettings();
  }, []);

  // Initialize Meta Pixel & GA4 whenever settings or env updates
  useEffect(() => {
    analytics.init({
      metaPixelId: settings.metaPixelId,
      ga4MeasurementId: settings.ga4MeasurementId,
      enabled: settings.enableAnalytics !== false
    });
  }, [settings.metaPixelId, settings.ga4MeasurementId, settings.enableAnalytics]);

  // Track PageView on route changes
  useEffect(() => {
    trackPageView(currentRoute, window.location.pathname);
  }, [currentRoute]);

  // Save cart & wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vellure_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vellure_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // URL routing handler (sync with window.location)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentRoute('home');
        setRouteParams({});
      } else if (path === '/shop') {
        setCurrentRoute('shop');
        setRouteParams({});
      } else if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '').replace(/\/$/, '');
        setCurrentRoute('product');
        setRouteParams({ slug });
      } else if (path === '/cart') {
        setCurrentRoute('cart');
        setRouteParams({});
      } else if (path === '/checkout') {
        setCurrentRoute('checkout');
        setRouteParams({});
      } else if (path.startsWith('/order-confirmed/')) {
        const orderId = path.replace('/order-confirmed/', '').replace(/\/$/, '');
        setCurrentRoute('order-confirmed');
        setRouteParams({ orderId });
      } else if (path === '/track-order') {
        setCurrentRoute('track-order');
        setRouteParams({});
      } else if (path === '/about') {
        setCurrentRoute('about');
        setRouteParams({});
      } else if (path === '/contact') {
        setCurrentRoute('contact');
        setRouteParams({});
      } else if (path === '/admin') {
        setCurrentRoute('admin');
        setRouteParams({});
      } else {
        setCurrentRoute('home');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigateTo = (path: string, params: Record<string, string> = {}) => {
    let url = '/';
    if (path === 'home') url = '/';
    else if (path === 'shop') url = '/shop';
    else if (path === 'product') url = `/product/${params.slug || ''}`;
    else if (path === 'cart') url = '/cart';
    else if (path === 'checkout') {
      url = '/checkout';
      if (cart.length > 0) {
        trackInitiateCheckout(cart, cartSubtotal);
      }
    }
    else if (path === 'order-confirmed') url = `/order-confirmed/${params.orderId || ''}`;
    else if (path === 'track-order') url = '/track-order';
    else if (path === 'about') url = '/about';
    else if (path === 'contact') url = '/contact';
    else if (path === 'admin') url = '/admin';

    window.history.pushState({}, '', url);
    setCurrentRoute(path);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vellure_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    const item = UI_TRANSLATIONS[key];
    if (!item) return key;
    return language === 'bn' ? item.bn : item.en;
  };

  // Cart operations
  const addToCart = (product: Product, size: '3ml' | '6ml', quantity = 1) => {
    // Track AddToCart for Meta Pixel and GA4
    trackAddToCart(product, size, quantity);

    setCart(prev => {
      const price = size === '3ml' ? product.price3ml : product.price6ml;
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.size === size);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      let itemImage = product.images[0];
      if (size === '6ml') {
        const img6ml = product.images.find(img => img.toLowerCase().includes('6ml'));
        if (img6ml) itemImage = img6ml;
      } else if (size === '3ml') {
        const img3ml = product.images.find(img => img.toLowerCase().includes('3ml'))
          || product.images.find(img => !img.toLowerCase().includes('6ml'));
        if (img3ml) itemImage = img3ml;
      }

      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          nameBn: product.nameBn,
          image: resolveImage(itemImage),
          size,
          price,
          quantity
        }
      ];
    });
    setIsCartOpen(true);

    // Send Telegram Notification to merchant
    const price = size === '3ml' ? product.price3ml : product.price6ml;
    fetch('/api/notifications/telegram/add-to-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        productNameBn: product.nameBn,
        size,
        price,
        quantity,
        cartSubtotal: cartSubtotal + price * quantity,
        language
      })
    }).catch(err => {
      console.warn('Telegram notice dispatch:', err);
    });
  };

  const updateCartQuantity = (productId: string, size: '3ml' | '6ml', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: '3ml' | '6ml') => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Admin login / logout
  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('vellure_admin_tok', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection error' };
    }
  };

  const logoutAdmin = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    setAdminToken(null);
    sessionStorage.removeItem('vellure_admin_tok');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        language,
        currentRoute,
        routeParams,
        isCartOpen,
        isSearchOpen,
        searchQuery,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        setLanguage,
        toggleLanguage,
        t,
        navigateTo,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setIsCartOpen,
        setIsSearchOpen,
        setSearchQuery,
        cartCount,
        cartSubtotal,
        loginAdmin,
        logoutAdmin,
        refreshProducts,
        refreshCategories,
        refreshSettings,
        analytics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
