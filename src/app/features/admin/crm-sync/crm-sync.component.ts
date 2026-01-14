import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../core/services/event.service';
import { Event, SyncStatus } from '../../../core/models/event.model';

@Component({
  selector: 'app-crm-sync',
  templateUrl: './crm-sync.component.html',
  styleUrls: ['./crm-sync.component.scss']
})
export class CrmSyncComponent implements OnInit {
  currentEvent: Event | null = null;
  syncHistory: SyncStatus[] = [];
  isSyncing = false;
  lastSyncStatus: SyncStatus | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadCurrentEvent();
    this.loadSyncHistory();
  }

  loadCurrentEvent(): void {
    this.eventService.getCurrentEvent().subscribe({
      next: (event) => {
        this.currentEvent = event;
        if (event.lastSyncedAt) {
          this.lastSyncStatus = {
            status: 'success',
            lastSyncAt: event.lastSyncedAt
          };
        }
      },
      error: (error) => {
        console.error('Error loading current event:', error);
      }
    });
  }

  loadSyncHistory(): void {
    this.eventService.getSyncHistory().subscribe({
      next: (history) => {
        this.syncHistory = history;
        if (history.length > 0) {
          this.lastSyncStatus = history[0];
        } else {
          this.lastSyncStatus = null;
        }
      },
      error: (error) => {
        console.error('Error loading sync history:', error);
        this.lastSyncStatus = null;
      }
    });
  }

  syncNow(): void {
    this.isSyncing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eventService.syncFromCrm().subscribe({
      next: (status) => {
        this.lastSyncStatus = status;
        if (status.status === 'success') {
          this.successMessage = `Sync completed successfully. ${status.recordsSynced || 0} records synced.`;
          this.loadCurrentEvent();
          this.loadSyncHistory();
        } else {
          this.errorMessage = status.errorMessage || 'Sync failed';
        }
        this.isSyncing = false;
        setTimeout(() => {
          this.successMessage = '';
          this.errorMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Sync error:', error);
        this.errorMessage = 'Failed to sync from CRM. Please try again.';
        this.isSyncing = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'error':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return '';
    }
  }
}
