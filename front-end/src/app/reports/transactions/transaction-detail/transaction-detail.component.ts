import { Component } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { isDebtRepayment } from '../../../shared/models/transaction.model';
import { IndependentExpenditureCreateF3xInputComponent } from '../../../shared/components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionInputComponent } from '../transaction-input/transaction-input.component';
import { GlossaryService } from 'app/shared/components/glossary/glossary.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [IndependentExpenditureCreateF3xInputComponent, ReactiveFormsModule, TransactionInputComponent],
  providers: [GlossaryService, TransactionService, ReportService],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent {
  protected readonly isDebtRepayment = isDebtRepayment;
}
