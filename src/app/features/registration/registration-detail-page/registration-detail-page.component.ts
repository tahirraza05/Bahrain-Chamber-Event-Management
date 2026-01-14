import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberDetails, Membership } from '../../../core/models/member.model';
import { MemberService } from '../../../core/services/member.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-registration-detail-page',
  templateUrl: './registration-detail-page.component.html',
  styleUrls: ['./registration-detail-page.component.scss']
})
export class RegistrationDetailPageComponent implements OnInit {
  memberId: string | null = null;
  memberDetails: MemberDetails | null = null;
  selectedMemberships: Set<string> = new Set();
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentEventId: string = '';
  currentEventName: string = '';
  displayedColumns: string[] = ['select', 'isAttended', 'attendedBy', 'event', 'name', 'crNumber', 
    'membershipNumber', 'startDate', 'endDate', 'companyCapital', 'votes'];

  // Form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  cprNumber: string = '';
  passportNumber: string = '';
  gccNumber: string = '';
  attendanceStatus: 'Yes' | 'No' = 'No';
  preRegistration: boolean = false;
  isUnregistered: boolean = false;
  attendanceDateTime: Date | null = null;
  showUnregisterDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private registrationService: RegistrationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.memberId = params.get('id');
      if (this.memberId) {
        this.loadMemberDetails();
        this.loadCurrentEvent();
      }
    });
  }

  loadCurrentEvent(): void {
    this.eventService.getCurrentEvent().subscribe({
      next: (event) => {
        this.currentEventId = event.id;
        this.currentEventName = event.name;
      },
      error: () => {
        this.currentEventId = 'event-1';
        this.currentEventName = 'Election 2022';
      }
    });
  }

  loadMemberDetails(): void {
    if (!this.memberId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.memberService.getMemberDetails(this.memberId).subscribe({
      next: (details) => {
        this.memberDetails = details;
        this.populateForm(details);
        
        // Pre-select memberships that are marked as attended
        if (details.eligibleMemberships) {
          details.eligibleMemberships.forEach(membership => {
            if (membership.isAttended) {
              this.selectedMemberships.add(membership.id);
            }
          });
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading member details:', error);
        this.errorMessage = 'Failed to load member details';
        this.isLoading = false;
      }
    });
  }

  populateForm(details: MemberDetails): void {
    this.firstName = details.firstName || '';
    this.lastName = details.lastName || '';
    this.email = details.email || '';
    this.cprNumber = details.cprNumber || '';
    this.passportNumber = details.passportNumber || '';
    this.gccNumber = details.gccNumber || '';
    this.attendanceStatus = details.isAttended ? 'Yes' : 'No';
    this.preRegistration = details.preRegistration ?? false;
    this.isUnregistered = details.isUnregistered ?? false;
    this.attendanceDateTime = details.attendanceDateTime || null;
  }

  toggleMembershipSelection(membershipId: string): void {
    if (this.selectedMemberships.has(membershipId)) {
      this.selectedMemberships.delete(membershipId);
    } else {
      this.selectedMemberships.add(membershipId);
    }
  }

  isMembershipSelected(membershipId: string): boolean {
    return this.selectedMemberships.has(membershipId);
  }

  getSelectedVotesTotal(): number {
    if (!this.memberDetails?.eligibleMemberships) return 0;
    
    return this.memberDetails.eligibleMemberships
      .filter(m => this.selectedMemberships.has(m.id))
      .reduce((sum, m) => sum + m.votes, 0);
  }

  areAllSelected(): boolean {
    if (!this.memberDetails?.eligibleMemberships || this.memberDetails.eligibleMemberships.length === 0) {
      return false;
    }
    return this.memberDetails.eligibleMemberships.every(m => this.selectedMemberships.has(m.id));
  }

  isSomeSelected(): boolean {
    if (!this.memberDetails?.eligibleMemberships) return false;
    const selectedCount = this.memberDetails.eligibleMemberships.filter(m => this.selectedMemberships.has(m.id)).length;
    return selectedCount > 0 && selectedCount < this.memberDetails.eligibleMemberships.length;
  }

  toggleAll(checked: boolean): void {
    if (!this.memberDetails?.eligibleMemberships) return;
    
    if (checked) {
      this.memberDetails.eligibleMemberships.forEach(m => this.selectedMemberships.add(m.id));
    } else {
      this.selectedMemberships.clear();
    }
  }

  calculateTotalVotes(): void {
    if (!this.memberDetails) return;
    
    // Recalculate total votes based on selected memberships
    const totalVotes = this.getSelectedVotesTotal();
    if (this.memberDetails) {
      this.memberDetails.totalVotesTaken = totalVotes;
    }
    
    this.successMessage = 'Total votes recalculated: ' + totalVotes;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  saveRegistration(): void {
    if (!this.memberDetails || !this.memberId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Update member details with form values
    const updatedDetails: MemberDetails = {
      ...this.memberDetails,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      passportNumber: this.passportNumber,
      gccNumber: this.gccNumber,
      isAttended: this.attendanceStatus === 'Yes',
      preRegistration: this.preRegistration,
      attendanceDateTime: this.attendanceDateTime || new Date(),
      totalVotesTaken: this.getSelectedVotesTotal()
    };

    // Update selected memberships
    if (updatedDetails.eligibleMemberships) {
      updatedDetails.eligibleMemberships.forEach(membership => {
        membership.isAttended = this.selectedMemberships.has(membership.id);
      });
    }

    // Save registration
    this.registrationService.registerMember(this.memberId, this.currentEventId).subscribe({
      next: () => {
        this.successMessage = 'Registration saved successfully';
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
          this.loadMemberDetails(); // Reload to reflect changes
        }, 2000);
      },
      error: (error) => {
        console.error('Error saving registration:', error);
        this.errorMessage = 'Failed to save registration. Please try again.';
        this.isLoading = false;
      }
    });
  }

  runReport(): void {
    if (!this.memberDetails) return;
    
    // Navigate to print page or open report
    this.router.navigate(['/registration/print', this.memberId]);
  }

  printRegistration(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onUnregisterButtonClick(): void {
    this.showUnregisterDialog = true;
  }

  onUnregisterToggleChange(): void {
    if (this.isUnregistered) {
      this.showUnregisterDialog = true;
    }
  }

  cancelUnregister(): void {
    this.showUnregisterDialog = false;
    // Reset toggle if dialog was cancelled
    if (this.memberDetails) {
      this.isUnregistered = this.memberDetails.isUnregistered ?? false;
    }
  }

  confirmUnregister(): void {
    if (!this.memberId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Use memberId as registrationId (adjust if you have a separate registration ID)
    this.registrationService.unregisterMember(this.memberId).subscribe({
      next: () => {
        this.isUnregistered = true;
        this.showUnregisterDialog = false;
        this.successMessage = 'Member unregistered successfully';
        this.isLoading = false;
        
        // Reload member details to reflect changes
        setTimeout(() => {
          this.successMessage = '';
          this.loadMemberDetails();
        }, 2000);
      },
      error: (error) => {
        console.error('Error unregistering member:', error);
        this.errorMessage = 'Failed to unregister member. Please try again.';
        this.isLoading = false;
        this.showUnregisterDialog = false;
        // Reset toggle on error
        if (this.memberDetails) {
          this.isUnregistered = this.memberDetails.isUnregistered ?? false;
        }
      }
    });
  }
}
