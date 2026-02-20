import { Route } from '@angular/router';

export const CONTACTS_ROUTES: Route[] = [
  {
    path: '',
    title: 'Manage Contacts',
    loadComponent: () => import('./contact-list/contact-list.component').then((m) => m.ContactListComponent),
    pathMatch: 'full',
  },
  {
    path: 'deleted',
    title: 'Restore Deleted Contacts',
    loadComponent: () => import('./deleted-contact/deleted-contact.component').then((m) => m.DeletedContactComponent),
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
