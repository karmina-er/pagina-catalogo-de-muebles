import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { FloatingShowcase } from '../components/FloatingShowcase';
import { appPath } from '../utils/paths';

export const InicioPage: React.FC = () => {
  const { productos, navigate } = useStore();
  const destacados = productos.filter((p) => p.destacado).slice(0, 6);
  const heroPiece = productos.find((p) => p.id === 'mf-01') || productos[0];

  const pilares = [
    { metric: '25 años', label: 'Maestría en ebanistería residencial' },
    { metric: '100% FSC', label: 'Nogal europeo y roble certificado' },
    { metric: '10 años', label: 'Garantía en estructura y bronce' },
    { metric: 'Guante blanco', label: 'Entrega e instalación asegurada' },
  ];

  const materiales = [
    {
      titulo: '01. Terciopelo y lino natural',
      detalle:
        'Tejidos de pelo corto en algodón italiano de 620 g/m² y bouclé francés sin tratamientos sintéticos.',
    },
    {
      titulo: '02. Bronce cepillado',
      detalle:
        'Perfiles macizos acabados manualmente con cepillo de acero fino y cera microcristalina de pátina cálida.',
    },
    {
      titulo: '03. Travertino y nogal',
      detalle:
        'Piedra natural apomazada de cantera abierta combinada con maderas nobles secadas durante veinticuatro meses.',
    },
  ];

  return (
    <div>
      {/* Section 1: Storefront Hero with Levitating Centerpiece & Cursor/Scroll Parallax */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]"
            >
              Colección Residencial 2026 · Series Numeradas
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-medium text-[#1A1A1A] dark:text-[#F4F1EC] leading-[1.03] tracking-tight"
              style={{ fontSize: 'clamp(2.75rem, 4.8vw, 4.5rem)', textWrap: 'balance' }}
            >
              Escultura habitable en nogal, piedra y bronce.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg leading-relaxed text-[#5C554E] dark:text-[#A8A197] max-w-md"
            >
              Mobiliario de autor concebido como piezas de galería. Proporciones serenas,
              materiales vivos y acabados pensados para acompañar generaciones.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              {/* Minimalist CTA with smooth GPU fill-sweep hover */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/catalogo')}
                className="group relative overflow-hidden inline-flex items-center gap-3 px-7 py-4 text-sm font-medium tracking-wide border border-[#1A1A1A] dark:border-[#F4F1EC] text-[#1A1A1A] dark:text-[#F4F1EC] rounded-md transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#1A1A1A] dark:bg-[#F4F1EC] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <span className="relative z-10 group-hover:text-[#F9F8F6] dark:group-hover:text-[#141413] transition-colors duration-300">
                  Explorar colección
                </span>
                <ArrowRight
                  className="relative z-10 w-4 h-4 group-hover:text-[#F9F8F6] dark:group-hover:text-[#141413] group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  aria-hidden="true"
                />
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/contacto')}
                className="px-4 py-3 text-sm font-medium text-[#5C554E] dark:text-[#A8A197] hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                Cita privada en showroom
              </button>
            </motion.div>
          </div>

          {/* Hero Flagship Piece: Levitating + Dynamic Floor Shadow + Parallax */}
          {heroPiece && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <FloatingShowcase
                src={heroPiece.imagen}
                alt={`${heroPiece.nombre} — Pieza insignia`}
                onClick={() => navigate(`/producto/${heroPiece.id}`)}
                subtitle={`Pieza insignia · ${heroPiece.material}`}
                title={heroPiece.nombre}
                price={formatUSD(heroPiece.precio)}
              />
            </motion.div>
          )}
        </div>

        {/* Full-Width 4-Column Craftsmanship Metrics Strip */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 border-y border-[#E6E0D6] dark:border-[#262421]">
          {pilares.map((pilar, idx) => (
            <motion.div
              key={pilar.metric}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`py-7 px-4 sm:px-6 ${
                idx < 3 ? 'lg:border-r border-[#E6E0D6] dark:border-[#262421]' : ''
              } ${idx % 2 === 0 ? 'border-r lg:border-r border-[#E6E0D6] dark:border-[#262421]' : ''} ${
                idx < 2 ? 'border-b lg:border-b-0 border-[#E6E0D6] dark:border-[#262421]' : ''
              }`}
            >
              <div className="font-display text-2xl sm:text-3xl font-medium text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                {pilar.metric}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[#5C554E] dark:text-[#A8A197]">
                {pilar.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: Colección Destacada (Floating Gallery Pedestals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
              Selección Curatorial
            </div>
            <h2 className="mt-1.5 font-display text-3xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
              Piezas destacadas en suspensión
            </h2>
          </div>
          <a
            href={appPath('/catalogo')}
            onClick={(e) => {
              e.preventDefault();
              navigate('/catalogo');
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] dark:text-[#F4F1EC] hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors whitespace-nowrap"
          >
            <span>Explorar las {productos.length} piezas</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destacados.map((producto, idx) => (
            <ProductCard key={producto.id} producto={producto} index={idx} floating />
          ))}
        </div>
      </section>

      {/* Section 3: High-Contrast Deep Charcoal Atelier & Materials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#141413] dark:bg-[#1B1A18] text-[#F4F1EC] border border-[#2C2A26] rounded-xl p-8 sm:p-14 lg:p-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#C5A587]">
                Atelier Multiforme
              </div>
              <h2
                className="font-display text-3xl sm:text-5xl font-medium text-[#F4F1EC] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Materiales nobles con pátina viva
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#A8A197]">
                Rechazamos los recubrimientos sintéticos. Trabajamos exclusivamente con piedras
                de cantera abierta, textiles teñidos en tina y bronce sólido sin lacas plásticas.
              </p>
              <div className="pt-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/contacto')}
                  className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold tracking-wide border border-[#C5A587] text-[#F4F1EC] rounded-md transition-colors cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#C5A587] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <span className="relative z-10 group-hover:text-[#141413] transition-colors duration-300">
                    Solicitar muestrario de materiales
                  </span>
                  <ArrowRight
                    className="relative z-10 w-3.5 h-3.5 group-hover:text-[#141413] transition-colors duration-300"
                    aria-hidden="true"
                  />
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-7">
              {materiales.map((mat, idx) => (
                <motion.div
                  key={mat.titulo}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.36, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="pt-5 border-t border-[#2E2C28] space-y-2.5"
                >
                  <h3 className="font-display text-2xl font-medium text-[#C5A587]">
                    {mat.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#A8A197]">
                    {mat.detalle}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
