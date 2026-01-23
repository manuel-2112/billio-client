import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { Toaster } from '@/components/design-system/feedback/toast';
import { QueryProvider } from '@/lib/providers/query-provider';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: 'PayInTable - Pago Rápido en Mesa',
    description: 'Paga tu cuenta de forma rápida y segura con Apple Pay y Google Pay',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='es'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overscroll-none antialiased`}>
                <QueryProvider>
                    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                        <main className="min-h-screen">
                            {children}
                        </main>
                        <Toaster position="top-center" />
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
};

export default Layout;
