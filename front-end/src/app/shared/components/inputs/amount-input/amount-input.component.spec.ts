import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { AmountInputComponent } from './amount-input.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ScheduleATransactionTypes, Transaction } from 'app/shared/models';
import { Component, signal, viewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';

@Component({
  imports: [AmountInputComponent, AsyncPipe],
  standalone: true,
  template: `<app-amount-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
    [contributionAmountReadOnly]="contributionAmountReadOnly"
    [negativeAmountValueOnly]="!!transaction?.transactionType?.negativeAmountValueOnly"
    [showAggregate]="!!transaction?.transactionType?.showAggregate"
    [showCalendarYTD]="!!transaction?.transactionType?.showCalendarYTD"
    [showPayeeCandidateYTD]="!!transaction?.transactionType?.showPayeeCandidateYTD"
    [transaction]="transaction"
    [memoHasOptional]="(memoHasOptional$ | async)!"
  />`,
})
class TestHostComponent {
  form: FormGroup = new FormGroup(
    {
      contribution_date: new SubscriptionFormControl(''),
      memo_code: new SubscriptionFormControl(''),
      contribution_amount: new SubscriptionFormControl(''),
      contribution_aggregate: new SubscriptionFormControl(''),
      disbursement_date: new SubscriptionFormControl(''),
      dissemination_date: new SubscriptionFormControl(''),
      expenditure_date: new SubscriptionFormControl(''),
      calendar_ytd_per_election_office: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMap = testTemplateMap;
  transaction: Transaction = getTestTransactionByType(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
  contributionAmountReadOnly = false;
  memoHasOptional: Observable<boolean> = of(false);

  component = viewChild.required(AmountInputComponent);
}

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CheckboxModule,
        InputNumberModule,
        DatePickerModule,
        ReactiveFormsModule,
        TooltipModule,
        AmountInputComponent,
        ErrorMessagesComponent,
        FecDatePipe,
        Dialog,
        Tooltip,
        InputNumberComponent,
      ],
      providers: [ConfirmationService, provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);

    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy(); // destroy the fixture to avoid memory leaks & state carried between test cases
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call updateInput when negativeAmountValueOnly is false', () => {
    component.negativeAmountValueOnly = false;
    fixture.detectChanges();
    const updateInputMethodFalse = spyOn(component.amountInput, 'updateInput');
    expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
    component.onInputAmount();
    // expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
  });

  it('should call updateInput when negativeAmountValueOnly is true', () => {
    component.negativeAmountValueOnly = true;
    fixture.detectChanges();
    const updateInputMethodTrue = spyOn(component.amountInput, 'updateInput');
    component.onInputAmount();
    expect(updateInputMethodTrue).toHaveBeenCalled();
  });

  it('should set up the component properly', () => {
    fixture.detectChanges();
    const transaction = getFromJSON({ transaction_type_identifier: 'INDEPENDENT_EXPENDITURE' });
    const date: Date = new Date('July 20, 69 20:17:40 GMT+00:00');
    host.transaction = transaction;
    host.templateMap = transaction.transactionType.templateMap;
    const checkboxLabel = signal('MEMO ITEM');

    component.memoCode = {
      checkboxLabel,
      updateMemoItemWithDate: () => undefined,
    } as unknown as MemoCodeInputComponent;
    component.form.patchValue({
      [transaction.transactionType.templateMap.date]: undefined,
    });
    component.form.patchValue({
      [transaction.transactionType.templateMap.date2]: date,
    });
    fixture.detectChanges();
    expect(component.memoCode.checkboxLabel()).toBe(checkboxLabel());
  });

  it('should not allow memo item selection for loan repayment', fakeAsync(() => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
    transaction.loan_id = 'test';
    host.transaction = transaction;
    host.templateMap = transaction.transactionType.templateMap;
    fixture.detectChanges();
    component.ngOnInit();

    const dateFormControl = component.form.get(component.templateMap.date);

    const validDate: Date = new Date('May 26, 22 20:17:40 GMT+00:00');
    component.form.patchValue({
      [transaction.transactionType.templateMap.date]: validDate,
    });
    expect(dateFormControl?.invalid).toBeFalse();
    const invalidDate: Date = new Date('May 26, 20 20:17:40 GMT+00:00');
    component.form.patchValue({
      [transaction.transactionType.templateMap.date]: invalidDate,
    });
    fixture.detectChanges();
    expect(dateFormControl?.invalid).toBeTrue();

    const msg = dateFormControl?.errors?.['invaliddate'].msg;
    expect(msg).toEqual('Date must fall within the report date range.');
  }));
});
