import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Booklet AI - Create Beautiful Books with AI',
  description: 'Transform your ideas into professionally designed books in minutes with Booklet AI\'s powerful AI-driven platform.',
  keywords: 'ai book creator, ai writing, book creation, self-publishing, ai tools',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
