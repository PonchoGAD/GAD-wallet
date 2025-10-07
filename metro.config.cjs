// metro.config.cjs
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Оставляем стандарт. Если будут жалобы на длинные пути — можно добавить watchFolders позже.
module.exports = config;
