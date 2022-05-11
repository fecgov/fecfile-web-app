// @ts-check

import { GenerateContactObject } from "../support/contacts.spec";

//  Will not work until the dropdown bug is fixed!
const contact = GenerateContactObject({"contact_type":"Committee"});

describe('QA Test Script #186 (Sprint 6)', () => {



  function before(){
    cy.login();
    cy.CreateContactIndividual(contact);
  }

  function after(){
    cy.get("p-table")
      .find("tr")
      .contains(`${contact["committee_name"]}`) //Finds out contact in the Manage Contacts table
      .parent()                                                     //Gets the row its in
      .find('p-button[icon="pi pi-trash"]')                         //Gets the edit button
      .click();

    cy.wait(100);
    cy.get(".p-confirm-dialog-accept")
      .click()
    
    cy.wait(100);
    cy.logout();
  };


  it('Step 1: Navigate to contacts page', () => {
    before();

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

  it("Steps 2 & 3: Select a contact and open the edit menu", ()=>{
    cy.get("p-table")
      .find("tr")
      .contains(`${contact["committee_name"]}`) //Finds out contact in the Manage Contacts table
      .parent()                                                     //Gets the row its in
      .find("p-tablecheckbox")
      .click()                                                      //Check the checkbox for step 2
      .parent().parent()                                            //Get back to the row
      .find('p-button[icon="pi pi-pencil"]')                        //Gets the edit button
      .click();
  });

  it("Steps 4 & 5: No 'Save & Add More' button; Save and Cancel buttons exist", ()=>{
    cy.get("button[label='Save & Add More']").should("not.exist"); //Checks that the "Save & Add More button does not exist"
    cy.get("button[label='Save']").should("exist");
    cy.get("button[label='Cancel']").should("exist");
  });
  
  it("Step 6: Close the form with the 'X' button", ()=>{
    cy.get(".p-dialog-header-close-icon").click(); //Close the form with the 'X' button

    cy.wait(100);
    after();
  });
});