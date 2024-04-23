export default () => ({
  port: process.env.CORS_ORIGIN || '*',
  redirectUrl: process.env.REDIRECT_URL,
  nestAppPort: parseInt(process.env.NEST_APP_PORT) || 1500,
});
