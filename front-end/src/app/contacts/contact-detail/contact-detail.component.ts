import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import {
  Contact,
  ContactTypes,
  ContactTypeLabels,
  CandidateOfficeTypes,
  CandidateOfficeTypeLabels,
} from '../../shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  @Input() contact: Contact = new Contact();
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

  private destroy$: Subject<boolean> = new Subject();

  // Need this setter/getter to get the isNewItem value into the template
  private _isNewItem = false;
  @Input() set isNewItem(value: boolean) {
    this._isNewItem = value;
    if (this._isNewItem) {
      this.form.get('type')?.enable();
    } else {
      this.form.get('type')?.disable();
    }
  }
  get isNewItem(): boolean {
    return this._isNewItem;
  }

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];
  formSubmitted = false;

  form: FormGroup = this.fb.group(
    this.validateService.getFormGroupFields([
      ...new Set([
        ...this.validateService.getSchemaProperties(contactIndividualSchema),
        ...this.validateService.getSchemaProperties(contactCandidateSchema),
        ...this.validateService.getSchemaProperties(contactCommitteeSchema),
        ...this.validateService.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );

  constructor(
    private messageService: MessageService,
    private contactService: ContactService,
    private validateService: ValidateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = contactIndividualSchema;
    this.validateService.formValidatorForm = this.form;

    this.form
      ?.get('type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        // Update validator JSON schema to the selected contact type
        this.validateService.formValidatorSchema = this.getSchemaByType(value as ContactTypes);

        // Clear out non-schema form values
        const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        const schemaProperties: string[] = this.validateService.getSchemaProperties(
          this.validateService.formValidatorSchema
        );
        Object.keys(this.form.controls).forEach((property: string) => {
          if (!schemaProperties.includes(property)) {
            formValues[property] = '';
          }
        });
        this.form.patchValue(formValues);

        if (value === ContactTypes.CANDIDATE) {
          this.stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
        } else {
          this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
        }
      });

    this.form
      ?.get('country')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value !== 'USA') {
          this.form.patchValue({
            state: 'ZZ',
          });
          this.form?.get('state')?.disable();
        } else {
          this.form?.get('state')?.enable();
        }
      });

    this.form
      ?.get('candidate_office')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            candidate_state: '',
            candidate_district: '',
          });
          this.form?.get('candidate_state')?.disable();
          this.form?.get('candidate_district')?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            candidate_district: '',
          });
          this.form?.get('candidate_state')?.enable();
          this.form?.get('candidate_district')?.disable();
        } else {
          this.form?.get('candidate_state')?.enable();
          this.form?.get('candidate_district')?.enable();
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
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  public onOpenDetail() {
    this.resetForm();
    this.form.patchValue(this.contact);
  }

  public saveItem(closeDetail = true) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: Contact = Contact.fromJSON({ ...this.contact, ...this.validateService.getFormValues(this.form) });

    if (payload.id) {
      this.contactService.update(payload).subscribe(() => {
        this.loadTableItems.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.contactService.create(payload).subscribe(() => {
        this.loadTableItems.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Created',
          life: 3000,
        });
      });
    }
    if (closeDetail) {
      this.closeDetail();
    }
    this.resetForm();
  }

  public closeDetail() {
    this.detailVisibleChange.emit(false);
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.formSubmitted = false;
  }

  /**
   * Given the type of contact given, return the appropriate JSON schema doc
   * @param {ContactTypes} type
   * @returns {JsonSchema} schema
   */
  private getSchemaByType(type: ContactTypes): JsonSchema {
    let schema: JsonSchema = contactIndividualSchema;
    if (type === ContactTypes.CANDIDATE) {
      schema = contactCandidateSchema;
    }
    if (type === ContactTypes.COMMITTEE) {
      schema = contactCommitteeSchema;
    }
    if (type === ContactTypes.ORGANIZATION) {
      schema = contactOrganizationSchema;
    }
    return schema;
  }
}
