import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  LogOut,
  PackagePlus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { formatUSD, useStore } from '../context/StoreContext';
import { CategoriaMueble, Producto } from '../types';
import { assetPath } from '../utils/paths';

const CATEGORIAS: CategoriaMueble[] = [
  'Sala',
  'Comedor',
  'Dormitorio',
  'Iluminación',
  'Estudio',
];

const GALERIA_ESTUDIO = [
  { label: 'Sofá Modular Valenza', path: 'src/assets/images/sofa_modular_valenza_1795138657480.jpg' },
  { label: 'Mesa de Comedor Aurelia', path: 'src/assets/images/mesa_comedor_aurelia_1795138656800.jpg' },
  { label: 'Butaca Borghese', path: 'src/assets/images/butaca_borghese_1795138658041.jpg' },
  { label: 'Aparador Palazzo', path: 'src/assets/images/aparador_palazzo_1795138656345.jpg' },
  { label: 'Lámpara de Pie Solis', path: 'src/assets/images/lampara_pie_solis_1795138657171.jpg' },
  { label: 'Diván Medicea', path: 'src/assets/images/divan_medicea_1795138657341.jpg' },
  { label: 'Consola Bellagio', path: 'src/assets/images/consola_bellagio_1795138656611.jpg' },
  { label: 'Cama Imperial Verona', path: 'src/assets/images/cama_imperial_verona_1795138657622.jpg' },
];

interface FormState {
  nombre: string;
  sku: string;
  categoria: CategoriaMueble;
  material: string;
  acabadosTexto: string;
  precio: string;
  stock: string;
  dimensiones: string;
  peso: string;
  origen: string;
  imagen: string;
  descripcion: string;
  destacado: boolean;
}

const EMPTY_FORM: FormState = {
  nombre: '',
  sku: '',
  categoria: 'Sala',
  material: '',
  acabadosTexto: 'Terciopelo Vino, Bronce Cepillado',
  precio: '2800',
  stock: '3',
  dimensiones: '180 × 90 × 76 cm',
  peso: '45 kg',
  origen: 'Milán, Italia',
  imagen: GALERIA_ESTUDIO[0].path,
  descripcion: '',
  destacado: false,
};

export const AdminPage: React.FC = () => {
  const { productos, navigate, addProduct, deleteProduct } = useStore();

  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openCreateModal = () => {
    setForm({
      ...EMPTY_FORM,
      sku: `MF-NEW-${String(productos.length + 1).padStart(2, '0')}`,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Selecciona un archivo de imagen válido (JPG, PNG o WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imagen: reader.result as string }));
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const precioNum = Number(form.precio);
    const stockNum = Number(form.stock);

    if (form.nombre.trim().length < 3) {
      setFormError('El nombre de la pieza debe tener al menos 3 caracteres.');
      return;
    }
    if (form.sku.trim().length < 3) {
      setFormError('Indica un código SKU válido.');
      return;
    }
    if (form.material.trim().length < 3) {
      setFormError('Especifica el material principal.');
      return;
    }
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      setFormError('El precio debe ser mayor que cero.');
      return;
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      setFormError('El stock no puede ser negativo.');
      return;
    }
    if (form.descripcion.trim().length < 10) {
      setFormError('Añade una breve descripción comercial (mínimo 10 caracteres).');
      return;
    }

    const acabados = form.acabadosTexto
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Omit<Producto, 'id'> = {
      nombre: form.nombre.trim(),
      sku: form.sku.trim().toUpperCase(),
      categoria: form.categoria,
      material: form.material.trim(),
      acabados: acabados.length > 0 ? acabados : [form.material.trim()],
      precio: Math.round(precioNum),
      stock: Math.floor(stockNum),
      dimensiones: form.dimensiones.trim() || 'Por confirmar',
      peso: form.peso.trim() || 'Por confirmar',
      origen: form.origen.trim() || 'Atelier Multiforme',
      imagen: form.imagen.trim() || GALERIA_ESTUDIO[0].path,
      descripcion: form.descripcion.trim(),
      destacado: form.destacado,
    };

    addProduct(payload);
    setModalOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !password) {
      setLoginError('Ingresa tu usuario y contraseña para continuar.');
      return;
    }
    if (usuario.trim() === 'admin' && password === '1234') {
      setAutenticado(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setUsuario('');
    setPassword('');
    setLoginError('');
    setConfirmDeleteId(null);
    setModalOpen(false);
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#F9F8F6] dark:bg-[#141413]">
        <header className="border-b border-[#E6E0D6] dark:border-[#262421] bg-[#F9F8F6]/90 dark:bg-[#141413]/90">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F4F1EC]">
                Multiforme
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C6D53] dark:text-[#C5A587] border-l border-[#DFD8CE] dark:border-[#2E2C28] pl-3">
                Acceso Admin
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Volver a la tienda</span>
            </button>
          </div>
        </header>

        <section className="max-w-md w-full mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#FFFFFF] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg p-7 sm:p-10 space-y-6 shadow-sm"
          >
            <div className="space-y-2 pb-5 border-b border-[#E6E0D6] dark:border-[#262421]">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zona Exclusiva de Administrador</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
                Iniciar sesión
              </h1>
              <p className="text-sm text-[#5C554E] dark:text-[#A8A197]">
                Ingresa tus credenciales para agregar o eliminar piezas del catálogo.
              </p>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-center gap-2 p-3 border border-[#8E3B46] bg-[#8E3B46]/10 text-xs font-medium text-[#8E3B46] dark:text-[#E5989B] rounded-md"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-user"
                  className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                >
                  Usuario
                </label>
                <input
                  id="admin-user"
                  type="text"
                  autoComplete="username"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Usuario de administrador"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-[#1A1A1A] dark:text-[#E8E2D9]"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={verPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-11 py-2.5 text-sm bg-[#F9F8F6] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] focus:outline-none focus:border-[#8C6D53]"
                  />
                  <button
                    type="button"
                    onClick={() => setVerPassword((v) => !v)}
                    aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#6F675E] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC] cursor-pointer"
                  >
                    {verPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-5 text-sm font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Ingresar al panel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </section>

        <footer className="py-5 text-center text-xs text-[#6F675E] dark:text-[#8F887E]">
          Multiforme · Consola Exclusiva de Administración
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] dark:bg-[#141413]">
      {/* Exclusive Admin Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E6E0D6] dark:border-[#262421] bg-[#F9F8F6]/92 dark:bg-[#141413]/92 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-2xl font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F4F1EC]">
              Multiforme
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#8C6D53] dark:text-[#C5A587] border-l border-[#DFD8CE] dark:border-[#2E2C28] pl-3 truncate">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] hover:border-[#8C6D53] rounded-md text-[#5C554E] dark:text-[#A8A197] hover:text-[#1A1A1A] dark:hover:text-[#F4F1EC] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ir a la tienda</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] hover:border-[#8E3B46] text-[#5C554E] dark:text-[#A8A197] hover:text-[#8E3B46] dark:hover:text-[#E5989B] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Exclusive Workspace: ONLY Add & Delete */}
      <section className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E6E0D6] dark:border-[#262421]">
          <div>
            <div className="text-xs font-medium tracking-[0.18em] uppercase text-[#8C6D53] dark:text-[#C5A587]">
              Panel Exclusivo de Catálogo
            </div>
            <h1 className="mt-1.5 font-display text-3xl sm:text-5xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
              Agregar y borrar productos
            </h1>
            <p className="mt-1.5 text-sm text-[#5C554E] dark:text-[#A8A197]">
              {productos.length} {productos.length === 1 ? 'pieza publicada' : 'piezas publicadas'} en el catálogo.
            </p>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
          >
            <PackagePlus className="w-4 h-4" aria-hidden="true" />
            <span>Agregar producto</span>
          </motion.button>
        </div>

        {/* Simple Product List with ONLY Delete action */}
        <div className="bg-[#FFFFFF] dark:bg-[#1B1A18] border border-[#E6E0D6] dark:border-[#2A2824] rounded-lg divide-y divide-[#EEE9E0] dark:divide-[#24221E] overflow-hidden">
          {productos.map((p) => {
            const isDeleting = confirmDeleteId === p.id;
            return (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F8F6] dark:hover:bg-[#21201D] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={assetPath(p.imagen)}
                    alt={p.nombre}
                    referrerPolicy="no-referrer"
                    className="w-20 h-14 object-cover rounded-md bg-[#F2EFE9] dark:bg-[#22201D] border border-[#E6E0D6] dark:border-[#2A2824] shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-[11px] text-[#8C6D53] dark:text-[#C5A587]">
                        {p.sku}
                      </span>
                      <span className="text-xs text-[#6F675E] dark:text-[#A8A197]">
                        · {p.categoria}
                      </span>
                    </div>
                    <div className="font-display text-xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] truncate">
                      {p.nombre}
                    </div>
                    <div className="text-xs text-[#5C554E] dark:text-[#A8A197] truncate">
                      {p.material} ·{' '}
                      <span className="font-mono font-medium text-[#1A1A1A] dark:text-[#E8E2D9] tabular-nums">
                        {formatUSD(p.precio)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0">
                  {!isDeleting ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(p.id)}
                      aria-label={`Borrar ${p.nombre}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] text-[#5C554E] dark:text-[#A8A197] hover:border-[#8E3B46] hover:text-[#8E3B46] dark:hover:text-[#E5989B] rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Borrar producto</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          deleteProduct(p.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-3.5 py-2 bg-[#8E3B46] text-[#F9F8F6] rounded-md font-semibold cursor-pointer"
                      >
                        Confirmar borrado
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-2 text-[#6F675E] hover:underline cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {productos.length === 0 && (
            <div className="py-16 px-4 text-center space-y-3">
              <p className="text-sm text-[#6F675E] dark:text-[#A8A197]">
                No hay productos en el catálogo.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md cursor-pointer"
              >
                <PackagePlus className="w-4 h-4" aria-hidden="true" />
                <span>Agregar primer producto</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F9F8F6] dark:bg-[#191816] border border-[#8C6D53]/40 rounded-lg p-6 sm:p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6] dark:border-[#262421]">
                <h2
                  id="admin-modal-title"
                  className="font-display text-2xl sm:text-3xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]"
                >
                  Agregar nuevo producto
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Cerrar ventana"
                  className="p-2 text-[#6F675E] hover:text-[#1A1A1A] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3 border border-[#8E3B46] bg-[#8E3B46]/10 text-xs text-[#8E3B46] dark:text-[#E5989B] rounded-md"
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Nombre de la pieza *</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Ej. Sillón Esquinero Veneto"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Código SKU *</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-mono uppercase bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Categoría</label>
                    <select
                      value={form.categoria}
                      onChange={(e) =>
                        setForm({ ...form, categoria: e.target.value as CategoriaMueble })
                      }
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    >
                      {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Precio (USD) *</label>
                    <input
                      type="number"
                      min={1}
                      value={form.precio}
                      onChange={(e) => setForm({ ...form, precio: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-mono bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Stock inicial *</label>
                    <input
                      type="number"
                      min={0}
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-mono bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Material principal *</label>
                    <input
                      type="text"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                      placeholder="Ej. Terciopelo Vino y Nogal"
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Acabados (separados por coma)</label>
                    <input
                      type="text"
                      value={form.acabadosTexto}
                      onChange={(e) => setForm({ ...form, acabadosTexto: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Dimensiones</label>
                    <input
                      type="text"
                      value={form.dimensiones}
                      onChange={(e) => setForm({ ...form, dimensiones: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-mono bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Peso neto</label>
                    <input
                      type="text"
                      value={form.peso}
                      onChange={(e) => setForm({ ...form, peso: e.target.value })}
                      className="w-full px-3 py-2 text-sm font-mono bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium">Origen</label>
                    <input
                      type="text"
                      value={form.origen}
                      onChange={(e) => setForm({ ...form, origen: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#F2EFE9] dark:bg-[#1E1D1A] border border-[#E6E0D6] dark:border-[#2A2824] rounded-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <label className="block text-xs font-medium">
                        Fotografía de estudio (catálogo base)
                      </label>
                      <select
                        value={
                          GALERIA_ESTUDIO.some((g) => g.path === form.imagen)
                            ? form.imagen
                            : ''
                        }
                        onChange={(e) => {
                          if (e.target.value) setForm({ ...form, imagen: e.target.value });
                        }}
                        className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                      >
                        {!GALERIA_ESTUDIO.some((g) => g.path === form.imagen) && (
                          <option value="">Imagen personalizada cargada</option>
                        )}
                        {GALERIA_ESTUDIO.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-[#8C6D53] text-[#1A1A1A] dark:text-[#C5A587] hover:bg-[#8C6D53] hover:text-[#F9F8F6] rounded-md transition-colors cursor-pointer self-end shrink-0">
                      <ImagePlus className="w-4 h-4" aria-hidden="true" />
                      <span>Subir foto propia</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={assetPath(form.imagen)}
                      alt="Vista previa"
                      referrerPolicy="no-referrer"
                      className="w-24 h-18 object-cover rounded-md border border-[#DFD8CE] dark:border-[#2E2C28]"
                    />
                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.destacado}
                        onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                        className="w-4 h-4 accent-[#8C6D53] dark:accent-[#C5A587]"
                      />
                      <span>Destacar pieza en página de inicio</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium">Descripción curatorial *</label>
                  <textarea
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Describe materiales, proporciones y acabados artesanales..."
                    className="w-full px-3 py-2 text-sm bg-[#FFFFFF] dark:bg-[#141413] border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E6E0D6] dark:border-[#262421]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-medium border border-[#DFD8CE] dark:border-[#2E2C28] rounded-md cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 cursor-pointer"
                  >
                    Agregar al catálogo
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
