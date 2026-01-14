export enum EventType {
  AGM = 'AGM',
  Election = 'Election'
}

export enum EventStatus {
  Upcoming = 'Upcoming',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  eventDate: Date;
  description?: string;
  totalEligibleMembers: number;
  registeredMembers: number;
  attendees: number;
  lastSyncedAt?: Date;
}

export interface SyncStatus {
  status: 'success' | 'error' | 'pending';
  lastSyncAt?: Date;
  recordsSynced?: number;
  errorMessage?: string;
}
