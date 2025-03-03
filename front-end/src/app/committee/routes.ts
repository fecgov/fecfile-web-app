import { Route } from '@angular/router';
import { ManageCommitteeComponent } from './manage-committee/manage-committee.component';
import { CommitteeInfoComponent } from './committee-info/committee-info.component';
import { SelectCommitteeComponent } from './select-committee/select-committee.component';

export const COMMITTEE_ROUTES: Route[] = [
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
