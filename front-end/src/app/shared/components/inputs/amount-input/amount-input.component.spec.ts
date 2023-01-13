import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

import { AmountInputComponent } from './amount-input.component';

describe('AmountInputComponent', () => {
  let component: AmountInputComponent;
  let fixture: ComponentFixture<AmountInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmountInputComponent, ErrorMessagesComponent],
      imports: [CheckboxModule, InputNumberModule, CalendarModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contribution_date: new FormControl(''),
      memo_code: new FormControl(''),
      contribution_amount: new FormControl(''),
      contribution_aggregate: new FormControl(''),
    });
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
});
