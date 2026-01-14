# Bahrain Chamber App - Azure Package Builder
# This script builds and packages the application for Azure deployment

param(
    [string]$Version = "1.0.0",
    [switch]$SkipBuild = $false,
    [string]$DeploymentType = "static" # "static" or "appservice"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Bahrain Chamber App - Azure Package Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get current date/time for package naming
$BuildDate = Get-Date -Format "yyyyMMdd-HHmmss"
$PackageName = "BahrainChamber-Azure-$BuildDate"
$PackageDir = "Azure-Package-$BuildDate"

# Step 1: Clean previous builds
Write-Host "[1/8] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    Write-Host "   ✓ Previous build artifacts removed" -ForegroundColor Green
} else {
    Write-Host "   ✓ No previous build found" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "[2/8] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Dependencies installed" -ForegroundColor Green

# Step 3: Build for production
if (-not $SkipBuild) {
    Write-Host "[3/8] Building for production..." -ForegroundColor Yellow
    
    if ($DeploymentType -eq "appservice") {
        # For App Service, include web.config
        npm run build:prod:iis
    } else {
        # For Static Web Apps, standard build
        npm run build:prod
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ✗ Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✓ Production build completed" -ForegroundColor Green
} else {
    Write-Host "[3/8] Skipping build (using existing dist folder)" -ForegroundColor Yellow
}

# Step 4: Verify build output
Write-Host "[4/8] Verifying build output..." -ForegroundColor Yellow
$BuildPath = "dist\bahrain-chamber-app"
if (-not (Test-Path $BuildPath)) {
    Write-Host "   ✗ Build output not found at $BuildPath" -ForegroundColor Red
    exit 1
}

$RequiredFiles = @("index.html")
if ($DeploymentType -eq "appservice") {
    $RequiredFiles += "web.config"
}

foreach ($file in $RequiredFiles) {
    if (-not (Test-Path "$BuildPath\$file")) {
        Write-Host "   ✗ Required file missing: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "   ✓ Build output verified" -ForegroundColor Green

# Step 5: Create package directory
Write-Host "[5/8] Creating package directory..." -ForegroundColor Yellow
if (Test-Path $PackageDir) {
    Remove-Item -Recurse -Force $PackageDir
}
New-Item -ItemType Directory -Force -Path $PackageDir | Out-Null
Write-Host "   ✓ Package directory created: $PackageDir" -ForegroundColor Green

# Step 6: Copy files to package
Write-Host "[6/8] Copying files to package..." -ForegroundColor Yellow

# Copy build files
Copy-Item -Recurse "$BuildPath\*" "$PackageDir\" -Force
Write-Host "   ✓ Application files copied" -ForegroundColor Green

# Copy documentation
$Docs = @(
    "AZURE_DEPLOYMENT_GUIDE.md",
    "AZURE_DEPLOYMENT_STEPS.md",
    "README.md"
)
foreach ($doc in $Docs) {
    if (Test-Path $doc) {
        Copy-Item $doc "$PackageDir\" -Force
        Write-Host "   ✓ Copied: $doc" -ForegroundColor Green
    }
}

# Create staticwebapp.config.json for Azure Static Web Apps (if needed)
if ($DeploymentType -eq "static") {
    $StaticWebAppConfig = @{
        routes = @(
            @{
                route = "/*"
                serve = "/index.html"
                statusCode = 200
            }
        )
        navigationFallback = @{
            fallback = "/index.html"
        }
        responseOverrides = @{
            "404" = @{
                serve = "/index.html"
                statusCode = 200
            }
        }
    } | ConvertTo-Json -Depth 10
    
    $StaticWebAppConfig | Out-File "$PackageDir\staticwebapp.config.json" -Encoding UTF8
    Write-Host "   ✓ Created staticwebapp.config.json" -ForegroundColor Green
}

# Step 7: Create package manifest
Write-Host "[7/8] Creating package manifest..." -ForegroundColor Yellow

$ConfigNote = if ($DeploymentType -eq "appservice") {
    "- web.config (IIS/App Service configuration)"
} else {
    "- staticwebapp.config.json (Static Web Apps configuration)"
}

$Manifest = "Bahrain Chamber Event Management System - Azure Deployment Package`r`n"
$Manifest += "================================================================`r`n"
$Manifest += "Version: $Version`r`n"
$Manifest += "Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`r`n"
$Manifest += "Build Environment: Production`r`n"
$Manifest += "Target Environment: Azure`r`n"
$Manifest += "Deployment Type: $DeploymentType`r`n"
$Manifest += "`r`n"
$Manifest += "Package Contents:`r`n"
$Manifest += "- Application files (dist/bahrain-chamber-app/*)`r`n"
$Manifest += "- Deployment documentation`r`n"
$Manifest += "$ConfigNote`r`n"
$Manifest += "`r`n"
$Manifest += "Deployment Instructions:`r`n"
$Manifest += "1. Review AZURE_DEPLOYMENT_GUIDE.md for detailed steps`r`n"
$Manifest += "2. Choose deployment method (Static Web Apps or App Service)`r`n"
$Manifest += "3. Follow deployment steps in the guide`r`n"
$Manifest += "4. Configure Azure AD and environment settings`r`n"
$Manifest += "`r`n"
$Manifest += "Build Information:`r`n"
$Manifest += "- Node Version: $(node --version)`r`n"
$Manifest += "- npm Version: $(npm --version)`r`n"
$Manifest += "- Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`r`n"
$Manifest += "- Deployment Type: $DeploymentType`r`n"
$Manifest += "`r`n"
$Manifest += "Azure Deployment Methods:`r`n"
$Manifest += "1. Azure Static Web Apps (Recommended for Angular)`r`n"
$Manifest += "   - Use: swa deploy command`r`n"
$Manifest += "   - Or: Connect GitHub repository for CI/CD`r`n"
$Manifest += "`r`n"
$Manifest += "2. Azure App Service`r`n"
$Manifest += "   - Use: ZIP deploy via Azure CLI`r`n"
$Manifest += "   - Or: Use Azure Portal ZIP deploy`r`n"
$Manifest += "   - Or: Use VS Code Azure extension`r`n"
$Manifest += "`r`n"
$Manifest += "Important Notes:`r`n"
$Manifest += "- Update environment.prod.ts with Azure URLs before deployment`r`n"
$Manifest += "- Configure Azure AD redirect URIs for Azure domain`r`n"
$Manifest += "- Ensure SSL/HTTPS is configured for production`r`n"
$Manifest += "- Test all functionality after deployment`r`n"

$Manifest | Out-File "$PackageDir\PACKAGE_MANIFEST.txt" -Encoding UTF8
Write-Host "   ✓ Package manifest created" -ForegroundColor Green

# Step 8: Create ZIP archive
Write-Host "[8/8] Creating ZIP archive..." -ForegroundColor Yellow
$ZipFile = "$PackageName.zip"
if (Test-Path $ZipFile) {
    Remove-Item -Force $ZipFile
}
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipFile -Force
Write-Host "   ✓ ZIP archive created: $ZipFile" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Azure Package Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package Details:" -ForegroundColor Yellow
Write-Host "  Package Name: $ZipFile" -ForegroundColor White
Write-Host "  Package Size: $([math]::Round((Get-Item $ZipFile).Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  Package Location: $(Resolve-Path $ZipFile)" -ForegroundColor White
Write-Host "  Deployment Type: $DeploymentType" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review AZURE_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "  2. Update environment.prod.ts with Azure URLs" -ForegroundColor White
Write-Host "  3. Choose deployment method (Static Web Apps or App Service)" -ForegroundColor White
Write-Host "  4. Deploy using Azure CLI or Azure Portal" -ForegroundColor White
Write-Host "  5. Configure Azure AD redirect URIs" -ForegroundColor White
Write-Host "  6. Test the application after deployment" -ForegroundColor White
Write-Host ""
Write-Host "Quick Deploy Commands:" -ForegroundColor Yellow
if ($DeploymentType -eq "static") {
    Write-Host "  swa deploy $PackageDir --app-name your-app-name" -ForegroundColor Cyan
} else {
    $DeployCmd = "az webapp deployment source config-zip --resource-group rg-name --name app-name --src $ZipFile"
    Write-Host "  $DeployCmd" -ForegroundColor Cyan
}
Write-Host ""
