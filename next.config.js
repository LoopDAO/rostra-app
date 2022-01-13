const { withPlausibleProxy } = require("next-plausible")
const { i18n } = require("./next-i18next.config")

const config = withPlausibleProxy()({
  i18n,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/rostra/:path*",
        destination: 'http://' + process.env.BASEURI + "/rostra/:path*",
      }
    ]
  }
})

module.exports = config
