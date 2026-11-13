import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter_Tight({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Givaudan Opportunity Radar',
  description:
    'Copilote commercial : comprendre ses clients, anticiper leurs besoins, préparer ses rendez-vous.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
