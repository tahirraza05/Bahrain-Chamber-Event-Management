import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from './dashboard.component';
import { MemberSearchComponent } from './components/member-search/member-search.component';
import { EligibleMembersListComponent } from './components/eligible-members-list/eligible-members-list.component';
import { AttendeesListComponent } from './components/attendees-list/attendees-list.component';
import { RegisteredMembersListComponent } from './components/registered-members-list/registered-members-list.component';
import { SharedModule } from '../../shared/shared.module';
import { RegistrationModule } from '../registration/registration.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MemberSearchComponent,
    EligibleMembersListComponent,
    AttendeesListComponent,
    RegisteredMembersListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
    RegistrationModule
  ]
})
export class DashboardModule { }
