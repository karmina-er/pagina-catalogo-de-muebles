import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastBanner } from './components/ToastBanner';
import { InicioPage } from './pages/InicioPage';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductoPage } from './pages/ProductoPage';
import { CarritoPage } from './pages/CarritoPage';
import { ContactoPage } from './pages/ContactoPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  const { route } = useStore();

  const renderPage = () => {
    switch (route.name) {
      case 'inicio':
        return <InicioPage />;
      case 'catalogo':
        return <CatalogoPage categoriaInicial={route.categoriaInicial} />;
      case 'producto':
        return <ProductoPage id={route.id} />;
      case 'carrito':
        return <CarritoPage initialTab={route.tab} />;
      case 'contacto':
        return <ContactoPage />;
      case 'admin':
        return <AdminPage />;
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  const routeKey =
    route.name === 'producto'
      ? `producto-${route.id}`
      : route.name === 'carrito'
      ? `carrito-${route.tab}`
      : route.name;

  const isAdminRoute = route.name === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#1A1A1A] dark:bg-[#141413] dark:text-[#F4F1EC] transition-colors duration-300">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      <ToastBanner />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}
