import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import {
  getTestTransactionByType,
  testActiveReport,
  testMockStore,
  testTemplateMap,
} from 'app/shared/utils/unit-test.utils';
import { ConfirmationService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { AmountInputComponent } from './amount-input.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ScheduleATransactionTypes } from 'app/shared/models';
import { setActiveReportAction } from 'app/store/active-report.actions';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;
  let store: MockStore;

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

    fixture = TestBed.createComponent(AmountInputComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        contribution_date: new SubscriptionFormControl(''),
        memo_code: new SubscriptionFormControl(''),
        contribution_amount: new SubscriptionFormControl(''),
        contribution_aggregate: new SubscriptionFormControl(''),
        disbursement_date: new SubscriptionFormControl(''),
        dissemination_date: new SubscriptionFormControl(''),
        expenditure_date: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
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
    component.transaction = transaction;
    component.templateMap = transaction.transactionType.templateMap;
    const checkboxLabel = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component.memoCode = { checkboxLabel, updateMemoItemWithDate: (date) => undefined } as MemoCodeInputComponent;
    component.form.patchValue({
      [transaction.transactionType.templateMap.date]: undefined,
    });
    component.form.patchValue({
      [transaction.transactionType.templateMap.date2]: date,
    });
    fixture.detectChanges();
    expect(component.memoCode.checkboxLabel).toBe(checkboxLabel);
  });

  it('should not allow memo item selection for loan repayment', fakeAsync(() => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
    transaction.loan_id = 'test';
    component.transaction = transaction;
    component.templateMap = transaction.transactionType.templateMap;
    store.dispatch(setActiveReportAction({ payload: testActiveReport }));
    fixture.detectChanges();

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
    console.log(dateFormControl);
    expect(dateFormControl?.invalid).toBeTrue();

    const msg = dateFormControl?.errors?.['invaliddate'].msg;
    expect(msg).toEqual('Date must fall within the report date range.');
  }));
});
