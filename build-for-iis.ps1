# Build script for IIS deployment
# This script builds the Angular app for production and prepares it for IIS

Write-Host "=== Building Bahrain Chamber App for Production ===" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Build for production
Write-Host "Building for production..." -ForegroundColor Yellow
npm run build -- --configuration production

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host ""
    
    # Copy web.config to dist folder
    $distPath = "dist\bahrain-chamber-app"
    $webConfigPath = "web.config"
    
    if (Test-Path $webConfigPath) {
        if (Test-Path $distPath) {
            Copy-Item $webConfigPath "$distPath\web.config" -Force
            Write-Host "web.config copied to $distPath" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "=== Build Complete ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your production files are in: $distPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Copy contents of $distPath to your IIS website folder" -ForegroundColor White
    Write-Host "2. Ensure URL Rewrite Module is installed on IIS" -ForegroundColor White
    Write-Host "3. Configure IIS website pointing to the deployment folder" -ForegroundColor White
    Write-Host "4. Test the application at http://localhost (or your configured port)" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
