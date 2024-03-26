import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchC1Transaction } from 'app/shared/models/schc1-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { SharedModule } from 'app/shared/shared.module';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { of } from 'rxjs';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts.component';

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
                report: Form3X.fromJSON({}),
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
                }),
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
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: 'testId', report_ids: ['1'] } as unknown as Transaction;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanRepaymentReceived', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_ids: ['123'] } as unknown as Transaction;
    component.createLoanRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test editLoanAgreement', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Review loan agreement')[0];
    const transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    transaction.loan_agreement_id = 'loan agreement id';
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    component.editLoanAgreement(transaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanAgreement', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'New loan agreement')[0];
    const transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);
    transaction.loan_id = 'testLoanId';
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.loan_agreement_id = 'loan agreement id';
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    component.createLoanAgreement(transaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanAgreement', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_ids: ['123'] } as unknown as Transaction;
    component.createLoanAgreement(testTransaction);
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
    const testTransaction: Transaction = { id: '123', report_ids: ['123'] } as unknown as Transaction;
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
    const testTransaction: Transaction = { id: '123', report_ids: ['123'] } as unknown as Transaction;
    component.createDebtRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
