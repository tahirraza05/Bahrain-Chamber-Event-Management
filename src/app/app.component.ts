import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <app-main-nav *ngIf="isAuthenticated"></app-main-nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

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
    
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
}
