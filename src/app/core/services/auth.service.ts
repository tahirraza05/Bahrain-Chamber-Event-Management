import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        sessionStorage.removeItem('currentUser');
      }
    }
  }

  setCurrentUser(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  validateToken(token: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { token });
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUser;
    if (!user) return false;
    
    if (role === UserRole.SuperAdmin) {
      return user.role === UserRole.SuperAdmin;
    }
    if (role === UserRole.Admin) {
      return user.role === UserRole.SuperAdmin || user.role === UserRole.Admin;
    }
    return true; // NormalUser can access normal user routes
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.clearUser();
  }
}
