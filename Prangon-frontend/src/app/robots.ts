import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/w/', '/api/'],
    },
    sitemap: 'https://prangon.com/sitemap.xml',
  }
}
