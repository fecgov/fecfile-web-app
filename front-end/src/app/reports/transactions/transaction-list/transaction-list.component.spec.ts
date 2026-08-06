import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { TransactionListComponent } from './transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReportStatus, ReportTypes } from 'app/shared/models/reports/report.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import type { Form24 } from 'app/shared/models/reports/form-24.model';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let router: Router;
  const isCloneable = vi.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, ConfirmDialogModule, TransactionListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
        {
          provide: TransactionService,
          useValue: {
            get: (transactionId: string) =>
              of(
                SchATransaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPERATING_EXPENDITURES',
                }),
              ),
            getTableData: () => of([]),
            update: () => of([]),
            isCloneable,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({}),
              },
              params: {
                reportId: '999',
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    isCloneable.mockReset();
    isCloneable.mockReturnValue(true);
    fixture = TestBed.createComponent(TransactionListComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should memoCode transform', () => {
    const pipe = new MemoCodePipe();
    let result = pipe.transform(true);
    expect(result).toBe('Y');
    result = pipe.transform(false);
    expect(result).toBe('-');
  });

  it('should navigate to create receipt', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[0], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/receipt`);
  });
  it('should navigate to create disbursement', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[1], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/disbursement`);
  });
  it('should navigate to create loans & debts', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[2], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/loans-and-debts`);
  });
  it('should navigate to create other transactions', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[3], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/other-transactions`);
  });
  it('should show the correct table actions', () => {
    const f3x_params = {
      report_status: ReportStatus.IN_PROGRESS,
      report_type: ReportTypes.F3X,
    } as Form3X;
    const f24_params = {
      report_status: ReportStatus.IN_PROGRESS,
      report_type: ReportTypes.F24,
    } as Form24;
    expect(component.tableActions[0].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[1].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[2].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[3].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[0].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[1].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[2].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[3].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[4].isAvailable(f24_params)).toEqual(true);
    expect(component.tableActions[0].isEnabled(f3x_params)).toEqual(true);
    expect(component.tableActions[1].isEnabled(f3x_params)).toEqual(true);
    expect(component.tableActions[2].isEnabled(f3x_params)).toEqual(true);
    expect(component.tableActions[3].isEnabled(f3x_params)).toEqual(false);
  });

  it('should call refreshTable on receipts, disbursements, and loans', async () => {
    const receiptSpy = vi.spyOn(component.receipts(), 'refreshTable').mockResolvedValue(undefined);
    const disbursementsSpy = vi.spyOn(component.disbursements(), 'refreshTable').mockResolvedValue(undefined);
    const loanSpy = vi.spyOn(component.loans(), 'refreshTable').mockResolvedValue(undefined);
    await component.refreshTables();
    expect(receiptSpy).toHaveBeenCalled();
    expect(disbursementsSpy).toHaveBeenCalled();
    expect(loanSpy).toHaveBeenCalled();
  });

  it('should show Clone only for allowed editable single transactions', () => {
    const receipts = component.receipts() as unknown as {
      rowActions: { label: string; isAvailable: (item: TransactionListRecord) => boolean }[];
      reportService: { isEditable: (report: unknown) => boolean };
    };
    isCloneable.mockImplementation((transaction: TransactionListRecord) => !transaction.parent_transaction_id);
    vi.spyOn(receipts.reportService, 'isEditable').mockReturnValue(true);
    const cloneAction = receipts.rowActions.find((action) => action.label === 'Clone');

    expect(cloneAction).toBeDefined();

    const allowedTransaction = TransactionListRecord.fromJSON({
      id: '100',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    });
    const childTransaction = TransactionListRecord.fromJSON({
      id: '101',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      parent_transaction_id: '10',
    });

    expect(cloneAction?.isAvailable(allowedTransaction)).toBe(true);
    expect(cloneAction?.isAvailable(childTransaction)).toBe(false);
  });

  it('should navigate directly to the pre-filled create page when Clone is selected', () => {
    const receipts = component.receipts() as unknown as {
      rowActions: { label: string; action: (item: TransactionListRecord) => void }[];
      reportService: { isEditable: (report: unknown) => boolean };
    };
    vi.spyOn(receipts.reportService, 'isEditable').mockReturnValue(true);
    const confirmSpy = vi.spyOn(TestBed.inject(ConfirmationService), 'confirm');
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const cloneAction = receipts.rowActions.find((action) => action.label === 'Clone');
    const transaction = TransactionListRecord.fromJSON({
      id: '100',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    });

    cloneAction?.action(transaction);

    expect(confirmSpy).not.toHaveBeenCalled();

    expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/999/create/INDIVIDUAL_RECEIPT?clone=100');
  });
});
