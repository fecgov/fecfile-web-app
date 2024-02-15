import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCommitteeComponent } from './manage-committee/manage-committee.component';
import { CommitteeInfoComponent } from './committee-info/committee-info.component';
import { SelectCommitteeComponent } from './select-committee/select-committee.component';

const routes: Routes = [
  {
    path: 'members',
    component: ManageCommitteeComponent,
    title: 'Manage Users',
    pathMatch: 'full',
  },
  {
    path: 'select',
    component: SelectCommitteeComponent,
    title: 'Select Committee',
    pathMatch: 'full',
  },
  {
    path: '',
    component: CommitteeInfoComponent,
    title: 'Committee Info',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeRoutingModule {}
