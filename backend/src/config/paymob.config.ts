import { registerAs } from '@nestjs/config';

export default registerAs('paymob', () => ({
  apiKey: process.env.PAYMOB_API_KEY,
  integrationId: process.env.PAYMOB_INTEGRATION_ID,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET,
  iframeId: process.env.PAYMOB_IFRAME_ID,
  apiUrl: process.env.PAYMOB_API_URL || 'https://accept.paymob.com/api',
  currency: process.env.PAYMOB_CURRENCY || 'EGP',
}));
