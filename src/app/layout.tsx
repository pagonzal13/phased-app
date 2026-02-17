import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/LanguageProvider';

export const metadata: Metadata = {
  title: 'PHASED — Premium Menstrual Cycle Management',
  description: 'Elegant, science-based cycle tracking and personalized guidance for modern professionals.',
  keywords: ['menstrual cycle', 'cycle tracking', 'hormones', 'wellness', 'training', 'productivity'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
