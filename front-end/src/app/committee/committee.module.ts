// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// App
import { SharedModule } from '../shared/shared.module';
import { CommitteeRoutingModule } from './committee-routing.module';
import { ManageCommitteeComponent } from './manage-committee/manage-committee.component';
import { CommitteeInfoComponent } from './committee-info/committee-info.component';
import { SelectCommitteeComponent } from './select-committee/select-committee.component';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CreateCommitteeComponent } from './create-committee/create-committee.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    ManageCommitteeComponent,
    SelectCommitteeComponent,
    CommitteeInfoComponent,
    CreateCommitteeComponent,
  ],
  imports: [
    AutoCompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    CommitteeRoutingModule,
    DropdownModule,
    DividerModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    DialogModule,
    SharedModule,
    RippleModule,
    DialogModule,
  ],
})
export class CommitteeModule {}
