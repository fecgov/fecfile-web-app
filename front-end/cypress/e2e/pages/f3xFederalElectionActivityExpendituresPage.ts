
export type F3xFederalElectionActivityExpenditureFormData = {
  electionYear: number; 
  electionType: string;
}

export const defaultElectionActivityExpenditureData: F3xFederalElectionActivityExpenditureFormData = { 
  electionType: "",
  electionYear: 0
}

export class F3xFederalElectionActivityExpendituresPage {
  static enterFormData(formData: F3xFederalElectionActivityExpenditureFormData) {
    // pass in contact type
    
    cy.get('input[formControlName="electionYear"').overwrite(formData.electionYear);
    cy.get('input[formControlName="electionType"').overwrite(formData.electionType);
  }

}