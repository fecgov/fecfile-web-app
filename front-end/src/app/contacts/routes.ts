import { Route } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

export const CONTACTS_ROUTES: Route[] = [
  {
    path: '',
    title: 'Manage Contacts',
    component: ContactListComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
