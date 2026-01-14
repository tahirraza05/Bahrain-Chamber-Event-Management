import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from '../../../../core/models/member.model';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class AttendeesListComponent {
  @Input() members: Member[] = [];
  
  displayedColumns: string[] = ['fullName', 'cprNumber', 'attendanceDate', 'status', 'actions'];

  constructor(private router: Router) {}

  viewRegistration(memberId: string): void {
    this.router.navigate(['/registration/detail', memberId]);
  }
}
