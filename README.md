# Bahrain Chamber Event Management System

A comprehensive Angular frontend application for managing events (AGM/Election) with Azure AD authentication, role-based access control, member registration, and Dynamics CRM integration.

## Features

- **Azure AD Single Sign-On (SSO)**: Secure authentication using Microsoft Azure Active Directory
- **Role-Based Access Control**: Three user roles (Super Admin, Admin, Normal User)
- **Dashboard**: Real-time statistics, charts, and member lists
- **Member Registration**: Search by CPR, CR, or Membership number with vote calculation
- **User Management**: Super Admin can assign roles to Azure AD users
- **CRM Sync**: Admin/Super Admin can sync event data from Microsoft Dynamics CRM
- **Unregister Members**: Admin/Super Admin can unregister members with activity log
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Bahrain Chamber Theme**: Styled to match the Bahrain Chamber website

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v17 or higher)
- Azure AD App Registration (for authentication)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Azure AD:**
   - Update `src/environments/environment.ts` with your Azure AD configuration:
     ```typescript
     azureAd: {
       clientId: 'YOUR_AZURE_AD_CLIENT_ID',
       authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
       redirectUri: window.location.origin,
       postLogoutRedirectUri: window.location.origin
     }
     ```

3. **Configure API URL:**
   - Update `src/environments/environment.ts` with your .NET Core backend API URL:
     ```typescript
     apiUrl: 'http://localhost:5000/api'
     ```

## Development

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Build for production:

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── core/              # Core functionality (services, guards, models)
│   ├── shared/            # Shared components and modules
│   ├── features/          # Feature modules
│   │   ├── auth/          # Authentication module
│   │   ├── dashboard/     # Dashboard module
│   │   ├── admin/         # Admin features (user management, CRM sync, unregister)
│   │   └── registration/  # Registration module
│   └── app.module.ts      # Root module
├── assets/                # Static assets
│   └── styles/            # Global styles and theme
└── environments/          # Environment configurations
```

## API Endpoints

The application expects the following endpoints from the .NET Core backend:

- `POST /api/auth/login` - Azure AD token validation
- `GET /api/users` - Get users from AAD
- `PUT /api/users/{id}/role` - Assign role to user
- `GET /api/events/current` - Get current event details
- `POST /api/events/sync` - Sync from Dynamics CRM
- `GET /api/members/eligible` - Get eligible members
- `GET /api/members/search` - Search member
- `GET /api/members/{id}/details` - Get member details with votes
- `POST /api/registrations` - Register member
- `DELETE /api/registrations/{id}` - Unregister member
- `GET /api/registrations/activities` - Get registration activities log

## User Roles

- **Super Admin**: Full access including user management
- **Admin**: Can sync CRM, unregister members, view all data
- **Normal User**: Can view dashboard and register members

## Technologies Used

- Angular 17+
- TypeScript
- Angular Material
- MSAL (Microsoft Authentication Library)
- Chart.js / ng2-charts
- RxJS
- SCSS

## License

This project is proprietary software for Bahrain Chamber.
