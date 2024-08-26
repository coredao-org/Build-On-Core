import { Header } from '@/components/header';
import { AppProvider } from '@/provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'b14g - Unlock Yield with No-loss Bitcoin Restaking',
  description: 'b14g enables Bitcoin holders to earn yield through no-loss restaking while providing security for PoS chains and DApps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="relative flex flex-col min-h-screen">
          <AppProvider>
            <Header />
            {children}
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
