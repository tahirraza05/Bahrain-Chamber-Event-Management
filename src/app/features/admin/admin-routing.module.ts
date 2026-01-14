import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { CrmSyncComponent } from './crm-sync/crm-sync.component';
import { UnregisterComponent } from './unregister/unregister.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserManagementComponent
  },
  {
    path: 'crm-sync',
    component: CrmSyncComponent
  },
  {
    path: 'unregister',
    component: UnregisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
