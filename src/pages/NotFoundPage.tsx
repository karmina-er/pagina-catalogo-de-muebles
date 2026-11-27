import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center space-y-6">
      <div className="font-display text-7xl sm:text-8xl font-medium text-[#8C6D53] dark:text-[#C5A587]">
        404
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC]">
        Pieza o galería no encontrada
      </h1>
      <p className="text-sm sm:text-base text-[#5C554E] dark:text-[#A8A197] max-w-md mx-auto leading-relaxed">
        La ruta que intentas consultar no existe o ha sido reubicada dentro del archivo digital
        de Multiforme.
      </p>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold border border-[#D8D0C4] dark:border-[#33302B] hover:border-[#8C6D53] rounded-md cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Volver al inicio</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/catalogo')}
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-[#1A1A1A] dark:bg-[#F4F1EC] text-[#F9F8F6] dark:text-[#141413] rounded-md hover:opacity-90 cursor-pointer"
        >
          <span>Ir al catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
