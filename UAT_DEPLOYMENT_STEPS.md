# UAT Deployment Steps - Quick Reference

## Quick Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and approved
- [ ] Environment configuration updated (`environment.prod.ts`)
- [ ] Azure AD UAT app registration configured
- [ ] UAT API URL confirmed and accessible

### Build Package
```powershell
# Run the automated build script
.\build-uat-package.ps1

# Or manually:
npm install
npm run build:prod:iis
```

### Deploy to Server
1. **Transfer Package**
   - Copy `BahrainChamber-UAT-[timestamp].zip` to UAT server
   - Extract to deployment location

2. **IIS Configuration**
   - Create Application Pool: `BahrainChamberUAT` (No Managed Code)
   - Create Website pointing to extracted folder
   - Bind to UAT domain/port
   - Set permissions (IIS_IUSRS: Read & Execute)

3. **Verify**
   - Check `web.config` exists
   - Verify URL Rewrite Module installed
   - Test application loads

### Post-Deployment
- [ ] Application accessible at UAT URL
- [ ] Azure AD login works
- [ ] All routes accessible
- [ ] API connectivity verified
- [ ] Print functionality tested

---

## Detailed Steps

### Step 1: Build Package
```powershell
.\build-uat-package.ps1
```

### Step 2: Transfer to UAT Server
- Copy ZIP file to server
- Extract to: `C:\inetpub\wwwroot\bahrain-chamber-uat`

### Step 3: Configure IIS

#### Create Application Pool
```
Name: BahrainChamberUAT
.NET CLR Version: No Managed Code
Pipeline Mode: Integrated
```

#### Create Website
```
Name: Bahrain Chamber UAT
Physical Path: C:\inetpub\wwwroot\bahrain-chamber-uat
Binding: https://uat.bahrainchamber.bh:443
Application Pool: BahrainChamberUAT
```

#### Set Permissions
- Add `IIS_IUSRS` with Read & Execute
- Add Application Pool Identity with Read & Execute

### Step 4: Test
1. Navigate to UAT URL
2. Test login
3. Test all features
4. Check browser console for errors

---

## Rollback
1. Stop website in IIS
2. Restore previous version
3. Restart website

---

## Support
See `UAT_DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
