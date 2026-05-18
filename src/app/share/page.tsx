import type { Metadata } from 'next';
import SharePageClient from './SharePageClient';

export const metadata: Metadata = {
  title: 'Money Secured - Track Your Income & Expenses | Free Offline Finance App',
  description: 'Money Secured - Apni income aur expenses easily track karo! 100% offline, free app. No login required. Install karo ab!',
  keywords: ['Money Secured', 'Finance App', 'Expense Tracker', 'Budget Manager', 'Income Tracker', 'Offline App', 'Free App'],
  openGraph: {
    title: '💰 Money Secured - Track Your Money',
    description: 'Apni income aur expenses track karo! 100% offline, free app. Install like a real app on Android & iPhone.',
    url: 'https://money-secured.vercel.app/share',
    siteName: 'Money Secured',
    images: [
      {
        url: 'https://money-secured.vercel.app/money-secured-poster.png',
        width: 768,
        height: 1344,
        alt: 'Money Secured App - Track Income & Expenses',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '💰 Money Secured - Track Your Money',
    description: 'Apni income aur expenses track karo! 100% offline, free app.',
    images: ['https://money-secured.vercel.app/money-secured-poster.png'],
  },
  other: {
    'og:image:width': '768',
    'og:image:height': '1344',
  },
};

export default function SharePage() {
  return <SharePageClient />;
}
