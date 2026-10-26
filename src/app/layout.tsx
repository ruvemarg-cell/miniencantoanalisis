import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'MiniEncanto Análisis | Plataforma de Tendencias y Oportunidades en Argentina',
  description:
    'Plataforma integral de análisis de productos, oportunidades de venta, comparativa de precios y métricas de e-commerce en Argentina.',
  icons: {
    icon: '/logo-miniencanto.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full">
      <body className="min-h-full font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
