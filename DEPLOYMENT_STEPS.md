# Quick Deployment Steps

## Option 1: IIS Deployment (Windows Server)

### Prerequisites
1. Windows Server with IIS installed
2. URL Rewrite Module: https://www.iis.net/downloads/microsoft/url-rewrite
3. Node.js installed (for building)

### Steps

1. **Install URL Rewrite Module**
   - Download from: https://www.iis.net/downloads/microsoft/url-rewrite
   - Install on the server

2. **Build the Application**
   ```powershell
   cd C:\Users\TAHIR\bahrain-chamber-app
   npm install
   npm run build:prod
   ```

3. **Copy web.config**
   - Copy `web.config` from project root to `dist\bahrain-chamber-app\`

4. **Create IIS Website**
   - Open IIS Manager
   - Right-click "Sites" → "Add Website"
   - Site name: `BahrainChamberApp`
   - Physical path: `C:\inetpub\wwwroot\bahrain-chamber-app` (or your preferred path)
   - Port: 80 (or your preferred port)
   - Copy contents from `dist\bahrain-chamber-app\` to the physical path

5. **Configure Application Pool**
   - Set .NET CLR Version to "No Managed Code"
   - Pipeline Mode: Integrated

6. **Set Permissions**
   - Grant IIS_IUSRS read access to the deployment folder

7. **Test**
   - Navigate to: `http://localhost` (or your server IP)

---

## Option 2: Azure App Service (Recommended - Easiest)

### Steps

1. **Install Azure CLI**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Build and Deploy**
   ```bash
   npm run build:prod
   swa deploy dist/bahrain-chamber-app --app-name bahrain-chamber-app --resource-group your-resource-group
   ```

**OR use Azure Portal:**
1. Create Static Web App in Azure Portal
2. Connect to GitHub/DevOps
3. Configure build: `npm run build`
4. Configure output: `dist/bahrain-chamber-app`
5. Deploy automatically on commit

---

## Option 3: Netlify (Free & Easy)

### Steps

1. **Sign up**: https://netlify.com
2. **Drag & Drop**:
   - Build: `npm run build:prod`
   - Drag `dist/bahrain-chamber-app` folder to Netlify dashboard
3. **OR Connect Git**:
   - Connect GitHub repository
   - Build command: `npm run build -- --configuration production`
   - Publish directory: `dist/bahrain-chamber-app`
4. **Deploy** - Automatic on push!

---

## Option 4: AWS S3 + CloudFront

### Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://bahrain-chamber-app
   ```

2. **Enable Static Website Hosting**
   - S3 Console → Properties → Static website hosting → Enable
   - Index document: `index.html`
   - Error document: `index.html`

3. **Upload Files**
   ```bash
   npm run build:prod
   aws s3 sync dist/bahrain-chamber-app s3://bahrain-chamber-app --delete
   ```

4. **Set Bucket Policy** (for public access)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadGetObject",
       "Effect": "Allow",
       "Principal": "*",
       "Action": "s3:GetObject",
       "Resource": "arn:aws:s3:::bahrain-chamber-app/*"
     }]
   }
   ```

5. **Create CloudFront Distribution** (optional, for CDN)

---

## Build Output Location

After running `npm run build:prod`, your files will be in:
```
dist/bahrain-chamber-app/
```

This folder contains all the files you need to deploy.

---

## Environment Configuration

**IMPORTANT**: Before deploying, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  azureAd: {
    clientId: 'your-production-client-id',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: 'https://your-production-domain.com'
  }
};
```

---

## Recommended Hosting Options (Ranked)

1. **Azure Static Web Apps** ⭐⭐⭐⭐⭐
   - Best for .NET backend integration
   - Easy deployment
   - Built-in CI/CD
   - Free tier available

2. **Netlify** ⭐⭐⭐⭐⭐
   - Easiest setup
   - Free tier
   - Great for Angular apps
   - Automatic HTTPS

3. **Vercel** ⭐⭐⭐⭐⭐
   - Excellent performance
   - Free tier
   - Edge network
   - Easy Git integration

4. **AWS S3 + CloudFront** ⭐⭐⭐⭐
   - Very scalable
   - Cost-effective
   - Requires more setup

5. **IIS** ⭐⭐⭐
   - Good for Windows environments
   - Requires server management
   - More configuration needed

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Build for production
npm run build:prod

# Build for IIS (includes web.config copy)
npm run build:prod:iis

# Test production build locally
npx http-server dist/bahrain-chamber-app -p 8080
```
