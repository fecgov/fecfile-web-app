

export class CashOnHandPage {
  //Deletes all cash on hand overrides belonging to the logged-in committee
  static deleteAllCashOnHandOverrides() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/cash_on_hand/e2e-delete-cash-on-hand-overrides/',
        //"e2e-delete-cash-on-hand-overrides"
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }
}
