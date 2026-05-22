/**
 * Public config for GitHub Pages (and local).
 * registerToken = short code from https://api-bakong.nbc.gov.kh/register
 * token = JWT (renew: node scripts/bakong-token.mjs)
 */
window.DYNA_BAKONG_CONFIG = {
  /**
   * Payment API host. Same as your Vercel URL for GitHub Pages / shared links.
   * On https://dyna-store36.vercel.app or http://127.0.0.1:8787 the app uses /api/check-md5 on that host.
   */
  apiBase: 'https://dyna-store36.vercel.app',
  /** Do not use localhost here when deployed */
  proxy: '',
  email: 'thikkthikk09@gmail.com',
  registerToken: 'rbk82qAU7sFjn7CG2mAP-CA0_mKVz_RNVRcNlA60b3oNkY',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMWJkOTRjMDY2ODViNGIwMiJ9LCJpYXQiOjE3Nzk0MjYwNTYsImV4cCI6MTc4NzIwMjA1Nn0.HQMVk8k4jg9uSsEDR59flVidUf1lh3RJU53pEJwDUaA',
  account: 'ben_sothida@bkrt',
  organization: 'Dyna Store',
  project: 'dyna_store',
}
