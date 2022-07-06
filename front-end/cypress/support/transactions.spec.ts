export function enterTransactionSchA(transaction: object) {
  const tType = transaction['contributor_type'];

  cy.dropdownSetValue('p-dropdown[formcontrolname="entity_type"]', tType);
  cy.shortWait();

  //Contributor
  if (tType == 'Individual' || tType == 'Candidate') {
    cy.get("input[formControlName='contributor_last_name']").safeType(transaction['last_name']);
    cy.get("input[formControlName='contributor_first_name']").safeType(transaction['first_name']);
    cy.get("input[formControlName='contributor_middle_name']").safeType(transaction['middle_name']);
    cy.get("input[formControlName='contributor_prefix']").safeType(transaction['prefix']);
    cy.get("input[formControlName='contributor_suffix']").safeType(transaction['suffix']);
  } else {
    cy.get("input[formControlName='contributor_organization_name']").safeType(transaction['name']);
  }

  //Address
  cy.get("input[formControlName='contributor_street_1']").safeType(transaction['street']);
  cy.get("input[formControlName='contributor_street_2']").safeType(transaction['apartment']);
  cy.get("input[formControlName='contributor_city']").safeType(transaction['city']);
  cy.dropdownSetValue("p-dropdown[formControlName='contributor_state']", transaction['state']);
  cy.get("input[formControlName='contributor_zip']").safeType(transaction['zip']);

  //Contribution
  cy.calendarSetValue("p-calendar[formControlName='contribution_date']", transaction['contribution_date']);
  if (transaction['contribution_memo_item']) {
    cy.get("p-checkbox[formControlName='memo_code']").find("div[class='p-checkbox-box']").click();
  }
  cy.get("p-inputnumber[formControlName='contribution_amount']").safeType(transaction['contribution_amount']);

  //Additional Information
  cy.get("textarea[formControlName='contribution_purpose_descrip']").safeType(transaction['contribution_purpose']);
  cy.get("textarea[formControlName='memo_text_description']").safeType(transaction['contribution_memo']);

  //Save
  cy.get("button[label='Save & view all transactions']").click();
  cy.longWait();
}
