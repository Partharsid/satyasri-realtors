import { MetadataRoute } from 'next';
import { BUSINESS } from '@/data/business';
import listings from '@/data/listings';

const BASE_URL = `https://${BUSINESS.contact.website}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/listings',
    '/contact',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const locationRoutes = [
    'hitech-city',
    'gachibowli',
    'kondapur',
    'financial-district',
    'kokapet',
    'manikonda',
  ].map((loc) => ({
    url: `${BASE_URL}/locations/${loc}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const listingRoutes = listings.map((listing) => ({
    url: `${BASE_URL}/listings/${listing.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...locationRoutes, ...listingRoutes];
}