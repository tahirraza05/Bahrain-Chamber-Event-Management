export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  azureAd: {
    clientId: 'YOUR_AZURE_AD_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  }
};
