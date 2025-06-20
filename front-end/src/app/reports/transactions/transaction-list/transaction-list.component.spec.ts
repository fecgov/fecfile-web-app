/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { MemoCodePipe, TransactionListComponent } from './transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts/transaction-loans-and-debts.component';
import { ReportStatus, ReportTypes } from 'app/shared/models/report.model';
import { TransactionReceiptsComponent } from './transaction-receipts/transaction-receipts.component';
import { TransactionDisbursementsComponent } from './transaction-disbursements/transaction-disbursements.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createSignal } from '@angular/core/primitives/signals';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TableModule,
        ConfirmDialogModule,
        TransactionListComponent,
        TransactionLoansAndDebtsComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
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
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[0], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/receipt`);
  });
  it('should navigate to create disbursement', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[1], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/disbursement`);
  });
  it('should navigate to create loans & debts', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[2], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/loans-and-debts`);
  });
  it('should navigate to create other transactions', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[3], { id: '999' } as Form3X);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/other-transactions`);
  });
  it('should show the correct table actions', () => {
    const f3x_params = {
      report_status: ReportStatus.IN_PROGRESS,
      report_type: ReportTypes.F3X,
    };
    const f24_params = {
      report_status: ReportStatus.IN_PROGRESS,
      report_type: ReportTypes.F24,
    };
    expect(component.tableActions[0].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[1].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[2].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[3].isAvailable(f3x_params)).toEqual(true);
    expect(component.tableActions[0].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[1].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[2].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[3].isAvailable(f24_params)).toEqual(false);
    expect(component.tableActions[4].isAvailable(f24_params)).toEqual(true);
    expect(component.tableActions[0].isEnabled({})).toEqual(true);
    expect(component.tableActions[1].isEnabled({})).toEqual(true);
    expect(component.tableActions[2].isEnabled({})).toEqual(true);
    expect(component.tableActions[3].isEnabled({})).toEqual(false);
  });

  it('should call refreshTable on receipts, disbursements, and loans', () => {
    (component.receipts as any) = createSignal({
      refreshTable: jasmine.createSpy('refreshTable'),
    } as unknown as TransactionReceiptsComponent);
    (component.disbursements as any) = createSignal({
      refreshTable: jasmine.createSpy('refreshTable'),
    } as unknown as TransactionDisbursementsComponent);
    (component.loans as any) = createSignal({
      refreshTable: jasmine.createSpy('refreshTable'),
    } as unknown as TransactionLoansAndDebtsComponent);
    component.refreshTables();
    expect(component.receipts().refreshTable).toHaveBeenCalled();
    expect(component.disbursements().refreshTable).toHaveBeenCalled();
    expect(component.loans().refreshTable).toHaveBeenCalled();
  });
});
