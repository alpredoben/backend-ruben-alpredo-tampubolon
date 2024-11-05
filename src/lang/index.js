const TranslationMessage = require('i18n');
const path = require('path');
const { APP } = require('../configs/environments');

TranslationMessage.configure({
  locales: ['en', 'id'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: APP.LANG,
  objectNotation: true,
  autoReload: true,
  updateFiles: false,
  syncFiles: true,
  register: global,
});

module.exports = {
  translator: TranslationMessage,
};
