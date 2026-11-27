import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ToastBanner: React.FC = () => {
  const { toast, dismissToast } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-md border border-[#8C6D53]/40 bg-[#141413] dark:bg-[#22201D] text-[#F9F8F6] shadow-xl"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              {toast.tipo === 'success' && (
                <Check className="w-4 h-4 text-[#C5A587] shrink-0" aria-hidden="true" />
              )}
              {toast.tipo === 'info' && (
                <Info className="w-4 h-4 text-[#C5A587] shrink-0" aria-hidden="true" />
              )}
              {toast.tipo === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-[#E6A08A] shrink-0" aria-hidden="true" />
              )}
              <span>{toast.texto}</span>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Cerrar notificación"
              className="p-1 text-[#A8A197] hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
