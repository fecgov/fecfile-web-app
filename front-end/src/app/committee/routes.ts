import { Route } from '@angular/router';

export const COMMITTEE_ROUTES: Route[] = [
  {
    path: 'members',
    loadComponent: () =>
      import('./manage-committee/manage-committee.component').then((m) => m.ManageCommitteeComponent),
    title: 'Manage Users',
    pathMatch: 'full',
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./select-committee/select-committee.component').then((m) => m.SelectCommitteeComponent),
    title: 'Select Committee',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./committee-info/committee-info.component').then((m) => m.CommitteeInfoComponent),
    title: 'Committee Info',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
