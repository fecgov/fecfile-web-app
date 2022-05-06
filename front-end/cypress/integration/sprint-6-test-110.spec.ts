// @ts-check

/*

        Individual

*/

//      Contact Values
const individual_last_name    = "Jorgenson";
const individual_first_name   = "Bill";
const individual_middle_name  = "Thomas";
const individual_prefix       = "Dr";
const individual_suffix       = "IV";

//      Address Values
const individual_street       = "118 Test Rd";
const individual_apartment    = "Apt 22";
const individual_city         = "Testopolis";
const individual_zip          = "12121";
const individual_state        = "Maryland";
const individual_phone        = "8000010001";

//      Employer Values
const individual_employer     = "University of Testopolis";
const individual_occupation   = "Historian";

describe('QA Test Script #110 (Sprint 6)', () => {
  beforeEach(() => {
    cy.login();
  });


  afterEach(() => {
    cy.logout();
  });

  it('Navigate to contacts page (Step #1)', () => {
      cy.url()
        .should("contain","/dashboard");
      cy.get(".p-menubar")
        .find(".p-menuitem-link")
        .contains("Contacts")
        .click();
      cy.url()
        .should("contain","/contacts");
  });

  it("Creates a random contact", () => {
    var contact = cy.CreateContactIndividual();

  });

  it('Create new Contact, Individual (Steps 2-11)', () => {
    cy.visit('/contacts');
    cy.wait(500);

    cy.get('#button-contacts-new')
      .click();

    cy.get("app-contact-detail")
      .should("contain", "Add Contact");

    //Contact
    cy.get("#last_name")
      .type(individual_last_name)
      .should("have.value", individual_last_name);
    cy.get("#first_name")
      .type(individual_first_name)
      .should("have.value", individual_first_name);
    cy.get("#middle_name")
      .type(individual_middle_name)
      .should("have.value", individual_middle_name);
    cy.get("#prefix")
      .type(individual_prefix)
      .should("have.value", individual_prefix);
    cy.get("#suffix")
      .type(individual_suffix)
      .should("have.value", individual_suffix);

    //Address
    cy.get("#street_1")
      .type(individual_street)
      .should("have.value", individual_street);
    cy.get("#street_2")
      .type(individual_apartment)
      .should("have.value", individual_apartment);
    cy.get("#city")
      .type(individual_city)
      .should("have.value", individual_city);
    cy.get("#zip")
      .type(individual_zip)
      .should("have.value", individual_zip);
    cy.get("#telephone")
      .type(individual_phone)
      .should("have.value", individual_phone);
    cy.get("[inputid='state']") //Get the field for State based on its "inputid" attribute
      .find("div [role='button']") //Get the field's child element, div, based on its role element
      .click();
    cy.get("span")
      .contains(individual_state)
      .click();
    cy.get("[inputid='state']") //Gets the field for the input for State
      .should("contain", individual_state);

    cy.get("#employer")
      .type(individual_employer)
      .should("have.value", individual_employer);
    cy.get("#occupation")
      .type(individual_occupation)
      .should("have.value", individual_occupation);

    cy.get(".p-button-primary > .p-button-label")
      .contains("Save")
      .click();

    cy.pause();
  });

});