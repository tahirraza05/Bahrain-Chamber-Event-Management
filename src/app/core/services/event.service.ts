import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Event, SyncStatus, EventType, EventStatus } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Dummy data
  private dummyEvent: Event = {
    id: 'event-1',
    name: 'Annual General Meeting 2024',
    type: EventType.AGM,
    status: EventStatus.Active,
    eventDate: new Date('2024-12-15'),
    description: 'Annual General Meeting for all members',
    totalEligibleMembers: 1250,
    registeredMembers: 856,
    attendees: 723,
    lastSyncedAt: new Date(Date.now() - 3600000) // 1 hour ago
  };

  private dummySyncHistory: SyncStatus[] = [
    {
      status: 'success',
      lastSyncAt: new Date(Date.now() - 3600000),
      recordsSynced: 1250
    },
    {
      status: 'success',
      lastSyncAt: new Date(Date.now() - 7200000),
      recordsSynced: 1248
    },
    {
      status: 'error',
      lastSyncAt: new Date(Date.now() - 10800000),
      errorMessage: 'Connection timeout'
    }
  ];

  constructor(private http: HttpClient) {}

  getCurrentEvent(): Observable<Event> {
    // Return dummy data for development
    return of(this.dummyEvent).pipe(delay(500));
    // Original: return this.http.get<Event>(`${environment.apiUrl}/events/current`);
  }

  syncFromCrm(): Observable<SyncStatus> {
    // Return dummy sync status
    const syncStatus: SyncStatus = {
      status: 'success',
      lastSyncAt: new Date(),
      recordsSynced: 1250
    };
    this.dummyEvent.lastSyncedAt = new Date();
    this.dummySyncHistory.unshift(syncStatus);
    return of(syncStatus).pipe(delay(1000));
    // Original: return this.http.post<SyncStatus>(`${environment.apiUrl}/events/sync`, {});
  }

  getSyncHistory(): Observable<SyncStatus[]> {
    // Return dummy sync history
    return of(this.dummySyncHistory).pipe(delay(300));
    // Original: return this.http.get<SyncStatus[]>(`${environment.apiUrl}/events/sync/history`);
  }
}
