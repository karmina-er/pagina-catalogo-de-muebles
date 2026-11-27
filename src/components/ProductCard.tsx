import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Heart, Plus } from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { Producto } from '../types';
import { appPath, assetPath } from '../utils/paths';

interface ProductCardProps {
  producto: Producto;
  index?: number;
  floating?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  index = 0,
  floating = false,
}) => {
  const { navigate, addToCart, toggleFavorite, isFavorite } = useStore();
  const [imgError, setImgError] = useState(false);
  const favorite = isFavorite(producto.id);
  const agotado = producto.stock <= 0;

  // Stagger organic float phase so adjacent furniture pieces move independently
  const floatDelay = `${(index % 4) * 0.85}s`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.42,
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group flex flex-col bg-[#FFFFFF] dark:bg-[#1B1A18] rounded-lg border border-[#E8E2D9]/90 dark:border-[#2A2824] hover:border-[#8C6D53]/55 dark:hover:border-[#C5A587]/55 transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_24px_48px_-20px_rgba(26,26,26,0.16)] dark:hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.75)] overflow-hidden"
    >
      {/* Gallery Stage with generous breathing room & levitation */}
      <div className="relative bg-[#F2EFE9] dark:bg-[#22201D] px-6 pt-7 pb-5 overflow-hidden">
        <a
          href={appPath(`/producto/${producto.id}`)}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/producto/${producto.id}`);
          }}
          className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C6D53]"
        >
          <div
            style={floating ? { animationDelay: floatDelay } : undefined}
            className={floating ? 'animate-levitate-subtle' : ''}
          >
            <div className="relative aspect-[4/3] rounded-md overflow-hidden shadow-[0_14px_28px_-14px_rgba(26,26,26,0.22)] dark:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.75)]">
              {!imgError ? (
                <>
                  {/* Primary Gallery Shot */}
                  <img
                    src={assetPath(producto.imagen)}
                    alt={`${producto.nombre} — ${producto.material}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] group-hover:opacity-0"
                  />
                  {/* Secondary Craftsmanship Texture / Detail Reveal on Hover */}
                  <img
                    src={assetPath(producto.imagen)}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-[1.22] opacity-0 group-hover:opacity-100 group-hover:scale-[1.14] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] contrast-[1.04]"
                  />
                  {/* Subtle Craftsmanship Scrim on Detail Reveal */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141413]/75 via-[#141413]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-end p-4">
                    <span className="font-mono text-[11px] tracking-wide text-[#F4F1EC]/95 tabular-nums">
                      {producto.dimensiones} · {producto.origen}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F2EFE9] to-[#E6E0D6] dark:from-[#22201D] dark:to-[#181715]">
                  <span className="font-display text-2xl text-[#1A1A1A] dark:text-[#F4F1EC]">
                    {producto.nombre}
                  </span>
                  <span className="mt-1 text-xs text-[#6F675E] dark:text-[#A8A197]">
                    {producto.material}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Diffused Floor Shadow underneath floating furniture */}
          <div
            aria-hidden="true"
            style={floating ? { animationDelay: floatDelay } : undefined}
            className={`mx-auto mt-3.5 w-[76%] h-4 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.30)_0%,rgba(26,26,26,0.08)_55%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.22)_55%,transparent_80%)] blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-90 group-hover:opacity-65 ${
              floating ? 'animate-shadow-breathe-subtle' : ''
            }`}
          />
        </a>

        {/* Favorite Heart Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          onClick={() => toggleFavorite(producto.id)}
          aria-label={favorite ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}
          aria-pressed={favorite}
          className={`absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-md border transition-colors duration-200 cursor-pointer ${
            favorite
              ? 'bg-[#1A1A1A] dark:bg-[#C5A587] border-[#1A1A1A] dark:border-[#C5A587] text-[#F9F8F6] dark:text-[#141413]'
              : 'bg-[#F9F8F6]/90 dark:bg-[#141413]/85 border-[#E6E0D6] dark:border-[#2C2A26] text-[#5C554E] dark:text-[#D5CFC6] hover:border-[#8C6D53] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} aria-hidden="true" />
        </motion.button>
      </div>

      {/* Editorial Metadata & Discreetly Revealed Actions */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#6F675E] dark:text-[#A8A197]">
            <div className="flex items-center gap-1.5 truncate">
              <span>{producto.categoria}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{producto.material}</span>
            </div>
            {agotado ? (
              <span className="text-[#8E3B46] dark:text-[#E5989B] font-medium shrink-0">
                Agotado
              </span>
            ) : producto.stock <= 2 ? (
              <span className="text-[#8C6D53] dark:text-[#C5A587] font-medium shrink-0">
                Últimas {producto.stock}
              </span>
            ) : null}
          </div>

          <h3 className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] leading-snug">
            <a
              href={appPath(`/producto/${producto.id}`)}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/producto/${producto.id}`);
              }}
              className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors duration-200"
            >
              {producto.nombre}
            </a>
          </h3>
        </div>

        <div className="pt-3.5 border-t border-[#EEE9E0] dark:border-[#282622] flex items-center justify-between gap-3">
          <span className="font-mono text-sm font-medium text-[#1A1A1A] dark:text-[#C5A587] tabular-nums">
            {formatUSD(producto.precio)}
          </span>

          {/* Discreet reveal on desktop hover/focus, always accessible on touch */}
          <div className="flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:opacity-80 md:translate-y-0.5 md:group-hover:opacity-100 md:group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => navigate(`/producto/${producto.id}`)}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Ver pieza</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <motion.button
              type="button"
              whileTap={agotado ? undefined : { scale: 0.95 }}
              disabled={agotado}
              onClick={() => addToCart(producto.id)}
              className={`group/btn relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 ${
                agotado
                  ? 'bg-[#ECE7DF] dark:bg-[#262421] text-[#9A9288] dark:text-[#66615B] cursor-not-allowed'
                  : 'bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] cursor-pointer'
              }`}
            >
              {!agotado && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#8C6D53] dark:bg-[#C5A587] origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              )}
              <Plus className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
              <span className="relative z-10">{agotado ? 'Sin stock' : 'Añadir'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
