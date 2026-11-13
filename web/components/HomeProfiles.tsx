'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import HowToTest from '@/components/HowToTest';
import {
  ROLE_LABEL,
  ROLE_PERSON,
  ROLE_PHOTO,
  roleBase,
  type Role,
} from '@/lib/roles';

const PROFILES: Role[] = ['junior', 'senior', 'rd'];

export default function HomeProfiles() {
  const reduced = useReducedMotion();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-12 p-6">
      <motion.main
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-16"
      >
        {PROFILES.map((role, index) => (
          <motion.div
            key={role}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : index * 0.09,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href={roleBase(role)}
              className="group flex flex-col items-center gap-5"
            >
              <div className="relative block overflow-hidden size-28 flex justify-center items-end overflow-hidden rounded-full bg-white transition-transform duration-300 ease-out group-hover:scale-105 lg:size-50">
                <Image
                  src={ROLE_PHOTO[role]}
                  alt=""
                  width={140}
                  height={140}
                  
                  priority={index === 0}
                  className="absolute -bottom-5"
                />
              </div>
              <span className="space-y-1">
                <span className="block text-center font-medium">
                  {ROLE_PERSON[role]}
                </span>
                <span className="block text-center text-xs text-neutral-700">
                  {ROLE_LABEL[role]}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.main>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.34, duration: 0.4 }}
      >
        <HowToTest />
      </motion.div>
    </div>
  );
}