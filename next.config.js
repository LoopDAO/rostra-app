const { withPlausibleProxy } = require("next-plausible")
const { i18n } = require("./next-i18next.config")

const config = withPlausibleProxy()({
  i18n,
  reactStrictMode: true,
})

console.log('next config ->', config)

module.exports = config
