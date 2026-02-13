import { Component } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { isDebtRepayment } from '../../../shared/models/transaction.model';
import { IndependentExpenditureCreateF3xInputComponent } from '../../../shared/components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmationWrapperService } from 'app/shared/services/confirmation-wrapper.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [IndependentExpenditureCreateF3xInputComponent, ReactiveFormsModule, TransactionInputComponent],
  providers: [MessageService, ConfirmationService, ConfirmationWrapperService],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent {
  protected readonly isDebtRepayment = isDebtRepayment;
}
