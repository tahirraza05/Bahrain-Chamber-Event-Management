import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Member, MemberDetails, MemberSearchCriteria } from '../models/member.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // Dummy data
  private dummyMembers: Member[] = [
    {
      id: 'member-1',
      cprNumber: '123456789',
      crNumber: 'CR-001',
      membershipNumber: 'MEM-001',
      fullName: 'Ahmed Ali Al-Khalifa',
      email: 'ahmed.ali@example.com',
      phone: '+973 1234 5678',
      gender: 'Male',
      nationality: 'Bahraini',
      isEligible: true,
      isRegistered: true,
      isAttended: true,
      registrationDate: new Date('2024-12-10T10:30:00'),
      attendanceDate: new Date('2024-12-10T11:00:00')
    },
    {
      id: 'member-2',
      cprNumber: '987654321',
      crNumber: 'CR-002',
      membershipNumber: 'MEM-002',
      fullName: 'Fatima Hassan Al-Mansoori',
      email: 'fatima.hassan@example.com',
      phone: '+973 2345 6789',
      gender: 'Female',
      nationality: 'Bahraini',
      isEligible: true,
      isRegistered: true,
      isAttended: false,
      registrationDate: new Date('2024-12-11T14:20:00')
    },
    {
      id: 'member-3',
      cprNumber: '456789123',
      membershipNumber: 'MEM-003',
      fullName: 'Mohammed Ibrahim Al-Dosari',
      email: 'mohammed.ibrahim@example.com',
      phone: '+973 3456 7890',
      isEligible: true,
      isRegistered: false,
      isAttended: false
    },
    {
      id: 'member-4',
      cprNumber: '789123456',
      crNumber: 'CR-003',
      membershipNumber: 'MEM-004',
      fullName: 'Sara Abdullah Al-Ghanim',
      email: 'sara.abdullah@example.com',
      phone: '+973 4567 8901',
      isEligible: true,
      isRegistered: true,
      isAttended: true,
      registrationDate: new Date('2024-12-09T09:15:00'),
      attendanceDate: new Date('2024-12-09T09:45:00')
    },
    {
      id: 'member-5',
      cprNumber: '321654987',
      membershipNumber: 'MEM-005',
      fullName: 'Khalid Yousif Al-Mutawa',
      email: 'khalid.yousif@example.com',
      phone: '+973 5678 9012',
      isEligible: true,
      isRegistered: false,
      isAttended: false
    }
  ];

  constructor(private http: HttpClient) {}

  getEligibleMembers(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<{ members: Member[]; total: number }> {
    let filtered = this.dummyMembers.filter(m => m.isEligible);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(term) ||
        m.cprNumber.includes(term) ||
        m.membershipNumber.toLowerCase().includes(term)
      );
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return of({
      members: filtered.slice(start, end),
      total: filtered.length
    }).pipe(delay(300));
  }

  getAttendees(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<{ members: Member[]; total: number }> {
    let filtered = this.dummyMembers.filter(m => m.isAttended);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(term) ||
        m.cprNumber.includes(term)
      );
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return of({
      members: filtered.slice(start, end),
      total: filtered.length
    }).pipe(delay(300));
  }

  getRegisteredMembers(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<{ members: Member[]; total: number }> {
    let filtered = this.dummyMembers.filter(m => m.isRegistered);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(term) ||
        m.cprNumber.includes(term)
      );
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return of({
      members: filtered.slice(start, end),
      total: filtered.length
    }).pipe(delay(300));
  }

  searchMember(criteria: MemberSearchCriteria): Observable<Member[]> {
    let results = [...this.dummyMembers];
    if (criteria.cprNumber) {
      results = results.filter(m => m.cprNumber === criteria.cprNumber);
    }
    if (criteria.crNumber) {
      results = results.filter(m => m.crNumber === criteria.crNumber);
    }
    if (criteria.membershipNumber) {
      results = results.filter(m => m.membershipNumber.toLowerCase() === criteria.membershipNumber!.toLowerCase());
    }
    if (criteria.passportNumber) {
      results = results.filter(m => m.passportNumber === criteria.passportNumber);
    }
    if (criteria.gccNumber) {
      results = results.filter(m => m.gccNumber === criteria.gccNumber);
    }
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      results = results.filter(m => 
        m.cprNumber.includes(term) ||
        m.passportNumber?.toLowerCase().includes(term) ||
        m.gccNumber?.toLowerCase().includes(term) ||
        m.fullName.toLowerCase().includes(term) ||
        m.membershipNumber.toLowerCase().includes(term)
      );
    }
    return of(results).pipe(delay(300));
  }

  getMemberDetails(memberId: string): Observable<MemberDetails> {
    const member = this.dummyMembers.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    
    // Enhanced member details with all new fields
    const details: MemberDetails = {
      ...member,
      gender: member.gender || (member.id === 'member-1' ? 'Male' : member.id === 'member-2' ? 'Female' : 'Male'),
      nationality: member.nationality || 'Bahraini',
      firstName: member.firstName || member.fullName.split(' ')[0],
      lastName: member.lastName || member.fullName.split(' ').slice(1).join(' '),
      passportNumber: member.passportNumber || (member.id === 'member-1' ? 'T096385' : member.id === 'member-2' ? 'i911207' : 'S10520'),
      gccNumber: member.gccNumber,
      preRegistration: member.preRegistration ?? (member.isRegistered ? true : false),
      isUnregistered: member.isUnregistered ?? false,
      attendanceDateTime: member.attendanceDateTime || member.attendanceDate,
      totalVotesTaken: member.totalVotesTaken || 0,
      eventId: member.eventId || 'event-1',
      eventName: member.eventName || 'Election 2022',
      memberships: [
        {
          id: 'membership-1',
          companyName: 'First Arab Service Company',
          companyNameArabic: 'الخدمة العربية الأولى ذ.م.م',
          companyCrNumber: '59131',
          memberRole: 'Shareholder',
          sharePercentage: 15.5,
          votes: 8,
          membershipNumber: '42275',
          membershipStartDate: new Date('2022-04-04'),
          membershipEndDate: new Date('2017-04-04'),
          companyCapital: 20000,
          eventId: 'event-1',
          eventName: 'Election 2022',
          isAttended: false
        },
        {
          id: 'membership-2',
          companyName: 'ETIHAD AL KHALEEJ REAL ESTATE',
          companyNameArabic: 'اتحاد الخليج العقارية ش م ب مقفلة',
          companyCrNumber: '72101',
          memberRole: 'Shareholder',
          sharePercentage: 25.0,
          votes: 32,
          membershipNumber: '21814',
          membershipStartDate: new Date('2022-06-25'),
          membershipEndDate: new Date('2009-11-12'),
          companyCapital: 250002,
          eventId: 'event-1',
          eventName: 'Election 2022',
          isAttended: false
        }
      ],
      crDetails: [
        {
          id: 'cr-1',
          companyName: 'Bahrain Trading Company',
          companyCrNumber: 'CR-001',
          position: 'Board Director',
          votes: 50
        }
      ],
      eligibleMemberships: [
        {
          id: 'membership-1',
          companyName: 'First Arab Service Company',
          companyNameArabic: 'الخدمة العربية الأولى ذ.م.م',
          companyCrNumber: '59131',
          memberRole: 'Shareholder',
          sharePercentage: 15.5,
          votes: 8,
          membershipNumber: '42275',
          membershipStartDate: new Date('2022-04-04'),
          membershipEndDate: new Date('2017-04-04'),
          companyCapital: 20000,
          eventId: 'event-1',
          eventName: 'Election 2022',
          isAttended: false,
          attendedBy: member.fullName
        },
        {
          id: 'membership-2',
          companyName: 'ETIHAD AL KHALEEJ REAL ESTATE',
          companyNameArabic: 'اتحاد الخليج العقارية ش م ب مقفلة',
          companyCrNumber: '72101',
          memberRole: 'Shareholder',
          sharePercentage: 25.0,
          votes: 32,
          membershipNumber: '21814',
          membershipStartDate: new Date('2022-06-25'),
          membershipEndDate: new Date('2009-11-12'),
          companyCapital: 250002,
          eventId: 'event-1',
          eventName: 'Election 2022',
          isAttended: false,
          attendedBy: member.fullName
        }
      ],
      totalVotes: 40,
      membershipTaken: member.isRegistered ? 1 : 0,
      totalMemberships: 2
    };
    return of(details).pipe(delay(300));
  }

  getEligibleRegistrations(searchTerm?: string): Observable<Member[]> {
    let filtered = this.dummyMembers.filter(m => m.isEligible);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(term) ||
        m.cprNumber.includes(term) ||
        m.passportNumber?.toLowerCase().includes(term) ||
        m.gccNumber?.toLowerCase().includes(term) ||
        m.membershipNumber.toLowerCase().includes(term)
      );
    }
    return of(filtered).pipe(delay(300));
  }
}
