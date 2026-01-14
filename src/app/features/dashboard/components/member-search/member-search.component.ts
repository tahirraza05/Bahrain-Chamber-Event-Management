import { Component, EventEmitter, Output } from '@angular/core';
import { MemberService } from '../../../../core/services/member.service';
import { Member, MemberDetails, MemberSearchCriteria } from '../../../../core/models/member.model';

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.scss']
})
export class MemberSearchComponent {
  @Output() memberSelected = new EventEmitter<Member>();

  searchType: 'cpr' | 'cr' | 'membership' = 'cpr';
  searchValue = '';
  searchResults: Member[] = [];
  isSearching = false;
  errorMessage = '';
  showPopup = false;
  selectedMemberDetails: MemberDetails | null = null;

  constructor(private memberService: MemberService) {}

  onSearchTypeChange(): void {
    this.searchValue = '';
    this.searchResults = [];
    this.errorMessage = '';
    this.closePopup();
  }

  search(): void {
    if (!this.searchValue.trim()) {
      this.errorMessage = 'Please enter a search value';
      return;
    }

    this.isSearching = true;
    this.errorMessage = '';
    this.searchResults = [];
    this.closePopup();

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
        this.searchResults = members;
        if (members.length === 0) {
          this.errorMessage = 'No members found. Try: 123456789, 987654321, or MEM-001';
          this.isSearching = false;
        } else if (members.length === 1) {
          // Auto-show popup if only one result
          this.selectMember(members[0]);
        } else {
          // Multiple results - show first one in popup
          this.selectMember(members[0]);
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.errorMessage = 'Error searching for member. Please try again.';
        this.isSearching = false;
      }
    });
  }

  selectMember(member: Member): void {
    // Load full member details
    this.memberService.getMemberDetails(member.id).subscribe({
      next: (details) => {
        this.selectedMemberDetails = details;
        this.showPopup = true;
      },
      error: (error) => {
        console.error('Error loading member details:', error);
        // Fallback to basic member info
        this.selectedMemberDetails = {
          ...member,
          memberships: [],
          crDetails: [],
          totalVotes: 0
        } as MemberDetails;
        this.showPopup = true;
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedMemberDetails = null;
  }

  registerMember(): void {
    if (this.selectedMemberDetails) {
      this.memberSelected.emit(this.selectedMemberDetails);
      this.closePopup();
    }
  }

  printMember(): void {
    window.print();
  }
}
