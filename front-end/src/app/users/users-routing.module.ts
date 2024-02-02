import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateCurrentUserComponent } from './update-current-user/update-current-user.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    title: 'Manage Users',
    pathMatch: 'full',
  },
  {
    path: 'current',
    component: UpdateCurrentUserComponent,
    title: 'Update User Profile',
    pathMatch: 'full',
    data: {
      showCommitteeBanner: false,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
