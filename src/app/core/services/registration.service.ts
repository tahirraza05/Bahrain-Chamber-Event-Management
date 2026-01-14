import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Registration, RegistrationActivity, RegistrationAction } from '../models/registration.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // Dummy data
  private dummyActivities: RegistrationActivity[] = [
    {
      id: 'activity-1',
      memberId: 'member-1',
      memberName: 'Ahmed Ali Al-Khalifa',
      memberCprNumber: '123456789',
      action: RegistrationAction.Register,
      performedBy: 'user-1',
      performedByName: 'Admin User',
      timestamp: new Date('2024-12-10T10:30:00'),
      status: 'success'
    },
    {
      id: 'activity-2',
      memberId: 'member-2',
      memberName: 'Fatima Hassan Al-Mansoori',
      memberCprNumber: '987654321',
      action: RegistrationAction.Register,
      performedBy: 'user-1',
      performedByName: 'Admin User',
      timestamp: new Date('2024-12-11T14:20:00'),
      status: 'success'
    },
    {
      id: 'activity-3',
      memberId: 'member-4',
      memberName: 'Sara Abdullah Al-Ghanim',
      memberCprNumber: '789123456',
      action: RegistrationAction.Register,
      performedBy: 'user-2',
      performedByName: 'Super Admin',
      timestamp: new Date('2024-12-09T09:15:00'),
      status: 'success'
    },
    {
      id: 'activity-4',
      memberId: 'member-1',
      memberName: 'Ahmed Ali Al-Khalifa',
      memberCprNumber: '123456789',
      action: RegistrationAction.Unregister,
      performedBy: 'user-1',
      performedByName: 'Admin User',
      timestamp: new Date('2024-12-10T11:00:00'),
      status: 'success'
    },
    {
      id: 'activity-5',
      memberId: 'member-1',
      memberName: 'Ahmed Ali Al-Khalifa',
      memberCprNumber: '123456789',
      action: RegistrationAction.Register,
      performedBy: 'user-1',
      performedByName: 'Admin User',
      timestamp: new Date('2024-12-10T11:05:00'),
      status: 'success'
    }
  ];

  constructor(private http: HttpClient) {}

  registerMember(memberId: string, eventId: string): Observable<Registration> {
    const registration: Registration = {
      id: `reg-${Date.now()}`,
      memberId,
      memberName: 'Member Name',
      eventId,
      action: RegistrationAction.Register,
      performedBy: 'dev-user-1',
      performedByName: 'Development User',
      timestamp: new Date(),
      registrationPass: `PASS-${Date.now()}`,
      qrCode: `QR-${Date.now()}`
    };
    
    // Add to activities
    this.dummyActivities.unshift({
      id: `activity-${Date.now()}`,
      memberId,
      memberName: 'Member Name',
      memberCprNumber: '123456789',
      action: RegistrationAction.Register,
      performedBy: 'dev-user-1',
      performedByName: 'Development User',
      timestamp: new Date(),
      status: 'success'
    });
    
    return of(registration).pipe(delay(500));
  }

  unregisterMember(registrationId: string): Observable<void> {
    // Add to activities
    this.dummyActivities.unshift({
      id: `activity-${Date.now()}`,
      memberId: 'member-1',
      memberName: 'Member Name',
      memberCprNumber: '123456789',
      action: RegistrationAction.Unregister,
      performedBy: 'dev-user-1',
      performedByName: 'Development User',
      timestamp: new Date(),
      status: 'success'
    });
    
    return of(undefined).pipe(delay(500));
  }

  getRegistrationActivities(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      action?: string;
      memberName?: string;
    }
  ): Observable<{ activities: RegistrationActivity[]; total: number }> {
    let filtered = [...this.dummyActivities];
    
    if (filters) {
      if (filters.startDate) {
        filtered = filtered.filter(a => a.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(a => a.timestamp <= filters.endDate!);
      }
      if (filters.action) {
        filtered = filtered.filter(a => a.action === filters.action);
      }
      if (filters.memberName) {
        const term = filters.memberName.toLowerCase();
        filtered = filtered.filter(a => a.memberName.toLowerCase().includes(term));
      }
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return of({
      activities: filtered.slice(start, end),
      total: filtered.length
    }).pipe(delay(300));
  }
}
