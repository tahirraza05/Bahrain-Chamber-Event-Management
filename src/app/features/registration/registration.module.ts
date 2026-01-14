import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegistrationDetailsComponent } from './registration-details/registration-details.component';
import { RegistrationDetailPageComponent } from './registration-detail-page/registration-detail-page.component';
import { RegistrationCardComponent } from './registration-card/registration-card.component';
import { SharedModule } from '../../shared/shared.module';
import { RegistrationRoutingModule } from './registration-routing.module';

@NgModule({
  declarations: [
    RegistrationDetailsComponent,
    RegistrationDetailPageComponent,
    RegistrationCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    SharedModule,
    RegistrationRoutingModule
  ],
  exports: [
    RegistrationDetailsComponent,
    RegistrationDetailPageComponent,
    RegistrationCardComponent
  ]
})
export class RegistrationModule { }
