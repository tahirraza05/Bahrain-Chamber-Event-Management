import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { User, UserRole, AzureAdUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Dummy data
  private dummyUsers: User[] = [
    {
      id: 'user-1',
      name: 'Ahmed Mohammed Al-Khalifa',
      email: 'ahmed.mohammed@bahrainchamber.bh',
      role: UserRole.SuperAdmin,
      isActive: true,
      isLoggedIn: true,
      lastLogin: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    },
    {
      id: 'user-2',
      name: 'Fatima Al-Khalifa',
      email: 'fatima.alkhalifa@bahrainchamber.bh',
      role: UserRole.Admin,
      isActive: true,
      isLoggedIn: true,
      lastLogin: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    },
    {
      id: 'user-3',
      name: 'Mohammed Hassan Al-Dosari',
      email: 'mohammed.hassan@bahrainchamber.bh',
      role: UserRole.NormalUser,
      isActive: true,
      isLoggedIn: false,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      id: 'user-4',
      name: 'Sara Abdullah Al-Ghanim',
      email: 'sara.abdullah@bahrainchamber.bh',
      role: UserRole.Admin,
      isActive: true,
      isLoggedIn: true,
      lastLogin: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      id: 'user-5',
      name: 'Khalid Yousif Al-Mutawa',
      email: 'khalid.yousif@bahrainchamber.bh',
      role: UserRole.NormalUser,
      isActive: true,
      isLoggedIn: false,
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      id: 'user-6',
      name: 'Noor Ibrahim Al-Mansoori',
      email: 'noor.ibrahim@bahrainchamber.bh',
      role: UserRole.NormalUser,
      isActive: true,
      isLoggedIn: true,
      lastLogin: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
    },
    {
      id: 'user-7',
      name: 'Omar Ali Al-Sabah',
      email: 'omar.ali@bahrainchamber.bh',
      role: UserRole.Admin,
      isActive: true,
      isLoggedIn: false,
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 'user-8',
      name: 'Layla Mohammed Al-Fahad',
      email: 'layla.mohammed@bahrainchamber.bh',
      role: UserRole.NormalUser,
      isActive: false,
      isLoggedIn: false,
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
  ];

  private dummyAzureAdUsers: AzureAdUser[] = [
    {
      id: 'aad-user-1',
      displayName: 'Ahmed Mohammed Al-Khalifa',
      mail: 'ahmed.mohammed@bahrainchamber.bh',
      userPrincipalName: 'ahmed.mohammed@bahrainchamber.bh'
    },
    {
      id: 'aad-user-2',
      displayName: 'Fatima Al-Khalifa',
      mail: 'fatima.alkhalifa@bahrainchamber.bh',
      userPrincipalName: 'fatima.alkhalifa@bahrainchamber.bh'
    },
    {
      id: 'aad-user-3',
      displayName: 'Mohammed Hassan Al-Dosari',
      mail: 'mohammed.hassan@bahrainchamber.bh',
      userPrincipalName: 'mohammed.hassan@bahrainchamber.bh'
    },
    {
      id: 'aad-user-4',
      displayName: 'Sara Abdullah Al-Ghanim',
      mail: 'sara.abdullah@bahrainchamber.bh',
      userPrincipalName: 'sara.abdullah@bahrainchamber.bh'
    },
    {
      id: 'aad-user-5',
      displayName: 'Khalid Yousif Al-Mutawa',
      mail: 'khalid.yousif@bahrainchamber.bh',
      userPrincipalName: 'khalid.yousif@bahrainchamber.bh'
    },
    {
      id: 'aad-user-6',
      displayName: 'Noor Ibrahim Al-Mansoori',
      mail: 'noor.ibrahim@bahrainchamber.bh',
      userPrincipalName: 'noor.ibrahim@bahrainchamber.bh'
    },
    {
      id: 'aad-user-7',
      displayName: 'Omar Ali Al-Sabah',
      mail: 'omar.ali@bahrainchamber.bh',
      userPrincipalName: 'omar.ali@bahrainchamber.bh'
    },
    {
      id: 'aad-user-8',
      displayName: 'Layla Mohammed Al-Fahad',
      mail: 'layla.mohammed@bahrainchamber.bh',
      userPrincipalName: 'layla.mohammed@bahrainchamber.bh'
    },
    {
      id: 'aad-user-9',
      displayName: 'Yousif Abdullah Al-Kuwari',
      mail: 'yousif.abdullah@bahrainchamber.bh',
      userPrincipalName: 'yousif.abdullah@bahrainchamber.bh'
    },
    {
      id: 'aad-user-10',
      displayName: 'Mariam Hassan Al-Thani',
      mail: 'mariam.hassan@bahrainchamber.bh',
      userPrincipalName: 'mariam.hassan@bahrainchamber.bh'
    },
    {
      id: 'aad-user-11',
      displayName: 'Hamad Khalid Al-Attiyah',
      mail: 'hamad.khalid@bahrainchamber.bh',
      userPrincipalName: 'hamad.khalid@bahrainchamber.bh'
    },
    {
      id: 'aad-user-12',
      displayName: 'Aisha Yousif Al-Nuaimi',
      mail: 'aisha.yousif@bahrainchamber.bh',
      userPrincipalName: 'aisha.yousif@bahrainchamber.bh'
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(searchTerm?: string, role?: UserRole): Observable<User[]> {
    console.log('=== UserService.getUsers() called ===');
    console.log('Parameters:', { searchTerm, role });
    console.log('dummyUsers count:', this.dummyUsers ? this.dummyUsers.length : 'NULL!');
    
    // Check if dummyUsers exists
    if (!this.dummyUsers || this.dummyUsers.length === 0) {
      console.error('ERROR: dummyUsers is empty or undefined!');
      return of([]).pipe(delay(50));
    }
    
    console.log('dummyUsers:', JSON.stringify(this.dummyUsers, null, 2));
    
    // If no filters, return ALL users immediately
    if (!searchTerm && !role) {
      console.log('No filters - returning ALL dummyUsers');
      const allUsers = [...this.dummyUsers]; // Create new array reference
      console.log('✅ Returning:', allUsers.length, 'users');
      console.log('✅ First user:', allUsers[0] ? allUsers[0].name : 'NONE');
      console.log('✅ Returning users:', JSON.stringify(allUsers, null, 2));
      return of(allUsers).pipe(delay(100)); // Increased delay slightly
    }
    
    // Apply filters if provided
    let filtered = [...this.dummyUsers];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.email.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term)
      );
      console.log('After search filter:', filtered.length, 'users');
    }
    
    if (role) {
      filtered = filtered.filter(u => u.role === role);
      console.log('After role filter:', filtered.length, 'users');
    }
    
    console.log('=== UserService.getUsers() returning ===');
    console.log('Result count:', filtered.length);
    console.log('Result:', JSON.stringify(filtered, null, 2));
    return of(filtered).pipe(delay(50));
  }

  getAzureAdUsers(searchTerm?: string): Observable<AzureAdUser[]> {
    console.log('=== UserService.getAzureAdUsers() called ===');
    console.log('Parameters:', { searchTerm });
    console.log('dummyAzureAdUsers count:', this.dummyAzureAdUsers ? this.dummyAzureAdUsers.length : 'NULL!');
    
    // Check if dummyAzureAdUsers exists
    if (!this.dummyAzureAdUsers || this.dummyAzureAdUsers.length === 0) {
      console.error('ERROR: dummyAzureAdUsers is empty or undefined!');
      return of([]).pipe(delay(50));
    }
    
    console.log('dummyAzureAdUsers:', JSON.stringify(this.dummyAzureAdUsers, null, 2));
    
    // If no search term, return ALL users immediately
    if (!searchTerm) {
      console.log('No search term - returning ALL dummyAzureAdUsers');
      const allUsers = [...this.dummyAzureAdUsers]; // Create new array reference
      console.log('✅ Returning:', allUsers.length, 'Azure AD users');
      console.log('✅ First user:', allUsers[0] ? allUsers[0].displayName : 'NONE');
      return of(allUsers).pipe(delay(100)); // Increased delay slightly
    }
    
    // Apply search filter
    const term = searchTerm.toLowerCase();
    const filtered = this.dummyAzureAdUsers.filter(u => 
      u.displayName.toLowerCase().includes(term) ||
      u.mail?.toLowerCase().includes(term) ||
      u.userPrincipalName.toLowerCase().includes(term)
    );
    console.log('After search filter:', filtered.length, 'users');
    
    console.log('=== UserService.getAzureAdUsers() returning ===');
    console.log('Result count:', filtered.length);
    console.log('Result:', JSON.stringify(filtered, null, 2));
    return of(filtered).pipe(delay(50));
  }

  assignRole(userId: string, role: UserRole): Observable<User> {
    const user = this.dummyUsers.find(u => u.id === userId) || this.dummyUsers[0];
    user.role = role;
    return of(user).pipe(delay(500));
  }

  getUserById(userId: string): Observable<User> {
    const user = this.dummyUsers.find(u => u.id === userId) || this.dummyUsers[0];
    return of(user).pipe(delay(300));
  }
}
