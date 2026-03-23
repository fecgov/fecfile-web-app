type DebtFieldValues = {
  amount: string;
  balance: string;
  balanceAtClose: string;
  paymentAmount: string;
};

export function assertDebtFieldValues(values: DebtFieldValues) {
  cy.get('#balance:visible').should('have.value', values.balance);
  cy.get('#amount:visible').should('have.value', values.amount);
  cy.get('#payment_amount:visible').should('have.value', values.paymentAmount);
  cy.get('#balance_at_close:visible').should('have.value', values.balanceAtClose);
}
