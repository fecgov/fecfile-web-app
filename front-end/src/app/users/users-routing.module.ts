import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateCurrentUserComponent } from './update-current-user/update-current-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserLoginDataGuard } from 'app/shared/guards/user-login-data.guard';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    title: 'Manage Users',
    pathMatch: 'full',
    canActivateChild: [UserLoginDataGuard],
  },
  {
    path: 'current',
    component: UpdateCurrentUserComponent,
    title: 'Update User Profile',
    pathMatch: 'full',
    data: {
      showCommitteeBanner: false,
      showHeader: false,
      showUpperFooter: false,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
