import React from 'react';
import { ArrowRight, Lock, Moon, Sun } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { appPath } from '../utils/paths';

export const Footer: React.FC = () => {
  const { navigate, theme, toggleTheme, route } = useStore();

  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="mt-28 border-t border-[#E6E0D6] dark:border-[#262421] bg-[#F2EFE9] dark:bg-[#191816] text-[#1A1A1A] dark:text-[#F4F1EC] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-5">
          <div className="font-display text-3xl font-semibold tracking-tight text-[#1A1A1A] dark:text-[#F4F1EC]">
            Multiforme
          </div>
          <p className="text-sm leading-relaxed text-[#5C554E] dark:text-[#A8A197] max-w-md">
            Casa de mobiliario arquitectónico contemporáneo. Cada pieza se concibe en series
            numeradas con maderas europeas certificadas, piedra natural apomazada,
            terciopelos italianos y herrajes en bronce cepillado.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-[#D8D0C4] dark:border-[#33302B] rounded-md text-[#1A1A1A] dark:text-[#F4F1EC] hover:border-[#8C6D53] dark:hover:border-[#C5A587] transition-colors duration-200 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#C5A587]" aria-hidden="true" />
                  <span>Cambiar a modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#8C6D53]" aria-hidden="true" />
                  <span>Cambiar a modo oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          <h4 className="font-display text-xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            Colección
          </h4>
          <ul className="space-y-2.5 text-sm text-[#5C554E] dark:text-[#A8A197]">
            <li>
              <a href={appPath('/catalogo')} onClick={(e) => handleLink(e, '/catalogo')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Catálogo completo
              </a>
            </li>
            <li>
              <a href={appPath('/catalogo?categoria=Sala')} onClick={(e) => handleLink(e, '/catalogo?categoria=Sala')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Sala y estar
              </a>
            </li>
            <li>
              <a href={appPath('/catalogo?categoria=Comedor')} onClick={(e) => handleLink(e, '/catalogo?categoria=Comedor')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Comedor
              </a>
            </li>
            <li>
              <a href={appPath('/catalogo?categoria=Dormitorio')} onClick={(e) => handleLink(e, '/catalogo?categoria=Dormitorio')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Dormitorio
              </a>
            </li>
            <li>
              <a href={appPath('/catalogo?categoria=Iluminación')} onClick={(e) => handleLink(e, '/catalogo?categoria=Iluminación')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Iluminación
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3.5">
          <h4 className="font-display text-xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
            Showroom y Atención
          </h4>
          <ul className="space-y-2.5 text-sm text-[#5C554E] dark:text-[#A8A197]">
            <li>
              <a href={appPath('/contacto')} onClick={(e) => handleLink(e, '/contacto')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Cita privada en showroom
              </a>
            </li>
            <li>
              <a href={appPath('/carrito')} onClick={(e) => handleLink(e, '/carrito')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Bolsa de compras
              </a>
            </li>
            <li>
              <a href={appPath('/carrito?tab=favoritos')} onClick={(e) => handleLink(e, '/carrito?tab=favoritos')} className="hover:text-[#8C6D53] dark:hover:text-[#C5A587] transition-colors">
                Lista de favoritos
              </a>
            </li>
          </ul>
          <p className="pt-2 text-xs text-[#6F675E] dark:text-[#8F887E]">
            Calle de Ortega y Gasset 48, Madrid
            <br />
            concierge@multiforme.com
          </p>
        </div>
      </div>

      {/* Bottom Administrator Panel Trigger Bar */}
      <div className="border-t border-[#E6E0D6] dark:border-[#262421] bg-[#EAE4DA]/70 dark:bg-[#141413]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-[#5C554E] dark:text-[#A8A197]">
            <span className="font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
              Administración de catálogo
            </span>{' '}
            · Acceso exclusivo para agregar o borrar productos de la colección.
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md border transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              route.name === 'admin'
                ? 'bg-[#1A1A1A] dark:bg-[#F4F1EC] border-[#1A1A1A] dark:border-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413]'
                : 'border-[#8C6D53] dark:border-[#C5A587] text-[#1A1A1A] dark:text-[#F4F1EC] hover:bg-[#8C6D53] hover:text-[#F9F8F6] hover:border-[#8C6D53]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Vista de administrador</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="border-t border-[#E6E0D6] dark:border-[#262421]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6F675E] dark:text-[#8F887E]">
          <span>© {new Date().getFullYear()} Multiforme Mobiliario de Autor. Todos los derechos reservados.</span>
          <span>Garantía estructural de 10 años en maderas y bronce cepillado</span>
        </div>
      </div>
    </footer>
  );
};
