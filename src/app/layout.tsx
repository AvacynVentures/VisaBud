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
        
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '27658385610429651');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=27658385610429651&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="bg-white text-slate-900 antialiased">
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
        
        {/* Schema.org markup for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'VisaBud',
              description: 'UK Visa Checklist Generator - Get personalized checklists for Spouse, Skilled Worker, and Citizenship visas.',
              url: 'https://visabud.co.uk',
              applicationCategory: 'UtilitiesApplication',
              offers: {
                '@type': 'Offer',
                price: '50.00',
                priceCurrency: 'GBP',
                description: 'Standard visa checklist from £50',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '247',
                bestRating: '5',
                worstRating: '1',
              },
              author: {
                '@type': 'Organization',
                name: 'VisaBud',
                url: 'https://visabud.co.uk',
              },
            }),
          }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How long does it take to get my visa checklist?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Your personalized checklist is generated in just 5 minutes after you answer a few simple questions about your visa type and situation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which visa types does VisaBud support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'VisaBud currently supports Spouse/Partner visas, Skilled Worker visas, and British Citizenship applications. More visa types coming soon.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is VisaBud a law firm?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, VisaBud is not a law firm. We provide guidance based on official UK Home Office requirements. Always verify with gov.uk before submitting your application.',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
