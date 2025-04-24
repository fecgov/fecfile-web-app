/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ScheduleATransactionTypes } from 'app/shared/models';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { createSignal } from '@angular/core/primitives/signals';
import { Injector } from '@angular/core';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;
  let store: MockStore;
  let injector: Injector;

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
      ],
      providers: [ConfirmationService, provideMockStore(testMockStore)],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(AmountInputComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    (component.form as any) = createSignal(
      new FormGroup(
        {
          contribution_date: new SignalFormControl(injector, ''),
          memo_code: new SignalFormControl(injector, ''),
          contribution_amount: new SignalFormControl(injector, ''),
          contribution_aggregate: new SignalFormControl(injector, ''),
          disbursement_date: new SignalFormControl(injector, ''),
          dissemination_date: new SignalFormControl(injector, ''),
          expenditure_date: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal(testTemplateMap);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the component properly', () => {
    fixture.detectChanges();
    const transaction = getFromJSON({ transaction_type_identifier: 'INDEPENDENT_EXPENDITURE' });
    const date: Date = new Date('July 20, 69 20:17:40 GMT+00:00');
    (component.transaction as any) = createSignal(transaction);
    (component.templateMap as any) = createSignal(transaction.transactionType.templateMap);
    const checkboxLabel = '';

    (component.memoCode as any) = createSignal({
      checkboxLabel: createSignal(checkboxLabel),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updateMemoItemWithDate: (date) => undefined,
    } as MemoCodeInputComponent);
    component.form().patchValue({
      [transaction.transactionType.templateMap.date]: undefined,
    });
    component.form().patchValue({
      [transaction.transactionType.templateMap.date2]: date,
    });
    fixture.detectChanges();
    expect(component.memoCode()!.checkboxLabel).toBe(checkboxLabel);
  });

  it('should not allow memo item selection for loan repayment', fakeAsync(() => {
    const transaction = getTestTransactionByType(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
    transaction.loan_id = 'test';
    (component.transaction as any) = createSignal(transaction);
    (component.templateMap as any) = createSignal(transaction.transactionType.templateMap);
    store.dispatch(setActiveReportAction({ payload: testActiveReport }));
    fixture.detectChanges();

    const dateFormControl = component.form().get(component.templateMap().date);

    const validDate: Date = new Date('May 26, 22 20:17:40 GMT+00:00');
    component.form().patchValue({
      [transaction.transactionType.templateMap.date]: validDate,
    });
    expect(dateFormControl?.invalid).toBeFalse();
    const invalidDate: Date = new Date('May 26, 20 20:17:40 GMT+00:00');
    component.form().patchValue({
      [transaction.transactionType.templateMap.date]: invalidDate,
    });
    fixture.detectChanges();
    console.log(dateFormControl);
    expect(dateFormControl?.invalid).toBeTrue();

    const msg = dateFormControl?.errors?.['invaliddate'].msg;
    expect(msg).toEqual('Date must fall within the report date range.');
  }));
});
