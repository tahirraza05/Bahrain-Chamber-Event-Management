import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // TEMPORARY: Skip authentication for development
    // TODO: Re-enable authentication before production
    if (!this.authService.isAuthenticated()) {
      // Create a mock user for development
      this.authService.setCurrentUser({
        id: 'dev-user-1',
        name: 'Development User',
        email: 'dev@bahrainchamber.bh',
        role: 'SuperAdmin' as any,
        isActive: true
      });
    }
    return true;
    
    // Original code (commented out for now):
    // if (this.authService.isAuthenticated()) {
    //   return true;
    // }
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // return false;
  }
}
