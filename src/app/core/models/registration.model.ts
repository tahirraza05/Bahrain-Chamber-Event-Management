export enum RegistrationAction {
  Register = 'Register',
  Unregister = 'Unregister'
}

export interface Registration {
  id: string;
  memberId: string;
  memberName: string;
  eventId: string;
  action: RegistrationAction;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  registrationPass?: string;
  qrCode?: string;
}

export interface RegistrationActivity {
  id: string;
  memberId: string;
  memberName: string;
  memberCprNumber: string;
  action: RegistrationAction;
  performedBy: string;
  performedByName: string;
  timestamp: Date;
  status: 'success' | 'failed';
  errorMessage?: string;
}
