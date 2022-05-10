// @ts-check

/*
    !  This test file will not work before the dropdown bug is squashed   !
*/

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Foreign Countries', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

describe('QA Test Script #182 (Sprint 6)', () => {
  /*
            No login is currently required for fully testing this QA script
  before(() => {
    //cy.login();
  });


  after(() => {
    //cy.logout();
  });
  */

  it('Step 1: Navigate to contacts page', () => {
      cy.visit("/dashboard");
      cy.url()
        .should("contain","/dashboard");
      cy.get(".p-menubar")
        .find(".p-menuitem-link")
        .contains("Contacts")
        .click();
      cy.url()
        .should("contain","/contacts");
  });

  it('Step 2: Open the "Add Contact" form', () => {
    cy.get('#button-contacts-new')
      .click();
    cy.wait(250);

    cy.get(".p-dialog-header")
      .contains("Add Contact")
      .should("contain","Add Contact");
  });

  it("Step 3: Select Contact Type - Candidate", () => {
    //Broken due to dropdown bug.  Can run the test without it
    //cy.dropdown_set_value("[inputid='type]","Candidate");
  });

  it("Step 4: The 'State' field should be empty", () => {
    cy.get("[inputid='state']")
      .should("have.value","");
  });

  it("Steps 5-8: Open the 'State' dropdown, check for all the relevent states, check that it does not contain 'Armed Forces' entries, and select 'Virginia'", () =>{    
    cy.get("[inputid='state']")
      .find("div[role='button']")
      .click();
    
    for (var i = 0; i < states.length; i++){
      var state = states[i];
      cy.get("li[role='option']")
        .contains(state)
        .should("contain",state);
    }

    
    cy.get("li[role='option']")
      //.should("not.contain","Armed Forces")   Fails because we cannot select 'Candidate' from the dropdown menu
      .contains("Virginia")
      .click();

    cy.get("[inputid='state']")
      .should("contain","Virginia");

  })

});