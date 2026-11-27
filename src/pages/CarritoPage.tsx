import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Heart, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { PedidoConfirmado } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CarritoPageProps {
  initialTab: 'carrito' | 'favoritos';
}

export const CarritoPage: React.FC<CarritoPageProps> = ({ initialTab }) => {
  const {
    productos,
    carrito,
    favoritos,
    navigate,
    updateCartQty,
    removeFromCart,
    completeOrder,
  } = useStore();

  const [tab, setTab] = useState<'carrito' | 'favoritos'>(initialTab);
  const [codigo, setCodigo] = useState('');
  const [descuentoActivo, setDescuentoActivo] = useState(false);
  const [mensajeCodigo, setMensajeCodigo] = useState('');

  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [cliente, setCliente] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [errores, setErrores] = useState<{ cliente?: string; email?: string; direccion?: string }>({});
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoConfirmado | null>(null);

  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const itemsDetallados = carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productId);
      if (!producto) return null;
      return { ...item, producto };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const productosFavoritos = productos.filter((p) => favoritos.includes(p.id));

  const subtotal = itemsDetallados.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );
  const descuento = descuentoActivo ? Math.round(subtotal * 0.1) : 0;
  const envio = subtotal === 0 ? 0 : subtotal - descuento >= 4500 ? 0 : 180;
  const total = subtotal - descuento + envio;

  const aplicarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codigo.trim().toUpperCase();
    if (clean === 'MULTIFORME10') {
      setDescuentoActivo(true);
      setMensajeCodigo('Cortesía del 10% aplicada correctamente.');
    } else {
      setDescuentoActivo(false);
      setMensajeCodigo('Código no reconocido. Prueba con MULTIFORME10.');
    }
  };

  const procesarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errores = {};
    if (cliente.trim().length < 3) errs.cliente = 'Ingresa tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Ingresa un correo válido.';
    if (direccion.trim().length < 10) errs.direccion = 'Ingresa la dirección completa de entrega.';

    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    const orden = completeOrder({
      cliente: cliente.trim(),
      email: email.trim(),
      direccion: direccion.trim(),
      descuentoAplicado: descuentoActivo,
    });
    if (orden) {
      setPedidoConfirmado(orden);
      setMostrarCheckout(false);
      setDescuentoActivo(false);
      setCodigo('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#E6E0D6] dark:border-[#262421]">
        <div>
          <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
            Selección Personal
          </div>
          <h1 className="mt-1.5 font-display text-4xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            {tab === 'carrito' ? 'Bolsa de compras' : 'Piezas favoritas'}
          </h1>
        </div>

        {/* Segmented Tab Switch with smooth layoutId indicator */}
        <div
          role="tablist"
          aria-label="Secciones personales"
          className="inline-flex p-1 bg-[#F2EFE9] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-md self-start sm:self-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'carrito'}
            onClick={() => {
              setTab('carrito');
              navigate('/carrito');
            }}
            className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              tab === 'carrito'
                ? 'text-[#F9F8F6] dark:text-[#141413]'
                : 'text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]'
            }`}
          >
            {tab === 'carrito' && (
              <motion.span
                layoutId="cartTabIndicator"
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-[#1A1A1A] dark:bg-[#F4F1EC] rounded-md"
              />
            )}
            <ShoppingBag className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
            <span className="relative z-10 tabular-nums">
              Carrito ({itemsDetallados.reduce((s, i) => s + i.cantidad, 0)})
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'favoritos'}
            onClick={() => {
              setTab('favoritos');
              navigate('/carrito?tab=favoritos');
            }}
            className={`relative inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              tab === 'favoritos'
                ? 'text-[#F9F8F6] dark:text-[#141413]'
                : 'text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC]'
            }`}
          >
            {tab === 'favoritos' && (
              <motion.span
                layoutId="cartTabIndicator"
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 bg-[#1A1A1A] dark:bg-[#F4F1EC] rounded-md"
              />
            )}
            <Heart className="relative z-10 w-3.5 h-3.5" aria-hidden="true" />
            <span className="relative z-10 tabular-nums">Favoritos ({productosFavoritos.length})</span>
          </button>
        </div>
      </div>

      {/* Order Confirmation State */}
      {pedidoConfirmado && tab === 'carrito' ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 max-w-2xl mx-auto bg-[#FFFFFF] dark:bg-[#1B1A18] border border-[#8C6D53] rounded-lg p-8 space-y-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#8C6D53] dark:text-[#C5A587] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="font-mono text-xs text-[#8C6D53] dark:text-[#C5A587]">
                PEDIDO {pedidoConfirmado.numero} CONFIRMADO · {pedidoConfirmado.fecha}
              </div>
              <h2 className="mt-1 font-display text-3xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                Gracias por tu elección, {pedidoConfirmado.cliente}
              </h2>
              <p className="mt-1 text-sm text-[#5C554E] dark:text-[#A8A197]">
                Nuestro equipo de logística guante blanco coordinará la entrega en{' '}
                <span className="font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                  {pedidoConfirmado.direccion}
                </span>
                . Hemos enviado el comprobante a {pedidoConfirmado.email}.
              </p>
            </div>
          </div>

          <div className="border-t border-b border-[#E6E0D6] dark:border-[#262421] py-4 space-y-2.5 text-sm">
            {pedidoConfirmado.items.map((it) => (
              <div key={`${it.sku}-${it.acabado}`} className="flex justify-between gap-4">
                <div>
                  <span className="font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                    {it.nombre}
                  </span>{' '}
                  <span className="text-xs text-[#6F675E] dark:text-[#A8A197]">
                    ({it.acabado} × {it.cantidad})
                  </span>
                </div>
                <span className="font-mono tabular-nums">
                  {formatUSD(it.precioUnitario * it.cantidad)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-[#5C554E] dark:text-[#A8A197]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatUSD(pedidoConfirmado.subtotal)}</span>
            </div>
            {pedidoConfirmado.descuento > 0 && (
              <div className="flex justify-between text-[#8C6D53] dark:text-[#C5A587]">
                <span>Cortesía aplicada</span>
                <span className="font-mono tabular-nums">-{formatUSD(pedidoConfirmado.descuento)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#5C554E] dark:text-[#A8A197]">
              <span>Envío asegurado</span>
              <span className="font-mono tabular-nums">
                {pedidoConfirmado.envio === 0 ? 'Cortesía' : formatUSD(pedidoConfirmado.envio)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E6E0D6] dark:border-[#262421] flex justify-between font-semibold text-base">
              <span>Total abonado</span>
              <span className="font-mono text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                {formatUSD(pedidoConfirmado.total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPedidoConfirmado(null);
              navigate('/catalogo');
            }}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>Seguir explorando el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </motion.div>
      ) : tab === 'carrito' ? (
        itemsDetallados.length === 0 ? (
          <div className="mt-12 py-16 px-6 text-center border border-dashed border-[#D8D0C4] dark:border-[#33302B] rounded-lg space-y-4">
            <ShoppingBag className="w-8 h-8 mx-auto text-[#8C6D53] dark:text-[#C5A587]" aria-hidden="true" />
            <h2 className="font-display text-3xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
              Tu bolsa de compras está vacía
            </h2>
            <p className="text-sm text-[#5C554E] dark:text-[#A8A197] max-w-md mx-auto">
              Descubre sofás escultóricos, comedores en travertino y luminarias de alabastro en
              nuestro catálogo.
            </p>
            <button
              type="button"
              onClick={() => navigate('/catalogo')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Explorar catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 divide-y divide-[#E6E0D6] dark:divide-[#262421] border-y border-[#E6E0D6] dark:border-[#262421]">
              {itemsDetallados.map(({ producto, acabado, cantidad }) => (
                <div
                  key={`${producto.id}-${acabado}`}
                  className="py-6 flex flex-col sm:flex-row sm:items-center gap-5"
                >
                  <a
                    href={`/producto/${producto.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/producto/${producto.id}`);
                    }}
                    className="w-full sm:w-36 aspect-[4/3] bg-[#F2EFE9] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-md overflow-hidden shrink-0"
                  >
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </a>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-xs text-[#6F675E] dark:text-[#A8A197]">
                      {producto.sku} · {producto.categoria}
                    </div>
                    <h3 className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                      <a
                        href={`/producto/${producto.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/producto/${producto.id}`);
                        }}
                        className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors"
                      >
                        {producto.nombre}
                      </a>
                    </h3>
                    <div className="text-xs text-[#5C554E] dark:text-[#A8A197]">
                      Acabado: <span className="font-medium">{acabado}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="inline-flex items-center border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md bg-[#FFFFFF] dark:bg-[#1B1A18]">
                      <button
                        type="button"
                        onClick={() => updateCartQty(producto.id, acabado, cantidad - 1)}
                        aria-label={`Disminuir cantidad de ${producto.nombre}`}
                        className="p-2 text-[#1A1A1A] dark:text-[#F4F1EC] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono text-xs font-medium tabular-nums">
                        {cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(producto.id, acabado, cantidad + 1)}
                        aria-label={`Aumentar cantidad de ${producto.nombre}`}
                        className="p-2 text-[#1A1A1A] dark:text-[#F4F1EC] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-sm font-semibold text-[#1A1A1A] dark:text-[#C5A587] tabular-nums min-w-[6.5rem] text-right">
                      {formatUSD(producto.precio * cantidad)}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(producto.id, acabado)}
                      aria-label={`Eliminar ${producto.nombre} del carrito`}
                      className="p-2 text-[#6F675E] hover:text-[#8E3B46] dark:hover:text-[#E5989B] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout */}
            <div className="lg:col-span-4 bg-[#F2EFE9] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg p-6 space-y-5">
              <h2 className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                Resumen del pedido
              </h2>

              <form onSubmit={aplicarCodigo} className="space-y-2">
                <label
                  htmlFor="codigo-cortesia"
                  className="block text-xs font-medium text-[#5C554E] dark:text-[#A8A197]"
                >
                  Código de cortesía (prueba: MULTIFORME10)
                </label>
                <div className="flex gap-2">
                  <input
                    id="codigo-cortesia"
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="MULTIFORME10"
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-semibold border border-[#8C6D53] dark:border-[#C5A587] text-[#1A1A1A] dark:text-[#F4F1EC] hover:bg-[#8C6D53] hover:text-[#F9F8F6] rounded-md transition-colors cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {mensajeCodigo && (
                  <p className="text-xs text-[#8C6D53] dark:text-[#C5A587]">{mensajeCodigo}</p>
                )}
              </form>

              <div className="pt-3 border-t border-[#E3DDD2] dark:border-[#282622] space-y-2.5 text-sm">
                <div className="flex justify-between text-[#5C554E] dark:text-[#A8A197]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatUSD(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-[#8C6D53] dark:text-[#C5A587]">
                    <span>Cortesía (10%)</span>
                    <span className="font-mono tabular-nums">-{formatUSD(descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5C554E] dark:text-[#A8A197]">
                  <span>Entrega guante blanco</span>
                  <span className="font-mono tabular-nums">
                    {envio === 0 ? 'Cortesía' : formatUSD(envio)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E3DDD2] dark:border-[#282622] flex justify-between font-semibold text-base text-[#1A1A1A] dark:text-[#F4F1EC]">
                  <span>Total estimado</span>
                  <span className="font-mono text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                    {formatUSD(total)}
                  </span>
                </div>
              </div>

              {!mostrarCheckout ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMostrarCheckout(true)}
                  className="group relative overflow-hidden w-full py-3.5 px-5 text-sm font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md transition-colors cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#8C6D53] dark:bg-[#C5A587] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <span className="relative z-10">Confirmar pedido</span>
                </motion.button>
              ) : (
                <form onSubmit={procesarPedido} noValidate className="pt-3 border-t border-[#E3DDD2] dark:border-[#282622] space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6D53] dark:text-[#C5A587]">
                    Datos de entrega
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cliente}
                      onChange={(e) => setCliente(e.target.value)}
                      placeholder="Nombre completo"
                      aria-label="Nombre completo"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC]"
                    />
                    {errores.cliente && (
                      <p role="alert" className="mt-1 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                        {errores.cliente}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      aria-label="Correo electrónico"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC]"
                    />
                    {errores.email && (
                      <p role="alert" className="mt-1 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                        {errores.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Dirección completa de entrega"
                      aria-label="Dirección de entrega"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC]"
                    />
                    {errores.direccion && (
                      <p role="alert" className="mt-1 text-xs text-[#8E3B46] dark:text-[#E5989B]">
                        {errores.direccion}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMostrarCheckout(false)}
                      className="px-4 py-2.5 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 cursor-pointer"
                    >
                      Finalizar compra
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )
      ) : productosFavoritos.length === 0 ? (
        <div className="mt-12 py-16 px-6 text-center border border-dashed border-[#D8D0C4] dark:border-[#33302B] rounded-lg space-y-4">
          <Heart className="w-8 h-8 mx-auto text-[#8C6D53] dark:text-[#C5A587]" aria-hidden="true" />
          <h2 className="font-display text-3xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            Aún no has guardado piezas en favoritos
          </h2>
          <p className="text-sm text-[#5C554E] dark:text-[#A8A197] max-w-md mx-auto">
            Marca cualquier pieza con el icono de corazón para conservar tu selección privada y
            comparar acabados.
          </p>
          <button
            type="button"
            onClick={() => navigate('/catalogo')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>Explorar catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFavoritos.map((producto, idx) => (
            <ProductCard key={producto.id} producto={producto} index={idx} />
          ))}
        </div>
      )}
    </section>
  );
};
