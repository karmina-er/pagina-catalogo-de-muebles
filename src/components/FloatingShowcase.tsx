import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { assetPath } from '../utils/paths';

interface FloatingShowcaseProps {
  src: string;
  alt: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  price?: string;
}

export const FloatingShowcase: React.FC<FloatingShowcaseProps> = ({
  src,
  alt,
  onClick,
  title,
  subtitle,
  price,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll parallax: separates the levitating piece gently from the architectural backdrop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const scrollParallaxY = useTransform(scrollYProgress, [0, 1], [18, -24]);

  // Pointer-tracking subtle 3D depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.6 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);
  const shiftX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{ perspective: 1100 }}
      className={`relative flex flex-col items-center justify-center rounded-xl bg-[#F2EFE9] dark:bg-[#1C1B19] border border-[#E6E0D6]/80 dark:border-[#2C2A26] px-6 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10 overflow-hidden select-none ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      {/* Subtle architectural warm backdrop vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.65),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_38%,rgba(140,109,83,0.12),transparent_72%)]"
      />

      {/* Scroll + Cursor Parallax Plane */}
      <motion.div
        style={{
          y: scrollParallaxY,
          x: shiftX,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* Organic GPU-accelerated infinite levitation */}
        <div className="animate-levitate">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-[0_24px_48px_-18px_rgba(26,26,26,0.22)] dark:shadow-[0_28px_56px_-18px_rgba(0,0,0,0.75)] ring-1 ring-[#1A1A1A]/5 dark:ring-white/10">
            <img
              src={assetPath(src)}
              alt={alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          </div>
        </div>
      </motion.div>

      {/* Dynamic Floor Shadow synced to levitation cycle */}
      <div
        aria-hidden="true"
        className="animate-shadow-breathe relative z-0 mt-5 w-[74%] max-w-md h-7 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(26,26,26,0.38)_0%,rgba(26,26,26,0.12)_48%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.28)_50%,transparent_75%)] blur-md"
      />

      {/* Minimalist Gallery Plaque */}
      {(title || price) && (
        <div className="relative z-10 mt-6 w-full flex items-end justify-between gap-4 pt-5 border-t border-[#E3DDD2] dark:border-[#2C2A26]">
          <div className="min-w-0">
            {subtitle && (
              <div className="text-xs tracking-wide text-[#6F675E] dark:text-[#A8A197] truncate">
                {subtitle}
              </div>
            )}
            {title && (
              <div className="font-display text-2xl font-medium text-[#1A1A1A] dark:text-[#F4F1EC] group-hover:text-[#8C6D53] dark:group-hover:text-[#C5A587] transition-colors duration-300 truncate">
                {title}
              </div>
            )}
          </div>
          {price && (
            <div className="text-right shrink-0">
              <div className="font-mono text-sm font-medium text-[#8C6D53] dark:text-[#C5A587] tabular-nums">
                {price}
              </div>
              <div className="text-[11px] tracking-wide text-[#6F675E] dark:text-[#A8A197] group-hover:translate-x-0.5 transition-transform duration-300">
                Explorar pieza →
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
