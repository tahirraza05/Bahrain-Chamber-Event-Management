import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationDetailPageComponent } from './registration-detail-page/registration-detail-page.component';
import { RegistrationCardComponent } from './registration-card/registration-card.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'detail/:id',
    component: RegistrationDetailPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'print/:id',
    component: RegistrationCardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
