# Deployment Quick Reference

## 🚀 Quick Start

### Build for Production
```bash
npm run build:prod
```

Output will be in: `dist/bahrain-chamber-app/`

---

## 📦 Deployment Options

### Option 1: IIS (Windows Server) ⭐
**Best for:** Windows environments, .NET backend integration

**Steps:**
1. Install URL Rewrite Module: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run: `npm run build:prod`
3. Copy `dist/bahrain-chamber-app/*` to IIS folder
4. Copy `web.config` to IIS folder
5. Create IIS website pointing to folder
6. Set Application Pool to "No Managed Code"
7. Test at `http://localhost`

**See:** `DEPLOYMENT_STEPS.md` for detailed IIS steps

---

### Option 2: Azure Static Web Apps ⭐⭐⭐⭐⭐
**Best for:** .NET backend, enterprise environments

**Steps:**
1. Create Static Web App in Azure Portal
2. Connect to GitHub/DevOps
3. Build command: `npm run build`
4. Output: `dist/bahrain-chamber-app`
5. Deploy automatically on commit

**OR use CLI:**
```bash
npm install -g @azure/static-web-apps-cli
npm run build:prod
swa deploy dist/bahrain-chamber-app --app-name your-app-name
```

---

### Option 3: Netlify ⭐⭐⭐⭐⭐
**Best for:** Easy setup, free tier

**Steps:**
1. Sign up at: https://netlify.com
2. Connect GitHub repository OR drag & drop `dist/bahrain-chamber-app` folder
3. Build command: `npm run build -- --configuration production`
4. Publish directory: `dist/bahrain-chamber-app`
5. Deploy!

**Free tier includes:**
- HTTPS by default
- Global CDN
- Continuous deployment
- Custom domains

---

### Option 4: Vercel ⭐⭐⭐⭐⭐
**Best for:** Fast performance, Angular apps

**Steps:**
1. Sign up at: https://vercel.com
2. Import Git repository
3. Auto-detects Angular configuration
4. Deploy automatically on push

---

### Option 5: AWS S3 + CloudFront ⭐⭐⭐⭐
**Best for:** Scalable, cost-effective

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist/bahrain-chamber-app/*` to bucket
4. Configure CloudFront distribution
5. Set up Route 53 (optional, for custom domain)

---

## 📝 Pre-Deployment Checklist

- [ ] Update `src/environments/environment.prod.ts` with production URLs
- [ ] Update Azure AD redirect URIs to include production domain
- [ ] Test production build locally
- [ ] Remove console.log statements (optional)
- [ ] Verify API endpoints are accessible
- [ ] Test authentication flow
- [ ] Test all routes and navigation

---

## 🔧 Build Commands

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

---

## 📂 Build Output Location

After building, all files will be in:
```
dist/bahrain-chamber-app/
```

This folder contains everything you need to deploy.

---

## 🔒 Security Checklist

- [ ] Enable HTTPS in production
- [ ] Update CORS settings on backend
- [ ] Configure Azure AD redirect URIs
- [ ] Remove source maps (or keep separate)
- [ ] Set security headers (included in web.config)
- [ ] Use environment variables for sensitive data

---

## 📚 Documentation Files

- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_STEPS.md` - Quick step-by-step instructions
- `web.config` - IIS configuration file
- `build-for-iis.ps1` - PowerShell build script for IIS

---

## 🌐 Recommended Hosting (Ranked)

1. **Azure Static Web Apps** - Best for .NET integration ⭐⭐⭐⭐⭐
2. **Netlify** - Easiest setup, free tier ⭐⭐⭐⭐⭐
3. **Vercel** - Great performance, free tier ⭐⭐⭐⭐⭐
4. **AWS S3 + CloudFront** - Scalable, cost-effective ⭐⭐⭐⭐
5. **IIS** - Windows server deployment ⭐⭐⭐

---

## 💡 Tips

- **For development:** Use `npm start` (runs on `http://localhost:4200`)
- **For production:** Use `npm run build:prod` (creates optimized bundle)
- **Test locally:** Use `npx http-server dist/bahrain-chamber-app -p 8080`
- **For IIS:** Use `npm run build:prod:iis` (includes web.config copy)

---

## 🆘 Troubleshooting

### Build Fails
- Run `npm install` first
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall

### 404 Errors After Deployment (IIS)
- Install URL Rewrite Module
- Ensure web.config is in deployment folder
- Check routing configuration

### API Calls Failing
- Verify CORS is configured on backend
- Check API URLs in environment.prod.ts
- Ensure HTTPS is used in production

### Authentication Not Working
- Update Azure AD redirect URIs
- Check environment configuration
- Verify client ID and tenant ID

---

## 📞 Support

For detailed deployment instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete guide
- `DEPLOYMENT_STEPS.md` - Step-by-step instructions
- Angular Deployment: https://angular.io/guide/deployment
