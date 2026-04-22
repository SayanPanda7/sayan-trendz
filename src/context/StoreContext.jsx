import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  collectionConfigs,
  getCollectionProducts,
  products as fallbackProducts,
  recentPurchaseNotifications,
} from '../data/store';
import { apiRequest } from '../lib/api';
import { normalizeProduct } from '../lib/normalizers';

const StoreContext = createContext(null);
const CART_STORAGE_KEY = 'sayan_trendz_cart';
const WISHLIST_STORAGE_KEY = 'sayan_trendz_wishlist';

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const { isAdmin, isAuthenticated, profile } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(() => readStorage(WISHLIST_STORAGE_KEY, []));
  const [cartItems, setCartItems] = useState(() => readStorage(CART_STORAGE_KEY, []));
  const [catalog, setCatalog] = useState(() => fallbackProducts.map(normalizeProduct));
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [recommendationMap, setRecommendationMap] = useState({});
  const [recentNotificationIndex, setRecentNotificationIndex] = useState(0);
  const exitIntentTriggered = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const response = await apiRequest('/products', {
          params: { limit: 80 },
        });

        if (response.products?.length) {
          const normalizedProducts = response.products.map(normalizeProduct);

          if (isMounted) {
            setCatalog(normalizedProducts);
          }
        }
      } catch (error) {
        console.warn('Using catalog fallback:', error.message);
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    loadCatalog();

    const timer = window.setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 1300);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNewsletterOpen(true);
    }, 9000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (event.clientY <= 0 && !exitIntentTriggered.current) {
        exitIntentTriggered.current = true;
        setExitIntentOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRecentNotificationIndex((current) => (current + 1) % recentPurchaseNotifications.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFlashMessage(null);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    }
  }, [wishlistIds]);

  useEffect(() => {
    const syncWishlist = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const response = await apiRequest('/wishlist');
        setWishlistIds(response.wishlist.map((product) => product._id || product.id));
      } catch (error) {
        console.warn('Wishlist sync skipped:', error.message);
      }
    };

    syncWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        return;
      }

      try {
        const response = await apiRequest('/orders/my');
        setOrders(response.orders || []);
      } catch (error) {
        console.warn('Orders sync skipped:', error.message);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const response = await apiRequest('/wishlist/toggle', {
          method: 'POST',
          data: { productId },
        });
        setWishlistIds(response.wishlist.map((product) => product._id || product.id));
        const existsInServerWishlist = response.wishlist.some((product) => String(product._id || product.id) === String(productId));
        setFlashMessage(existsInServerWishlist ? 'Saved to your wishlist' : 'Removed from your wishlist');
        return;
      } catch (error) {
        console.warn('Falling back to local wishlist:', error.message);
      }
    }

    setWishlistIds((current) => {
      const exists = current.includes(productId);
      setFlashMessage(exists ? 'Removed from your wishlist' : 'Saved to your wishlist');
      return exists ? current.filter((id) => id !== productId) : [...current, productId];
    });
  };

  const addToCart = (product, options = {}) => {
    const quantity = options.quantity ?? 1;
    const size = options.size ?? product.sizes?.[0] ?? 'Free Size';

    setCartItems((current) => {
      const existingItem = current.find(
        (item) => String(item.productId) === String(product.id || product._id) && item.size === size,
      );

      if (existingItem) {
        return current.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [
        ...current,
        {
          id: `${product.id || product._id}-${Date.now()}`,
          productId: product.id || product._id,
          size,
          quantity,
        },
      ];
    });

    setFlashMessage(`${product.title} added to bag`);
    setCartOpen(true);
  };

  const buyNow = (product, options = {}) => {
    addToCart(product, options);
    setFlashMessage(`Checkout started for ${product.title}`);
  };

  const updateCartItem = (itemId, updates) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
              quantity: Math.max(1, Number(updates.quantity ?? item.quantity)),
            }
          : item,
      ),
    );
  };

  const removeCartItem = (itemId) => {
    setCartItems((current) => current.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCatalogProduct = useCallback(
    (identifier) => catalog.find((product) => String(product.id || product._id) === String(identifier)),
    [catalog],
  );

  const cartDetailedItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = getCatalogProduct(item.productId);

          if (!product) {
            return null;
          }

          return {
            ...item,
            product,
            lineTotal: product.salePrice * item.quantity,
          };
        })
        .filter(Boolean),
    [cartItems, catalog],
  );

  const cartTotals = useMemo(() => {
    const subtotal = cartDetailedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shipping = subtotal >= 1499 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
    };
  }, [cartDetailedItems]);

  const getCollectionProductsFromCatalog = useCallback(
    (tag) => {
      const fromCatalog = catalog.filter((product) => product.tags?.includes(tag)).slice(0, 10);
      return fromCatalog.length ? fromCatalog : getCollectionProducts(tag);
    },
    [catalog],
  );

  const getProductBySlugFromCatalog = useCallback(
    (slug) => catalog.find((product) => product.slug === slug),
    [catalog],
  );

  const fetchRecommendations = useCallback(
    async (productId) => {
      if (!productId) {
        return catalog.slice(0, 8);
      }

      if (recommendationMap[productId]) {
        return recommendationMap[productId];
      }

      try {
        const response = await apiRequest('/recommendations', {
          params: { productId },
        });

        const normalized = (response.recommendations || []).map(normalizeProduct);
        setRecommendationMap((current) => ({
          ...current,
          [productId]: normalized,
        }));

        return normalized;
      } catch (error) {
        const fallbackRecommendations = catalog
          .filter((product) => String(product.id || product._id) !== String(productId))
          .slice(0, 8);

        setRecommendationMap((current) => ({
          ...current,
          [productId]: fallbackRecommendations,
        }));

        return fallbackRecommendations;
      }
    },
    [catalog, recommendationMap],
  );

  const applyCoupon = useCallback(
    async (code) => {
      const response = await apiRequest('/coupons/validate', {
        method: 'POST',
        data: {
          code,
          items: cartDetailedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
          })),
        },
      });

      return response;
    },
    [cartDetailedItems],
  );

  const placeOrder = useCallback(
    async ({ address, couponCode, paymentMethod = 'razorpay', notes }) => {
      const response = await apiRequest('/orders', {
        method: 'POST',
        data: {
          address,
          couponCode,
          paymentMethod,
          notes,
          items: cartDetailedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
          })),
        },
      });

      if (response.order?.paymentStatus === 'paid' || response.order?.paymentStatus === 'cod') {
        clearCart();
        setOrders((current) => [response.order, ...current]);
      }

      return response;
    },
    [cartDetailedItems],
  );

  const verifyPayment = useCallback(async (payload) => {
    const response = await apiRequest('/orders/verify-payment', {
      method: 'POST',
      data: payload,
    });

    clearCart();
    setOrders((current) => [response.order, ...current.filter((order) => order._id !== response.order._id)]);
    return response;
  }, []);

  const trackEvent = useCallback(async (eventPayload) => {
    try {
      await apiRequest('/analytics/track', {
        method: 'POST',
        data: eventPayload,
      });
    } catch (error) {
      console.warn('Analytics event skipped:', error.message);
    }
  }, []);

  const value = useMemo(
    () => ({
      catalog,
      collectionConfigs,
      wishlistIds,
      cartItems,
      cartDetailedItems,
      cartTotals,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      wishlistCount: wishlistIds.length,
      quickViewProduct,
      loginOpen,
      searchOpen,
      newsletterOpen,
      exitIntentOpen,
      supportOpen,
      cartOpen,
      flashMessage,
      isLoading: isLoading || productsLoading,
      productsLoading,
      orders,
      isAdmin,
      profile,
      recentPurchase: recentPurchaseNotifications[recentNotificationIndex],
      toggleWishlist,
      addToCart,
      buyNow,
      updateCartItem,
      removeCartItem,
      clearCart,
      getCollectionProductsFromCatalog,
      getProductBySlugFromCatalog,
      fetchRecommendations,
      applyCoupon,
      placeOrder,
      verifyPayment,
      trackEvent,
      setQuickViewProduct,
      setLoginOpen,
      setSearchOpen,
      setNewsletterOpen,
      setExitIntentOpen,
      setSupportOpen,
      setCartOpen,
      setFlashMessage,
    }),
    [
      addToCart,
      applyCoupon,
      buyNow,
      catalog,
      cartDetailedItems,
      cartItems,
      cartOpen,
      cartTotals,
      clearCart,
      collectionConfigs,
      exitIntentOpen,
      fetchRecommendations,
      flashMessage,
      getCollectionProductsFromCatalog,
      getProductBySlugFromCatalog,
      isLoading,
      isAdmin,
      loginOpen,
      newsletterOpen,
      orders,
      placeOrder,
      productsLoading,
      profile,
      quickViewProduct,
      recentNotificationIndex,
      removeCartItem,
      searchOpen,
      supportOpen,
      toggleWishlist,
      trackEvent,
      updateCartItem,
      verifyPayment,
      wishlistIds,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }

  return context;
}
