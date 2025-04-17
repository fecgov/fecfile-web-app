import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportTypes } from 'app/shared/models/report.model';
import { QueryParams } from 'app/shared/services/api.service';
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
import { FormComponent } from '../app-destroyer.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { CandidateOfficeInputComponent } from '../inputs/candidate-office-input/candidate-office-input.component';
import { TableComponent } from '../table/table.component';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { effectOnceIf } from 'ngxtension/effect-once-if';

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
export class ContactDialogComponent extends FormComponent {
  private readonly contactService = inject(ContactService);
  private readonly transactionService = inject(TransactionService);
  protected readonly confirmationService = inject(ConfirmationService);
  public readonly router = inject(Router);
  readonly ContactTypes = ContactTypes;

  readonly contact = model<Contact>();
  readonly contactTypeOptions = model<PrimeOptions>(LabelUtils.getPrimeOptions(ContactTypeLabels));
  readonly detailVisible = model(false);
  readonly showHistory = input(false);
  readonly headerTitle = input<string>();
  readonly defaultCandidateOffice = input<CandidateOfficeTypes>();

  readonly detailVisibleChange = output<boolean>();
  readonly savedContact = output<Contact>();

  transactions: TransactionData[] = [];
  tableLoading = true;
  totalTransactions = 0;
  rowsPerPage = 5;
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
  );

  readonly contactLookup = viewChild.required<ContactLookupComponent>(ContactLookupComponent);

  form = signal<FormGroup>(
    this.fb.group(
      SchemaUtils.getFormGroupFields(this.injector, [
        ...new Set([
          ...SchemaUtils.getSchemaProperties(contactIndividualSchema),
          ...SchemaUtils.getSchemaProperties(contactCandidateSchema),
          ...SchemaUtils.getSchemaProperties(contactCommitteeSchema),
          ...SchemaUtils.getSchemaProperties(contactOrganizationSchema),
        ]),
      ]),
      { updateOn: 'blur' },
    ),
  );

  isNewItem = true;
  protected readonly contactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);

  readonly candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly stateOptions = signal(LabelUtils.getPrimeOptions(StatesCodeLabels));
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
  readonly candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  dialogVisible = false; // We need to hide dialog manually so dynamic layout changes are not visible to the user
  emptyMessage = 'No data available in table';

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Report' },
    { field: 'date', label: 'Date' },
    { field: 'amount', label: 'Amount' },
  ];

  pagerState?: TableLazyLoadEvent;

  async loadTransactions(event: TableLazyLoadEvent) {
    this.tableLoading = true;

    // event is undefined when triggered from the detail page because
    // the detail doesn't know what page we are on. We check the local
    // pagerState variable to retrieve the page state.
    if (!!event && 'first' in event) {
      this.pagerState = event;
    } else {
      event = this.pagerState
        ? this.pagerState
        : {
            first: 0,
            rows: this.rowsPerPage,
          };
    }

    // Calculate the record page number to retrieve from the API.
    const first: number = event.first ?? 0;
    const rows: number = event.rows ?? this.rowsPerPage;
    const pageNumber: number = Math.floor(first / rows) + 1;
    const params = this.getParams();

    // Determine query sort ordering
    let ordering: string | string[] = event.sortField ? event.sortField : '';
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

  constructor() {
    super();
    effect(() => {
      const value = this.getControl('country')?.valueChangeSignal();
      if (value !== 'USA') {
        this.form().patchValue({
          state: 'ZZ',
        });
        // ajv does not un-require zip when country is not USA
        this.form().patchValue({ zip: this.form().get('zip')?.value || '' });
        this.form().get('state')?.disable();
      } else {
        this.form().patchValue({ zip: this.form().get('zip')?.value || null });
        this.form().get('state')?.enable();
      }
    });

    // If there is a default candidate office (e.g. 'P') set, then make the
    // candidate office select read-only disabled.
    effectOnceIf(
      () => this.defaultCandidateOffice() && this.form().get('candidate_office'),
      () => {
        this.form().get('candidate_office')?.disable();
      },
    );

    effectOnceIf(
      () => this.contactType() && this.contactTypeOptions(),
      () => this.contactTypeChanged(this.contactType()),
    );
  }
  /**
   * On ngOnInit and when a user changes the selection of the ContactType for the contact
   * entry form (as known by the emitter from the contact-lookup component), update the necessary
   * FormControl elements for the ContactType selected by the user.
   * @param contactType
   */
  contactTypeChanged(contactType: ContactTypes) {
    if (!this.contactTypeOptions().find((opt) => opt.value === contactType)) return;
    this.contactType.set(contactType);
    if (!this.contact()) this.contact.set(new Contact());

    // The type form control is not displayed on the form page because we are
    // displaying the contact lookup component which operates independently, so
    // we keep the 'type' value on the contact dialog form up-to-date in the background.
    this.form().get('type')?.setValue(contactType);

    const schema = ContactService.getSchemaByType(contactType);
    SchemaUtils.addJsonSchemaValidators(this.form(), schema, true);
    switch (contactType) {
      case ContactTypes.CANDIDATE:
        this.form().get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact()?.id));
        break;
      case ContactTypes.COMMITTEE:
        this.form().get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact()?.id));
        break;
    }
    this.form().updateValueAndValidity();

    // Clear out non-schema form values
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const schemaProperties: string[] = SchemaUtils.getSchemaProperties(schema);
    Object.keys(this.form().controls).forEach((property: string) => {
      if (!schemaProperties.includes(property)) {
        formValues[property] = null;
      }
    });
    this.form().patchValue(formValues);

    if (contactType === ContactTypes.CANDIDATE) {
      this.stateOptions.set(LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary()));
    } else {
      this.stateOptions.set(LabelUtils.getPrimeOptions(StatesCodeLabels));
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
    this.form().patchValue(this.contact()!);
    this.contactType.set(this.contactTypeOptions()[0].value as ContactTypes);
    if (this.contact()?.id) {
      this.isNewItem = false;
      // Update the value of the Contact Type select box in the Contact Lookup
      // component because the Contact Dialog is hidden and not destroyed on close,
      // so we need to directly update the lookup "type" form control value
      this.contactLookup().contactTypeFormControl.setValue(this.contact()?.type);
      this.contactLookup().contactTypeFormControl.enable();
    } else if (this.contactTypeOptions.length === 1) {
      this.contactLookup().contactTypeFormControl.enable();
    }
    this.dialogVisible = true;
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.detailVisible.set(false);
      this.dialogVisible = false;
    }
  }

  readonly showSearchBox = computed(() => this.isCand() || this.isCom());

  private resetForm() {
    this.form().reset();
    this.form().get('country')?.setValue(this.countryOptions[0]['value']);
    this.form().get('state')?.setValue(null);
    this.isNewItem = true;
    this.contactLookup().contactTypeFormControl.enable();
    this.contactLookup().contactTypeFormControl.setValue(this.contactType());
    if (this.defaultCandidateOffice) {
      this.form().get('candidate_office')?.setValue(this.defaultCandidateOffice);
    }
    this.formSubmitted = false;
  }

  updateContact(contact: Contact) {
    this.contact.set(contact);
    this.contactType.set(contact.type);
    this.contactTypeOptions.set(
      LabelUtils.getPrimeOptions(ContactTypeLabels).filter((opt) => opt.value === contact.type),
    );
    this.form().patchValue(contact);
  }

  public confirmPropagation() {
    const contact = this.contact();
    if (!contact) return;
    const changes = Object.entries(this.form().controls)
      .map(([field, control]: [string, AbstractControl]) => {
        const contactValue = contact[field as keyof Contact];
        if (control?.value !== contactValue) {
          return [field, control.value];
        }
        return undefined;
      })
      .filter((change) => !!change) as [string, any][]; // eslint-disable-line @typescript-eslint/no-explicit-any
    const changesMessage = TransactionContactUtils.getContactChangesMessage(contact, changes);
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
    blurActiveInput(this.form());
    this.form().updateValueAndValidity();
    if (this.form().invalid) {
      return;
    }

    const contact: Contact = Contact.fromJSON({
      ...this.contact(),
      ...SchemaUtils.getFormValues(this.form(), ContactService.getSchemaByType(this.contactType())),
    });
    contact.type = this.contactType()!;
    this.savedContact.emit(contact);

    if (closeDialog) {
      this.closeDialog();
    }
    this.resetForm();
  }

  async openTransaction(transaction: TransactionData) {
    await this.router.navigate([`reports/transactions/report/${transaction.report_ids[0]}/list/${transaction.id}`]);
  }

  onRowsPerPageChange(rowsPerPage: number) {
    this.rowsPerPage = rowsPerPage;
    this.loadTransactions({
      first: 0,
      rows: this.rowsPerPage,
    });
  }

  getParams(): QueryParams {
    return { page_size: this.rowsPerPage, contact: this.contact()?.id ?? '' };
  }

  readonly isCom = computed(() => this.contactType() === ContactTypes.COMMITTEE);
  readonly isInd = computed(() => this.contactType() === ContactTypes.INDIVIDUAL);
  readonly isCand = computed(() => this.contactType() === ContactTypes.CANDIDATE);
  readonly isOrg = computed(() => this.contactType() === ContactTypes.ORGANIZATION);
}
