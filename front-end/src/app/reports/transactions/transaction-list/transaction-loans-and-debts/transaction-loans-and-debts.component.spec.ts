import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { Transaction, ScheduleIds } from 'app/shared/models/transaction.model';
import { SchC1Transaction } from 'app/shared/models/schc1-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { DropdownModule } from 'primeng/dropdown';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';

describe('TransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<TransactionLoansAndDebtsComponent>;
  let component: TransactionLoansAndDebtsComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SharedModule, HttpClientTestingModule, DropdownModule, FormsModule],
      declarations: [TransactionLoansAndDebtsComponent],
      providers: [
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
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
        {
          provide: TransactionSchCService,
          useValue: {
            get: (transactionId: string) =>
              of(
                SchC1Transaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPERATING_EXPENDITURES',
                  transactionType: { scheduleId: ScheduleIds.A },
                })
              ),
            getTableData: () => of([]),
            update: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionLoansAndDebtsComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test editItem', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const testTransaction: Transaction = { id: 'testId' } as unknown as Transaction;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanRepaymentReceived', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_id: '123' } as unknown as Transaction;
    component.createLoanRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanRepaymentMade', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Make loan repayment')[0];
    const transaction = { id: 1, transaction_type_identifier: ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL };
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.transaction_type_identifier = ScheduleCTransactionTypes.LOAN_BY_COMMITTEE;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_id: '123' } as unknown as Transaction;
    component.createLoanRepaymentMade(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createDebtRepaymentMade', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Report debt repayment')[0];
    const transaction = { id: 1, transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE };
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.transaction_type_identifier = ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_id: '123' } as unknown as Transaction;
    component.createDebtRepaymentMade(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createDebtRepaymentReceived', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Report debt repayment')[1];
    const transaction = { id: 1, transaction_type_identifier: ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE };
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.transaction_type_identifier = ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_id: '123' } as unknown as Transaction;
    component.createDebtRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
