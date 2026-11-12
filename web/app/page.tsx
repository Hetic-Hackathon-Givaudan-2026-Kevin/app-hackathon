import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full h-svh">
      <main className="h-full lg:flex items-center justify-center gap-10">
        <Link href="/sales/junior" className="flex flex-col items-center gap-5">
          <div className="size-20 rounded-full bg-white lg:size-50"></div>
          <p className="font-medium">Commercial junior</p>
        </Link>
        <Link href="/sales/senior" className="flex flex-col items-center gap-5">
          <div className="size-20 rounded-full bg-white lg:size-50"></div>
          <p className="font-medium">Commercial senior</p>
        </Link>
      </main>
    </div>
  );
}
