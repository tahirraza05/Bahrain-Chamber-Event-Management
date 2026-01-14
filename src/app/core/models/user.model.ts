export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  NormalUser = 'NormalUser'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  isActive: boolean;
  isLoggedIn?: boolean;
  lastLogin?: Date;
}

export interface AzureAdUser {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  photo?: string;
}
