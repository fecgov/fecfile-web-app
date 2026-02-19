import { Initialize } from '../pages/loginPage';
import { DataSetup } from './setup';
import {
  assertDebtValues,
  createDebt,
  openDebtForEdit,
  updateAmountAndAssertBalanceAtClose,
} from './utils/debt-balance-helpers';

describe('Debt Balance at Close Calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate balance_at_close = beginning_balance + incurred_amount - payment_amount when creating a debt', () => {
    DataSetup({ committee: true }).then((result: any) => {
      createDebt(result, 3000, '$3,000.00');
      openDebtForEdit(result.report);

      assertDebtValues('$3,000.00', '$3,000.00');
      updateAmountAndAssertBalanceAtClose('5000', '$5,000.00');
    });
  });

  it('should update balance_at_close when modifying incurred_amount', () => {
    DataSetup({ committee: true }).then((result: any) => {
      createDebt(result, 5000, '$5,000.00');
      openDebtForEdit(result.report);

      assertDebtValues('$5,000.00', '$5,000.00');
      updateAmountAndAssertBalanceAtClose('8000', '$8,000.00');
    });
  });
});
