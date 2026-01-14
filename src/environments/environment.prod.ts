export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  azureAd: {
    clientId: 'YOUR_AZURE_AD_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  }
};
