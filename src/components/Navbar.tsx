import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { route, navigate, totalCartCount, favoritos, theme, toggleTheme } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', path: '/', active: route.name === 'inicio' },
    { label: 'Catálogo', path: '/catalogo', active: route.name === 'catalogo' || route.name === 'producto' },
    {
      label: 'Favoritos',
      path: '/carrito?tab=favoritos',
      active: route.name === 'carrito' && route.tab === 'favoritos',
    },
    { label: 'Contacto', path: '/contacto', active: route.name === 'contacto' },
  ];

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Slim Editorial Atelier Strip */}
      <div className="bg-[#141413] dark:bg-[#0D0D0C] text-[#EAE5DD] border-b border-[#2A2824]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-9 flex items-center justify-between text-xs">
          <span className="text-[#C9C1B6] truncate tracking-wide">
            Madrid · Milán · Ciudad de México — Ediciones arquitectónicas numeradas
          </span>
          <div className="flex items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/carrito?tab=favoritos')}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#DFD7CC] hover:text-[#C5A587] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#C5A587]" aria-hidden="true" />
              <span className="tabular-nums">Favoritos ({favoritos.length})</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="inline-flex items-center gap-1.5 text-[#DFD7CC] hover:text-[#C5A587] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#C5A587]" aria-hidden="true" />
                  <span>Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#C5A587]" aria-hidden="true" />
                  <span>Modo oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Top Bar: Strictly 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#F9F8F6]/92 dark:bg-[#141413]/92 backdrop-blur-md border-b border-[#E6E0D6] dark:border-[#262421] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => handleNav(e, '/')}
            className="font-display text-2xl sm:text-[28px] font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F4F1EC] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C6D53]"
          >
            Multiforme
          </a>

          {/* Zone 2: Clean Single-Line Nav Links with gliding bronze underline */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={(e) => handleNav(e, link.path)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C6D53] ${
                  link.active
                    ? 'text-[#1A1A1A] dark:text-[#F4F1EC] font-semibold'
                    : 'text-[#6B645C] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]'
                }`}
              >
                {link.label}
                {link.active && (
                  <motion.span
                    layoutId="activeNavUnderline"
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#8C6D53] dark:bg-[#C5A587]"
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action (Carrito) with silky fill sweep + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/carrito')}
              className="group relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md transition-colors duration-300 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C6D53]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#8C6D53] dark:bg-[#C5A587] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <ShoppingBag className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
              <motion.span
                key={totalCartCount}
                initial={{ opacity: 0.6, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 tabular-nums"
              >
                Carrito ({totalCartCount})
              </motion.span>
            </motion.button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              className="md:hidden p-2 min-w-[40px] min-h-[40px] inline-flex items-center justify-center text-[#1A1A1A] dark:text-[#F4F1EC] border border-[#E6E0D6] dark:border-[#2C2A26] rounded-md cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden border-t border-[#E6E0D6] dark:border-[#262421] bg-[#F9F8F6] dark:bg-[#181715] px-4 py-4 space-y-2"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={(e) => handleNav(e, link.path)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-md ${
                    link.active
                      ? 'bg-[#8C6D53]/12 dark:bg-[#C5A587]/15 text-[#1A1A1A] dark:text-[#F4F1EC]'
                      : 'text-[#5C554E] dark:text-[#A8A197]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
