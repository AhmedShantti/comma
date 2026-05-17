import type { Metadata } from 'next';
import { LangProvider } from '@/components/LangProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { OrdersProvider } from '@/components/admin/OrdersProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'COMMA',
  description: 'Premium Café & Lounge — Cairo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cairo:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <AuthProvider>
            <OrdersProvider>{children}</OrdersProvider>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
