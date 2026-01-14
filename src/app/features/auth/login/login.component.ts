import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMessage = '';

  constructor(
    private msalService: MsalService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TEMPORARY: Auto-login for development
    if (!this.authService.isAuthenticated()) {
      this.authService.setCurrentUser({
        id: 'dev-user-1',
        name: 'Development User',
        email: 'dev@bahrainchamber.bh',
        role: 'SuperAdmin' as any,
        isActive: true
      });
    }
    this.redirectToDashboard();
    
    // Original code (commented for development):
    // if (this.authService.isAuthenticated()) {
    //   this.redirectToDashboard();
    //   return;
    // }
    // this.handleRedirectCallback();
  }

  handleRedirectCallback(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (response) => {
        if (response) {
          this.processLoginResponse(response);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Authentication failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  login(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.msalService.loginRedirect({
      scopes: ['user.read', 'profile']
    });
  }

  private processLoginResponse(response: any): void {
    if (response && response.account) {
      const account = response.account;
      
      // Get access token
      this.msalService.acquireTokenSilent({
        scopes: ['user.read'],
        account: account
      }).subscribe({
        next: (tokenResponse) => {
          // Validate token with backend and get user with roles
          this.authService.validateToken(tokenResponse.accessToken).subscribe({
            next: (user: User) => {
              // Store token
              sessionStorage.setItem('authToken', tokenResponse.accessToken);
              
              // Set user profile picture if available
              if (account.idTokenClaims && (account.idTokenClaims as any).picture) {
                user.profilePicture = (account.idTokenClaims as any).picture;
              }
              
              this.authService.setCurrentUser(user);
              this.redirectToDashboard();
            },
            error: (error) => {
              console.error('Token validation error:', error);
              this.errorMessage = 'Failed to validate authentication. Please contact support.';
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Token acquisition error:', error);
          this.errorMessage = 'Failed to acquire access token. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  private redirectToDashboard(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigate([returnUrl]);
  }
}
