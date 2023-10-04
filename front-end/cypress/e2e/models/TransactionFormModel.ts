import { currentYear, PageUtils } from "../pages/pageUtils";

export class ScheduleFormData {
    amount: number;
    category_code: string;
    date_received: Date | undefined;
    electionType: string | undefined; // electionType and electionYear are composite form data for election_code
    electionYear: number | undefined;
    election_other_description: string;
    memo_code: boolean;
    memo_text: string;
    purpose_description: string | undefined;

    constructor(formData: ScheduleFormData) {
        this.amount = formData.amount;
        this.category_code = formData.category_code;
        this.date_received = formData.date_received;
        this.electionType = formData.electionType;
        this.electionYear = formData.electionYear;
        this.election_other_description = formData.election_other_description;
        this.purpose_description = formData.purpose_description;
        this.memo_code = formData.memo_code;
        this.memo_text = formData.memo_text;
    }
};

export const defaultScheduleFormData: ScheduleFormData = {
    amount: 100.55,
    category_code: '',
    date_received: new Date(currentYear, 4 - 1, 27),
    electionType: 'G',
    electionYear: 2022,
    election_other_description: '',
    purpose_description: PageUtils.randomString(20),
    memo_code: false,
    memo_text: PageUtils.randomString(20),
};

export class LoanFormData extends ScheduleFormData {
    authorized_first_name: string;
    authorized_last_name: string;
    authorized_title: string;
    collateral: string;
    date_incurred: Date | undefined;
    date_signed: Date | undefined;
    due_date: Date | undefined;
    due_date_setting: string | undefined;
    first_name: string;
    future_income: string;
    interest_rate_setting: string | undefined;
    interest_rate: number | undefined;
    last_name: string;
    line_of_credit: string;
    loan_restructured: string;
    others_liable: string;
    secured: string | undefined;
    
    constructor(formData: LoanFormData) {
        super(formData);
        this.authorized_first_name = formData.authorized_first_name;
        this.authorized_last_name = formData.authorized_last_name;
        this.authorized_title = formData.authorized_title;
        this.collateral = formData.collateral;   
        this.date_incurred = formData.date_incurred;
        this.date_signed = formData.date_signed;
        this.due_date = formData.due_date;
        this.due_date_setting = formData.due_date_setting;
        this.first_name = formData.first_name;
        this.future_income = formData.future_income;
        this.interest_rate_setting = formData.interest_rate_setting;
        this.interest_rate = formData.interest_rate;
        this.last_name = formData.last_name;
        this.loan_restructured = formData.loan_restructured;
        this.line_of_credit = formData.line_of_credit;
        this.others_liable = formData.others_liable;
        this.purpose_description = formData.purpose_description;
        this.secured = formData.secured;
    }
}

export class DebtFormData extends LoanFormData {
    constructor(formData: LoanFormData) {
        super(formData);
    }
}

export const defaultDebtFormData: DebtFormData = {
    amount: 60000,
    authorized_first_name: "",
    authorized_last_name: "",
    authorized_title: "",
    category_code: "",
    collateral: "",
    date_incurred: undefined,
    date_received: undefined,
    date_signed: undefined,
    due_date: undefined,
    due_date_setting: "",
    electionType: undefined,
    electionYear: undefined,
    election_other_description: "",
    first_name: "",
    future_income: "",
    interest_rate_setting: "",
    interest_rate: undefined,
    last_name: "",
    line_of_credit: "",
    loan_restructured: "",
    memo_code: false,
    memo_text: "",
    others_liable: "",
    purpose_description: PageUtils.randomString(20),
    secured: undefined,
    
}

export const defaultLoanFormData: LoanFormData = {
    amount: 60000,
    authorized_first_name: PageUtils.randomString(6),
    authorized_last_name: PageUtils.randomString(6),
    authorized_title: PageUtils.randomString(6),
    category_code: '',
    collateral: "NO",
    date_incurred: new Date(currentYear, 4 - 1, 27),
    date_received: new Date(currentYear, 4 - 1, 27),
    date_signed: new Date(currentYear, 4 - 1, 27),
    due_date: new Date(currentYear, 4 - 1, 27),
    due_date_setting: "Enter a specific date",
    electionType: undefined,
    electionYear: undefined,
    election_other_description: '',
    first_name: PageUtils.randomString(6),
    future_income: "NO",
    interest_rate_setting: "Enter an exact percentage",
    interest_rate: 2.3,
    last_name: PageUtils.randomString(6),
    line_of_credit: "NO",
    loan_restructured: "NO",
    memo_code: false,
    memo_text: PageUtils.randomString(20),
    others_liable: "NO",
    purpose_description: PageUtils.randomString(20),
    secured: "YES"
}

export const formTransactionDataForSchedule: ScheduleFormData = {
    ...defaultLoanFormData,
    ...{
      amount: 200.01,
      category_code: '005 Polling Expenses',
      date_incurred: undefined,
      due_date_setting: undefined,
      interest_rate_setting: undefined,
      secured: undefined,
      
    },
  };