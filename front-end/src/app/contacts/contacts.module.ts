// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

// App
import { ContactDisplayNamePipe } from 'app/shared/pipes/contact-display-name.pipe';
import { RippleModule } from 'primeng/ripple';
import { SharedModule } from '../shared/shared.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { DeletedContactDialogComponent } from './deleted-contact-dialog/deleted-contact-dialog.component';

@NgModule({
  declarations: [ContactListComponent, DeletedContactDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactsRoutingModule,
    TableModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    SharedModule,
    TooltipModule,
    RippleModule,
    SharedModule,
  ],
  providers: [ContactDisplayNamePipe],
})
export class ContactsModule { }
