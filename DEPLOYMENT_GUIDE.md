# Bahrain Chamber App - Deployment Guide

## Table of Contents
1. [Production Build](#production-build)
2. [IIS Deployment](#iis-deployment)
3. [Alternative Hosting Options](#alternative-hosting-options)
4. [Prerequisites](#prerequisites)
5. [Step-by-Step Deployment](#step-by-step-deployment)

---

## Production Build

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build for Production
```bash
npm run build -- --configuration production
```

This will create a production build in the `dist/bahrain-chamber-app` directory (or `dist/[project-name]` based on your angular.json configuration).

---

## IIS Deployment

### Prerequisites for IIS
- Windows Server with IIS installed
- URL Rewrite Module for IIS (download from: https://www.iis.net/downloads/microsoft/url-rewrite)
- Node.js installed on the server (if using Node.js backend)
- Application Request Routing (ARR) - if needed for API proxy

### Step-by-Step IIS Deployment

#### Step 1: Build the Application
```bash
npm run build -- --configuration production
```

#### Step 2: Configure IIS

1. **Create a New Website in IIS:**
   - Open IIS Manager
   - Right-click on "Sites" → "Add Website"
   - Site name: `bahrain-chamber-app`
   - Physical path: Point to the `dist/bahrain-chamber-app` folder
   - Binding: 
     - Type: http or https
     - IP address: All Unassigned
     - Port: 80 (or 443 for HTTPS)
     - Host name: your-domain.com (optional)

2. **Install URL Rewrite Module:**
   - Download and install from: https://www.iis.net/downloads/microsoft/url-rewrite
   - This is required for Angular routing to work properly

3. **Create web.config File:**
   - Create a `web.config` file in the `dist/bahrain-chamber-app` folder
   - See the web.config template below

#### Step 3: web.config Configuration

Create `web.config` in the `dist/bahrain-chamber-app` folder:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="X-XSS-Protection" value="1; mode=block" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

#### Step 4: Set Permissions
- Grant IIS_IUSRS read permissions to the deployment folder
- Grant the application pool identity appropriate permissions

#### Step 5: Configure Application Pool
- Use .NET CLR Version: No Managed Code (since this is a static Angular app)
- Set Managed Pipeline Mode: Integrated
- Enable 32-bit Applications: False (unless specifically needed)

#### Step 6: Test the Application
- Navigate to: `http://localhost` (or your configured hostname)
- Test all routes and navigation

---

## Alternative Hosting Options

### 1. Azure App Service (Recommended)
**Pros:**
- Easy deployment via Git, Azure DevOps, or VS Code
- Auto-scaling
- Integrated CI/CD
- HTTPS by default
- Global CDN

**Steps:**
1. Create Azure account
2. Create App Service (choose "Static Web App" or regular Web App)
3. Deploy via Azure CLI, VS Code extension, or Azure DevOps
4. Configure custom domain and SSL

**Deployment Command:**
```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy dist/bahrain-chamber-app --app-name your-app-name
```

### 2. AWS S3 + CloudFront
**Pros:**
- Very cost-effective
- High scalability
- Global CDN
- Simple setup

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload build files
4. Configure CloudFront distribution
5. Set up Route 53 for custom domain

### 3. Netlify
**Pros:**
- Free tier available
- Continuous deployment from Git
- HTTPS by default
- Easy setup

**Steps:**
1. Sign up at netlify.com
2. Connect your Git repository
3. Set build command: `npm run build -- --configuration production`
4. Set publish directory: `dist/bahrain-chamber-app`
5. Deploy automatically on push

### 4. Vercel
**Pros:**
- Excellent for Angular/React apps
- Free tier
- Automatic deployments
- Edge network

**Steps:**
1. Sign up at vercel.com
2. Import Git repository
3. Configure build settings (auto-detected for Angular)
4. Deploy

### 5. Firebase Hosting
**Pros:**
- Free tier
- Fast global CDN
- Easy deployment
- Integrated with Firebase services

**Steps:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy --only hosting`

---

## Environment Configuration

### Production Environment Variables

Update `src/environments/environment.prod.ts` with production API URLs:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  azureAd: {
    clientId: 'your-production-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: 'https://your-domain.com'
  }
};
```

---

## Deployment Checklist

### Before Deployment
- [ ] Update `environment.prod.ts` with production URLs
- [ ] Test production build locally
- [ ] Remove console.log statements (or use a logger service)
- [ ] Enable production mode in Angular
- [ ] Optimize images and assets
- [ ] Test all routes and navigation
- [ ] Test authentication flow
- [ ] Verify API endpoints are accessible

### During Deployment
- [ ] Build production bundle
- [ ] Copy web.config (for IIS)
- [ ] Set correct file permissions
- [ ] Configure IIS/Server settings
- [ ] Set up SSL certificate (if using HTTPS)
- [ ] Configure CORS on backend (if needed)
- [ ] Update DNS records (if using custom domain)

### After Deployment
- [ ] Test all pages and routes
- [ ] Verify authentication works
- [ ] Check API connectivity
- [ ] Test on different browsers
- [ ] Monitor error logs
- [ ] Set up monitoring/analytics

---

## Build Scripts

Add these scripts to `package.json` for easier deployment:

```json
{
  "scripts": {
    "build:prod": "ng build --configuration production",
    "build:prod:iis": "ng build --configuration production && copy web.config dist\\bahrain-chamber-app\\",
    "deploy": "npm run build:prod"
  }
}
```

---

## Troubleshooting

### Common Issues

1. **404 errors on page refresh (IIS):**
   - Ensure URL Rewrite Module is installed
   - Check web.config is in the correct location

2. **API calls failing:**
   - Verify CORS is configured on backend
   - Check API URLs in environment.prod.ts

3. **Assets not loading:**
   - Check base href in index.html
   - Verify paths are relative (not absolute)

4. **Authentication not working:**
   - Verify Azure AD redirect URIs include production domain
   - Check environment configuration

---

## Security Considerations

- Enable HTTPS in production
- Set security headers (included in web.config)
- Remove source maps from production build (or keep separate)
- Implement Content Security Policy (CSP)
- Regularly update dependencies
- Use environment variables for sensitive data

---

## Performance Optimization

- Enable compression in IIS (gzip/brotli)
- Use CDN for static assets
- Implement lazy loading for routes
- Optimize images before deployment
- Use Angular's production build optimizations
- Enable browser caching headers

---

## Support

For deployment issues, check:
- Angular Deployment Documentation: https://angular.io/guide/deployment
- IIS URL Rewrite Documentation: https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/
- Azure Static Web Apps: https://docs.microsoft.com/en-us/azure/static-web-apps/
