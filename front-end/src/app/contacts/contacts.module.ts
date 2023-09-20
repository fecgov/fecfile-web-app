// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

// App
import { SharedModule } from '../shared/shared.module';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';
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
  ],
})
export class ContactsModule {}
