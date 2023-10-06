import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
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
import { ReportF3X } from 'app/shared/models/report-f3x.model';
import { Dialog } from 'primeng/dialog';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';

describe('MemoCodeInputComponent', () => {
  let component: MemoCodeInputComponent;
  let fixture: ComponentFixture<MemoCodeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemoCodeInputComponent, ErrorMessagesComponent, FecDatePipe, Dialog, Tooltip],
      imports: [CheckboxModule, InputNumberModule, CalendarModule, ReactiveFormsModule, TooltipModule],
      providers: [provideMockStore(testMockStore), ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(MemoCodeInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contribution_date: new FormControl(''),
      memo_code: new FormControl(''),
      contribution_amount: new FormControl(''),
      contribution_aggregate: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
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
    component.report = new ReportF3X();
    component.templateMap.memo_code = 'memo_code';
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');
    component.transaction = testScheduleATransaction;

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeTrue();
  });

  it('should not open the dialog box when memo_code is unchecked and inside of report dates', () => {
    component.report = new ReportF3X();
    component.templateMap.memo_code = 'memo_code';
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick();
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should not open the dialog box when memo_code is checked and outside of report dates', () => {
    component.report = new ReportF3X();
    component.templateMap.memo_code = 'memo_code';
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

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

  it('should add and remove the requiredTrue validator when a date is set', () => {
    component.report = new ReportF3X();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');
    component.transaction = testScheduleATransaction;

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();
  });

  it('should preserve old validators when clearing an added requiredTrue validator', () => {
    component.report = new ReportF3X();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');
    component.transaction = testScheduleATransaction;

    component.form.get('memo_code')?.addValidators(Validators.email);

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    expect(component.form.get('memo_code')?.hasValidator(Validators.email)).toBeTrue();
  });

  it('should not crash if it tries to update the contribution date without a memo_code formControl', () => {
    component.report = new ReportF3X();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');
    component.transaction = testScheduleATransaction;
    component.form.removeControl('memo_code');

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.dateIsOutsideReport).toBeTrue();
  });

  it('should update transaction type identifiers correctly based on the TransactionType', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.ngOnInit();

    const trueTTI = component.transaction.transactionType?.memoCodeTransactionTypes?.true;
    const falseTTI = component.transaction.transactionType?.memoCodeTransactionTypes?.false;

    component.memoControl.setValue(true);
    expect(component.transaction.transaction_type_identifier).toEqual(trueTTI);

    component.memoControl.setValue(false);
    expect(component.transaction.transaction_type_identifier).toEqual(falseTTI);
  });

  it('should form the memoCodeMapOptions correctly', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT);
    component.ngOnInit();

    for (const option of component.memoCodeMapOptions) {
      if (option.value === false) {
        expect(option.label).toEqual(component.transaction.transactionType?.memoCodeMap?.false);
      }
      if (option.value === true) {
        expect(option.label).toEqual(component.transaction.transactionType?.memoCodeMap?.true);
      }
    }
  });
});
