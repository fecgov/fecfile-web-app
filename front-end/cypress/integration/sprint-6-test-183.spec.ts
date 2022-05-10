// @ts-check

import { after } from "lodash";
import { GenerateContactObject } from "../support/contacts.spec";

/*
    !  This test file will not work before the dropdown bug is squashed   !
*/

//      Cannot use type "Candidate" until the dropdown bug is fixed.  Using "Individual" for now
//const contact = GenerateContactObject({"contact_type":"Candidate", "state":"Oklahoma"});
const contact = GenerateContactObject({"contact_type":"Individual", "state":"Virginia"});

describe('QA Test Script #183 (Sprint 6)', () => {



  function before(){

    cy.login();
    cy.CreateContactIndividual(contact);
  }

  function after(){
    cy.get("p-table")
      .find("tr")
      .contains(`${contact["first_name"]} ${contact["last_name"]}`) //Finds out contact in the Manage Contacts table
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

  it("Steps 2-8: Select a contact, edit that contact's state, verify that it saved", ()=>{

    cy.get("p-table")
      .find("tr")
      .contains(`${contact["first_name"]} ${contact["last_name"]}`) //Finds out contact in the Manage Contacts table
      .parent()                                                     //Gets the row its in
      .find("p-tablecheckbox")
      .click()                                                      //Check the checkbox for step 2
      .parent().parent()                                            //Get back to the row
      .find('p-button[icon="pi pi-pencil"]')                        //Gets the edit button
      .click();

    cy.get("[inputid='state']")
      .should("contain","Virginia")
      .should("not.contain","Texas") //Demonstrates that it's not just finding a value within the dropdown options

    // TO BE DEPRECATED by dropdown_set_value()
    cy.get("[inputid='state'")
      .find("div[role='button']")
      .click();
    cy.get("li[role='option']")
      .contains("West Virginia")
      .click()

    cy.get("button[label='Save']")
      .click();
   
    cy.wait(100) //Wait for the form to close itself
    cy.get("p-table")
      .find("tr")
      .contains(`${contact["first_name"]} ${contact["last_name"]}`) //Finds out contact in the Manage Contacts table
      .parent()                                                     //Gets the row its in
      .find('p-button[icon="pi pi-pencil"]')                        //Gets the edit button
      .click();

    cy.get("[inputid='state']")
      .should("contain","West Virginia");
    cy.get("button[label='Cancel']")
      .click();
  });

  it("Cleanup",()=>{
    cy.wait(100);
    after();
  });


});