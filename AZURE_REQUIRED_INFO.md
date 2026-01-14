# Azure Deployment - Required Information

## Information Needed for Azure Deployment

To successfully deploy the Bahrain Chamber App to Azure, please provide the following information:

---

## 1. Azure Account & Subscription

### Required:
- [ ] **Azure Subscription ID**
  - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Where to find: Azure Portal → Subscriptions

- [ ] **Azure Subscription Name**
  - Example: `Pay-As-You-Go`, `Enterprise Agreement`, etc.

- [ ] **Resource Group**
  - Existing: `_________________`
  - Or create new: `rg-bahrain-chamber-uat` (suggested)

- [ ] **Azure Region**
  - Preferred region: `_________________`
  - Options: East US, West Europe, Southeast Asia, etc.

---

## 2. Application Configuration

### Required:
- [ ] **Application Name**
  - Must be globally unique
  - Format: lowercase, alphanumeric, hyphens only
  - Example: `bahrain-chamber-uat`
  - Your choice: `_________________`

- [ ] **Custom Domain** (Optional)
  - Domain name: `_________________`
  - SSL certificate: `_________________` (if you have one)

- [ ] **Deployment Type Preference**
  - [ ] Azure Static Web Apps (Recommended - Free tier available)
  - [ ] Azure App Service (More features, paid tier)

---

## 3. Azure AD (Active Directory) Configuration

### Required:
- [ ] **Azure AD Tenant ID**
  - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Where to find: Azure Portal → Azure Active Directory → Overview

- [ ] **Azure AD App Registration Client ID**
  - Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
  - Where to find: Azure Portal → Azure AD → App registrations

- [ ] **Redirect URIs to Add**
  - Production URL: `https://[your-app-name].azurewebsites.net`
  - Or custom domain: `https://[your-domain.com]`

- [ ] **App Registration Name**
  - Current name: `_________________`

---

## 4. Backend API Configuration

### Required:
- [ ] **API Base URL**
  - Example: `https://api.bahrainchamber.bh/api`
  - Or: `https://[api-app-name].azurewebsites.net/api`
  - Your API URL: `_________________`

- [ ] **API Authentication Method**
  - [ ] Azure AD Token (Same as frontend)
  - [ ] API Key
  - [ ] Other: `_________________`

- [ ] **CORS Configuration**
  - Is CORS configured on backend? `_________________`
  - Allowed origins: `_________________`

---

## 5. Deployment Method Preference

### Choose one:
- [ ] **Azure Static Web Apps**
  - Pros: Free tier, easy deployment, built-in CI/CD
  - Cons: Limited server-side features

- [ ] **Azure App Service**
  - Pros: More control, custom domains, scaling options
  - Cons: Paid tier required for production

- [ ] **Other** (Specify): `_________________`

---

## 6. CI/CD Preferences

### Choose one:
- [ ] **Manual Deployment** (I'll deploy manually)
- [ ] **GitHub Actions** (Auto-deploy on push)
- [ ] **Azure DevOps** (Pipeline-based)
- [ ] **Other**: `_________________`

---

## 7. Environment-Specific Settings

### UAT Environment:
- [ ] **Environment Name**: `UAT` or `Staging`
- [ ] **API Environment**: `UAT` or `Staging`
- [ ] **Azure AD Environment**: `UAT` or `Production`

### Production Environment (if applicable):
- [ ] **Environment Name**: `Production`
- [ ] **API Environment**: `Production`
- [ ] **Azure AD Environment**: `Production`

---

## 8. Access & Permissions

### Required:
- [ ] **Azure Account Access**
  - Do you have Azure Portal access? `Yes / No`
  - Do you have Azure CLI access? `Yes / No`
  - Do you have subscription owner/contributor role? `Yes / No`

- [ ] **Azure AD Access**
  - Can you modify App Registration? `Yes / No`
  - Can you add redirect URIs? `Yes / No`

---

## 9. Additional Requirements

### Optional:
- [ ] **Custom SSL Certificate**
  - Do you have a custom SSL certificate? `Yes / No`
  - Certificate provider: `_________________`

- [ ] **Monitoring & Logging**
  - [ ] Enable Application Insights
  - [ ] Enable Azure Monitor
  - [ ] Custom logging requirements: `_________________`

- [ ] **Backup & Disaster Recovery**
  - Backup requirements: `_________________`
  - Recovery time objective: `_________________`

- [ ] **Scaling Requirements**
  - Expected traffic: `_________________`
  - Auto-scaling needed? `Yes / No`

---

## 10. Contact Information

### For Deployment Support:
- [ ] **Primary Contact Name**: `_________________`
- [ ] **Email**: `_________________`
- [ ] **Phone**: `_________________`
- [ ] **Role**: `_________________`

- [ ] **Backup Contact Name**: `_________________`
- [ ] **Email**: `_________________`

---

## How to Provide This Information

### Option 1: Fill This Document
1. Fill in all required fields above
2. Save this document
3. Share with deployment team

### Option 2: Create Information File
Create a file named `azure-deployment-info.json`:

```json
{
  "subscription": {
    "id": "your-subscription-id",
    "name": "your-subscription-name",
    "region": "eastus"
  },
  "application": {
    "name": "bahrain-chamber-uat",
    "resourceGroup": "rg-bahrain-chamber",
    "deploymentType": "static"
  },
  "azureAd": {
    "tenantId": "your-tenant-id",
    "clientId": "your-client-id"
  },
  "api": {
    "url": "https://your-api-url.com/api"
  }
}
```

### Option 3: Direct Communication
Share the information via email or project management tool.

---

## Next Steps After Providing Information

Once you provide the required information:

1. ✅ I will update `environment.prod.ts` with your configuration
2. ✅ I will create the deployment package
3. ✅ I will provide step-by-step deployment commands
4. ✅ I will assist with Azure AD configuration
5. ✅ I will help test the deployment

---

## Security Note

⚠️ **Important**: Do not commit sensitive information (like Client IDs, Tenant IDs) to version control. Use environment variables or Azure Key Vault for production deployments.

---

**Please fill in the required fields and share this document to proceed with Azure deployment.**
