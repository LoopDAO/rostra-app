const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'zh',
      // 'zh-HK',
      // 'zh-TW',
      // 'af-ZA',
      // 'de',
      // 'es',
      // 'fr',
      // 'pt',
      // 'pt-BR',
      // 'pt-PT',
      // 'ru',
    ],
    localePath: path.resolve('./public/locales'),
  },
};
