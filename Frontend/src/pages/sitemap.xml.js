import { serverGet } from 'src/configs/services/serverHttp'
import { API_URL } from 'src/configs'

const BASE_URL = 'https://gocommunitymap.com'

const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/hotels', changefreq: 'daily', priority: '0.9' },
  { url: '/rental', changefreq: 'daily', priority: '0.9' },
  { url: '/newhome', changefreq: 'daily', priority: '0.9' },
  { url: '/houseprice', changefreq: 'daily', priority: '0.8' },
  { url: '/com-hotels', changefreq: 'daily', priority: '0.8' },
  { url: '/com-rental', changefreq: 'daily', priority: '0.8' },
  { url: '/hotels/properties', changefreq: 'hourly', priority: '0.9' },
  { url: '/rental/properties', changefreq: 'hourly', priority: '0.9' },
  { url: '/newhome/properties', changefreq: 'hourly', priority: '0.9' },
  { url: '/houseprice/properties', changefreq: 'daily', priority: '0.8' },
  { url: '/com-hotels/properties', changefreq: 'hourly', priority: '0.8' },
  { url: '/com-rental/properties', changefreq: 'hourly', priority: '0.8' }
]

function generateSitemap(staticRoutes, properties) {
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = staticRoutes
    .map(
      route => `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('')

  const propertyUrls = properties
    .map(
      p => `
  <url>
    <loc>${BASE_URL}/hotels/properties/${p.PROPERTY_ID}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${propertyUrls}
</urlset>`
}

export const getServerSideProps = async ({ res }) => {
  let properties = []
  try {
    const data = await serverGet(API_URL.GET_PROPERTIES_FULL_DETAILS, { LISTING_TYPE_ID: 1 })
    properties = Array.isArray(data) ? data : []
  } catch {
    properties = []
  }

  const sitemap = generateSitemap(staticRoutes, properties)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function SitemapPage() {
  return null
}
