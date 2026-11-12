'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex w-fit items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-white transition-all duration-300 ease-out hover:bg-violet-600 hover:shadow-md"
    >
      <ArrowLeft size={16} />
      Retour
    </button>
  );
}