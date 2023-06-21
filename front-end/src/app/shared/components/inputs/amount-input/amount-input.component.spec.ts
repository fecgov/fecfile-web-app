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
import { Dialog } from 'primeng/dialog';
import { Tooltip, TooltipModule } from 'primeng/tooltip';

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
});
