import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL('https://visabud.co.uk'),
  title: 'VisaBud - UK Visa Checklist Generator',
  description: 'Get a personalized UK visa checklist in 5 minutes. Stop missing documents. Start applying with confidence.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'VisaBud - UK Visa Checklist',
    description: 'Personalized visa checklists for Spouse, Skilled Worker, and Citizenship visas. Never miss a document again.',
    url: 'https://visabud.co.uk',
    siteName: 'VisaBud',
    images: [
      {
        url: 'https://visabud.co.uk/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VisaBud - Your Complete UK Visa Guide',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisaBud - UK Visa Checklist',
    description: 'Personalized visa checklists for Spouse, Skilled Worker, and Citizenship visas.',
    images: ['https://visabud.co.uk/og-image.png'],
  },
  alternates: {
    canonical: 'https://visabud.co.uk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E3A8A" />
      </head>
      <body className="bg-white text-slate-900 antialiased">
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
