import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole, AzureAdUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: AzureAdUser[] = [];
  filteredUsers: AzureAdUser[] = [];
  existingUsers: User[] = [];
  userRoles: Map<string, UserRole> = new Map();
  searchTerm = '';
  selectedUser: AzureAdUser | null = null;
  selectedRole: UserRole = UserRole.NormalUser;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  componentLoadTime = new Date().toLocaleTimeString();
  
  // Angular Material table column definitions
  existingUsersColumns: string[] = ['name', 'email', 'role', 'loginStatus', 'status', 'actions'];
  azureAdUsersColumns: string[] = ['name', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('=== UserManagementComponent constructor called ===');
    console.log('Component is being created...');
  }

  ngOnInit(): void {
    console.log('=== UserManagementComponent ngOnInit() called ===');
    console.log('Component is initializing...');
    
    // Set debug object immediately
    (window as any).userManagementDebug = {
      componentInitialized: true,
      timestamp: new Date().toISOString(),
      message: 'Component initialized - check console!'
    };
    console.log('Debug object set:', (window as any).userManagementDebug);
    
    // Load users immediately
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('=== loadUsers() called ===');
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
    
    // Load existing users
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('=== EXISTING USERS RECEIVED ===', users);
        
        if (users && Array.isArray(users) && users.length > 0) {
          this.existingUsers = users;
          users.forEach(user => {
            this.userRoles.set(user.email, user.role);
          });
          console.log(`✅ Loaded ${this.existingUsers.length} existing users`);
        } else {
          this.existingUsers = [];
          console.warn('⚠️ No existing users received');
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('=== ERROR LOADING EXISTING USERS ===');
        console.error('Error:', error);
        console.error('Error type:', typeof error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        this.existingUsers = [];
      },
      complete: () => {
        console.log('getUsers() subscription completed');
      }
    });
    
    // Load Azure AD users
    console.log('Calling userService.getAzureAdUsers()...');
    this.userService.getAzureAdUsers().subscribe({
      next: (users) => {
        console.log('=== AZURE AD USERS RECEIVED ===', users);
        
        if (users && Array.isArray(users) && users.length > 0) {
          this.users = users;
          this.filteredUsers = users;
          
          // Update roles for Azure AD users based on existing users
          if (this.existingUsers.length > 0) {
            this.users.forEach(aadUser => {
              const existingUser = this.existingUsers.find(u => u.email === aadUser.mail || u.email === aadUser.userPrincipalName);
              if (existingUser) {
                this.userRoles.set(aadUser.mail || aadUser.userPrincipalName, existingUser.role);
              }
            });
          }
          
          console.log(`✅ Loaded ${this.filteredUsers.length} Azure AD users`);
        } else {
          this.users = [];
          this.filteredUsers = [];
          console.warn('⚠️ No Azure AD users received');
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
        
        // Update debug object
        (window as any).userManagementDebug = {
          existingUsers: this.existingUsers,
          filteredUsers: this.filteredUsers,
          existingUsersCount: this.existingUsers.length,
          filteredUsersCount: this.filteredUsers.length,
          loadComplete: true
        };
        
        console.log('✅ FINAL STATE:', {
          existingUsers: this.existingUsers.length,
          filteredUsers: this.filteredUsers.length
        });
      },
      error: (error) => {
        console.error('=== ERROR LOADING AZURE AD USERS ===');
        console.error('Error:', error);
        console.error('Error type:', typeof error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        this.errorMessage = 'Failed to load Azure AD users. Showing existing users only.';
        this.users = [];
        this.filteredUsers = [];
        this.isLoading = false;
      },
      complete: () => {
        console.log('getAzureAdUsers() subscription completed');
      }
    });
  }

  loadUserRoles(): void {
    // This method is no longer needed as loadUsers handles everything
    // Keeping for backward compatibility
  }

  editUserRole(user: User): void {
    // Find the Azure AD user and select them for role editing
    const aadUser = this.users.find(u => u.mail === user.email || u.userPrincipalName === user.email);
    if (aadUser) {
      this.selectUser(aadUser);
      this.selectedRole = user.role;
    }
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      // Reload all existing users when search is cleared
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.existingUsers = users;
        }
      });
      return;
    }

    const term = this.searchTerm.toLowerCase();
    // Filter Azure AD users by email
    this.filteredUsers = this.users.filter(user =>
      user.mail?.toLowerCase().includes(term) ||
      user.userPrincipalName.toLowerCase().includes(term)
    );
    
    // Filter existing users by email
    this.userService.getUsers(term).subscribe({
      next: (users) => {
        this.existingUsers = users;
      }
    });
  }

  selectUser(user: AzureAdUser): void {
    this.selectedUser = user;
    this.selectedRole = this.userRoles.get(user.mail || user.userPrincipalName) || UserRole.NormalUser;
    this.errorMessage = '';
    this.successMessage = '';
  }

  assignRole(): void {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // First, get or create user in system, then assign role
    this.userService.assignRole(this.selectedUser.id, this.selectedRole).subscribe({
      next: (user) => {
        this.userRoles.set(this.selectedUser!.mail || this.selectedUser!.userPrincipalName, this.selectedRole);
        this.successMessage = `Role assigned successfully to ${this.selectedUser!.displayName}`;
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
          this.selectedUser = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error assigning role:', error);
        this.errorMessage = 'Failed to assign role. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getRoleForUser(user: AzureAdUser): UserRole | string {
    const role = this.userRoles.get(user.mail || user.userPrincipalName);
    return role ? this.formatRoleName(role) : 'Not Assigned';
  }

  formatRoleName(role: UserRole | string): string {
    if (!role) return '';
    // Convert camelCase to Title Case with spaces
    return role.toString()
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  }

  getFormattedRole(role: string): string {
    return this.formatRoleName(role);
  }

  getLoggedInCount(): number {
    return this.existingUsers.filter(user => user.isLoggedIn).length;
  }

  getLastLoginText(lastLogin: Date): string {
    if (!lastLogin) return '';
    
    const now = new Date();
    const diff = now.getTime() - new Date(lastLogin).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  removeRole(user: User): void {
    if (confirm(`Are you sure you want to remove the role from ${user.name}?`)) {
      // In a real implementation, this would call an API to remove the role
      // For now, we'll just remove it from the local map
      this.userRoles.delete(user.email);
      const index = this.existingUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.existingUsers[index].role = UserRole.NormalUser; // Set to default or remove
      }
      this.successMessage = `Role removed from ${user.name}`;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }
}
