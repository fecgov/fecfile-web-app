import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'app/shared/shared.module';
import { F1MRoutingModule } from './f1m-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, F1MRoutingModule, SharedModule, ConfirmDialogModule],
})
export class F1MModule {}
