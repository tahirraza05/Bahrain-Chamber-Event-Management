import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberDetails } from '../../../core/models/member.model';
import { MemberService } from '../../../core/services/member.service';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-registration-card',
  templateUrl: './registration-card.component.html',
  styleUrls: ['./registration-card.component.scss']
})
export class RegistrationCardComponent implements OnInit {
  memberId: string | null = null;
  memberDetails: MemberDetails | null = null;
  currentEvent: Event | null = null;
  currentUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  currentDate = new Date();
  currentPage = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.memberId = params.get('id');
      if (this.memberId) {
        this.loadMemberDetails();
        this.loadCurrentEvent();
      }
    });
    this.currentUser = this.authService.currentUser;
  }

  loadMemberDetails(): void {
    if (!this.memberId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.memberService.getMemberDetails(this.memberId).subscribe({
      next: (details) => {
        this.memberDetails = details;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading member details:', error);
        this.errorMessage = 'Failed to load member details';
        this.isLoading = false;
      }
    });
  }

  loadCurrentEvent(): void {
    this.eventService.getCurrentEvent().subscribe({
      next: (event) => {
        this.currentEvent = event;
      },
      error: () => {
        // Use default event if service fails
        this.currentEvent = {
          id: 'event-1',
          name: '2022 Election',
          eventDate: new Date('2022-12-15')
        } as Event;
      }
    });
  }

  printCard(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/registration/detail', this.memberId]);
  }

  getFormattedDate(): string {
    return this.memberDetails?.attendanceDateTime 
      ? this.formatDate(this.memberDetails.attendanceDateTime)
      : this.formatDate(this.currentDate);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = d.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear().toString().substring(2);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${day}/${month}/${year} ${displayHours}:${displayMinutes} ${ampm}`;
  }

  getTotalVotes(): number {
    return this.memberDetails?.totalVotesTaken || 0;
  }

  getFirstMembership(): any {
    if (this.memberDetails?.eligibleMemberships && this.memberDetails.eligibleMemberships.length > 0) {
      return this.memberDetails.eligibleMemberships[0];
    }
    return null;
  }

  hasEligibleMemberships(): boolean {
    return !!(this.memberDetails?.eligibleMemberships && this.memberDetails.eligibleMemberships.length > 0);
  }
}
