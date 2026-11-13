import Link from 'next/link';
import { ROLE_LABEL, ROLE_PERSON, roleBase, type Role } from '@/lib/roles';

const PROFILES: Role[] = ['junior', 'senior', 'rd'];

export default function Home() {
  return (
    <div className="h-svh w-full">
      <main className="h-full items-center justify-center gap-10 lg:flex">
        {PROFILES.map((role) => (
          <Link
            key={role}
            href={roleBase(role)}
            className="flex flex-col items-center gap-5"
          >
            <div className="size-20 rounded-full bg-white transition-transform duration-300 hover:scale-105 lg:size-50" />
            <div className="space-y-1">
              <p className="text-center font-medium">{ROLE_PERSON[role]}</p>
              <p className="text-center text-xs text-neutral-700">
                {ROLE_LABEL[role]}
              </p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
