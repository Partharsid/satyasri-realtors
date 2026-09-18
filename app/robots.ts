import { MetadataRoute } from 'next';
import { BUSINESS } from '@/data/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `https://${BUSINESS.contact.website}/sitemap.xml`,
  };
}