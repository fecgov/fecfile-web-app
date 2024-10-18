import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CashOnHandOverrideComponent } from './cash-on-hand-override/cash-on-hand-override.component';
import { ToolsRoutingModule } from './tools-routing.module';

@NgModule({
  declarations: [
    CashOnHandOverrideComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SharedModule,
    ToolsRoutingModule,
  ],
})
export class ToolsModule { }
