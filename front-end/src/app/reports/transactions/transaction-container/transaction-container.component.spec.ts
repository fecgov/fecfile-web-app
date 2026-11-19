import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TransactionContainerComponent } from './transaction-container.component';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/shared/services/report.service';
import {
  Report,
  SchATransaction,
  SchCTransaction,
  ScheduleATransactionTypes,
  ScheduleCTransactionTypes,
  Transaction,
  TransactionTypes,
} from 'app/shared/models';
import { ReattRedesTypes } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { inputBinding, signal } from '@angular/core';

const baseTestTransaction = getTestTransactionByType(
  ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
) as SchATransaction;
const child = getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction;
const reatt = getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction;
reatt.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
reatt.transactionType.dependentChildTransactionTypes = [reatt.transaction_type_identifier as TransactionTypes];
reatt.children = [child];
reatt.reatt_redes = child;

const originalLoan = getTestTransactionByType(
  ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
) as SchCTransaction;
const loanTransaction = getTestTransactionByType(
  ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
) as SchCTransaction;
loanTransaction.transactionType.dependentChildTransactionTypes = [
  loanTransaction.transaction_type_identifier as TransactionTypes,
];
loanTransaction.children = [originalLoan];
loanTransaction.loan_id = '111';

const parent = getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction;
parent.transactionType.dependentChildTransactionTypes = [child.transaction_type_identifier as TransactionTypes];
parent.children = [child];

const child2 = getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction;
const parent2 = getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction;
parent2.transactionType.dependentChildTransactionTypes = [
  child.transaction_type_identifier as TransactionTypes,
  child2.transaction_type_identifier as TransactionTypes,
];
parent2.children = [child, child2];
const mockTransaction = signal<Transaction>(baseTestTransaction);
const clone = signal<string | null>(null);
const report = signal<Report>(testActiveReport());

describe('TransactionContainerComponent', () => {
  let component: TransactionContainerComponent;
  let fixture: ComponentFixture<TransactionContainerComponent>;
  let titleSpy: Mock;
  let isEditableSpy: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        DividerModule,
        SelectModule,
        ButtonModule,
        DatePickerModule,
        CheckboxModule,
        InputTextModule,
        InputNumberModule,
        ConfirmDialogModule,
        TransactionContainerComponent,
        ConfirmDialog,
        TransactionDetailComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        FormBuilder,
        MessageService,
        ReportService,
        ConfirmationService,
        TransactionService,
        ReattRedesStore,
        Form3XService,
        Title,
        provideMockStore(testMockStore()),
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockTransaction.set(
      getTestTransactionByType(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES) as SchATransaction,
    );
    clone.set(null);
    const title = TestBed.inject(Title);
    titleSpy = vi.spyOn(title, 'setTitle');
    const reportService = TestBed.inject(ReportService);
    isEditableSpy = vi.spyOn(reportService, 'isEditable');
    fixture = TestBed.createComponent(TransactionContainerComponent, {
      bindings: [
        inputBinding('transaction', mockTransaction),
        inputBinding('clone', clone),
        inputBinding('report', report),
      ],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title based on the transaction type', () => {
    fixture.detectChanges();
    expect(titleSpy).toHaveBeenCalledWith('Offsets to Operating Expenditures');
  });

  it.each([true, false])('should correctly determine if the report is editable: %s', (editable) => {
    isEditableSpy.mockReturnValue(editable);
    report.set(testActiveReport());
    fixture.detectChanges();
    expect(component.isEditableReport()).toBe(editable);
  });

  it('should get the transaction from the route data', () => {
    fixture.detectChanges();
    expect(component.transaction()).toEqual(mockTransaction());
  });

  it.each([
    { value: 'test', condition: 'show', expectation: true },
    { value: null, condition: 'hide', expectation: false },
  ])('should $condition the cloned transaction modal when clone query param is: %s', ({ value, expectation }) => {
    clone.set(value);
    fixture.detectChanges();
    expect(component.showClonedTransactionDialog()).toBe(expectation);
  });

  it('should react to clone query param changes without recreating the component', () => {
    expect(component.showClonedTransactionDialog()).toBe(false);

    clone.set('b49f0957-4404-4237-95ec-0df053083b19');
    fixture.detectChanges();

    expect(component.showClonedTransactionDialog()).toBe(true);

    component.showClonedTransactionDialog.set(false);
    expect(component.showClonedTransactionDialog()).toBe(false);

    clone.set(null);
    fixture.detectChanges();

    expect(component.showClonedTransactionDialog()).toBe(false);
  });

  it.each([
    { type: 'Re-Att/Re-Des', value: reatt, expectation: -1 },
    { type: 'pulled forward loan', value: loanTransaction, expectation: 1 },
    { type: 'transaction with one dependent child', value: parent, expectation: 2 },
    { type: 'transaction with two dependent children', value: parent2, expectation: 3 },
    { type: 'transaction with no dependent children', value: baseTestTransaction, expectation: 1 },
  ])('should return $expectation for a $type', ({ expectation, value }) => {
    mockTransaction.set(value);
    fixture.detectChanges();
    expect(component.transactionCardinality()).toBe(expectation);
  });
});
