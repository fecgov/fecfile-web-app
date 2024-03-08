import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

const CONTACTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Manage Contacts',
    component: ContactListComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(CONTACTS_ROUTES)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
