import { Component, computed, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ParsedTransaction, ParsedValue } from '../import.service';

interface ScheduleFields {
  namePrefix: string;
  dates: string[];
  amount: string;
  amountLabel?: string;
}

const SCHEDULE_FIELDS: Record<string, ScheduleFields> = {
  SchA: { namePrefix: 'contributor', dates: ['contribution_date'], amount: 'contribution_amount' },
  SchB: { namePrefix: 'payee', dates: ['expenditure_date'], amount: 'expenditure_amount' },
  SchC: {
    namePrefix: 'lender',
    dates: ['loan_incurred_date'],
    amount: 'loan_amount',
    amountLabel: 'Loan amount',
  },
  SchC1: {
    namePrefix: 'lender',
    dates: ['loan_incurred_date'],
    amount: 'loan_amount',
    amountLabel: 'Loan amount',
  },
  SchC2: { namePrefix: 'guarantor', dates: [], amount: 'guaranteed_amount', amountLabel: 'Guaranteed amount' },
  SchD: { namePrefix: 'creditor', dates: [], amount: 'balance_at_close', amountLabel: 'Closing balance' },
  SchE: { namePrefix: 'payee', dates: ['disbursement_date', 'dissemination_date'], amount: 'expenditure_amount' },
  SchF: { namePrefix: 'payee', dates: ['expenditure_date'], amount: 'expenditure_amount' },
};

function text(value: ParsedValue | undefined): string {
  return value === null || value === undefined ? '' : String(value);
}

function amount(value: ParsedValue | undefined): number | null {
  if (value === null || value === undefined || typeof value === 'boolean' || String(value).trim() === '') {
    return null;
  }

  // Numeric conversion is only for display and sorting, not the imported payload.
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function toPreviewRow(transaction: ParsedTransaction) {
  const data = transaction.data;
  const fields = SCHEDULE_FIELDS[transaction.schema_name];
  const organization = fields ? text(data[`${fields.namePrefix}_organization_name`]) : '';
  const person = fields
    ? ['first_name', 'middle_name', 'last_name', 'suffix']
        .map((part) => text(data[`${fields.namePrefix}_${part}`]))
        .filter(Boolean)
        .join(' ')
    : '';

  return {
    sourceRow: transaction.source_row,
    schema: transaction.schema_name,
    formType: text(data['form_type']),
    name: organization || person || '—',
    date: fields?.dates.map((field) => text(data[field])).find(Boolean) ?? null,
    amount: fields ? amount(data[fields.amount]) : null,
    amountLabel: fields?.amountLabel ?? '',
    memo: data['memo_code'] === true || data['memo_code'] === 'X',
    transactionId: text(data['transaction_id']) || text(data['transaction_id_number']),
  };
}

@Component({
  selector: 'app-preview-transaction-details',
  imports: [CardModule, TableModule, CurrencyPipe, DatePipe],
  templateUrl: './preview-transaction-details.component.html',
  styleUrl: './preview-transaction-details.component.scss',
})
export class PreviewTransactionDetailsComponent {
  readonly transactions = input.required<ParsedTransaction[]>();
  readonly rows = computed(() => this.transactions().map(toPreviewRow));
}
