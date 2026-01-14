import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../../../core/models/member.model';

@Component({
  selector: 'app-registered-members-list',
  templateUrl: './registered-members-list.component.html',
  styleUrls: ['./registered-members-list.component.scss']
})
export class RegisteredMembersListComponent {
  @Input() members: Member[] = [];
  
  displayedColumns: string[] = ['fullName', 'cprNumber', 'registrationDate', 'status', 'actions'];

  constructor(private router: Router) {}

  viewRegistration(memberId: string): void {
    this.router.navigate(['/registration/detail', memberId]);
  }
}
