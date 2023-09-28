import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchC1Transaction, ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { Transaction } from 'app/shared/models/transaction.model';
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

  it('should show the correct row actions', () => {
    expect(component.rowActions[0].isAvailable()).toEqual(true);
    expect(component.rowActions[1].isAvailable()).toEqual(false);
    expect(component.rowActions[2].isAvailable({ itemized: false })).toEqual(false);
    expect(component.rowActions[3].isAvailable({ itemized: true })).toEqual(false);
    component.reportIsEditable = true;
    expect(component.rowActions[0].isAvailable()).toEqual(false);
    expect(component.rowActions[1].isAvailable()).toEqual(true);
    expect(component.rowActions[2].isAvailable({ itemized: false })).toEqual(true);
    expect(component.rowActions[3].isAvailable({ itemized: true })).toEqual(true);
    expect(component.rowActions[0].isEnabled({})).toEqual(true);
    expect(component.rowActions[1].isEnabled({})).toEqual(true);
    expect(component.rowActions[2].isEnabled({})).toEqual(true);
    expect(component.rowActions[3].isEnabled({})).toEqual(true);
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

  it('test editLoanAgreement', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Review loan agreement')[0];
    const transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);
    component.reportIsEditable = true;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    transaction.children = [getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT)];
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
    transaction.children = [getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT)];
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    component.createLoanAgreement(transaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanAgreement', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: Transaction = { id: '123', report_id: '123' } as unknown as Transaction;
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
