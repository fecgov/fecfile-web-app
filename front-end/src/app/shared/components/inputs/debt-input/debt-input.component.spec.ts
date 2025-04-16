import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtInputComponent } from './debt-input.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('DebtInputComponent', () => {
  let component: DebtInputComponent;
  let fixture: ComponentFixture<DebtInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DebtInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(DebtInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form.setControl('loan_balance', new SubscriptionFormControl());
    component.form.setControl('contribution_amount', new SubscriptionFormControl());
    component.form.setControl('payment_amount', new SubscriptionFormControl());
    component.form.setControl('balance_at_close', new SubscriptionFormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
