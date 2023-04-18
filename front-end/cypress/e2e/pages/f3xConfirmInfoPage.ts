export function enterConfirmationDetails(details: ConfirmationDetails, save = true) {
  cy.get('input[formControlName="confirmation_email_1"]').overwrite(details.email_1);

  if (details.email_2) {
    cy.get('input[formControlName="confirmation_email_2"]').overwrite(details.email_2);
  }

  if (details.street_1) {
    cy.get('p-radiobutton[label="YES"]').find('div').last().click({ force: true });

    cy.get('input[formControlName="street_1"]').overwrite(details.street_1);
    cy.get('input[formControlName="street_2"]').overwrite(details.street_2);
    cy.get('input[formControlName="city"]').overwrite(details.city);
    cy.get('input[formControlName="zip"]').overwrite(details.zip);
    cy.dropdownSetValue('p-dropdown[formControlName="state"]', details.state);
  }

  if (save) {
    cy.get('button[label="Confirm information"]').click();
  }
}

export function enterFilingDetails(details: FilingDetails, save = true) {
  cy.get('input[formControlName="treasurer_first_name"]').overwrite(details.first_name);
  cy.get('input[formControlName="treasurer_last_name"]').overwrite(details.last_name);
  cy.get('input[formControlName="treasurer_middle_name"]').overwrite(details.middle_name);
  cy.get('input[formControlName="treasurer_prefix"]').overwrite(details.prefix);
  cy.get('input[formControlName="treasurer_suffix"]').overwrite(details.suffix);
  cy.get('input[formControlName="filing_password"]').overwrite(details.filing_pw);

  cy.get('p-checkbox[formControlName="truth_statement"]').find('div').last().click({ force: true });

  if (save) {
    cy.get('button[label="Submit"]').click();
    cy.contains('button', 'Yes').click();
  }
}
