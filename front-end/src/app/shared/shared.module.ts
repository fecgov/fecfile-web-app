import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderByPipe } from 'ngx-pipes';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations: [],
  exports: [CommonModule, NgbModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  providers: [DecimalPipe, DatePipe, OrderByPipe, CurrencyPipe],
})
export class SharedModule {}
