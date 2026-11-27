import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import initialProductos from '../data/productos.json';
import { AppRoute, CartItem, PedidoConfirmado, Producto } from '../types';
import { appPath } from '../utils/paths';

const STORAGE_KEYS = {
  productos: 'multiforme_productos_v2',
  carrito: 'multiforme_carrito_v1',
  favoritos: 'multiforme_favoritos_v1',
  theme: 'multiforme_theme',
};

interface ToastMessage {
  id: number;
  texto: string;
  tipo: 'success' | 'info' | 'warning';
}

interface StoreContextValue {
  productos: Producto[];
  carrito: CartItem[];
  favoritos: string[];
  theme: 'light' | 'dark';
  route: AppRoute;
  toast: ToastMessage | null;
  totalCartCount: number;
  navigate: (path: string) => void;
  toggleTheme: () => void;
  addToCart: (productId: string, acabado?: string, cantidad?: number) => boolean;
  updateCartQty: (productId: string, acabado: string, cantidad: number) => void;
  removeFromCart: (productId: string, acabado: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addProduct: (producto: Omit<Producto, 'id'>) => Producto;
  updateProduct: (id: string, updates: Partial<Producto>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  resetCatalog: () => void;
  completeOrder: (payload: {
    cliente: string;
    email: string;
    direccion: string;
    descuentoAplicado: boolean;
  }) => PedidoConfirmado | null;
  dismissToast: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function parseRouteFromLocation(): AppRoute {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const locationPath = window.location.pathname.toLowerCase();
  const pathname =
    locationPath === basePath
      ? '/'
      : locationPath.startsWith(`${basePath}/`)
      ? locationPath.slice(basePath.length)
      : locationPath;
  const params = new URLSearchParams(window.location.search);

  if (pathname === '/' || pathname === '/index.html') {
    return { name: 'inicio' };
  }
  if (pathname === '/catalogo' || pathname === '/catalogo.html') {
    const cat = params.get('categoria') || undefined;
    return { name: 'catalogo', categoriaInicial: cat };
  }
  if (pathname === '/producto.html') {
    const id = params.get('id') || '';
    return id ? { name: 'producto', id } : { name: '404' };
  }
  if (pathname.startsWith('/producto/')) {
    const id = decodeURIComponent(pathname.replace('/producto/', '').split('/')[0]);
    return id ? { name: 'producto', id } : { name: '404' };
  }
  if (pathname === '/carrito' || pathname === '/carrito.html') {
    const tab = params.get('tab') === 'favoritos' ? 'favoritos' : 'carrito';
    return { name: 'carrito', tab };
  }
  if (pathname === '/favoritos') {
    return { name: 'carrito', tab: 'favoritos' };
  }
  if (pathname === '/contacto' || pathname === '/contacto.html') {
    return { name: 'contacto' };
  }
  if (pathname === '/admin' || pathname === '/admin.html') {
    return { name: 'admin' };
  }
  return { name: '404' };
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.productos);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial JSON
    }
    return initialProductos as Producto[];
  });

  const [carrito, setCarrito] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.carrito);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.favoritos);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [route, setRoute] = useState<AppRoute>(() => parseRouteFromLocation());
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((texto: string, tipo: ToastMessage['tipo'] = 'success') => {
    setToast({ id: Date.now(), texto, tipo });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(productos));
    } catch {
      // Ignore storage quota errors
    }
  }, [productos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.carrito, JSON.stringify(carrito));
    } catch {
      // Ignore storage quota errors
    }
  }, [carrito]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favoritos, JSON.stringify(favoritos));
    } catch {
      // Ignore storage quota errors
    }
  }, [favoritos]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  useEffect(() => {
    const handlePop = () => {
      setRoute(parseRouteFromLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = useCallback((path: string) => {
    const destination = appPath(path);
    if (window.location.pathname + window.location.search === destination) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', destination);
    setRoute(parseRouteFromLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const addToCart = useCallback(
    (productId: string, acabado?: string, cantidad = 1): boolean => {
      const producto = productos.find((p) => p.id === productId);
      if (!producto) return false;

      if (producto.stock <= 0) {
        showToast(`${producto.nombre} se encuentra temporalmente agotado.`, 'warning');
        return false;
      }

      const selectedFinish = acabado || producto.acabados[0] || producto.material;
      let added = false;

      setCarrito((prev) => {
        const totalOfProductInCart = prev
          .filter((item) => item.productId === productId)
          .reduce((sum, item) => sum + item.cantidad, 0);

        if (totalOfProductInCart + cantidad > producto.stock) {
          showToast(
            `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`,
            'warning'
          );
          return prev;
        }

        added = true;
        const idx = prev.findIndex(
          (item) => item.productId === productId && item.acabado === selectedFinish
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cantidad };
          return next;
        }
        return [...prev, { productId, acabado: selectedFinish, cantidad }];
      });

      if (added) {
        showToast(`${producto.nombre} añadido al carrito.`, 'success');
      }
      return added;
    },
    [productos, showToast]
  );

  const updateCartQty = useCallback(
    (productId: string, acabado: string, cantidad: number) => {
      const producto = productos.find((p) => p.id === productId);
      if (!producto) return;

      if (cantidad <= 0) {
        setCarrito((prev) =>
          prev.filter((i) => !(i.productId === productId && i.acabado === acabado))
        );
        return;
      }

      setCarrito((prev) => {
        const otherVariantsQty = prev
          .filter((i) => i.productId === productId && i.acabado !== acabado)
          .reduce((sum, i) => sum + i.cantidad, 0);
        const maxAllowed = Math.max(0, producto.stock - otherVariantsQty);
        const clamped = Math.min(cantidad, maxAllowed);
        if (cantidad > maxAllowed) {
          showToast(`Stock máximo alcanzado (${producto.stock} unidades).`, 'warning');
        }
        return prev.map((i) =>
          i.productId === productId && i.acabado === acabado
            ? { ...i, cantidad: clamped }
            : i
        );
      });
    },
    [productos, showToast]
  );

  const removeFromCart = useCallback((productId: string, acabado: string) => {
    setCarrito((prev) =>
      prev.filter((i) => !(i.productId === productId && i.acabado === acabado))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCarrito([]);
  }, []);

  const toggleFavorite = useCallback(
    (productId: string) => {
      const producto = productos.find((p) => p.id === productId);
      setFavoritos((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          if (producto) showToast(`${producto.nombre} eliminado de favoritos.`, 'info');
          return prev.filter((id) => id !== productId);
        }
        if (producto) showToast(`${producto.nombre} guardado en favoritos.`, 'success');
        return [...prev, productId];
      });
    },
    [productos, showToast]
  );

  const isFavorite = useCallback(
    (productId: string) => favoritos.includes(productId),
    [favoritos]
  );

  const addProduct = useCallback(
    (newProd: Omit<Producto, 'id'>): Producto => {
      const created: Producto = {
        ...newProd,
        id: `mf-${Date.now().toString(36)}`,
      };
      setProductos((prev) => [created, ...prev]);
      showToast(`Pieza "${created.nombre}" añadida al catálogo.`, 'success');
      return created;
    },
    [showToast]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Producto>) => {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      showToast('Producto actualizado correctamente.', 'success');
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setCarrito((prev) => prev.filter((i) => i.productId !== id));
      setFavoritos((prev) => prev.filter((fid) => fid !== id));
      showToast('Pieza eliminada del catálogo.', 'info');
    },
    [showToast]
  );

  const adjustStock = useCallback((id: string, delta: number) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  }, []);

  const resetCatalog = useCallback(() => {
    setProductos(initialProductos as Producto[]);
    showToast('Catálogo restablecido a los valores originales.', 'info');
  }, [showToast]);

  const completeOrder = useCallback(
    (payload: {
      cliente: string;
      email: string;
      direccion: string;
      descuentoAplicado: boolean;
    }): PedidoConfirmado | null => {
      if (carrito.length === 0) return null;

      const orderItems = carrito
        .map((item) => {
          const p = productos.find((prod) => prod.id === item.productId);
          if (!p) return null;
          return {
            nombre: p.nombre,
            sku: p.sku,
            acabado: item.acabado,
            cantidad: item.cantidad,
            precioUnitario: p.precio,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.precioUnitario * item.cantidad,
        0
      );
      const descuento = payload.descuentoAplicado ? Math.round(subtotal * 0.1) : 0;
      const envio = subtotal - descuento >= 4500 ? 0 : 180;
      const total = subtotal - descuento + envio;

      // Deduct stock from inventory
      setProductos((prev) =>
        prev.map((p) => {
          const orderedQty = carrito
            .filter((i) => i.productId === p.id)
            .reduce((s, i) => s + i.cantidad, 0);
          if (orderedQty === 0) return p;
          return { ...p, stock: Math.max(0, p.stock - orderedQty) };
        })
      );

      setCarrito([]);

      const orderNum = `MF-${Math.floor(1000 + Math.random() * 9000)}`;
      const fecha = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date());

      showToast(`Pedido ${orderNum} confirmado.`, 'success');

      return {
        numero: orderNum,
        fecha,
        cliente: payload.cliente,
        email: payload.email,
        direccion: payload.direccion,
        items: orderItems,
        subtotal,
        descuento,
        envio,
        total,
      };
    },
    [carrito, productos, showToast]
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const totalCartCount = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <StoreContext.Provider
      value={{
        productos,
        carrito,
        favoritos,
        theme,
        route,
        toast,
        totalCartCount,
        navigate,
        toggleTheme,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        resetCatalog,
        completeOrder,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function formatUSD(amount: number): string {
  return `$${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)} USD`;
}
