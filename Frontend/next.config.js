const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  transpilePackages: ['zIndex.js'],
  output: 'standalone',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: '/(home|hotels|rental|rentals|newhome|houseprice|com-hotels|com-rental)',
        headers: [{ key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' }]
      },
      {
        source: '/(hotels|rental|rentals|newhome|houseprice|com-hotels|com-rental)/properties',
        headers: [{ key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' }]
      },
      {
        source: '/(hotels|rental|rentals|newhome|houseprice|com-hotels|com-rental)/properties/:id',
        headers: [{ key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' }]
      },
      {
        source: '/news/:id',
        headers: [{ key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' }]
      }
    ]
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
