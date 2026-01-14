import { Component, OnInit } from '@angular/core';
import { EventService } from '../../core/services/event.service';
import { MemberService } from '../../core/services/member.service';
import { Event } from '../../core/models/event.model';
import { Member } from '../../core/models/member.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentEvent: Event | null = null;
  isLoading = true;
  
  // Statistics
  totalEligible = 0;
  totalRegistered = 0;
  totalAttendees = 0;
  totalVotes = 0;

  // Lists
  eligibleMembers: Member[] = [];
  attendees: Member[] = [];
  registeredMembers: Member[] = [];
  
  activeTab: 'eligible' | 'attendees' | 'registered' = 'eligible';

  // Registration Modal
  selectedMemberId: string = '';
  showRegistrationModal = false;

  constructor(
    private eventService: EventService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load current event
    this.eventService.getCurrentEvent().subscribe({
      next: (event) => {
        this.currentEvent = event;
        this.totalEligible = event.totalEligibleMembers;
        this.totalRegistered = event.registeredMembers;
        this.totalAttendees = event.attendees;
        
        // Calculate total votes (sum of all registered members' votes)
        this.totalVotes = event.registeredMembers * 10; // Dummy calculation
        
        this.loadMemberLists();
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.isLoading = false;
      }
    });
  }

  loadMemberLists(): void {
    // Load eligible members
    this.memberService.getEligibleMembers(1, 10).subscribe({
      next: (response) => {
        this.eligibleMembers = response.members;
      }
    });

    // Load attendees
    this.memberService.getAttendees(1, 10).subscribe({
      next: (response) => {
        this.attendees = response.members;
      }
    });

    // Load registered members
    this.memberService.getRegisteredMembers(1, 10).subscribe({
      next: (response) => {
        this.registeredMembers = response.members;
        this.isLoading = false;
      }
    });
  }

  onTabChange(tab: 'eligible' | 'attendees' | 'registered'): void {
    this.activeTab = tab;
  }

  onMemberSelected(member: Member): void {
    this.selectedMemberId = member.id;
    this.showRegistrationModal = true;
  }

  closeRegistrationModal(): void {
    this.showRegistrationModal = false;
    this.selectedMemberId = '';
  }

  onMemberRegistered(): void {
    this.closeRegistrationModal();
    this.loadDashboardData(); // Reload data to reflect new registration
  }

  // Chart data removed - using simple display instead
}
