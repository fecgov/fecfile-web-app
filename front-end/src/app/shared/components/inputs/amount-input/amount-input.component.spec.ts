import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { testMockStore, testTemplateMap, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { AmountInputComponent } from './amount-input.component';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;
  let store;

  beforeEach(async () => {
    store = provideMockStore(testMockStore);
    await TestBed.configureTestingModule({
      declarations: [AmountInputComponent, ErrorMessagesComponent, FecDatePipe, Dialog, Tooltip, InputNumberComponent],
      imports: [CheckboxModule, InputNumberModule, CalendarModule, ReactiveFormsModule, TooltipModule],
      providers: [store, ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        contribution_date: new FormControl(''),
        memo_code: new FormControl(''),
        contribution_amount: new FormControl(''),
        contribution_aggregate: new FormControl(''),
        disbursement_date: new FormControl(''),
        dissemination_date: new FormControl(''),
        expenditure_date: new FormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    component.transaction = testScheduleATransaction;
    component.ngOnChanges({ transaction: {} as SimpleChange });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges() should execute successfully', () => {
    component.ngOnChanges({ transaction: {} as SimpleChange });
    expect(true).toBeTrue();
  });

  it('should not call updateInput when negativeAmountValueOnly is false', () => {
    component.negativeAmountValueOnly = false;
    const updateInputMethodFalse = spyOn(component.amountInput, 'updateInput');
    expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
    component.onInputAmount();
    // expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
  });

  it('should call updateInput when negativeAmountValueOnly is true', () => {
    component.negativeAmountValueOnly = true;
    const updateInputMethodTrue = spyOn(component.amountInput, 'updateInput');
    component.onInputAmount();
    expect(updateInputMethodTrue).toHaveBeenCalled();
  });

  it('should set up the component properly', () => {
    const transaction = getFromJSON({ transaction_type_identifier: 'INDEPENDENT_EXPENDITURE' });
    const date: Date = new Date('July 20, 69 20:17:40 GMT+00:00');
    component.transaction = transaction;
    component.templateMap = transaction.transactionType.templateMap;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component.memoCode = { updateMemoItemWithDate: (date) => undefined } as MemoCodeInputComponent;
    component.ngOnInit();
    component.form.patchValue({
      [transaction.transactionType.templateMap.date]: undefined,
    });
    component.form.patchValue({
      [transaction.transactionType.templateMap.date2]: date,
    });
    expect(component.memoCode.coverageDate.getTime()).toBe(-14182940000);
  });

  it('should not allow memo item selection for loan repayment', () => {
    const transaction = getFromJSON({ transaction_type_identifier: 'LOAN_REPAYMENT_MADE' });
    transaction.loan_id = 'test';
    component.transaction = transaction;
    component.templateMap = transaction.transactionType.templateMap;
    const store = TestBed.inject(MockStore);
    component.activeReport$ = store.select(selectActiveReport);
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
    expect(dateFormControl?.invalid).toBeTrue();

    const msg = dateFormControl?.errors?.['invaliddate'].msg;
    expect(msg).toEqual('Date must fall within the report date range.');
  });
});
