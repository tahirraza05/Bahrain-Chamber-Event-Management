# Bahrain Chamber App - UAT Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Bahrain Chamber Event Management System to the UAT (User Acceptance Testing) environment.

## Prerequisites

### Development Machine Requirements
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)
- Git (for version control)
- Access to UAT server/environment

### UAT Server Requirements
- Windows Server with IIS 8.0 or higher
- IIS URL Rewrite Module 2.1 or higher
- .NET Framework 4.5 or higher (for IIS)
- SSL Certificate (recommended for HTTPS)
- Access to backend API server
- Azure AD App Registration configured for UAT

---

## Step 1: Pre-Deployment Checklist

### 1.1 Code Review
- [ ] All features are implemented and tested
- [ ] No compilation errors
- [ ] All TypeScript errors resolved
- [ ] Code review completed
- [ ] Branch merged to main/master

### 1.2 Environment Configuration
- [ ] UAT API URL is available and documented
- [ ] Azure AD App Registration configured for UAT
- [ ] UAT redirect URIs configured in Azure AD
- [ ] Environment variables documented

### 1.3 Testing
- [ ] Unit tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness verified
- [ ] Print functionality tested

---

## Step 2: Update Environment Configuration

### 2.1 Update Production Environment File

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://uat-api.bahrainchamber.bh/api', // UAT API URL
  azureAd: {
    clientId: 'YOUR_UAT_AZURE_AD_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'https://uat.bahrainchamber.bh', // UAT Application URL
    postLogoutRedirectUri: 'https://uat.bahrainchamber.bh'
  }
};
```

**Important:** Replace placeholder values with actual UAT environment values.

---

## Step 3: Build Production Package

### 3.1 Clean Previous Builds (Optional)
```powershell
# Remove old build artifacts
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

### 3.2 Install Dependencies
```powershell
npm install
```

### 3.3 Build for Production
```powershell
# Option 1: Standard production build
npm run build:prod

# Option 2: Production build with IIS web.config (Recommended for IIS)
npm run build:prod:iis
```

**Expected Output:**
- Build artifacts will be in `dist/bahrain-chamber-app/` directory
- Build should complete without errors
- Check for any warnings (budget warnings are acceptable)

### 3.4 Verify Build Output
```powershell
# Check if build directory exists
Test-Path dist\bahrain-chamber-app

# List build files
Get-ChildItem dist\bahrain-chamber-app
```

**Expected Files:**
- `index.html`
- `main.*.js` (main application bundle)
- `polyfills.*.js`
- `runtime.*.js`
- `styles.*.css`
- `assets/` folder
- `web.config` (if using IIS build script)

---

## Step 4: Create Deployment Package

### 4.1 Create UAT Package Directory
```powershell
# Create deployment package folder
New-Item -ItemType Directory -Force -Path "UAT-Package-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
```

### 4.2 Copy Build Files
```powershell
# Copy build output
Copy-Item -Recurse dist\bahrain-chamber-app\* UAT-Package-*\ -Force
```

### 4.3 Include Additional Files
```powershell
# Copy deployment documentation
Copy-Item UAT_DEPLOYMENT_GUIDE.md UAT-Package-*\
Copy-Item DEPLOYMENT_STEPS.md UAT-Package-*\
Copy-Item README.md UAT-Package-*\
```

### 4.4 Create Package Manifest
Create `PACKAGE_MANIFEST.txt` in the package:

```
Bahrain Chamber Event Management System - UAT Deployment Package
Version: 1.0.0
Build Date: [Current Date]
Build Environment: Production
Target Environment: UAT

Contents:
- Application files (dist/bahrain-chamber-app/*)
- web.config (IIS configuration)
- Deployment documentation

Deployment Instructions:
1. Extract package to UAT server
2. Follow UAT_DEPLOYMENT_GUIDE.md
3. Configure IIS as per deployment steps
4. Update environment configuration if needed
```

### 4.5 Create Deployment Package Archive
```powershell
# Create ZIP archive
Compress-Archive -Path UAT-Package-* -DestinationPath "BahrainChamber-UAT-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip" -Force
```

---

## Step 5: Deploy to UAT Server

### 5.1 Transfer Package to UAT Server
- Copy the ZIP file to UAT server
- Extract to deployment location (e.g., `C:\inetpub\wwwroot\bahrain-chamber-uat`)

### 5.2 IIS Configuration

#### 5.2.1 Create Application Pool
1. Open IIS Manager
2. Right-click "Application Pools" → "Add Application Pool"
3. Name: `BahrainChamberUAT`
4. .NET CLR Version: **No Managed Code**
5. Managed Pipeline Mode: **Integrated**
6. Click OK

#### 5.2.2 Create Website
1. Right-click "Sites" → "Add Website"
2. Site name: `Bahrain Chamber UAT`
3. Application pool: `BahrainChamberUAT`
4. Physical path: `C:\inetpub\wwwroot\bahrain-chamber-uat` (or your deployment path)
5. Binding:
   - Type: **https** (recommended) or **http**
   - IP address: **All Unassigned**
   - Port: **443** (HTTPS) or **80** (HTTP)
   - Host name: `uat.bahrainchamber.bh` (or your UAT domain)
6. Click OK

#### 5.2.3 Verify URL Rewrite Module
1. Check if URL Rewrite Module is installed:
   - In IIS Manager, select the website
   - Look for "URL Rewrite" icon
   - If missing, download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Verify `web.config` exists in the deployment folder

#### 5.2.4 Set Permissions
1. Right-click deployment folder → Properties → Security
2. Add `IIS_IUSRS` with **Read & Execute** permissions
3. Add Application Pool Identity (e.g., `IIS AppPool\BahrainChamberUAT`) with **Read & Execute** permissions

### 5.3 SSL Certificate (If Using HTTPS)
1. Install SSL certificate in IIS
2. Bind certificate to the website
3. Ensure certificate is valid and not expired

---

## Step 6: Post-Deployment Configuration

### 6.1 Verify web.config
Ensure `web.config` is present in the deployment folder with correct routing rules.

### 6.2 Test Application
1. Open browser and navigate to UAT URL
2. Test authentication (Azure AD login)
3. Test all major features:
   - Dashboard loads correctly
   - User Management accessible
   - CRM Sync works (if applicable)
   - Registration functionality
   - Print functionality

### 6.3 Verify API Connectivity
- Check browser console for API errors
- Verify CORS is configured on backend
- Test API endpoints are accessible

### 6.4 Check Logs
- Check IIS logs: `C:\inetpub\logs\LogFiles\`
- Check browser console for JavaScript errors
- Monitor application performance

---

## Step 7: UAT Testing Checklist

### 7.1 Functional Testing
- [ ] User can log in via Azure AD
- [ ] Dashboard displays correctly
- [ ] User Management page loads
- [ ] Member search works
- [ ] Registration functionality works
- [ ] Print registration card works
- [ ] Navigation works correctly
- [ ] All routes are accessible

### 7.2 Browser Compatibility
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if applicable)

### 7.3 Responsive Design
- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)

### 7.4 Performance
- [ ] Page load time < 3 seconds
- [ ] API response times acceptable
- [ ] No memory leaks
- [ ] Print functionality works correctly

### 7.5 Security
- [ ] HTTPS is enforced
- [ ] Authentication required for protected routes
- [ ] Role-based access control works
- [ ] No sensitive data exposed in console

---

## Step 8: Rollback Plan

If deployment fails or issues are found:

### 8.1 Quick Rollback
1. Stop the website in IIS
2. Restore previous version from backup
3. Restart website

### 8.2 Full Rollback
1. Delete current deployment
2. Deploy previous known-good version
3. Verify functionality
4. Document issues for next deployment

---

## Step 9: Deployment Verification

### 9.1 Smoke Tests
Run these critical tests immediately after deployment:

```markdown
1. Application loads at UAT URL
2. Azure AD login works
3. Dashboard displays data
4. Can navigate to User Management
5. Can search for a member
6. Can view registration details
7. Print functionality works
```

### 9.2 Sign-Off
- [ ] UAT environment is accessible
- [ ] All smoke tests pass
- [ ] No critical errors
- [ ] Ready for user acceptance testing

---

## Troubleshooting

### Common Issues

#### Issue: 404 errors on page refresh
**Solution:**
- Verify URL Rewrite Module is installed
- Check web.config exists and is correct
- Restart IIS

#### Issue: API calls failing
**Solution:**
- Verify API URL in environment.prod.ts
- Check CORS configuration on backend
- Verify network connectivity

#### Issue: Authentication not working
**Solution:**
- Verify Azure AD redirect URIs include UAT URL
- Check client ID and tenant ID are correct
- Verify Azure AD app registration is active

#### Issue: Assets not loading
**Solution:**
- Check base href in index.html
- Verify file permissions
- Check IIS MIME types

---

## Deployment Package Contents

```
UAT-Package-[Date]/
├── index.html
├── main.*.js
├── polyfills.*.js
├── runtime.*.js
├── styles.*.css
├── web.config
├── assets/
│   ├── images/
│   └── styles/
├── UAT_DEPLOYMENT_GUIDE.md
├── DEPLOYMENT_STEPS.md
├── README.md
└── PACKAGE_MANIFEST.txt
```

---

## Support Contacts

- **Development Team:** [Contact Information]
- **Infrastructure Team:** [Contact Information]
- **Azure AD Admin:** [Contact Information]

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | [Date] | Initial UAT deployment package | [Name] |

---

## Additional Resources

- Angular Deployment: https://angular.io/guide/deployment
- IIS URL Rewrite: https://www.iis.net/downloads/microsoft/url-rewrite
- Azure AD App Registration: https://docs.microsoft.com/en-us/azure/active-directory/

---

**End of UAT Deployment Guide**
