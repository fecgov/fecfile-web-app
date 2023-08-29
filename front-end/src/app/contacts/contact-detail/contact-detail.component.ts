import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Contact, ContactType } from '../../shared/models/contact.model';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent {
  @Input() contact: Contact = new Contact();
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<TableLazyLoadEvent> = new EventEmitter<TableLazyLoadEvent>();

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

  formSubmitted = false;

  form: FormGroup = this.fb.group(
    ValidateUtils.getFormGroupFields([
      ...new Set([
        ...ValidateUtils.getSchemaProperties(contactIndividualSchema),
        ...ValidateUtils.getSchemaProperties(contactCandidateSchema),
        ...ValidateUtils.getSchemaProperties(contactCommitteeSchema),
        ...ValidateUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );

  constructor(
    private messageService: MessageService,
    private contactService: ContactService,
    private fb: FormBuilder
  ) {}

  public onOpenDetail() {
    this.resetForm();
    this.form.patchValue(this.contact);
    this.form?.get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact.id));
    this.form?.get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator(this.contact.id));
  }

  public saveItem(closeDetail = true) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: Contact = Contact.fromJSON({
      ...this.contact,
      ...ValidateUtils.getFormValues(
        this.form,
        ContactService.getSchemaByType(this.form.get('type')?.value as ContactType)
      ),
    });

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
}
