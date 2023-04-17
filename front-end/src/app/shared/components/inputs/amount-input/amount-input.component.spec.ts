import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AmountInputComponent } from './amount-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfirmationService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmountInputComponent, ErrorMessagesComponent, FecDatePipe],
      imports: [CheckboxModule, InputNumberModule, CalendarModule, ReactiveFormsModule],
      providers: [provideMockStore(testMockStore), ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputComponent);
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

  it('should not call updateInput when negativeAmountValueOnly is false', () => {
    component.negativeAmountValueOnly = false;
    const updateInputMethodFalse = spyOn(component.amountInput, 'updateInput');
    component.onInputAmount(new KeyboardEvent('1', undefined));
    expect(updateInputMethodFalse).toHaveBeenCalledTimes(0);
  });

  it('should call updateInput when negativeAmountValueOnly is true', () => {
    component.negativeAmountValueOnly = true;
    const updateInputMethodTrue = spyOn(component.amountInput, 'updateInput');
    component.onInputAmount(new KeyboardEvent('1', undefined));
    expect(updateInputMethodTrue).toHaveBeenCalled();
  });

  it('should close the dialog box when the method is called', () => {
    component.closeOutOfDateDialog();
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should open the dialog box when memo_code is unchecked and outside of report dates', () => {
    component.report = new F3xSummary();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick(new MouseEvent('test'));
    expect(component.outOfDateDialogVisible).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    component.onMemoItemClick(new MouseEvent('test'));
    expect(component.outOfDateDialogVisible).toBeTrue();
  });

  it('should not open the dialog box when memo_code is unchecked and inside of report dates', () => {
    component.report = new F3xSummary();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    component.form.get('memo_code')?.patchValue(false);
    component.onMemoItemClick(new MouseEvent('test'));
    expect(component.outOfDateDialogVisible).toBeFalse();
  });

  it('should add and remove the requiredTrue validator when a date is set', () => {
    component.report = new F3xSummary();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    component.form.get('contribution_date')?.patchValue(new Date('02/01/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();
  });

  it('should preserve old validators when clearing an added requiredTrue validator', () => {
    component.report = new F3xSummary();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');

    component.form.get('memo_code')?.addValidators(Validators.email);

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeTrue();

    component.form.get('contribution_date')?.patchValue(new Date('01/15/2020'));
    expect(component.form.get('memo_code')?.hasValidator(Validators.requiredTrue)).toBeFalse();

    expect(component.form.get('memo_code')?.hasValidator(Validators.email)).toBeTrue();
  });

  it('should not crash if it tries to update the contribution date without a memo_code formControl', () => {
    component.report = new F3xSummary();
    component.report.coverage_from_date = new Date('01/01/2020');
    component.report.coverage_through_date = new Date('01/31/2020');
    component.form.removeControl('memo_code');

    component.form.get('contribution_date')?.patchValue(new Date('12/25/2019'));
    expect(component.dateIsOutsideReport).toBeTrue();
  });
});
