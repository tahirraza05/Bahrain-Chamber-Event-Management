# Bahrain Chamber App - UAT Package Builder
# This script builds and packages the application for UAT deployment

param(
    [string]$Version = "1.0.0",
    [switch]$SkipBuild = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Bahrain Chamber App - UAT Package Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get current date/time for package naming
$BuildDate = Get-Date -Format "yyyyMMdd-HHmmss"
$PackageName = "BahrainChamber-UAT-$BuildDate"
$PackageDir = "UAT-Package-$BuildDate"

# Step 1: Clean previous builds
Write-Host "[1/7] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
    Write-Host "   ✓ Previous build artifacts removed" -ForegroundColor Green
} else {
    Write-Host "   ✓ No previous build found" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "[2/7] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Dependencies installed" -ForegroundColor Green

# Step 3: Build for production
if (-not $SkipBuild) {
    Write-Host "[3/7] Building for production..." -ForegroundColor Yellow
    npm run build:prod:iis
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ✗ Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✓ Production build completed" -ForegroundColor Green
} else {
    Write-Host "[3/7] Skipping build (using existing dist folder)" -ForegroundColor Yellow
}

# Step 4: Verify build output
Write-Host "[4/7] Verifying build output..." -ForegroundColor Yellow
$BuildPath = "dist\bahrain-chamber-app"
if (-not (Test-Path $BuildPath)) {
    Write-Host "   ✗ Build output not found at $BuildPath" -ForegroundColor Red
    exit 1
}

$RequiredFiles = @("index.html", "web.config")
foreach ($file in $RequiredFiles) {
    if (-not (Test-Path "$BuildPath\$file")) {
        Write-Host "   ✗ Required file missing: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "   ✓ Build output verified" -ForegroundColor Green

# Step 5: Create package directory
Write-Host "[5/7] Creating package directory..." -ForegroundColor Yellow
if (Test-Path $PackageDir) {
    Remove-Item -Recurse -Force $PackageDir
}
New-Item -ItemType Directory -Force -Path $PackageDir | Out-Null
Write-Host "   ✓ Package directory created: $PackageDir" -ForegroundColor Green

# Step 6: Copy files to package
Write-Host "[6/7] Copying files to package..." -ForegroundColor Yellow

# Copy build files
Copy-Item -Recurse "$BuildPath\*" "$PackageDir\" -Force
Write-Host "   ✓ Application files copied" -ForegroundColor Green

# Copy documentation
$Docs = @(
    "UAT_DEPLOYMENT_GUIDE.md",
    "DEPLOYMENT_STEPS.md",
    "README.md"
)
foreach ($doc in $Docs) {
    if (Test-Path $doc) {
        Copy-Item $doc "$PackageDir\" -Force
        Write-Host "   ✓ Copied: $doc" -ForegroundColor Green
    }
}

# Create package manifest
$Manifest = @"
Bahrain Chamber Event Management System - UAT Deployment Package
===============================================================
Version: $Version
Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Build Environment: Production
Target Environment: UAT

Package Contents:
- Application files (dist/bahrain-chamber-app/*)
- web.config (IIS configuration)
- Deployment documentation

Deployment Instructions:
1. Extract this package to UAT server
2. Follow UAT_DEPLOYMENT_GUIDE.md for detailed steps
3. Configure IIS as per deployment guide
4. Update environment configuration if needed

Build Information:
- Node Version: $(node --version)
- npm Version: $(npm --version)
- Angular CLI Version: $(ng version --json | ConvertFrom-Json | Select-Object -ExpandProperty 'angularCliVersion')
- Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Important Notes:
- Ensure IIS URL Rewrite Module is installed on UAT server
- Verify Azure AD configuration before deployment
- Test all functionality after deployment
"@

$Manifest | Out-File "$PackageDir\PACKAGE_MANIFEST.txt" -Encoding UTF8
Write-Host "   ✓ Package manifest created" -ForegroundColor Green

# Step 7: Create ZIP archive
Write-Host "[7/7] Creating ZIP archive..." -ForegroundColor Yellow
$ZipFile = "$PackageName.zip"
if (Test-Path $ZipFile) {
    Remove-Item -Force $ZipFile
}
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipFile -Force
Write-Host "   ✓ ZIP archive created: $ZipFile" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Package Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Package Details:" -ForegroundColor Yellow
Write-Host "  Package Name: $PackageName.zip" -ForegroundColor White
Write-Host "  Package Size: $([math]::Round((Get-Item $ZipFile).Length / 1MB, 2)) MB" -ForegroundColor White
Write-Host "  Package Location: $(Resolve-Path $ZipFile)" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review UAT_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "  2. Transfer package to UAT server" -ForegroundColor White
Write-Host "  3. Follow deployment steps in the guide" -ForegroundColor White
Write-Host "  4. Test the application after deployment" -ForegroundColor White
Write-Host ""
