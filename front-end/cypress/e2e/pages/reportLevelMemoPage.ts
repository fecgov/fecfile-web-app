export class ReportLevelMemoPage {
  static enterFormData(text: string) {
    cy.get('[id="text4000"]').overwrite(text);
  }
}
