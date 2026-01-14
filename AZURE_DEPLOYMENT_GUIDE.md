# Bahrain Chamber App - Azure Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Bahrain Chamber Event Management System to Microsoft Azure.

## Prerequisites

### Required Information
Before starting deployment, ensure you have the following:

1. **Azure Account**
   - Azure subscription with appropriate permissions
   - Resource group name (or create new)
   - Azure region (e.g., East US, West Europe)

2. **Application Information**
   - Application name for Azure (e.g., `bahrain-chamber-uat`)
   - Domain name (if using custom domain)
   - SSL certificate (if using custom domain)

3. **Azure AD Configuration**
   - Azure AD Tenant ID
   - Azure AD App Registration Client ID
   - Redirect URIs for Azure deployment

4. **Backend API**
   - API URL (if backend is separate)
   - API authentication details

5. **Deployment Method**
   - Azure CLI installed
   - Azure PowerShell module
   - Or Azure Portal access

---

## Step 1: Prepare Deployment Package

### 1.1 Update Environment Configuration

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.azurewebsites.net/api', // Azure API URL
  azureAd: {
    clientId: 'YOUR_AZURE_AD_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'https://your-app.azurewebsites.net', // Azure App URL
    postLogoutRedirectUri: 'https://your-app.azurewebsites.net'
  }
};
```

### 1.2 Build Production Package

```powershell
# Run the Azure build script
.\build-azure-package.ps1

# Or manually:
npm install
npm run build:prod
```

### 1.3 Verify Build Output

Check that `dist/bahrain-chamber-app/` contains:
- `index.html`
- JavaScript bundles (main.*.js, polyfills.*.js, runtime.*.js)
- CSS files (styles.*.css)
- `assets/` folder

---

## Step 2: Azure Static Web Apps Deployment (Recommended)

### 2.1 Prerequisites
- Azure subscription
- GitHub account (for CI/CD) OR Azure CLI for manual deployment

### 2.2 Create Azure Static Web App

#### Option A: Using Azure Portal

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Click "Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"

2. **Configure Static Web App**
   ```
   Subscription: [Your subscription]
   Resource Group: [Create new or select existing]
   Name: bahrain-chamber-uat
   Plan type: Free or Standard
   Region: [Select closest region]
   Source: Other (for manual deployment)
   ```

3. **Review and Create**
   - Review settings
   - Click "Create"
   - Wait for deployment to complete

#### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group (if not exists)
az group create --name rg-bahrain-chamber --location eastus

# Create Static Web App
az staticwebapp create \
  --name bahrain-chamber-uat \
  --resource-group rg-bahrain-chamber \
  --location eastus \
  --sku Free
```

### 2.3 Deploy Application

#### Option A: Using Azure CLI

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Login
swa login

# Deploy
swa deploy dist/bahrain-chamber-app \
  --app-name bahrain-chamber-uat \
  --resource-group rg-bahrain-chamber \
  --env production
```

#### Option B: Using Azure Portal

1. Go to your Static Web App in Azure Portal
2. Navigate to "Overview" → "Deployment token"
3. Copy the deployment token
4. Use Azure Static Web Apps CLI:

```bash
swa deploy dist/bahrain-chamber-app \
  --deployment-token YOUR_DEPLOYMENT_TOKEN
```

#### Option C: Manual Upload via Azure Portal

1. Go to Static Web App → "Overview"
2. Click "Browse" to view the app
3. Note: Manual upload requires using Azure Storage or FTP

---

## Step 3: Azure App Service Deployment (Alternative)

### 3.1 Create App Service

#### Using Azure Portal:

1. **Create App Service**
   - Go to Azure Portal
   - Click "Create a resource" → "Web App"
   - Configure:
     ```
     Subscription: [Your subscription]
     Resource Group: [Create new or select]
     Name: bahrain-chamber-uat
     Publish: Code
     Runtime stack: .NET (or any, we'll deploy static files)
     Operating System: Windows
     Region: [Select region]
     App Service Plan: [Create new or select]
     ```

2. **Review and Create**
   - Review settings
   - Click "Create"

#### Using Azure CLI:

```bash
# Create App Service Plan
az appservice plan create \
  --name plan-bahrain-chamber \
  --resource-group rg-bahrain-chamber \
  --sku B1 \
  --is-linux false

# Create Web App
az webapp create \
  --name bahrain-chamber-uat \
  --resource-group rg-bahrain-chamber \
  --plan plan-bahrain-chamber
```

### 3.2 Configure App Service

1. **Enable Static Content**
   - Go to App Service → Configuration
   - Add application setting:
     ```
     Name: WEBSITE_REDIRECT_TO_HTTPS
     Value: true
     ```

2. **Configure URL Rewrite**
   - Go to App Service → Configuration → General settings
   - Enable "Always On" (for production)

3. **Add web.config** (if not using Static Web Apps)
   - The build script includes web.config
   - Ensure it's in the deployment package

### 3.3 Deploy to App Service

#### Option A: Using Azure CLI (ZIP Deploy)

```bash
# Create ZIP package
Compress-Archive -Path dist\bahrain-chamber-app\* -DestinationPath deploy.zip

# Deploy ZIP
az webapp deployment source config-zip \
  --resource-group rg-bahrain-chamber \
  --name bahrain-chamber-uat \
  --src deploy.zip
```

#### Option B: Using Azure Portal (ZIP Deploy)

1. Go to App Service → Deployment Center
2. Select "Local Git" or "ZIP Deploy"
3. Upload the ZIP file
4. Deploy

#### Option C: Using VS Code Extension

1. Install "Azure App Service" extension in VS Code
2. Right-click `dist/bahrain-chamber-app` folder
3. Select "Deploy to Web App"
4. Select your Azure subscription and App Service

#### Option D: Using FTP

1. Go to App Service → Deployment Center → FTP
2. Get FTP credentials
3. Upload files using FTP client

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Custom Domain

1. Go to App Service → Custom domains
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### 4.2 Configure SSL Certificate

1. Go to App Service → TLS/SSL settings
2. Add SSL certificate (App Service Managed Certificate or upload your own)
3. Bind certificate to custom domain

---

## Step 5: Configure Application Settings

### 5.1 Environment Variables (if needed)

Go to App Service → Configuration → Application settings:

```
WEBSITE_REDIRECT_TO_HTTPS = true
WEBSITE_NODE_DEFAULT_VERSION = (not needed for static app)
```

### 5.2 CORS Configuration

If your API is on a different domain, configure CORS on the backend API.

---

## Step 6: Post-Deployment Verification

### 6.1 Test Application

1. **Access Application**
   - Navigate to: `https://your-app.azurewebsites.net`
   - Or custom domain if configured

2. **Verify Functionality**
   - [ ] Application loads correctly
   - [ ] Azure AD login works
   - [ ] All routes accessible
   - [ ] API calls successful
   - [ ] Print functionality works

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Check for JavaScript errors
   - Verify API calls are successful

### 6.2 Monitor Application

1. **Application Insights** (if enabled)
   - View application logs
   - Monitor performance
   - Check for errors

2. **Azure Portal Monitoring**
   - Go to App Service → Metrics
   - Monitor requests, response times, errors

---

## Step 7: Continuous Deployment (Optional)

### 7.1 GitHub Actions (Static Web Apps)

If using Azure Static Web Apps with GitHub:

1. Connect GitHub repository
2. Azure will automatically create GitHub Actions workflow
3. Push to main branch triggers deployment

### 7.2 Azure DevOps Pipeline

Create Azure DevOps pipeline:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'windows-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'
  displayName: 'Install Node.js'

- script: |
    npm install
    npm run build:prod
  displayName: 'Build application'

- task: AzureWebApp@1
  inputs:
    azureSubscription: 'your-subscription'
    appName: 'bahrain-chamber-uat'
    package: 'dist/bahrain-chamber-app'
```

---

## Troubleshooting

### Common Issues

#### Issue: 404 errors on page refresh
**Solution:**
- For Static Web Apps: Configure `routes.json` or `staticwebapp.config.json`
- For App Service: Ensure `web.config` is present with URL rewrite rules

#### Issue: API calls failing
**Solution:**
- Verify API URL in `environment.prod.ts`
- Check CORS configuration on backend
- Verify API is accessible from Azure

#### Issue: Authentication not working
**Solution:**
- Verify Azure AD redirect URIs include Azure app URL
- Check client ID and tenant ID are correct
- Ensure Azure AD app registration is active

#### Issue: Assets not loading
**Solution:**
- Check base href in `index.html`
- Verify file paths are relative
- Check MIME types in Azure configuration

---

## Deployment Checklist

### Pre-Deployment
- [ ] Environment configuration updated
- [ ] Azure AD app registration configured
- [ ] Build completed successfully
- [ ] Package verified

### Deployment
- [ ] Azure resource created
- [ ] Application deployed
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate configured (if applicable)

### Post-Deployment
- [ ] Application accessible
- [ ] Authentication works
- [ ] All features functional
- [ ] Monitoring configured
- [ ] Documentation updated

---

## Cost Estimation

### Azure Static Web Apps
- **Free Tier**: 100 GB bandwidth/month, 2 GB storage
- **Standard Tier**: $9/month + usage

### Azure App Service
- **Basic B1**: ~$13/month
- **Standard S1**: ~$50/month
- **Premium P1**: ~$146/month

---

## Security Best Practices

1. **Enable HTTPS**: Always use HTTPS in production
2. **Security Headers**: Configure in `web.config` or Azure settings
3. **Azure AD**: Use proper authentication flow
4. **API Security**: Secure API endpoints
5. **Monitoring**: Enable Application Insights

---

## Support Resources

- Azure Static Web Apps: https://docs.microsoft.com/azure/static-web-apps/
- Azure App Service: https://docs.microsoft.com/azure/app-service/
- Azure CLI: https://docs.microsoft.com/cli/azure/
- Azure Portal: https://portal.azure.com

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | [Date] | Initial Azure deployment guide | [Name] |

---

**End of Azure Deployment Guide**
