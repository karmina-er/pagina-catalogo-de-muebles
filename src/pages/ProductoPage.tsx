import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Heart, Minus, Plus, Ruler, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { FloatingShowcase } from '../components/FloatingShowcase';
import { appPath } from '../utils/paths';

interface ProductoPageProps {
  id: string;
}

export const ProductoPage: React.FC<ProductoPageProps> = ({ id }) => {
  const { productos, navigate, addToCart, toggleFavorite, isFavorite } = useStore();
  const producto = productos.find((p) => p.id === id);

  const [acabado, setAcabado] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [vista, setVista] = useState<'estudio' | 'medidas'>('estudio');

  useEffect(() => {
    if (producto) {
      setAcabado(producto.acabados[0] || producto.material);
      setCantidad(1);
      setVista('estudio');
    }
  }, [producto]);

  if (!producto) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center space-y-5">
        <h1 className="font-display text-4xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
          Pieza no disponible
        </h1>
        <p className="text-sm text-[#5C554E] dark:text-[#A8A197]">
          La referencia solicitada no forma parte del archivo actual o fue retirada del catálogo.
        </p>
        <button
          type="button"
          onClick={() => navigate('/catalogo')}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Volver al catálogo</span>
        </button>
      </section>
    );
  }

  const agotado = producto.stock <= 0;
  const favorite = isFavorite(producto.id);
  const relacionados = productos
    .filter((p) => p.id !== producto.id)
    .sort((a, b) => Number(b.categoria === producto.categoria) - Number(a.categoria === producto.categoria))
    .slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-[#6F675E] dark:text-[#A8A197] mb-10">
        <a
          href={appPath('/')}
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]"
        >
          Inicio
        </a>
        <span aria-hidden="true">/</span>
        <a
          href={appPath('/catalogo')}
          onClick={(e) => {
            e.preventDefault();
            navigate('/catalogo');
          }}
          className="hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]"
        >
          Catálogo
        </a>
        <span aria-hidden="true">/</span>
        <a
          href={appPath(`/catalogo?categoria=${encodeURIComponent(producto.categoria)}`)}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/catalogo?categoria=${encodeURIComponent(producto.categoria)}`);
          }}
          className="hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]"
        >
          {producto.categoria}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-[#1A1A1A] dark:text-[#F4F1EC] font-medium truncate">
          {producto.nombre}
        </span>
      </nav>

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Sticky Floating Visual Showcase & Technical Blueprint */}
        <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {vista === 'estudio' ? (
              <motion.div
                key="estudio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <FloatingShowcase src={producto.imagen} alt={producto.nombre} />
              </motion.div>
            ) : (
              <motion.div
                key="medidas"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="aspect-[4/3] w-full p-8 sm:p-12 flex flex-col justify-between bg-[#F2EFE9] dark:bg-[#1C1B19] border border-[#E6E0D6] dark:border-[#2C2A26] rounded-xl"
              >
                <div className="flex items-center justify-between border-b border-[#D8D0C4] dark:border-[#2E2C28] pb-4">
                  <span className="font-mono text-xs text-[#8C6D53] dark:text-[#C5A587]">
                    PLANO TÉCNICO · {producto.sku}
                  </span>
                  <span className="text-xs text-[#6F675E] dark:text-[#A8A197]">
                    Cotas en centímetros
                  </span>
                </div>
                <div className="my-auto py-8 flex flex-col items-center justify-center space-y-6">
                  <div className="w-full max-w-md border border-dashed border-[#8C6D53] p-8 relative flex flex-col items-center justify-center bg-[#F9F8F6]/80 dark:bg-[#141413]/70 rounded-md">
                    <Ruler className="w-7 h-7 text-[#8C6D53] dark:text-[#C5A587] mb-3" aria-hidden="true" />
                    <div className="font-mono text-lg sm:text-xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] tabular-nums">
                      {producto.dimensiones}
                    </div>
                    <div className="mt-1 text-xs text-[#6F675E] dark:text-[#A8A197]">
                      Ancho × Profundidad × Alto
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-[#D8D0C4] dark:border-[#2E2C28] pt-4 text-xs">
                  <div>
                    <div className="text-[#6F675E] dark:text-[#A8A197]">Peso neto</div>
                    <div className="font-mono font-medium text-[#1A1A1A] dark:text-[#F4F1EC] tabular-nums">
                      {producto.peso}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6F675E] dark:text-[#A8A197]">Taller de origen</div>
                    <div className="font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                      {producto.origen}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#6F675E] dark:text-[#A8A197]">Estructura</div>
                    <div className="font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                      Ensamble macizo
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVista('estudio')}
              className={`px-4 py-2 text-xs font-medium rounded-md border transition-colors duration-200 cursor-pointer ${
                vista === 'estudio'
                  ? 'bg-[#1A1A1A] dark:bg-[#F4F1EC] border-[#1A1A1A] dark:border-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B1A18] border-[#E6E0D6] dark:border-[#2A2824] text-[#5C554E] dark:text-[#A8A197]'
              }`}
            >
              Vista de estudio
            </button>
            <button
              type="button"
              onClick={() => setVista('medidas')}
              className={`px-4 py-2 text-xs font-medium rounded-md border transition-colors duration-200 cursor-pointer ${
                vista === 'medidas'
                  ? 'bg-[#1A1A1A] dark:bg-[#F4F1EC] border-[#1A1A1A] dark:border-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413]'
                  : 'bg-[#FFFFFF] dark:bg-[#1B1A18] border-[#E6E0D6] dark:border-[#2A2824] text-[#5C554E] dark:text-[#A8A197]'
              }`}
            >
              Ficha de dimensiones
            </button>
          </div>
        </div>

        {/* Right: Sticky Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="space-y-2.5 pb-6 border-b border-[#E6E0D6] dark:border-[#262421]">
            <div className="flex items-center gap-2 text-xs text-[#6F675E] dark:text-[#A8A197]">
              <span>{producto.categoria}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{producto.sku}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] leading-tight">
              {producto.nombre}
            </h1>

            <div className="pt-1 flex items-center justify-between gap-4">
              <span className="font-mono text-2xl font-medium text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                {formatUSD(producto.precio)}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                {agotado ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#8E3B46] dark:text-[#E5989B]" aria-hidden="true" />
                    <span className="text-[#8E3B46] dark:text-[#E5989B]">Agotado temporalmente</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587]" aria-hidden="true" />
                    <span className="text-[#1A1A1A] dark:text-[#E8E2D9] tabular-nums">
                      En existencia ({producto.stock} {producto.stock === 1 ? 'unidad' : 'unidades'})
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-[#5C554E] dark:text-[#A8A197]">
            {producto.descripcion}
          </p>

          {/* Finish / Acabado Selector */}
          <div className="space-y-2.5">
            <div className="text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]">
              Acabado seleccionado: <span className="text-[#8C6D53] dark:text-[#C5A587]">{acabado}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {producto.acabados.map((op) => {
                const selected = op === acabado;
                return (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setAcabado(op)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors duration-200 cursor-pointer ${
                      selected
                        ? 'border-[#8C6D53] dark:border-[#C5A587] bg-[#8C6D53]/10 dark:bg-[#C5A587]/15 text-[#1A1A1A] dark:text-[#F4F1EC]'
                        : 'border-[#DFD8CE] dark:border-[#2E2C28] text-[#5C554E] dark:text-[#A8A197] hover:border-[#8C6D53]'
                    }`}
                  >
                    {op}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Primary Purchase CTA with silky fill-sweep */}
          <div className="pt-2 space-y-3">
            <div className="flex items-stretch gap-3">
              <div className="inline-flex items-center border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md bg-[#FFFFFF] dark:bg-[#1B1A18]">
                <button
                  type="button"
                  disabled={agotado || cantidad <= 1}
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  aria-label="Disminuir cantidad"
                  className="px-3 py-3 text-[#1A1A1A] dark:text-[#F4F1EC] disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-mono text-sm font-medium tabular-nums min-w-[2.5rem] text-center">
                  {cantidad}
                </span>
                <button
                  type="button"
                  disabled={agotado || cantidad >= producto.stock}
                  onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                  aria-label="Aumentar cantidad"
                  className="px-3 py-3 text-[#1A1A1A] dark:text-[#F4F1EC] disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                type="button"
                whileTap={agotado ? undefined : { scale: 0.98 }}
                disabled={agotado}
                onClick={() => addToCart(producto.id, acabado, cantidad)}
                className={`group relative overflow-hidden flex-1 py-3.5 px-6 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  agotado
                    ? 'bg-[#ECE7DF] dark:bg-[#262421] text-[#9A9288] cursor-not-allowed'
                    : 'bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] cursor-pointer'
                }`}
              >
                {!agotado && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#8C6D53] dark:bg-[#C5A587] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                )}
                <span className="relative z-10">
                  {agotado ? 'Sin existencias' : 'Añadir a la colección'}
                </span>
              </motion.button>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(producto.id)}
              className="w-full py-2.5 px-4 inline-flex items-center justify-center gap-2 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] hover:border-[#8C6D53] rounded-md text-[#1A1A1A] dark:text-[#E8E2D9] transition-colors duration-200 cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${favorite ? 'fill-[#8C6D53] text-[#8C6D53] dark:fill-[#C5A587] dark:text-[#C5A587]' : ''}`}
                aria-hidden="true"
              />
              <span>{favorite ? 'Guardado en favoritos' : 'Guardar en favoritos'}</span>
            </button>
          </div>

          {/* Technical Specifications Table */}
          <div className="pt-4 border-t border-[#E6E0D6] dark:border-[#262421]">
            <dl className="divide-y divide-[#EEE9E0] dark:divide-[#24221E] text-sm">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-[#6F675E] dark:text-[#A8A197]">Dimensiones</dt>
                <dd className="font-mono text-[#1A1A1A] dark:text-[#F4F1EC] tabular-nums">{producto.dimensiones}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-[#6F675E] dark:text-[#A8A197]">Materiales</dt>
                <dd className="text-[#1A1A1A] dark:text-[#F4F1EC] text-right">{producto.material}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-[#6F675E] dark:text-[#A8A197]">Peso neto</dt>
                <dd className="font-mono text-[#1A1A1A] dark:text-[#F4F1EC] tabular-nums">{producto.peso}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-[#6F675E] dark:text-[#A8A197]">Origen</dt>
                <dd className="text-[#1A1A1A] dark:text-[#F4F1EC]">{producto.origen}</dd>
              </div>
            </dl>
          </div>

          {/* Service Assurances */}
          <div className="pt-2 space-y-2 text-xs text-[#5C554E] dark:text-[#A8A197]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0" aria-hidden="true" />
              <span>Envío asegurado sin costo en pedidos superiores a $4,500 USD</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C6D53] dark:text-[#C5A587] shrink-0" aria-hidden="true" />
              <span>Certificado de autenticidad y garantía estructural de 10 años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pieces */}
      <div className="mt-24 pt-14 border-t border-[#E6E0D6] dark:border-[#262421]">
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] mb-10">
          Piezas complementarias
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relacionados.map((item, idx) => (
            <ProductCard key={item.id} producto={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
