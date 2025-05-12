import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportTypes } from 'app/shared/models/report.model';
import { ContactService } from 'app/shared/services/contact.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { CountryCodeLabels, LabelList, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { ConfirmationService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { TableLazyLoadEvent } from 'primeng/table';
import { takeUntil } from 'rxjs';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
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
import { DestroyerComponent } from '../app-destroyer.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { CandidateOfficeInputComponent } from '../inputs/candidate-office-input/candidate-office-input.component';
import { TableComponent } from '../table/table.component';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';

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
    ReactiveFormsModule,
    ContactLookupComponent,
    InputText,
    ErrorMessagesComponent,
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
export class ContactDialogComponent extends DestroyerComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly transactionService = inject(TransactionService);
  protected readonly confirmationService = inject(ConfirmationService);
  public readonly router = inject(Router);

  readonly contact = input<Contact>(new Contact());
  readonly fixedContactType = input<ContactTypes | null>(null);
  readonly detailVisible = model.required<boolean>();
  readonly showHistory = input(false);
  readonly headerTitle = input<string>();
  readonly defaultCandidateOffice = input<CandidateOfficeTypes>();

  readonly contactSaved = output<Contact>();

  readonly contactTypeOptions = computed(() => {
    if (this.fixedContactType()) {
      return LabelUtils.getPrimeOptions(ContactTypeLabels, [this.fixedContactType()!]);
    } else if (this.isNewItem()) {
      return LabelUtils.getPrimeOptions(ContactTypeLabels);
    } else {
      return LabelUtils.getPrimeOptions(ContactTypeLabels, [this.contact().type]);
    }
  });

  transactions: TransactionData[] = [];
  tableLoading = true;
  totalTransactions = 0;
  readonly rowsPerPage = signal(5);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
  );

  readonly contactLookup = viewChild.required(ContactLookupComponent);

  readonly form: FormGroup = this.fb.group(
    SchemaUtils.getFormGroupFields([
      ...new Set([
        ...SchemaUtils.getSchemaProperties(contactIndividualSchema),
        ...SchemaUtils.getSchemaProperties(contactCandidateSchema),
        ...SchemaUtils.getSchemaProperties(contactCommitteeSchema),
        ...SchemaUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ]),
    { updateOn: 'blur' },
  );
  formSubmitted = false;

  readonly isNewItem = computed(() => !this.contact().id);
  readonly selectedContactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);

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
  candidateDistrictOptions: PrimeOptions = [];
  emptyMessage = 'No data available in table';

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Report' },
    { field: 'date', label: 'Date' },
    { field: 'amount', label: 'Amount' },
  ];

  pagerState?: TableLazyLoadEvent;

  readonly contactTypeEnabled = computed(() => this.isNewItem());
  readonly headerText = computed(() => this.headerTitle() ?? (this.isNewItem() ? 'Add Contact' : 'Edit Contact'));
  readonly isCandidate = computed(() => this.selectedContactType() === ContactTypes.CANDIDATE);
  readonly isIndividual = computed(() => this.selectedContactType() === ContactTypes.INDIVIDUAL);
  readonly isCommittee = computed(() => this.selectedContactType() === ContactTypes.COMMITTEE);
  readonly isOrganization = computed(() => this.selectedContactType() === ContactTypes.ORGANIZATION);
  readonly params = computed(() => {
    return { page_size: this.rowsPerPage(), contact: this.contact().id ?? '' };
  });

  constructor() {
    super();

    effect(() => {
      const rows = this.rowsPerPage();
      untracked(() => {
        this.loadTransactions({
          first: 0,
          rows,
        });
      });
    });

    effect(() => {
      const contact = this.contact();
      if (contact.candidate_id || contact.committee_id) this.form.patchValue(contact);
    });

    effect(() => {
      if (this.fixedContactType()) this.selectedContactType.set(this.fixedContactType()!);
    });

    // When selected contact type changes, update form
    effect(() => {
      const type = this.selectedContactType();
      untracked(() => {
        this.form.reset();
        // The type form control is not displayed on the form page because we are
        // displaying the contact lookup component which operates independently, so
        // we keep the 'type' value on the contact dialog form up-to-date in the background.
        this.form.get('type')?.setValue(type);

        const schema = ContactService.getSchemaByType(type);
        SchemaUtils.addJsonSchemaValidators(this.form, schema, true);
        switch (type) {
          case ContactTypes.CANDIDATE:
            this.form.get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact().id));
            break;
          case ContactTypes.COMMITTEE:
            this.form.get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact().id));
            break;
        }
        this.form.updateValueAndValidity();
      });
    });

    // effect(() => {
    //   const contact = this.contact();
    //   // this.contactType = contact.type;

    //   this.form.patchValue(contact);
    // });
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

  ngOnInit(): void {
    this.form
      ?.get('country')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value !== 'USA') {
          this.form.patchValue({
            state: 'ZZ',
          });
          // ajv does not un-require zip when country is not USA
          this.form.patchValue({ zip: this.form.get('zip')?.value ?? '' });
          this.form.get('state')?.disable();
        } else {
          this.form.patchValue({ zip: this.form.get('zip')?.value ?? null });
          this.form.get('state')?.enable();
        }
      });

    this.form
      ?.get('candidate_state')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });

    // If there is a default candidate office (e.g. 'P') set, then make the
    // candidate office select read-only disabled.
    if (this.defaultCandidateOffice()) {
      this.form.get('candidate_office')?.disable();
    }
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  public openDialog() {
    this.resetForm();
    this.form.patchValue(this.contact());
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisible.set(false);
    }
  }

  private resetForm() {
    this.form.reset();
    this.form.get('country')?.setValue(this.countryOptions[0]['value']);
    this.form.get('state')?.setValue(null);
    if (this.defaultCandidateOffice()) {
      this.form.get('candidate_office')?.setValue(this.defaultCandidateOffice());
    }
    this.formSubmitted = false;
  }

  public confirmPropagation() {
    const changes = Object.entries(this.form.controls)
      .map(([field, control]: [string, AbstractControl]) => {
        const contactValue = this.contact()[field as keyof Contact];
        if (control?.value !== contactValue) {
          return [field, control.value];
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
    blurActiveInput(this.form);
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const contact = Contact.fromJSON({
      ...this.contact(),
      ...SchemaUtils.getFormValues(this.form, ContactService.getSchemaByType(this.selectedContactType())),
    });

    this.contactSaved.emit(contact);

    if (closeDialog) {
      this.closeDialog();
    }
    this.resetForm();
  }

  async openTransaction(transaction: TransactionData) {
    await this.router.navigate([`reports/transactions/report/${transaction.report_ids[0]}/list/${transaction.id}`]);
  }
}
