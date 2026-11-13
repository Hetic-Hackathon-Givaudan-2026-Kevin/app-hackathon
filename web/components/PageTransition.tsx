'use client';

import { motion, useReducedMotion } from 'motion/react';

// Transition d'entrée entre les pages : courte, discrète, et désactivée
// si le système demande de réduire les animations.
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      className="flex w-full min-w-0 flex-1 flex-col gap-6"
    >
      {children}
    </motion.div>
  );
}
