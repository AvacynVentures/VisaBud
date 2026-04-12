'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

// ─── Page Fade-In ───────────────────────────────────────────────────────────

export function PageFadeIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Tab Content Transition ─────────────────────────────────────────────────

export function TabTransition({ children, tabKey }: { children: ReactNode; tabKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Stagger Container + Item ───────────────────────────────────────────────

export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Modal Slide Up ─────────────────────────────────────────────────────────

export function ModalSlideUp({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Bounce-In Checkmark ────────────────────────────────────────────────────

export function BounceCheckmark({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 15,
          }}
        >
          <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Confetti Burst (CSS-based, lightweight) ────────────────────────────────

export function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;

  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const distance = 20 + Math.random() * 20;
    const tx = Math.cos((angle * Math.PI) / 180) * distance;
    const ty = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#a7f3d0', '#fbbf24', '#60a5fa'];
    const color = colors[i % colors.length];
    return (
      <span
        key={i}
        className="confetti-dot"
        style={{
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          backgroundColor: color,
          animationDelay: `${i * 30}ms`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      {dots}
    </div>
  );
}

// ─── Celebration Banner ─────────────────────────────────────────────────────

export function CelebrationBanner({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Fade wrapper (generic) ─────────────────────────────────────────────────

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
