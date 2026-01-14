export interface Member {
  id: string;
  cprNumber: string;
  crNumber?: string;
  membershipNumber: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationality?: string;
  passportNumber?: string;
  gccNumber?: string;
  isEligible: boolean;
  isRegistered: boolean;
  isAttended: boolean;
  preRegistration?: boolean;
  isUnregistered?: boolean;
  registrationDate?: Date;
  attendanceDate?: Date;
  attendanceDateTime?: Date;
  totalVotesTaken?: number;
  eventId?: string;
  eventName?: string;
}

export interface Membership {
  id: string;
  companyName: string;
  companyNameArabic?: string;
  companyCrNumber: string;
  memberRole: 'Shareholder' | 'BoardDirector';
  sharePercentage?: number;
  votes: number;
  membershipNumber: string;
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  companyCapital?: number;
  isAttended?: boolean;
  attendedBy?: string;
  eventId?: string;
  eventName?: string;
}

export interface CRDetails {
  id: string;
  companyName: string;
  companyCrNumber: string;
  position: string;
  votes: number;
}

export interface MemberDetails extends Member {
  memberships: Membership[];
  crDetails: CRDetails[];
  totalVotes: number;
  eligibleMemberships?: Membership[];
  membershipTaken?: number;
  totalMemberships?: number;
}

export interface MemberSearchCriteria {
  cprNumber?: string;
  crNumber?: string;
  membershipNumber?: string;
  passportNumber?: string;
  gccNumber?: string;
  searchTerm?: string; // For searching by any of the above
}
