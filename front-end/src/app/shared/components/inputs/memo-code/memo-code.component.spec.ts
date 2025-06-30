import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import {
  getTestTransactionByType,
  testMockStore,
  testTemplateMap,
  testScheduleATransaction,
} from 'app/shared/utils/unit-test.utils';
import { MemoCodeInputComponent } from './memo-code.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfirmationService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Dialog } from 'primeng/dialog';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Component, viewChild } from '@angular/core';
import { Transaction } from 'app/shared/models';

@Component({
  imports: [MemoCodeInputComponent],
  standalone: true,
  template: `<app-memo-code
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
    [overrideMemoItemHelpText]="memoItemHelpText"
    [transaction]="transaction"
    checkboxLabel="MEMO ITEM"
    [parenLabel]="memoHasOptional ? '(OPTIONAL)' : ''"
  />`,
})
class TestHostComponent {
  form = new FormGroup(
    {
      contribution_date: new SubscriptionFormControl(''),
      memo_code: new SubscriptionFormControl(''),
      contribution_amount: new SubscriptionFormControl(''),
      contribution_aggregate: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMap = testTemplateMap;
  memoItemHelpText = '';
  transaction: Transaction = testScheduleATransaction;
  memoHasOptional = false;
  component = viewChild.required(MemoCodeInputComponent);
}

fdescribe('MemoCodeInputComponent', () => {
  let component: MemoCodeInputComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  function setForm3X(memoCode = true) {
    const form3x = new Form3X();
    if (memoCode) host.templateMap.memo_code = 'memo_code';
    form3x.coverage_from_date = new Date('01/01/2020');
    form3x.coverage_through_date = new Date('01/31/2020');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CheckboxModule,
        InputNumberModule,
        DatePickerModule,
        ReactiveFormsModule,
        TooltipModule,
        MemoCodeInputComponent,
        ErrorMessagesComponent,
        FecDatePipe,
        Dialog,
        Tooltip,
      ],
      providers: [provideMockStore(testMockStore), ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog box when the method is called', () => {
    component.closeOutOfDateDialog();
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should open the dialog box when memo_code is unchecked and outside of report dates', () => {
    setForm3X();
    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeTrue();
  });

  it('should not open the dialog box when memo_code is unchecked and inside of report dates', () => {
    setForm3X();
    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should not open the dialog box when memo_code is checked and outside of report dates', () => {
    setForm3X();

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    component.outOfDateDialogVisible = false;
    component.form.get('memo_code')?.patchValue(true);
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeFalse();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    component.outOfDateDialogVisible = false;
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should not open the dialog box when same report date is set', () => {
    setForm3X();

    component.form.get('contribution_date')?.patchValue(new Date('12/22/2019'));
    expect(component.outOfDateDialogVisible).toBeTrue();

    component.outOfDateDialogVisible = false;
    component.form.get('contribution_date')?.patchValue(new Date('12/22/2019'));
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should add and remove the requiredTrue validator when a date is set', () => {
    setForm3X(false);

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();
  });

  it('should preserve old validators when clearing an added requiredTrue validator', () => {
    setForm3X(false);

    component.form.get('memo_code')?.addValidators(Validators.email);
    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    expect(component.form.get('memo_code')?.hasValidator(Validators.email)).toBeTrue();
  });

  it('should not crash if it tries to update the contribution date without a memo_code formControl', () => {
    setForm3X(false);
    component.form.removeControl('memo_code');

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.dateIsOutsideReport).toBeTrue();
  });

  it('should update transaction type identifiers correctly based on the TransactionType', () => {
    host.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.ngOnInit();

    const trueTTI = component.transactionType()?.memoCodeTransactionTypes?.true;
    const falseTTI = component.transactionType()?.memoCodeTransactionTypes?.false;

    component.memoControl.setValue(true);
    expect(component.transaction()?.transaction_type_identifier).toEqual(trueTTI);

    component.memoControl.setValue(false);
    expect(component.transaction()?.transaction_type_identifier).toEqual(falseTTI);
  });

  it('should form the memoCodeMapOptions correctly', () => {
    host.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.ngOnInit();

    for (const option of component.memoCodeMapOptions()) {
      const memoCodeMap = host.transaction.transactionType.memoCodeMap!;
      if (option.value === false) {
        expect(option.label).toEqual(memoCodeMap.false);
      }
      if (option.value === true) {
        expect(option.label).toEqual(memoCodeMap.true);
      }
    }
  });
});
