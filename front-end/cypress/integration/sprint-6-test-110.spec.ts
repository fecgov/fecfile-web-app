// @ts-check

import { GenerateContactObject } from "../support/contacts.spec";

/*

        Individual

*/

describe('QA Test Script #110 (Sprint 6)', () => {
  beforeEach(() => {
    //cy.login();
  });


  afterEach(() => {
    //cy.logout();
  });

  it('Step 1: Navigate to contacts page', () => {
      cy.url()
        .should("contain","/dashboard");
      cy.get(".p-menubar")
        .find(".p-menuitem-link")
        .contains("Contacts")
        .click();
      cy.url()
        .should("contain","/contacts");
  });

  it("Steps 2-5: Creates a contact", () => {
    const contact = GenerateContactObject({"contact_type":"Candidate"});
    cy.CreateContactIndividual(contact, false);

    cy.get("#last_name")
      .should("have.value", contact["last_name"]);
    cy.get("#first_name")
      .should("have.value", contact["first_name"]);
    cy.get("#middle_name")
      .should("have.value", contact["middle_name"]);
    cy.get("#prefix")
      .should("have.value", contact["prefix"]);
    cy.get("#suffix")
      .should("have.value", contact["suffix"]);

    //Address
    cy.get("#street_1")
      .should("have.value", contact["street"]);
    cy.get("#street_2")
      .should("have.value", contact["apartment"]);
    cy.get("#city")
      .should("have.value", contact["city"]);
    cy.get("#zip")
      .should("have.value", contact["zip"]);
    cy.get("#telephone")
      .should("have.value", contact["phone"]);
    cy.get("[inputid='state']") //Get the field for State based on its "inputid" attribute
      .find("div [role='button']") //Get the field's child element, div, based on its role element
      .click();
    cy.get("span")
      .contains(contact["state"])
      .click();
    cy.get("[inputid='state']") //Gets the field for the input for State
      .should("contain", contact["state"]);

    cy.get("#employer")
      .should("have.value", contact["employer"]);
    cy.get("#occupation")
      .should("have.value", contact["occupation"]);

    cy.get(".p-button-primary > .p-button-label")
      .contains("Save")
      .click(); 

    cy.wait(250);
    cy.get("tbody")
      .find("tr")
      .contains(`${contact["first_name"]} ${contact["last_name"]}`).parent()
      .should("contain","Individual")
      .should("contain",contact["employer"])
      .should("contain",contact["occupation"]);
  });

  it('Steps 6-11: Test "Save & Add More"', () => {
    cy.CreateContactIndividual(GenerateContactObject(), false);

    cy.get(".p-button-label")
      .contains("Save & Add More")
      .click()
    
    cy.get(".p-toast-message")
      .should("contain","Contact Created");

    cy.get("#last_name")
      .should("have.value", "");
    cy.get("#first_name")
      .should("have.value", "");
  });

});