import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtInputComponent } from './debt-input.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Transaction } from 'app/shared/models/transaction.model';

describe('DebtInputComponent', () => {
  let component: DebtInputComponent;
  let fixture: ComponentFixture<DebtInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DebtInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore())],
    });
    fixture = TestBed.createComponent(DebtInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap();
    component.form.setControl('loan_balance', new SubscriptionFormControl());
    component.form.setControl('contribution_amount', new SubscriptionFormControl());
    component.form.setControl('payment_amount', new SubscriptionFormControl());
    component.form.setControl('balance_at_close', new SubscriptionFormControl());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Balance at Close Calculation', () => {
    /**
     * Tests for Balance at Close calculation when modifying Incurred Amount.
     *
     * Balance at Close = Beginning Balance + Incurred Amount - Payment Amount
     */

    /**
     * Helper function to set transaction data for testing and initialize component
     */
    function setupAndInitialize(
      beginningBalance: number | undefined,
      paymentAmount: number | undefined,
      transactionId: string | undefined = '123',
    ) {
      // Create a mock transaction object with the required properties
      const mockTransaction: Partial<Transaction> & Record<string, unknown> = {
        id: transactionId,
        [component.templateMap.balance]: beginningBalance,
        payment_amount: paymentAmount,
      };

      // Provide the input via Angular's test API for inputs
      fixture.componentRef.setInput('transaction', mockTransaction as Transaction);

      // Now initialize the component - this sets up the valueChanges subscription
      component.ngOnInit();
      fixture.detectChanges();
    }

    it('should calculate balance_at_close when incurred_amount changes', () => {
      // Setup: beginning balance = 5000, payment amount = 1000
      // When incurred_amount = 2000
      // Expected: balance_at_close = 5000 + 2000 - 1000 = 6000
      setupAndInitialize(5000, 1000);

      const incurredAmountControl = component.form.get(component.templateMap.amount);
      incurredAmountControl?.setValue(2000, { emitEvent: true });
      fixture.detectChanges();

      const balanceAtCloseControl = component.form.get('balance_at_close');
      expect(balanceAtCloseControl?.value).toBe(6000);
    });

    it('should calculate correct balance_at_close when incurred_amount is 0', () => {
      // Setup: beginning balance = 1000, payment amount = 0
      // When incurred_amount = 0
      // Expected: balance_at_close = 1000 + 0 - 0 = 1000
      setupAndInitialize(1000, 0);

      const incurredAmountControl = component.form.get(component.templateMap.amount);
      incurredAmountControl?.setValue(0, { emitEvent: true });
      fixture.detectChanges();

      const balanceAtCloseControl = component.form.get('balance_at_close');
      expect(balanceAtCloseControl?.value).toBe(1000);
    });

    it('should recalculate balance_at_close when incurred_amount changes multiple times', () => {
      // Setup: beginning balance = 1000, payment amount = 100
      setupAndInitialize(1000, 100);

      const incurredAmountControl = component.form.get(component.templateMap.amount);
      const balanceAtCloseControl = component.form.get('balance_at_close');

      // First update: incurred_amount = 500
      // Expected: 1000 + 500 - 100 = 1400
      incurredAmountControl?.setValue(500, { emitEvent: true });
      fixture.detectChanges();
      expect(balanceAtCloseControl?.value).toBe(1400);

      // Second update: incurred_amount = 750
      // Expected: 1000 + 750 - 100 = 1650
      incurredAmountControl?.setValue(750, { emitEvent: true });
      fixture.detectChanges();
      expect(balanceAtCloseControl?.value).toBe(1650);

      // Third update: incurred_amount = 200
      // Expected: 1000 + 200 - 100 = 1100
      incurredAmountControl?.setValue(200, { emitEvent: true });
      fixture.detectChanges();
      expect(balanceAtCloseControl?.value).toBe(1100);
    });

    it('should correctly calculate when all values are updated from new transaction', () => {
      // This test simulates updating a debt when creating a new one
      // Setup: beginning balance = 0, payment amount = 0 (new transaction)
      setupAndInitialize(0, 0, undefined);

      const incurredAmountControl = component.form.get(component.templateMap.amount);
      const balanceAtCloseControl = component.form.get('balance_at_close');

      // After user enters incurred amount of 10000
      incurredAmountControl?.setValue(10000, { emitEvent: true });
      fixture.detectChanges();
      expect(balanceAtCloseControl?.value).toBe(10000);
    });

    it('should handle negative payment amounts (overpayment scenario)', () => {
      // Setup: beginning balance = 5000, payment amount = -500 (overpayment/credit)
      // When incurred_amount = 1000
      // Expected: balance_at_close = 5000 + 1000 - (-500) = 6500
      setupAndInitialize(5000, -500);

      const incurredAmountControl = component.form.get(component.templateMap.amount);
      incurredAmountControl?.setValue(1000, { emitEvent: true });
      fixture.detectChanges();

      const balanceAtCloseControl = component.form.get('balance_at_close');
      expect(balanceAtCloseControl?.value).toBe(6500);
    });
  });
});
