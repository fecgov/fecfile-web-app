import { PhonePipe } from './pipes/phone-number/phone-number.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { UtilService } from './utils/util.service';
import { OrderByPipe } from 'ngx-pipes';
import { InputModalComponent } from './partials/input-modal/input-modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations: [PhonePipe, InputModalComponent],
  exports: [
    CommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    InputModalComponent,
  ],
  providers: [DecimalPipe, DatePipe, UtilService, OrderByPipe, PhonePipe, CurrencyPipe],
  entryComponents: [InputModalComponent],
})
export class SharedModule {}
