import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface CatalogoPageProps {
  categoriaInicial?: string;
}

const CATEGORIAS = ['Todas', 'Sala', 'Comedor', 'Dormitorio', 'Iluminación', 'Estudio'] as const;

export const CatalogoPage: React.FC<CatalogoPageProps> = ({ categoriaInicial }) => {
  const { productos } = useStore();

  const maxCatalogPrice = useMemo(
    () => Math.max(7000, ...productos.map((p) => p.precio)),
    [productos]
  );

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<string>(categoriaInicial || 'Todas');
  const [material, setMaterial] = useState<string>('Todos');
  const [precioMax, setPrecioMax] = useState<number>(maxCatalogPrice);
  const [soloStock, setSoloStock] = useState(false);
  const [orden, setOrden] = useState<'destacados' | 'precio_asc' | 'precio_desc' | 'nombre'>(
    'destacados'
  );

  useEffect(() => {
    if (categoriaInicial) {
      setCategoria(categoriaInicial);
    }
  }, [categoriaInicial]);

  useEffect(() => {
    if (precioMax > maxCatalogPrice) {
      setPrecioMax(maxCatalogPrice);
    }
  }, [maxCatalogPrice, precioMax]);

  const materialesDisponibles = useMemo(() => {
    const set = new Set(productos.map((p) => p.material));
    return ['Todos', ...Array.from(set).sort()];
  }, [productos]);

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    const list = productos.filter((p) => {
      if (categoria !== 'Todas' && p.categoria !== categoria) return false;
      if (material !== 'Todos' && p.material !== material) return false;
      if (p.precio > precioMax) return false;
      if (soloStock && p.stock <= 0) return false;
      if (query) {
        const hayMatch =
          p.nombre.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query) ||
          p.categoria.toLowerCase().includes(query);
        if (!hayMatch) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (orden === 'precio_asc') sorted.sort((a, b) => a.precio - b.precio);
    else if (orden === 'precio_desc') sorted.sort((a, b) => b.precio - a.precio);
    else if (orden === 'nombre') sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    else sorted.sort((a, b) => Number(b.destacado) - Number(a.destacado));

    return sorted;
  }, [productos, busqueda, categoria, material, precioMax, soloStock, orden]);

  const hayFiltrosActivos =
    busqueda !== '' ||
    categoria !== 'Todas' ||
    material !== 'Todos' ||
    precioMax < maxCatalogPrice ||
    soloStock;

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('Todas');
    setMaterial('Todos');
    setPrecioMax(maxCatalogPrice);
    setSoloStock(false);
    setOrden('destacados');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E6E0D6] dark:border-[#262421]">
        <div>
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
            Archivo de Mobiliario
          </div>
          <h1 className="mt-1.5 font-display text-4xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            Catálogo de colección
          </h1>
        </div>
        <div className="text-sm text-[#5C554E] dark:text-[#A8A197] tabular-nums">
          Mostrando <span className="font-semibold text-[#1A1A1A] dark:text-[#F4F1EC]">{filtrados.length}</span> de {productos.length} piezas
        </div>
      </div>

      {/* Dynamic Filter Controls Bar */}
      <div className="mt-8 bg-[#F2EFE9] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrar por categoría"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E8E2D9] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2A2824] rounded-md"
          >
            {CATEGORIAS.map((cat) => {
              const active = categoria === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategoria(cat)}
                  className={`relative px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'text-[#F9F8F6] dark:text-[#141413]'
                      : 'text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalogCategoryPill"
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-[#1A1A1A] dark:bg-[#F4F1EC] rounded-md"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              className="w-4 h-4 text-[#6F675E] dark:text-[#A8A197] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pieza, material o SKU..."
              aria-label="Buscar en el catálogo"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] placeholder:text-[#8E867E] focus:outline-none focus:border-[#8C6D53]"
            />
          </div>
        </div>

        {/* Secondary Dynamic Filters Row */}
        <div className="pt-4 border-t border-[#E3DDD2] dark:border-[#282622] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          <div className="space-y-1.5">
            <label
              htmlFor="filtro-material"
              className="block text-xs font-medium text-[#5C554E] dark:text-[#A8A197]"
            >
              Material principal
            </label>
            <select
              id="filtro-material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
            >
              {materialesDisponibles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="filtro-precio"
                className="font-medium text-[#5C554E] dark:text-[#A8A197]"
              >
                Precio máximo
              </label>
              <span className="font-mono font-medium text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                {formatUSD(precioMax)}
              </span>
            </div>
            <input
              id="filtro-precio"
              type="range"
              min={1000}
              max={maxCatalogPrice}
              step={100}
              value={precioMax}
              onChange={(e) => setPrecioMax(Number(e.target.value))}
              className="w-full accent-[#8C6D53] dark:accent-[#C5A587] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="orden-catalogo"
              className="block text-xs font-medium text-[#5C554E] dark:text-[#A8A197]"
            >
              Ordenar colección
            </label>
            <select
              id="orden-catalogo"
              value={orden}
              onChange={(e) => setOrden(e.target.value as typeof orden)}
              className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
            >
              <option value="destacados">Piezas destacadas</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="nombre">Orden alfabético (A–Z)</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 h-[38px]">
            <label className="inline-flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-[#E8E2D9] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={soloStock}
                onChange={(e) => setSoloStock(e.target.checked)}
                className="w-4 h-4 accent-[#8C6D53] dark:accent-[#C5A587] rounded-sm cursor-pointer"
              />
              <span>Solo en existencia</span>
            </label>

            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C6D53] dark:text-[#C5A587] hover:underline cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filtrados.length > 0 ? (
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtrados.map((producto, idx) => (
            <ProductCard key={producto.id} producto={producto} index={idx} />
          ))}
        </motion.div>
      ) : (
        <div className="mt-12 py-16 px-6 text-center border border-dashed border-[#D8D0C4] dark:border-[#33302B] rounded-lg space-y-4">
          <SlidersHorizontal
            className="w-8 h-8 mx-auto text-[#8C6D53] dark:text-[#C5A587]"
            aria-hidden="true"
          />
          <h2 className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            Ninguna pieza coincide con estos criterios
          </h2>
          <p className="text-sm text-[#5C554E] dark:text-[#A8A197] max-w-md mx-auto">
            Ajusta el rango de precio o limpia los filtros activos para explorar toda la
            colección residencial de Multiforme.
          </p>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Mostrar todo el catálogo</span>
          </button>
        </div>
      )}
    </section>
  );
};
