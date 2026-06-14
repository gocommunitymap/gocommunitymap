import Head from 'next/head'
import themeConfig from 'src/configs/themeConfig'

const SITE_NAME = themeConfig.templateName

/**
 * Reusable SEO head component — drop this into any page for full meta coverage.
 *
 * @param {string}  title       - Page <title> and OG title
 * @param {string}  description - Meta description and OG description (keep ≤155 chars)
 * @param {string}  [canonical] - Canonical URL for this page
 * @param {string}  [ogImage]   - Absolute URL for OG/Twitter card image
 * @param {string}  [ogType]    - OG type: 'website' | 'article' (default: 'website')
 * @param {boolean} [noIndex]   - Set true on auth/admin pages to prevent indexing
 */
const SeoHead = ({ title, description, canonical, ogImage, ogType = 'website', noIndex = false }) => (
  <Head>
    <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
    <meta name='description' content={description} />
    {noIndex && <meta name='robots' content='noindex, nofollow' />}
    {canonical && <link rel='canonical' href={canonical} />}

    {/* Open Graph */}
    <meta property='og:site_name' content={SITE_NAME} />
    <meta property='og:type' content={ogType} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    {ogImage && <meta property='og:image' content={ogImage} />}
    {canonical && <meta property='og:url' content={canonical} />}

    {/* Twitter Card */}
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
    {ogImage && <meta name='twitter:image' content={ogImage} />}
  </Head>
)

export default SeoHead
