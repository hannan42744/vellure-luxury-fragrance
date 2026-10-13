import { Product, CartItem, Order } from '../types';

// Declare global types for Facebook Pixel and Google Analytics
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: string;
  payload?: any;
}

interface AnalyticsConfig {
  metaPixelId?: string;
  ga4MeasurementId?: string;
  enabled?: boolean;
}

const STORAGE_KEY_EVENTS = 'vellure_analytics_events';

class AnalyticsService {
  private metaPixelId: string | null = null;
  private ga4MeasurementId: string | null = null;
  private isPixelInitialized: boolean = false;
  private isGA4Initialized: boolean = false;
  private isEnabled: boolean = true;
  private eventLog: AnalyticsEvent[] = [];

  constructor() {
    // Attempt reading from environment variables first
    const envPixelId = (import.meta.env.VITE_META_PIXEL_ID as string) || '';
    const envGA4Id = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string) || '';

    if (envPixelId) this.metaPixelId = envPixelId.trim();
    if (envGA4Id) this.ga4MeasurementId = envGA4Id.trim();

    // Load persisted local events
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (stored) {
        this.eventLog = JSON.parse(stored);
      }
    } catch {
      this.eventLog = [];
    }
  }

  /**
   * Initialize or update tracking IDs (from settings or env)
   */
  public init(config: AnalyticsConfig) {
    if (config.enabled !== undefined) {
      this.isEnabled = config.enabled;
    }

    const pixelId = (config.metaPixelId || this.metaPixelId || '').trim();
    const ga4Id = (config.ga4MeasurementId || this.ga4MeasurementId || '').trim();

    if (pixelId && pixelId !== this.metaPixelId) {
      this.metaPixelId = pixelId;
      this.isPixelInitialized = false;
    }

    if (ga4Id && ga4Id !== this.ga4MeasurementId) {
      this.ga4MeasurementId = ga4Id;
      this.isGA4Initialized = false;
    }

    if (!this.isEnabled) return;

    if (this.metaPixelId && !this.isPixelInitialized) {
      this.setupMetaPixel(this.metaPixelId);
    }

    if (this.ga4MeasurementId && !this.isGA4Initialized) {
      this.setupGA4(this.ga4MeasurementId);
    }
  }

  /**
   * Set up Meta Pixel (Facebook Pixel) Script
   */
  private setupMetaPixel(pixelId: string) {
    if (typeof window === 'undefined') return;

    try {
      if (!window.fbq) {
        const n: any = (window.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];

        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        } else {
          document.head.appendChild(t);
        }
      }

      window.fbq('init', pixelId);
      this.isPixelInitialized = true;
      console.log(`[VELLURE Analytics] Meta Pixel initialized with ID: ${pixelId}`);
    } catch (err) {
      console.warn('[VELLURE Analytics] Failed to initialize Meta Pixel:', err);
    }
  }

  /**
   * Set up Google Analytics 4 (GA4) Tag Script
   */
  private setupGA4(measurementId: string) {
    if (typeof window === 'undefined') return;

    try {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false // We handle page views manually on client routing
      });

      this.isGA4Initialized = true;
      console.log(`[VELLURE Analytics] GA4 initialized with Measurement ID: ${measurementId}`);
    } catch (err) {
      console.warn('[VELLURE Analytics] Failed to initialize GA4:', err);
    }
  }

  /**
   * Helper to persist events locally
   */
  private logEvent(name: string, payload?: any) {
    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      timestamp: new Date().toISOString(),
      payload
    };

    this.eventLog = [event, ...this.eventLog.slice(0, 99)];
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.eventLog));
    } catch {
      // ignore localstorage errors
    }
  }

  /**
   * Generic custom event tracking
   */
  public trackEvent(name: string, payload?: any) {
    this.logEvent(name, payload);
    if (!this.isEnabled) return;

    // Meta Pixel Custom Event
    if (window.fbq) {
      try {
        window.fbq('trackCustom', name, payload || {});
      } catch (e) {
        // silence
      }
    }

    // GA4 Custom Event
    if (window.gtag) {
      try {
        window.gtag('event', name, payload || {});
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] Custom Event: ${name}`, payload);
  }

  public getEventCount(name: string): number {
    return this.eventLog.filter((e) => e.name === name).length;
  }

  public getAnalyticsEvents(): AnalyticsEvent[] {
    return this.eventLog;
  }

  public getActiveIds() {
    return {
      metaPixelId: this.metaPixelId,
      ga4MeasurementId: this.ga4MeasurementId,
      isPixelActive: this.isPixelInitialized,
      isGA4Active: this.isGA4Initialized,
      isEnabled: this.isEnabled
    };
  }

  // =========================================================================
  // CORE E-COMMERCE TRACKING EVENTS
  // =========================================================================

  /**
   * 1. PageView Event
   */
  public trackPageView(pageName: string, path: string = window.location.pathname) {
    this.logEvent('page_view', { pageName, path });
    if (!this.isEnabled) return;

    // Meta Pixel PageView
    if (window.fbq) {
      try {
        window.fbq('track', 'PageView');
      } catch (e) {
        // silence
      }
    }

    // GA4 page_view
    if (window.gtag && this.ga4MeasurementId) {
      try {
        window.gtag('event', 'page_view', {
          page_title: pageName,
          page_location: window.location.href,
          page_path: path
        });
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] PageView: ${pageName} (${path})`);
  }

  /**
   * 2. ViewContent Event (Product Details View)
   */
  public trackViewContent(product: Product, size: '3ml' | '6ml' = '3ml') {
    if (!product) return;
    const price = size === '6ml' ? product.price6ml : product.price3ml;

    this.logEvent('view_content', {
      productId: product.id,
      name: product.name,
      size,
      price
    });

    if (!this.isEnabled) return;

    // Meta Pixel ViewContent
    if (window.fbq) {
      try {
        window.fbq('track', 'ViewContent', {
          content_name: product.name,
          content_category: product.category,
          content_ids: [product.id, product.slug],
          content_type: 'product',
          value: price,
          currency: 'BDT'
        });
      } catch (e) {
        // silence
      }
    }

    // GA4 view_item
    if (window.gtag) {
      try {
        window.gtag('event', 'view_item', {
          currency: 'BDT',
          value: price,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              item_variant: size,
              price: price,
              quantity: 1
            }
          ]
        });
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] ViewContent: ${product.name} (${size}) - BDT ${price}`);
  }

  /**
   * 3. AddToCart Event
   */
  public trackAddToCart(product: Product, size: '3ml' | '6ml' = '3ml', quantity: number = 1) {
    if (!product) return;
    const unitPrice = size === '6ml' ? product.price6ml : product.price3ml;
    const totalPrice = unitPrice * quantity;

    this.logEvent('add_to_cart', {
      productId: product.id,
      name: product.name,
      size,
      quantity,
      price: unitPrice,
      total: totalPrice
    });

    if (!this.isEnabled) return;

    // Meta Pixel AddToCart
    if (window.fbq) {
      try {
        window.fbq('track', 'AddToCart', {
          content_name: product.name,
          content_category: product.category,
          content_ids: [product.id, product.slug],
          content_type: 'product',
          value: totalPrice,
          currency: 'BDT'
        });
      } catch (e) {
        // silence
      }
    }

    // GA4 add_to_cart
    if (window.gtag) {
      try {
        window.gtag('event', 'add_to_cart', {
          currency: 'BDT',
          value: totalPrice,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              item_variant: size,
              price: unitPrice,
              quantity: quantity
            }
          ]
        });
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] AddToCart: ${product.name} (${quantity}x ${size}) - BDT ${totalPrice}`);
  }

  /**
   * 4. InitiateCheckout Event
   */
  public trackInitiateCheckout(items: CartItem[], totalAmount: number) {
    if (!items || items.length === 0) return;

    const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

    this.logEvent('initiate_checkout', {
      itemsCount: items.length,
      totalQuantity,
      totalAmount
    });

    if (!this.isEnabled) return;

    // Meta Pixel InitiateCheckout
    if (window.fbq) {
      try {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: items.map((i) => i.productId),
          contents: items.map((i) => ({
            id: i.productId,
            quantity: i.quantity,
            item_price: i.price
          })),
          num_items: totalQuantity,
          value: totalAmount,
          currency: 'BDT'
        });
      } catch (e) {
        // silence
      }
    }

    // GA4 begin_checkout
    if (window.gtag) {
      try {
        window.gtag('event', 'begin_checkout', {
          currency: 'BDT',
          value: totalAmount,
          items: items.map((i) => ({
            item_id: i.productId,
            item_name: i.name,
            item_variant: i.size,
            price: i.price,
            quantity: i.quantity
          }))
        });
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] InitiateCheckout: ${items.length} items - BDT ${totalAmount}`);
  }

  /**
   * 5. Purchase Event (Standard event on completed order)
   */
  public trackPurchase(order: Order) {
    if (!order) return;

    this.logEvent('purchase', {
      orderId: order.id,
      totalAmount: order.totalAmount,
      itemsCount: order.items.length
    });

    if (!this.isEnabled) return;

    // Meta Pixel Purchase
    if (window.fbq) {
      try {
        window.fbq('track', 'Purchase', {
          content_ids: order.items.map((i) => i.productId),
          contents: order.items.map((i) => ({
            id: i.productId,
            quantity: i.quantity,
            item_price: i.price
          })),
          num_items: order.items.reduce((acc, i) => acc + i.quantity, 0),
          value: order.totalAmount,
          currency: 'BDT'
        });
      } catch (e) {
        // silence
      }
    }

    // GA4 purchase
    if (window.gtag) {
      try {
        window.gtag('event', 'purchase', {
          transaction_id: order.id,
          value: order.totalAmount,
          currency: 'BDT',
          items: order.items.map((i) => ({
            item_id: i.productId,
            item_name: i.name,
            item_variant: i.size,
            price: i.price,
            quantity: i.quantity
          }))
        });
      } catch (e) {
        // silence
      }
    }

    console.log(`[VELLURE Analytics] Purchase: Order #${order.id} - BDT ${order.totalAmount}`);
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export convenience helper functions for direct imports
export const trackPageView = (pageName: string, path?: string) => analytics.trackPageView(pageName, path);
export const trackViewContent = (product: Product, size?: '3ml' | '6ml') => analytics.trackViewContent(product, size);
export const trackAddToCart = (product: Product, size?: '3ml' | '6ml', quantity?: number) => analytics.trackAddToCart(product, size, quantity);
export const trackInitiateCheckout = (items: CartItem[], totalAmount: number) => analytics.trackInitiateCheckout(items, totalAmount);
export const trackPurchase = (order: Order) => analytics.trackPurchase(order);
export const trackEvent = (name: string, payload?: any) => analytics.trackEvent(name, payload);
export const getEventCount = (name: string) => analytics.getEventCount(name);
export const getAnalyticsEvents = () => analytics.getAnalyticsEvents();
