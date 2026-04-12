import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://visabud.co.uk';
  const now = new Date().toISOString();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/app/start`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
  ];

  const guidePages = [
    'spouse-visa-checklist-2025',
    'skilled-worker-visa-documents',
    'uk-citizenship-requirements',
    'how-to-apply-uk-visa',
    'uk-visa-processing-times',
    'uk-visa-fees-costs',
    'tb-test-requirements-by-country',
    'uk-visa-interview-preparation',
    'common-visa-rejection-reasons',
    'uk-visa-timeline-planning',
  ].map((slug) => ({
    url: `${baseUrl}/visa-guides/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    { url: `${baseUrl}/visa-guides`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 },
    ...guidePages,
  ];
}
