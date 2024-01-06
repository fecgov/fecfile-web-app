import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'app/shared/shared.module';
import { F99RoutingModule } from './f99-routing.module';
import { MainFormComponent } from './main-form/main-form.component';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  declarations: [MainFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    F99RoutingModule,
    SharedModule,
    ConfirmDialogModule,
    DividerModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
  ],
})
export class F99Module {}
