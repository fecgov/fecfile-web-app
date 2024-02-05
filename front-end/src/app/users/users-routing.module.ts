import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateCurrentUserComponent } from './update-current-user/update-current-user.component';

const routes: Routes = [
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
