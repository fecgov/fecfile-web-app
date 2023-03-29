export class F3xReportLevelMemoPage {
  static enterFormData(text: string) {
    cy.get('[id="text4000"]').overwrite(text);
  }

  static clickSaveAndContinueButton() {
    cy.get('button[label="Save & continue"]').click();
  }
}
