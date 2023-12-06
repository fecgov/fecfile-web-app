import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
// import { AccordionModule } from 'primeng/accordion';
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
// import { CheckboxModule } from 'primeng/checkbox';
// import { DividerModule } from 'primeng/divider';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
// import { TableModule } from 'primeng/table';
// import { ToastModule } from 'primeng/toast';
// import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'app/shared/shared.module';
import { F3XRoutingModule } from './f3x-routing.module';
@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, F3XRoutingModule, SharedModule, ConfirmDialogModule],
})
export class F3XModule {}
