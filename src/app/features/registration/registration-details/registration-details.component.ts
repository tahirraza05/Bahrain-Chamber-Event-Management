import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MemberDetails } from '../../../core/models/member.model';
import { MemberService } from '../../../core/services/member.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-registration-details',
  templateUrl: './registration-details.component.html',
  styleUrls: ['./registration-details.component.scss']
})
export class RegistrationDetailsComponent implements OnInit, OnChanges {
  @Input() memberId: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() registered = new EventEmitter<void>();

  memberDetails: MemberDetails | null = null;
  isLoading = false;
  errorMessage = '';
  currentEventId: string = '';

  constructor(
    private memberService: MemberService,
    private registrationService: RegistrationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    if (this.memberId && this.isVisible) {
      this.loadMemberDetails();
      this.loadCurrentEvent();
    }
  }

  ngOnChanges(): void {
    if (this.memberId && this.isVisible) {
      this.loadMemberDetails();
      this.loadCurrentEvent();
    }
  }

  loadCurrentEvent(): void {
    this.eventService.getCurrentEvent().subscribe({
      next: (event) => {
        this.currentEventId = event.id;
      },
      error: () => {
        // Fallback for development
        this.currentEventId = 'event-1';
      }
    });
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

  confirmRegistration(): void {
    if (!this.memberDetails || !this.currentEventId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.registrationService.registerMember(this.memberDetails.id, this.currentEventId).subscribe({
      next: (registration) => {
        this.registered.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Failed to register member. Please try again.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.isVisible = false;
    this.memberDetails = null;
    this.errorMessage = '';
    this.close.emit();
  }
}
