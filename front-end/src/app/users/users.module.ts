// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

// App
import { SharedModule } from '../shared/shared.module';
import { UpdateCurrentUserComponent } from './update-current-user/update-current-user.component';

@NgModule({
  declarations: [UpdateCurrentUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    SharedModule,
    CardModule,
    DividerModule,
  ],
})
export class UsersModule {}
