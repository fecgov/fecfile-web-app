import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { SchCTransaction, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchDTransaction, ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TransactionLoansAndDebtsComponent } from './transaction-loans-and-debts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { ReportService } from 'app/shared/services/report.service';

describe('TransactionLoansAndDebtsComponent', () => {
  let fixture: ComponentFixture<TransactionLoansAndDebtsComponent>;
  let component: TransactionLoansAndDebtsComponent;
  let reportService: ReportService<Form3X>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, TransactionLoansAndDebtsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
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
        TransactionSchCService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionLoansAndDebtsComponent);
    router = TestBed.inject(Router);
    reportService = TestBed.inject(ReportService);
    spyOn(reportService, 'isEditable').and.returnValue(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test editItem', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: TransactionListRecord = {
      id: 'testId',
      report_ids: ['1'],
    } as unknown as TransactionListRecord;
    component.editItem(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createLoanRepaymentReceived', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: TransactionListRecord = {
      id: '123',
      report_ids: ['123'],
    } as unknown as TransactionListRecord;
    component.createLoanRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test editLoanAgreement', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Review loan agreement')[0];
    const transaction = {
      ...(getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction),
      back_reference_tran_id_number: '1',
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
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
    const transaction = {
      ...(getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction),
      back_reference_tran_id_number: '1',
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      loan_id: 'testLoanId',
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
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
    const testTransaction: TransactionListRecord = {
      id: '123',
      report_ids: ['123'],
    } as unknown as TransactionListRecord;
    component.createLoanAgreement(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createDebtRepaymentMade', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Report debt repayment')[0];
    const transaction = {
      ...(getTestTransactionByType(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE) as SchDTransaction),
      back_reference_tran_id_number: '1',
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      memo_code: false,
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;

    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.transaction_type_identifier = ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: TransactionListRecord = {
      id: '123',
      report_ids: ['123'],
    } as unknown as TransactionListRecord;
    component.createDebtRepaymentMade(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('test createDebtRepaymentReceived', () => {
    const tableAction = component.rowActions.filter((item) => item.label === 'Report debt repayment')[1];
    const transaction = {
      ...(getTestTransactionByType(ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE) as SchDTransaction),
      back_reference_tran_id_number: '1',
      name: 'TEST',
      date: new Date(),
      amount: 100,
      balance: 0,
      aggregate: 0,
      report_code_label: '',
      memo_code: false,
      report_type: 'Form 3X',
    } as unknown as TransactionListRecord;
    expect(tableAction.isAvailable(transaction)).toBeTrue();
    transaction.transaction_type_identifier = ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE;
    expect(tableAction.isAvailable(transaction)).toBeFalse();
    expect(tableAction.isEnabled(transaction)).toBeTrue();

    const navigateSpy = spyOn(router, 'navigateByUrl').and.callFake(() => Promise.resolve(true));
    const testTransaction: TransactionListRecord = {
      id: '123',
      report_ids: ['123'],
    } as unknown as TransactionListRecord;
    component.createDebtRepaymentReceived(testTransaction);
    expect(navigateSpy).toHaveBeenCalled();
  });
});
