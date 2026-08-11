require('ts-node').register();
const { t } = require('./src/translations.ts');
console.log(t('English', 'chat.welcome'));
console.log(t('English', 'dashboard.unlockInsights'));
console.log(t('English', 'app.title'));
