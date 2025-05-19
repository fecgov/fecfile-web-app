import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportTypes } from 'app/shared/models/report.model';
import { CountryCodeLabels, LabelList, LabelUtils, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent } from 'primeng/table';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  emptyContact,
} from '../../models/contact.model';
import { ScheduleATransactionTypeLabels } from '../../models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from '../../models/schb-transaction.model';
import { ScheduleCTransactionTypeLabels } from '../../models/schc-transaction.model';
import { ScheduleC1TransactionTypeLabels } from '../../models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from '../../models/schc2-transaction.model';
import { ScheduleDTransactionTypeLabels } from '../../models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from '../../models/sche-transaction.model';
import { LabelPipe } from '../../pipes/label.pipe';
import { getReportFromJSON } from '../../services/report.service';
import { TransactionService } from '../../services/transaction.service';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { CandidateOfficeInputComponent } from '../inputs/candidate-office-input/candidate-office-input.component';
import { TableComponent } from '../table/table.component';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SignalErrorMessagesComponent } from '../signal-error-messages/signal-error-messages.component';
import { SignalForm, SignalControl } from 'app/shared/models/signal-form';

export class TransactionData {
  id: string;
  report_ids: string[];
  form_type = '';
  report_code_label = '';
  transaction_type_identifier: string;
  date: string;
  amount: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(transaction: any) {
    this.id = transaction.id;
    this.report_ids = transaction.report_ids;
    this.date = transaction.date;
    this.amount = transaction.amount;
    this.transaction_type_identifier = transaction.transaction_type_identifier;

    transaction.reports.forEach((r: JSON) => {
      const report = getReportFromJSON(r);
      if (report.report_type === ReportTypes.F24) return; // We will display the Form 3X version of the transaction #1977
      this.form_type = report.formLabel;
      this.report_code_label = report.report_code_label ?? '';
    });
  }
}

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  imports: [
    Dialog,
    FormsModule,
    ContactLookupComponent,
    InputText,
    SignalErrorMessagesComponent,
    Select,
    FecInternationalPhoneInputComponent,
    CandidateOfficeInputComponent,
    TableComponent,
    ButtonDirective,
    Ripple,
    ConfirmDialog,
    CurrencyPipe,
    DatePipe,
    LabelPipe,
  ],
})
export class ContactDialogComponent {
  private readonly transactionService = inject(TransactionService);
  protected readonly confirmationService = inject(ConfirmationService);
  public readonly router = inject(Router);
  readonly ContactTypes = ContactTypes;
  readonly contact = model<Contact>(new Contact());

  readonly detailVisible = model.required<boolean>();
  readonly showHistory = input(false);
  readonly headerTitle = input<string>();
  readonly defaultCandidateOffice = input<CandidateOfficeTypes>();

  readonly savedContact = output<Contact>();

  readonly fixedContactType = input<ContactTypes | null>(null);
  readonly contactTypeOptions = computed(() => {
    if (this.fixedContactType()) {
      return LabelUtils.getPrimeOptions(ContactTypeLabels, [this.fixedContactType()!]);
    } else if (this.isNewItem()) {
      return LabelUtils.getPrimeOptions(ContactTypeLabels);
    } else {
      return LabelUtils.getPrimeOptions(ContactTypeLabels, [this.contact().type]);
    }
  });

  readonly schema = computed(() => {
    switch (this.selectedContactType()) {
      case ContactTypes.INDIVIDUAL:
        return contactIndividualSchema;
      case ContactTypes.CANDIDATE:
        return contactCandidateSchema;
      case ContactTypes.COMMITTEE:
        return contactCommitteeSchema;
      case ContactTypes.ORGANIZATION:
        return contactOrganizationSchema;
    }
  });

  readonly form = new SignalForm({
    candidate_id: new SignalControl('candidate_id'),
    committee_id: new SignalControl('committee_id'),
    name: new SignalControl('name'),
    last_name: new SignalControl('last_name'),
    first_name: new SignalControl('first_name'),
    middle_name: new SignalControl('middle_name'),
    prefix: new SignalControl('prefix'),
    suffix: new SignalControl('suffix'),
    country: new SignalControl('country'),
    street_1: new SignalControl('street_1'),
    street_2: new SignalControl('street_2'),
    city: new SignalControl('city'),
    state: new SignalControl('state'),
    zip: new SignalControl('zip'),
    telephone: new SignalControl('telephone'),
    employer: new SignalControl('employer'),
    occupation: new SignalControl('occupation'),
    candidate_office: new SignalControl('candidate_office'),
    candidate_state: new SignalControl('candidate_state'),
    candidate_district: new SignalControl('candidate_district'),
  });

  transactions: TransactionData[] = [];
  tableLoading = true;
  totalTransactions = 0;
  readonly first = signal(0);
  readonly rowsPerPage = signal(5);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
  );

  formSubmitted = false;

  readonly isNewItem = computed(() => !this.contact().id);

  readonly candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly stateOptions = computed(() => {
    if (this.selectedContactType() === ContactTypes.CANDIDATE) {
      return LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
    } else {
      return LabelUtils.getPrimeOptions(StatesCodeLabels);
    }
  });
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
  readonly candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  readonly candidateDistrictOptions = computed(() => {
    const state = this.form.controls['candidate_state'].value();
    if (!!state && this.form.controls['candidate_office'].value() === CandidateOfficeTypes.HOUSE) {
      return LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state));
    } else {
      return [];
    }
  });
  emptyMessage = 'No data available in table';

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Report' },
    { field: 'date', label: 'Date' },
    { field: 'amount', label: 'Amount' },
  ];

  pagerState?: TableLazyLoadEvent;

  readonly selectedContactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly headerText = computed(() => this.headerTitle() ?? (this.isNewItem() ? 'Add Contact' : 'Edit Contact'));
  readonly isCandidate = computed(() => this.selectedContactType() === ContactTypes.CANDIDATE);
  readonly isIndividual = computed(() => this.selectedContactType() === ContactTypes.INDIVIDUAL);
  readonly isCommittee = computed(() => this.selectedContactType() === ContactTypes.COMMITTEE);
  readonly isOrganization = computed(() => this.selectedContactType() === ContactTypes.ORGANIZATION);
  readonly params = computed(() => {
    return { page_size: this.rowsPerPage(), contact: this.contact().id ?? '' };
  });

  constructor() {
    effect(() => {
      const schema = this.schema();
      Object.values(this.form.controls).forEach((control) => control.schema.set(schema));
    });
    effect(() => {
      this.loadTransactions({
        first: 0,
        rows: this.rowsPerPage(),
      });
    });

    effect(() => {
      const type = this.selectedContactType();
      untracked(() => {
        if (!this.fixedContactType()) this.contact.set(emptyContact(type));
      });
    });

    effect(() => {
      const contact = this.contact();
      Object.entries(this.form.controls).forEach(([name, control]) => {
        const value = contact[name as keyof Contact] as string;
        control.value.set(value ?? null);
      });
    });

    effect(() => {
      const fixed = this.fixedContactType();
      untracked(() => {
        if (fixed != null) {
          this.selectedContactType.set(fixed);
        } else {
          this.selectedContactType.set(this.contactTypeOptions()[0].value as ContactTypes);
        }
      });
    });

    effect(() => {
      const country = this.form.controls['country'].value();
      if (country !== 'USA') {
        this.form.controls['state'].value.set('ZZ');
        this.form.controls['state'].disabled.set(true);
        this.form.controls['zip'].value.update((zip) => zip ?? '');
      } else {
        this.form.controls['zip'].value.update((zip) => zip ?? null);
        this.form.controls['state'].disabled.set(false);
      }
    });
    effect(() => {
      this.form.controls['candidate_office'].disabled.set(!!this.defaultCandidateOffice());
    });
  }

  async loadTransactions(event: TableLazyLoadEvent) {
    this.tableLoading = true;

    // event is undefined when triggered from the detail page because
    // the detail doesn't know what page we are on. We check the local
    // pagerState variable to retrieve the page state.
    if (!!event && 'first' in event) {
      this.pagerState = event;
    } else {
      event = this.pagerState ?? {
        first: 0,
        rows: this.rowsPerPage(),
      };
    }

    // Calculate the record page number to retrieve from the API.
    const first: number = event.first ?? 0;
    const rows: number = event.rows ?? this.rowsPerPage();
    const pageNumber: number = Math.floor(first / rows) + 1;
    const params = this.params();

    // Determine query sort ordering
    let ordering: string | string[] = event.sortField ?? '';
    if (ordering && event.sortOrder === -1) {
      ordering = `-${ordering}`;
    } else {
      ordering = `${ordering}`;
    }

    try {
      const transactionsPage = await this.transactionService.getTableData(pageNumber, ordering, params);
      this.transactions = transactionsPage.results.map((t) => new TransactionData(t));
      this.totalTransactions = transactionsPage.count;
      this.tableLoading = false;
      this.emptyMessage = 'No data available in table';
    } catch {
      this.tableLoading = false;
      this.emptyMessage = 'Error loading transactions for contact';
    }
  }

  private resetForm() {
    const defaultCandidateOffice = this.defaultCandidateOffice();
    Object.entries(this.form.controls).forEach(([key, control]) => {
      if (key === 'country') control.reset(this.countryOptions[0]['value']);
      else if (key === 'candidate_office' && defaultCandidateOffice) control.reset(defaultCandidateOffice);
      else control.reset();
    });

    this.formSubmitted = false;
  }

  public confirmPropagation() {
    const changes = Object.entries(this.form)
      .map(([field, control]: [string, SignalControl]) => {
        const contactValue = this.contact()[field as keyof Contact];
        if (control.value() !== contactValue) {
          return [field, control.value()];
        }
        return undefined;
      })
      .filter((change) => !!change) as [string, any][]; // eslint-disable-line @typescript-eslint/no-explicit-any
    const changesMessage = TransactionContactUtils.getContactChangesMessage(this.contact(), changes);
    this.confirmationService.confirm({
      key: 'contactDialogDialog',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      message: changesMessage,
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
      accept: () => {
        this.saveContact();
      },
    });
  }

  public saveContact(closeDialog = true) {
    this.formSubmitted = true;
    // blurActiveInput(this.form);
    // this.form.updateValueAndValidity();
    if (this.form.controls['telephone'].value() === '') this.form.controls['telephone'].value.set(null);
    if (!this.form.valid()) {
      Object.entries(this.form.controls).forEach(([prop, control]) => {
        if (!control.valid()) {
          console.log(prop);
        }
      });
      return;
    }

    const json: any = { type: this.selectedContactType() };
    Object.entries(this.form.controls).forEach(([prop, control]) => {
      json[prop] = control.value();
    });
    const contact = Contact.fromJSON(json);
    this.savedContact.emit(contact);

    if (closeDialog) {
      this.detailVisible.set(false);
    }
    this.resetForm();
  }

  async openTransaction(transaction: TransactionData) {
    await this.router.navigate([`reports/transactions/report/${transaction.report_ids[0]}/list/${transaction.id}`]);
  }

  validate(control: SignalControl) {
    control.dirty.set(true);
    control.validate();
  }
}
