import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { MemoCodePipe, TransactionListComponent } from './transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts/transaction-loans-and-debts.component';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TableModule,
        SharedModule,
        RouterTestingModule,
        ConfirmDialogModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [TransactionListComponent, TransactionLoansAndDebtsComponent],
      providers: [
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
                })
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
                report: F3xSummary.fromJSON({}),
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
    component.onTableActionClick(component.tableActions[0], { id: '999' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/receipt`);
  });
  it('should navigate to create disbursement', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[1], { id: '999' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/disbursement`);
  });
  it('should navigate to create loans & debts', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[2], { id: '999' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/loans-and-debts`);
  });
  it('should navigate to create other transactions', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.onTableActionClick(component.tableActions[3], { id: '999' } as F3xSummary);
    expect(navigateSpy).toHaveBeenCalledWith(`/reports/transactions/report/999/select/other-transactions`);
  });
  it('should show the correct table actions', () => {
    expect(component.tableActions[0].isAvailable({ report_status: 'In-Progress' })).toEqual(true);
    expect(component.tableActions[1].isAvailable({ report_status: 'In-Progress' })).toEqual(true);
    expect(component.tableActions[2].isAvailable({ report_status: 'In-Progress' })).toEqual(true);
    expect(component.tableActions[3].isAvailable({ report_status: 'In-Progress' })).toEqual(true);
    expect(component.tableActions[0].isEnabled({})).toEqual(true);
    expect(component.tableActions[1].isEnabled({})).toEqual(true);
    expect(component.tableActions[2].isEnabled({})).toEqual(true);
    expect(component.tableActions[3].isEnabled({})).toEqual(false);
  });
});
