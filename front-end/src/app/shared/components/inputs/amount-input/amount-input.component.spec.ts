import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AmountInputComponent } from './amount-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfirmationService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { Dialog } from 'primeng/dialog';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmountInputComponent, ErrorMessagesComponent, FecDatePipe, Dialog, Tooltip],
      imports: [CheckboxModule, InputNumberModule, CalendarModule, ReactiveFormsModule, TooltipModule],
      providers: [provideMockStore(testMockStore), ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contribution_date: new FormControl(''),
      memo_code: new FormControl(''),
      contribution_amount: new FormControl(''),
      contribution_aggregate: new FormControl(''),
      disbursement_date: new FormControl(''),
      dissemination_date: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call updateInput when negativeAmountValueOnly is false', () => {
    component.negativeAmountValueOnly = false;
    const updateInputMethodFalse = spyOn(component.amountInput, 'updateInput');
    component.onInputAmount();
    expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
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
});
