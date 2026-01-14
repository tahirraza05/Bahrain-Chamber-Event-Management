# GitHub Workflow Setup Guide

## Overview
This guide explains how to set up GitHub Actions workflows for automated CI/CD deployment of the Bahrain Chamber App to Azure.

## Available Workflows

### 1. Azure Static Web Apps Deployment (`azure-deploy.yml`)
**Recommended for Angular applications**

- Automatically builds and deploys to Azure Static Web Apps
- Triggers on push to main/master branch
- Can be manually triggered via workflow_dispatch

### 2. Azure App Service Deployment (`azure-app-service-deploy.yml`)
**Alternative deployment method**

- Builds application with IIS web.config
- Deploys to Azure App Service
- Uses ZIP deployment method

### 3. Build and Test (`build-and-test.yml`)
**CI workflow for testing**

- Builds application on every push/PR
- Runs linting (if configured)
- Uploads build artifacts
- Does not deploy

---

## Setup Instructions

### Step 1: Choose Deployment Method

#### Option A: Azure Static Web Apps (Recommended)

1. **Create Azure Static Web App**
   ```bash
   az staticwebapp create \
     --name bahrain-chamber-uat \
     --resource-group rg-bahrain-chamber \
     --location eastus \
     --sku Free
   ```

2. **Get Deployment Token**
   - Go to Azure Portal → Your Static Web App
   - Navigate to "Overview" → "Deployment token"
   - Copy the deployment token

3. **Add GitHub Secret**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: [Paste deployment token]
   - Click "Add secret"

4. **Update Workflow File**
   - Edit `.github/workflows/azure-deploy.yml`
   - Update `AZURE_WEBAPP_NAME` and `AZURE_RESOURCE_GROUP` if needed

#### Option B: Azure App Service

1. **Create Azure App Service**
   ```bash
   az webapp create \
     --name bahrain-chamber-uat \
     --resource-group rg-bahrain-chamber \
     --plan plan-bahrain-chamber
   ```

2. **Get Publish Profile**
   - Go to Azure Portal → Your App Service
   - Click "Get publish profile"
   - Download the `.PublishSettings` file
   - Open and copy the entire XML content

3. **Add GitHub Secret**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: [Paste entire XML content]
   - Click "Add secret"

4. **Update Workflow File**
   - Edit `.github/workflows/azure-app-service-deploy.yml`
   - Update `AZURE_WEBAPP_NAME` and `AZURE_RESOURCE_GROUP` if needed

---

## Step 2: Configure Environment Variables

### Update Workflow Files

Edit the workflow files to match your Azure configuration:

```yaml
env:
  NODE_VERSION: '18.x'
  AZURE_WEBAPP_NAME: your-app-name        # Update this
  AZURE_RESOURCE_GROUP: your-resource-group  # Update this
```

### Update Environment Configuration

Before deployment, ensure `src/environments/environment.prod.ts` has correct values:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.azurewebsites.net/api',
  azureAd: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'https://your-app.azurewebsites.net',
    postLogoutRedirectUri: 'https://your-app.azurewebsites.net'
  }
};
```

---

## Step 3: Commit and Push

1. **Commit workflow files**
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions workflows for Azure deployment"
   git push origin main
   ```

2. **Verify workflow runs**
   - Go to GitHub repository
   - Click "Actions" tab
   - You should see the workflow running

---

## Step 4: Configure Branch Protection (Optional)

1. Go to repository Settings → Branches
2. Add branch protection rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select the build workflow

---

## Workflow Triggers

### Automatic Triggers
- **Push to main/master**: Automatically builds and deploys
- **Pull Request**: Builds and tests (does not deploy)

### Manual Trigger
- Go to Actions tab
- Select workflow
- Click "Run workflow"
- Choose branch
- Click "Run workflow"

---

## Monitoring Workflows

### View Workflow Runs
1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow from left sidebar
4. Click on a run to see details

### View Logs
- Click on a workflow run
- Click on a job
- Click on a step to see logs

---

## Troubleshooting

### Issue: Workflow fails on build
**Solution:**
- Check Node.js version compatibility
- Verify `package.json` scripts are correct
- Check build logs for specific errors

### Issue: Deployment fails
**Solution:**
- Verify Azure secrets are correctly set
- Check Azure resource names match workflow
- Verify Azure permissions

### Issue: Authentication fails
**Solution:**
- Verify Azure AD redirect URIs include GitHub Pages URL (if applicable)
- Check environment.prod.ts configuration
- Verify Azure AD app registration is active

---

## Customization

### Add Environment-Specific Deployments

Create separate workflows for different environments:

```yaml
# .github/workflows/deploy-uat.yml
name: Deploy to UAT
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment'
        required: true
        default: 'uat'
```

### Add Notifications

Add Slack/Email notifications on deployment:

```yaml
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment successful!'
```

---

## Security Best Practices

1. **Never commit secrets**
   - Use GitHub Secrets for sensitive data
   - Never hardcode credentials

2. **Use least privilege**
   - Grant minimal required permissions
   - Use service principals with limited scope

3. **Enable branch protection**
   - Require reviews before merge
   - Require status checks

4. **Regular updates**
   - Keep workflow actions updated
   - Review and update dependencies

---

## Workflow Files Reference

### Main Workflow Files
- `.github/workflows/azure-deploy.yml` - Static Web Apps deployment
- `.github/workflows/azure-app-service-deploy.yml` - App Service deployment
- `.github/workflows/build-and-test.yml` - CI workflow

### Configuration Files
- `package.json` - Build scripts
- `angular.json` - Angular build configuration
- `src/environments/environment.prod.ts` - Production environment

---

## Next Steps

1. ✅ Choose deployment method (Static Web Apps or App Service)
2. ✅ Set up Azure resources
3. ✅ Configure GitHub Secrets
4. ✅ Update workflow environment variables
5. ✅ Update environment.prod.ts
6. ✅ Commit and push workflow files
7. ✅ Monitor first deployment
8. ✅ Configure Azure AD redirect URIs
9. ✅ Test deployed application

---

## Support

For issues or questions:
- Check workflow logs in GitHub Actions
- Review Azure deployment logs
- Consult Azure documentation
- Review Angular deployment guide

---

**End of GitHub Workflow Setup Guide**
