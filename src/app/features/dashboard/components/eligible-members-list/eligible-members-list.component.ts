import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../../../core/models/member.model';

@Component({
  selector: 'app-eligible-members-list',
  templateUrl: './eligible-members-list.component.html',
  styleUrls: ['./eligible-members-list.component.scss']
})
export class EligibleMembersListComponent {
  @Input() members: Member[] = [];
  
  displayedColumns: string[] = ['fullName', 'cprNumber', 'membershipNumber', 'email', 'status', 'actions'];

  constructor(private router: Router) {}

  viewRegistration(memberId: string): void {
    this.router.navigate(['/registration/detail', memberId]);
  }
}
