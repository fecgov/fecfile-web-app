import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { CountryCodeLabels, LabelList, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { lastValueFrom, takeUntil } from 'rxjs';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
} from '../../models/contact.model';
import { DestroyerComponent } from '../app-destroyer.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { ConfirmationService } from 'primeng/api';
import { ScheduleATransactionTypeLabels } from '../../models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from '../../models/schb-transaction.model';
import { ScheduleC1TransactionTypeLabels } from '../../models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from '../../models/schc2-transaction.model';
import { ScheduleCTransactionTypeLabels } from '../../models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from '../../models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from '../../models/sche-transaction.model';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { getReportFromJSON } from '../../services/report.service';
import { ReportTypes } from 'app/shared/models/report.model';
import { QueryParams } from 'app/shared/services/api.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';

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
})
export class ContactDialogComponent extends DestroyerComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() detailVisible = false;
  @Input() showHistory = false;
  @Input() headerTitle?: string;
  @Input() defaultCandidateOffice?: CandidateOfficeTypes;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() savedContact: EventEmitter<Contact> = new EventEmitter<Contact>();

  transactions: TransactionData[] = [];
  tableLoading = true;
  totalTransactions = 0;
  rowsPerPage = 5;
  scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
  );

  @ViewChild(ContactLookupComponent) contactLookup!: ContactLookupComponent;

  form: FormGroup = this.fb.group(
    SchemaUtils.getFormGroupFields([
      ...new Set([
        ...SchemaUtils.getSchemaProperties(contactIndividualSchema),
        ...SchemaUtils.getSchemaProperties(contactCandidateSchema),
        ...SchemaUtils.getSchemaProperties(contactCommitteeSchema),
        ...SchemaUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ]),
  );
  formSubmitted = false;

  isNewItem = true;
  contactType = ContactTypes.INDIVIDUAL;
  ContactTypes = ContactTypes;
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];
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

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private transactionService: TransactionService,
    protected confirmationService: ConfirmationService,
    public router: Router,
  ) {
    super();
  }

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
      const transactionsPage = await lastValueFrom(this.transactionService.getTableData(pageNumber, ordering, params));
      this.transactions = transactionsPage.results.map((t) => new TransactionData(t));
      this.totalTransactions = transactionsPage.count;
      this.tableLoading = false;
      this.emptyMessage = 'No data available in table';
    } catch (error) {
      this.tableLoading = false;
      this.emptyMessage = 'Error loading transactions for contact';
    }
  }

  ngOnInit(): void {
    if (this.contactTypeOptions.length === 0) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    }
    this.contactType = this.contactTypeOptions[0].value as ContactTypes;
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get('country')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value !== 'USA') {
          this.form.patchValue({
            state: 'ZZ',
          });
          // ajv does not un-require zip when country is not USA
          this.form.patchValue({ zip: this.form.get('zip')?.value || '' });
          this.form.get('state')?.disable();
        } else {
          this.form.patchValue({ zip: this.form.get('zip')?.value || null });
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
    if (this.defaultCandidateOffice) {
      this.form.get('candidate_office')?.disable();
    }

    this.contactTypeChanged(this.contactType);
  }

  /**
   * Add or remove the FEC ID unique validation check for a FormControl
   * @param formId
   * @param contactId
   * @param enableValidator
   */
  refreshFecIdValidator(formId: string, contactId: string | undefined, enableValidator: boolean) {
    this.form?.get(formId)?.clearAsyncValidators();
    if (enableValidator) {
      this.form?.get(formId)?.addAsyncValidators(this.contactService.getFecIdValidator(contactId));
    }
    this.form?.get(formId)?.updateValueAndValidity();
  }

  /**
   * On ngOnInit and when a user changes the selection of the ContactType for the contact
   * entry form (as known by the emitter from the contact-lookup component), update the necessary
   * FormControl elements for the ContactType selected by the user.
   * @param contactType
   */
  contactTypeChanged(contactType: ContactTypes) {
    this.contactType = contactType;
    if (!this.contact) this.contact = new Contact();

    // The type form control is not displayed on the form page because we are
    // displaying the contact lookup component which operates independently, so
    // we keep the 'type' value on the contact dialog form up-to-date in the background.
    this.form.get('type')?.setValue(contactType);

    const schema = ContactService.getSchemaByType(contactType);
    SchemaUtils.addJsonSchemaValidators(this.form, schema, true);
    this.refreshFecIdValidator('candidate_id', this.contact.id, contactType === ContactTypes.CANDIDATE);
    this.refreshFecIdValidator('committee_id', this.contact.id, contactType === ContactTypes.COMMITTEE);

    // Clear out non-schema form values
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const schemaProperties: string[] = SchemaUtils.getSchemaProperties(schema);
    Object.keys(this.form.controls).forEach((property: string) => {
      if (!schemaProperties.includes(property)) {
        formValues[property] = null;
      }
    });
    this.form.patchValue(formValues);

    if (contactType === ContactTypes.CANDIDATE) {
      this.stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
    } else {
      this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
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
    this.form.patchValue(this.contact);
    if (this.contact.id) {
      this.isNewItem = false;
      // Update the value of the Contact Type select box in the Contact Lookup
      // component because the Contact Dialog is hidden and not destroyed on close,
      // so we need to directly update the lookup "type" form control value
      this.contactLookup.contactTypeFormControl.setValue(this.contact.type);
      this.contactLookup.contactTypeFormControl.enable();
    } else if (this.contactTypeOptions.length === 1) {
      this.contactLookup.contactTypeFormControl.enable();
    }
    this.dialogVisible = true;
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.detailVisible = false;
      this.dialogVisible = false;
    }
  }

  /**
   * Callback passed to the contact-lookup component to show/hide lookup input box
   * @returns boolean
   */
  public showSearchBox() {
    return this.contactType === ContactTypes.CANDIDATE || this.contactType === ContactTypes.COMMITTEE;
  }

  private resetForm() {
    this.form.reset();
    this.form.get('country')?.setValue(this.countryOptions[0]['value']);
    this.form.get('state')?.setValue(null);
    this.isNewItem = true;
    this.contactLookup.contactTypeFormControl.enable();
    this.contactLookup.contactTypeFormControl.setValue(this.contactType);
    if (this.defaultCandidateOffice) {
      this.form.get('candidate_office')?.setValue(this.defaultCandidateOffice);
    }
    this.formSubmitted = false;
  }

  updateContact(contact: Contact) {
    this.contact = contact;
    this.form.patchValue(contact);
  }

  public confirmPropagation() {
    const changes = Object.entries(this.form.controls)
      .map(([field, control]: [string, AbstractControl]) => {
        const contactValue = this.contact[field as keyof Contact];
        if (control?.value !== contactValue) {
          return [field, control.value];
        }
        return undefined;
      })
      .filter((change) => !!change) as [string, any][]; // eslint-disable-line @typescript-eslint/no-explicit-any
    const changesMessage = TransactionContactUtils.getContactChangesMessage(this.contact, changes);
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
    if (this.form.invalid) {
      return;
    }

    const contact: Contact = Contact.fromJSON({
      ...this.contact,
      ...SchemaUtils.getFormValues(this.form, ContactService.getSchemaByType(this.contactType)),
    });
    contact.type = this.contactType;
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
    return { page_size: this.rowsPerPage, contact: this.contact.id ?? '' };
  }
}
