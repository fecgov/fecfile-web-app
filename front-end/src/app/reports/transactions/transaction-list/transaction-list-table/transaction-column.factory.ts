import { inject, Injectable, type TemplateRef } from '@angular/core';
import type { ColumnDefinition, TableBodyContext } from 'app/shared/components/table/table.component';
import type { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import type { CategoryConfig, TransactionCategory } from './transaction-category.config';
import { BreakpointStore, type ScreenSize } from 'app/store/breakpoint.store';

type TransactionColumn =
  | 'line'
  | 'type'
  | 'name'
  | 'date'
  | 'amount'
  | 'memo'
  | 'aggregate'
  | 'balance'
  | 'transactionId'
  | 'associatedWith'
  | 'actions';
type ColumnWidthMap = Record<TransactionColumn, string>;
const COMMON_SM: ColumnWidthMap = {
  line: '14%',
  type: '26.6%',
  name: '26.6%',
  amount: '18.8%',
  actions: '14%',
  date: 'none',
  memo: 'none',
  aggregate: 'none',
  balance: 'none',
  transactionId: 'none',
  associatedWith: 'none',
};

const COMMON_MD: ColumnWidthMap = {
  line: '10.2%',
  type: '26.2%',
  name: '26.2%',
  date: '13.6%',
  amount: '13.6%',
  actions: '10.2%',
  memo: 'none',
  aggregate: 'none',
  balance: 'none',
  transactionId: 'none',
  associatedWith: 'none',
};

const COMMON_DISBURSEMENT_DEBT_LG_XL: ColumnWidthMap = {
  line: '8.5%',
  type: '23.4%',
  name: '21.8%',
  date: '12.3%',
  amount: '12.3%',
  memo: 'none',
  aggregate: 'none',
  balance: 'none',
  actions: '8.5%',
  transactionId: 'none',
  associatedWith: 'none',
};

const CATEGORY_COLUMN_WIDTHS: Record<TransactionCategory, Partial<Record<ScreenSize, ColumnWidthMap>>> = {
  receipts: {
    sm: COMMON_SM,
    md: COMMON_MD,
    lg: {
      line: '8.5%',
      type: '19.4%',
      name: '17.8%',
      date: '11.3%',
      amount: '11.3%',
      memo: '10%',
      aggregate: '13.2%',
      actions: '8.5%',
      balance: 'none',
      transactionId: 'none',
      associatedWith: 'none',
    },
    xl: {
      line: '8.5%',
      type: '19.4%',
      name: '17.8%',
      date: '11.3%',
      amount: '11.3%',
      memo: '10%',
      aggregate: '13.2%',
      actions: '8.5%',
      balance: 'none',
      transactionId: 'none',
      associatedWith: 'none',
    },
    xxl: {
      line: '6.8%',
      type: '24.9%',
      name: '24.9%',
      date: '9.1%',
      amount: '9.1%',
      memo: '7.6%',
      aggregate: '10.8%',
      transactionId: '12%',
      associatedWith: '13.5%',
      actions: '6.8%',
      balance: 'none',
    },
  },
  disbursements: {
    sm: COMMON_SM,
    md: COMMON_MD,
    lg: { ...COMMON_DISBURSEMENT_DEBT_LG_XL, memo: '13.2%' },
    xl: { ...COMMON_DISBURSEMENT_DEBT_LG_XL, memo: '13.2%' },
    xxl: {
      line: '6.8%',
      type: '27.9%',
      name: '27.9%',
      date: '10.1%',
      amount: '10.1%',
      memo: '10.4%',
      transactionId: '13%',
      associatedWith: '14.5%',
      actions: '6.8%',
      aggregate: 'none',
      balance: 'none',
    },
  },
  'loans-and-debts': {
    sm: COMMON_SM,
    md: COMMON_MD,
    lg: { ...COMMON_DISBURSEMENT_DEBT_LG_XL, balance: '13.2%' },
    xl: { ...COMMON_DISBURSEMENT_DEBT_LG_XL, balance: '13.2%' },
    xxl: {
      line: '6.8%',
      type: '27.9%',
      name: '27.9%',
      date: '10.1%',
      amount: '10.1%',
      balance: '10.4%',
      transactionId: '13%',
      associatedWith: '14.5%',
      actions: '6.8%',
      memo: 'none',
      aggregate: 'none',
    },
  },
};

@Injectable()
export class TransactionColumnFactory {
  private readonly breakpointStore = inject(BreakpointStore);
  buildColumns(
    category: TransactionCategory,
    config: CategoryConfig,
    typeBodyTpl: TemplateRef<TableBodyContext<TransactionListRecord>>,
    actionsBodyTpl: TemplateRef<TableBodyContext<TransactionListRecord>>,
  ): ColumnDefinition<TransactionListRecord>[] {
    const widths = this.breakpointStore.getColumnWidths(CATEGORY_COLUMN_WIDTHS[category]);

    const cols: ColumnDefinition<TransactionListRecord>[] = [
      {
        field: 'line_label',
        header: 'Line',
        sortable: true,
        cssClass: 'line-column',
        width: widths.line,
      },
      {
        field: 'transaction_type_identifier',
        header: 'Type',
        sortable: true,
        cssClass: 'type-column',
        bodyTpl: typeBodyTpl,
        width: widths.type,
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        cssClass: 'name-column',
        width: widths.name,
      },
      buildDateColumn(widths.date, {
        header: config.dateHeaderLabel,
        cssClass: config.dateCssClass,
      }),
    ];

    if (config.hasMemoColumn) {
      cols.push({
        field: 'memo_code',
        header: 'Memo',
        sortable: true,
        cssClass: 'memo-column',
        pipes: ['memoCode'],
        width: widths.memo,
      });
    }

    cols.push(buildAmountColumn(widths.amount));

    if (config.hasAggregateColumn) {
      cols.push({
        field: 'aggregate',
        header: 'Aggregate',
        sortable: true,
        cssClass: 'aggregate-column',
        pipes: ['currency'],
        width: widths.aggregate,
      });
    }

    if (config.hasBalanceColumn) {
      cols.push({
        field: 'balance',
        header: 'Balance',
        sortable: true,
        cssClass: 'balance-column',
        pipes: ['currency'],
        width: widths.balance,
      });
    }

    cols.push(
      {
        field: 'transaction_id',
        header: 'Transaction ID',
        cssClass: 'transaction-id-column',
        pipes: ['transactionId'],
        width: widths.transactionId,
      },
      {
        field: 'back_reference_tran_id_number',
        header: 'Associated With',
        cssClass: 'associated-with-column',
        pipes: ['transactionId'],
        width: widths.associatedWith,
      },
      {
        field: '',
        header: 'Actions',
        cssClass: 'actions-column',
        bodyTpl: actionsBodyTpl,
        width: widths.actions,
      },
    );

    return cols;
  }
}

function buildDateColumn(
  width: string,
  options?: { header?: string; cssClass?: string },
): ColumnDefinition<TransactionListRecord> {
  return {
    field: 'date',
    header: options?.header ?? 'Date',
    sortable: true,
    cssClass: options?.cssClass ?? 'date-column',
    pipes: ['fecDate'],
    width,
  };
}

function buildAmountColumn(width: string, options?: { header?: string }): ColumnDefinition<TransactionListRecord> {
  return {
    field: 'amount',
    header: options?.header ?? 'Amount',
    sortable: true,
    cssClass: 'amount-column',
    pipes: ['currency'],
    width,
  };
}
