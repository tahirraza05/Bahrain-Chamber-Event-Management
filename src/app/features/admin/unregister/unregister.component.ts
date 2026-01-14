import { Component, OnInit } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { Member, MemberSearchCriteria } from '../../../core/models/member.model';
import { RegistrationActivity, RegistrationAction } from '../../../core/models/registration.model';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html',
  styleUrls: ['./unregister.component.scss']
})
export class UnregisterComponent implements OnInit {
  searchType: 'cpr' | 'cr' | 'membership' = 'cpr';
  searchValue = '';
  searchResults: Member[] = [];
  selectedMember: Member | null = null;
  activities: RegistrationActivity[] = [];
  
  // Filters
  startDate: Date | null = null;
  endDate: Date | null = null;
  actionFilter: string = '';
  memberNameFilter = '';

  isLoading = false;
  isUnregistering = false;
  errorMessage = '';
  successMessage = '';
  showConfirmDialog = false;

  page = 1;
  pageSize = 10;
  totalActivities = 0;

  constructor(
    private memberService: MemberService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  search(): void {
    if (!this.searchValue.trim()) {
      this.errorMessage = 'Please enter a search value';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];
    this.selectedMember = null;

    const criteria: MemberSearchCriteria = {};
    if (this.searchType === 'cpr') {
      criteria.cprNumber = this.searchValue;
    } else if (this.searchType === 'cr') {
      criteria.crNumber = this.searchValue;
    } else {
      criteria.membershipNumber = this.searchValue;
    }

    this.memberService.searchMember(criteria).subscribe({
      next: (members) => {
        // Filter to only show registered members
        this.searchResults = members.filter(m => m.isRegistered);
        if (this.searchResults.length === 0) {
          this.errorMessage = 'No registered members found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Error searching for member. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectMember(member: Member): void {
    this.selectedMember = member;
    this.errorMessage = '';
    this.successMessage = '';
  }

  confirmUnregister(): void {
    this.showConfirmDialog = true;
  }

  unregisterMember(): void {
    if (!this.selectedMember) return;

    this.isUnregistering = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showConfirmDialog = false;

    // Find registration ID - in real implementation, this would come from the member object
    // For dummy data, we'll use the member ID
    const registrationId = `reg-${this.selectedMember.id}`;

    this.registrationService.unregisterMember(registrationId).subscribe({
      next: () => {
        this.successMessage = `Member ${this.selectedMember!.fullName} has been unregistered successfully.`;
        this.selectedMember = null;
        this.searchResults = [];
        this.searchValue = '';
        this.loadActivities();
        this.isUnregistering = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        console.error('Unregister error:', error);
        this.errorMessage = 'Failed to unregister member. Please try again.';
        this.isUnregistering = false;
      }
    });
  }

  loadActivities(): void {
    this.isLoading = true;
    this.registrationService.getRegistrationActivities(
      this.page,
      this.pageSize,
      {
        startDate: this.startDate || undefined,
        endDate: this.endDate || undefined,
        action: this.actionFilter || undefined,
        memberName: this.memberNameFilter || undefined
      }
    ).subscribe({
      next: (response) => {
        this.activities = response.activities;
        this.totalActivities = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activities:', error);
        this.errorMessage = 'Failed to load activities';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadActivities();
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.actionFilter = '';
    this.memberNameFilter = '';
    this.applyFilters();
  }

  getActionClass(action: RegistrationAction): string {
    return action === RegistrationAction.Register ? 'badge-success' : 'badge-error';
  }
}
