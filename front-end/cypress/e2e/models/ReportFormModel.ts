import { currentYear } from '../pages/pageUtils';

export class F3xCreateReportFormData {
  filing_frequency: string;
  report_type_category: string;
  report_code: string;
  coverage_from_date: Date;
  coverage_through_date: Date;
  date_of_election: Date;
  state_of_election: string;

  constructor(formData: F3xCreateReportFormData) {
    this.filing_frequency = formData.filing_frequency;
    this.report_type_category = formData.report_type_category;
    this.report_code = formData.report_code;
    this.coverage_through_date = formData.coverage_through_date;
    this.coverage_from_date = formData.coverage_from_date;
    this.date_of_election = formData.date_of_election;
    this.state_of_election = formData.state_of_election;
  }
}

export const defaultFormData: F3xCreateReportFormData = {
  filing_frequency: 'Q', // Q, M
  report_type_category: 'Election Year',
  report_code: '12G',
  coverage_from_date: new Date(currentYear, 4 - 1, 1),
  coverage_through_date: new Date(currentYear, 4 - 1, 30),
  date_of_election: new Date(currentYear, 11 - 1, 4),
  state_of_election: 'California',
};

  export const e2eReportStrings = {
    new: "New",
    save: "Save",
    cancel: "Cancel",
    saveBoth: "Save both transactions",
    saveMultiple: "Save transactions",
    saveAndCont: "Save and continue",
    saveAndCont2: "Save & continue",
    saveAndAddGaurantor: "Save & add loan guarantor",
    loanAgreementUrl: "/C1_LOAN_AGREEMENT",
    addGuarantorUrl: "/C2_LOAN_GUARANTOR",
    createSubTransaction: "create-sub-transaction",
    addLoansAndDebts: "Add loans and debts",
    editReport: "Edit report",
    loans: "LOANS",
    loanByCommittee: "Loan By Committee",
    loanFromBank: "Loan Received from Bank",
    loanMade: "Loan Made",
    loanPaymentRecieved: "Loan Repayment Received",
    loanPaymentRecievedUrl: "LOAN_REPAYMENT_RECEIVED",
    makeLoanPayment: "Make loan repayment",
    makeLoanPaymentUrl: "LOAN_REPAYMENT_MADE",
    madeLoanPayment: "Loan Repayment Made",
    recieveLoanPayment: "Receive loan repayment",
    buttonLoansAndDebts: "loans-and-debts-button",
    reviewLoan: "Review loan agreement",
    newLoanAgreement: "New loan agreement",
    debts: "DEBTS",
    debtOwedByCommittee: "Debt Owed By Committee",
    debtOwedToCommittee: "Debt Owed To Committee",
    addDisbursement: "Add a disbursement",
    federalElectionActivityExpenditures: "FEDERAL ELECTION ACTIVITY EXPENDITURES",
    percentFedElectionActivity: "100% Federal Election Activity Payment",
    lookup: "LOOKUP",
    independantExpenditures: "INDEPENDENT EXPENDITURES",
    independantExpenditureVoid: "Independent Expenditure - Void",
    cashOnHandLink: "Cash on hand",
    submitReportLink: "SUBMIT YOUR REPORT",
    submitReport: "Submit report"
  }
