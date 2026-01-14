# Quick Start Guide

## Prerequisites

1. **Install Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - Run the installer and follow the setup wizard
   - **Important**: Restart your terminal/PowerShell after installation

## Running the Application

### Option 1: Using the Batch File (Windows)

1. Double-click `start-app.bat`
2. The script will:
   - Check if Node.js is installed
   - Install dependencies (first time only)
   - Start the development server
3. The app will open automatically at `http://localhost:4200`

### Option 2: Using Command Line

1. Open PowerShell or Command Prompt
2. Navigate to the project directory:
   ```powershell
   cd C:\Users\TAHIR\bahrain-chamber-app
   ```

3. Install dependencies (first time only):
   ```powershell
   npm install
   ```

4. Start the development server:
   ```powershell
   npm start
   ```
   or
   ```powershell
   ng serve
   ```

5. Open your browser and navigate to: `http://localhost:4200`

## Configuration

Before using the application, you need to configure:

1. **Azure AD Settings** in `src/environments/environment.ts`:
   ```typescript
   azureAd: {
     clientId: 'YOUR_AZURE_AD_CLIENT_ID',
     authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
     redirectUri: window.location.origin,
     postLogoutRedirectUri: window.location.origin
   }
   ```

2. **API URL** in `src/environments/environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:5000/api'  // Your .NET Core backend URL
   ```

## Troubleshooting

- **"npm is not recognized"**: Node.js is not installed or not in PATH. Reinstall Node.js and restart terminal.
- **Port 4200 already in use**: Another application is using port 4200. Stop it or change the port:
  ```powershell
  ng serve --port 4201
  ```
- **Installation errors**: Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again.

## Development

- The app will automatically reload when you make changes
- Check the browser console for any errors
- Use browser DevTools (F12) for debugging
