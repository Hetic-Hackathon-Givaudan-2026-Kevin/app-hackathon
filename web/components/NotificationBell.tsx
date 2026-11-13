'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bell, Check } from 'lucide-react';
import { formatDate } from '@/lib/crm';
import {
  markRead,
  useNotifications,
  type NotificationContext,
} from '@/lib/notifications';
import type { Role } from '@/lib/roles';

export default function NotificationBell({
  role,
  context,
}: {
  role: Role;
  context: NotificationContext;
}) {
  const { items, unread } = useNotifications(role, context);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const unreadIds = new Set(unread.map((item) => item.id));

  // Fermeture au clic extérieur et à la touche Échap
  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={
          unread.length > 0
            ? `Notifications, ${unread.length} non lue${unread.length > 1 ? 's' : ''}`
            : 'Notifications'
        }
        className="relative rounded-full bg-white p-2 text-[#172033] shadow-[0_1px_2px_rgba(23,32,51,0.08)] transition-colors hover:bg-[#F3F4F6]"
      >
        <Bell size={18} strokeWidth={1.6} />
        <AnimatePresence>
          {unread.length > 0 && (
            <motion.span
              key="count"
              initial={reduced ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 26 }}
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E6F03C] px-1 text-[11px] font-semibold text-[#172033] tabular-nums"
            >
              {unread.length > 9 ? '9+' : unread.length}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_-16px_rgba(23,32,51,0.28)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#EDEEF0] px-4 py-3">
              <p className="text-sm font-medium text-[#172033]">
                Notifications
              </p>
              {unread.length > 0 && (
                <button
                  type="button"
                  onClick={() => markRead([...unreadIds])}
                  className="inline-flex items-center gap-1 text-xs text-[#667085] transition-colors hover:text-[#172033]"
                >
                  <Check size={13} />
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {items.length > 0 ? (
              <ul className="max-h-[22rem] overflow-y-auto">
                {items.map((item) => {
                  const isUnread = unreadIds.has(item.id);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          markRead([item.id]);
                          setIsOpen(false);
                        }}
                        className={`flex gap-3 px-4 py-3 transition-colors hover:bg-[#F6F7F9] ${
                          isUnread ? 'bg-[#FBFCE8]' : ''
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 size-2 shrink-0 rounded-full ${
                            isUnread
                              ? item.highlight
                                ? 'bg-[#E6F03C]'
                                : 'bg-[#172033]'
                              : 'bg-[#DDE0E5]'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-[#172033]">
                            {item.title}
                          </span>
                          <span className="block truncate text-xs text-[#667085]">
                            {item.text}
                          </span>
                          {item.date !== '' && (
                            <span className="mt-0.5 block text-[11px] text-[#9AA1AD]">
                              {formatDate(item.date)}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-[#667085]">
                Aucune notification pour le moment.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
