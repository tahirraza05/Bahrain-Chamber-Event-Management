# Azure Deployment Steps - Quick Reference

## Required Information Checklist

Before deployment, collect the following information:

### Azure Account Information
- [ ] Azure subscription ID
- [ ] Azure subscription name
- [ ] Resource group name (or create new)
- [ ] Preferred Azure region (e.g., East US, West Europe)

### Application Information
- [ ] Application name for Azure (e.g., `bahrain-chamber-uat`)
- [ ] Custom domain name (if applicable)
- [ ] SSL certificate (if using custom domain)

### Azure AD Configuration
- [ ] Azure AD Tenant ID
- [ ] Azure AD App Registration Client ID
- [ ] Redirect URIs (will be: `https://your-app.azurewebsites.net`)

### Backend API Information
- [ ] API URL (if backend is separate)
- [ ] API authentication method
- [ ] CORS configuration requirements

### Deployment Preferences
- [ ] Deployment method preference:
  - [ ] Azure Static Web Apps (Recommended)
  - [ ] Azure App Service
- [ ] CI/CD preference:
  - [ ] Manual deployment
  - [ ] GitHub Actions
  - [ ] Azure DevOps

---

## Quick Deployment Steps

### Step 1: Prepare Package
```powershell
# Build Azure package
.\build-azure-package.ps1 -DeploymentType static
# or
.\build-azure-package.ps1 -DeploymentType appservice
```

### Step 2: Update Environment
Edit `src/environments/environment.prod.ts`:
- Update API URL
- Update Azure AD configuration
- Update redirect URIs

### Step 3: Deploy to Azure

#### Option A: Azure Static Web Apps (Recommended)
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

#### Option B: Azure App Service
```bash
# Create ZIP
Compress-Archive -Path dist\bahrain-chamber-app\* -DestinationPath deploy.zip

# Deploy
az webapp deployment source config-zip \
  --resource-group rg-bahrain-chamber \
  --name bahrain-chamber-uat \
  --src deploy.zip
```

### Step 4: Configure Azure AD
- Update redirect URIs in Azure AD app registration
- Add: `https://your-app.azurewebsites.net`

### Step 5: Test
- Navigate to Azure app URL
- Test login
- Test all features

---

## Detailed Steps

See `AZURE_DEPLOYMENT_GUIDE.md` for complete instructions.

---

## Information Required from You

To proceed with deployment, please provide:

1. **Azure Subscription Details**
   - Subscription ID: `_________________`
   - Subscription Name: `_________________`
   - Resource Group: `_________________` (or create new)
   - Region: `_________________`

2. **Application Details**
   - App Name: `_________________`
   - Custom Domain: `_________________` (if applicable)

3. **Azure AD Configuration**
   - Tenant ID: `_________________`
   - Client ID: `_________________`
   - Redirect URIs: `https://[app-name].azurewebsites.net`

4. **Backend API**
   - API URL: `_________________`
   - Authentication: `_________________`

5. **Deployment Method**
   - [ ] Static Web Apps
   - [ ] App Service
   - [ ] Other: `_________________`

---

## Support

For detailed instructions, see `AZURE_DEPLOYMENT_GUIDE.md`
