'use client';

import { motion, useReducedMotion } from 'motion/react';

// Apparition décalée des éléments d'une liste : la page se compose sous les
// yeux au lieu de surgir d'un bloc. Désactivée si le système le demande.
export default function Reveal({
  index = 0,
  className = '',
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduced ? 0 : Math.min(index, 7) * 0.05,
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.li>
  );
}
