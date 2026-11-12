import Navigation from '@/components/Navigation';

export default function OpportunitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 p-3">
        {children}
      </main>
    </div>
  );
}