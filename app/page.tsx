import type { Metadata } from 'next';
import { Header } from '@/components/menu/Header';
import { Footer } from '@/components/menu/Footer';
import { Hero } from '@/components/menu/Hero';
import { MenuClient } from '@/components/menu/MenuClient';

export const metadata: Metadata = {
  title: 'COMMA — Menu',
};

export default function MenuPage() {
  return (
    <>
      <Header />
      <Hero />
      <MenuClient />
      <Footer />
    </>
  );
}
