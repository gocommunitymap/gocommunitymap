const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')

// SSR mode  : NODE_ENV=production, output NOT standalone — node_modules required on server
// Standalone : deploy .next/standalone/ contents; Next.js generates its own server.js
//              but this file is used when iisnode points to it via web.config

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT || '3000', 10)
const hostname = process.env.HOSTNAME || 'localhost'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', err => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
