import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentUser: User | null = null;
  showProfileMenu = false;
  userRoles = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msalService: MsalService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  hasRole(role: UserRole): boolean {
    return this.authService.hasRole(role);
  }

  logout(): void {
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const fallback = img.nextElementSibling as HTMLElement;
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  }
}
