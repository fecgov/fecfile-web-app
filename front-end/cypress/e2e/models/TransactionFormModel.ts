import { currentYear, PageUtils } from "../pages/pageUtils";

export class ScheduleFormData {
    date_received: Date | undefined;
    memo_code: boolean;
    amount: number;
    electionType: string | undefined; // electionType and electionYear are composite form data for election_code
    electionYear: number | undefined;
    election_other_description: string;
    purpose_description: string;
    memo_text: string;
    category_code: string;

    constructor(formData: ScheduleFormData) {
        this.date_received = formData.date_received;
        this.memo_code = formData.memo_code;
        this.memo_text = formData.memo_text;
        this.amount = formData.amount;
        this.electionType = formData.electionType;
        this.electionYear = formData.electionYear;
        this.election_other_description = formData.election_other_description;
        this.purpose_description = formData.purpose_description;
        this.category_code = formData.category_code;
    }
};

export const defaultFormData: ScheduleFormData = {
    date_received: new Date(currentYear, 4 - 1, 27),
    memo_code: false,
    amount: 100.55,
    electionType: 'G',
    electionYear: 2022,
    election_other_description: '',
    purpose_description: PageUtils.randomString(20),
    memo_text: PageUtils.randomString(20),
    category_code: '',
};



export class LoanFormData extends ScheduleFormData {
    date_incurred: Date | undefined;
    due_date: Date | undefined;
    due_date_setting: string;
    interest_rate_setting: string;
    interest_rate: number | undefined;
    secured: string | undefined;
    loan_restructured: string;
    line_of_credit: string;
    others_liable: string;
    collateral: string;
    future_income: string;
    first_name: string;
    last_name: string;
    date_signed: Date | undefined;
    authorized_first_name: string;
    

    constructor(formData: LoanFormData) {
        super(formData);
        this.date_incurred = formData.date_incurred;
        this.due_date = formData.due_date;
        this.due_date_setting = formData.due_date_setting;
        this.interest_rate_setting = formData.interest_rate_setting;
        this.interest_rate = formData.interest_rate;
        this.secured = formData.secured;
        this.loan_restructured = formData.loan_restructured;
        this.line_of_credit = formData.line_of_credit;
        this.others_liable = formData.others_liable;
        this.collateral = formData.collateral;
        this.future_income = formData.future_income;
        this.first_name = formData.first_name;
        this.last_name = formData.last_name;
        this.date_signed = formData.date_signed;
        this.authorized_first_name = formData.authorized_first_name;
        this.purpose_description = formData.purpose_description;
    }
}

export class DebtFormData extends LoanFormData {
   constructor(formData: LoanFormData) {
    super(formData);
   }
}

export const defaultDebtFormData: DebtFormData = {
    date_incurred: undefined,
    due_date: undefined,
    due_date_setting: "",
    interest_rate_setting: "",
    interest_rate: undefined,
    secured: undefined,
    loan_restructured: "",
    line_of_credit: "",
    others_liable: "",
    collateral: "",
    future_income: "",
    first_name: "",
    last_name: "",
    date_signed: undefined,
    authorized_first_name: "",
    date_received: undefined,
    memo_code: false,
    amount: 60000,
    electionType: undefined,
    electionYear: undefined,
    election_other_description: "",
    purpose_description: PageUtils.randomString(20),
    memo_text: "",
    category_code: ""
}

export const defaultLoanFormData: LoanFormData = {
    date_received:  undefined,
    date_incurred: new Date(currentYear, 4 - 1, 27),
    due_date: new Date(currentYear, 4 - 1, 27),
    due_date_setting: "Enter a specific date",
    interest_rate_setting: "Enter an exact percentage",
    interest_rate: 2.3,
    loan_restructured: "NO",
    secured: "YES",
    line_of_credit: "NO",
    others_liable: "NO",
    collateral: "NO",
    memo_code: false,
    amount: 60000,
    electionType: undefined,
    electionYear: undefined,
    election_other_description: '',
    purpose_description: PageUtils.randomString(20),
    memo_text: PageUtils.randomString(20),
    category_code: '',
    future_income: "NO",
    last_name: PageUtils.randomString(6),
    first_name: PageUtils.randomString(6),
    authorized_first_name: PageUtils.randomString(6),
    date_signed: new Date(currentYear, 4 - 1, 27)
};