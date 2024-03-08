import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageCommitteeComponent } from './manage-committee/manage-committee.component';
import { CommitteeInfoComponent } from './committee-info/committee-info.component';
import { SelectCommitteeComponent } from './select-committee/select-committee.component';

const COMMITTEE_ROUTES: Routes = [
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
  imports: [RouterModule.forChild(COMMITTEE_ROUTES)],
  exports: [RouterModule],
})
export class CommitteeRoutingModule {}
