import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CashOnHandOverrideComponent } from './cash-on-hand-override/cash-on-hand-override.component';
import { ToolsRoutingModule } from './tools-routing.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [CashOnHandOverrideComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SharedModule,
    ToolsRoutingModule,
    CardModule,
    ButtonModule,
  ],
})
export class ToolsModule {}
