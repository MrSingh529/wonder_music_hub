import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { PlayerProvider } from '@/lib/player-context';
import { PlayerWrapper } from '@/components/player/PlayerWrapper';
import { Inter, Lexend } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata: Metadata = {
  title: 'Wonder Music Hub',
  description: 'The official music site for our label.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PlayerProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1 pb-24">{children}</div>
            </div>
            <PlayerWrapper />
            <Toaster />
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
