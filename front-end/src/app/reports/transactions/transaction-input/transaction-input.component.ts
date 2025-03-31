import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { Report } from 'app/shared/models/report.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { AdditionalInfoInputComponent } from '../../../shared/components/inputs/additional-info-input/additional-info-input.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { AmountInputComponent } from '../../../shared/components/inputs/amount-input/amount-input.component';
import { CandidateInputComponent } from '../../../shared/components/inputs/candidate-input/candidate-input.component';
import { CommitteeInputComponent } from '../../../shared/components/inputs/committee-input/committee-input.component';
import { DebtInputComponent } from '../../../shared/components/inputs/debt-input/debt-input.component';
import { ElectionInputComponent } from '../../../shared/components/inputs/election-input/election-input.component';
import { EmployerInputComponent } from '../../../shared/components/inputs/employer-input/employer-input.component';
import { LoanAgreementInputComponent } from '../../../shared/components/inputs/loan-agreement-input/loan-agreement-input.component';
import { LoanInfoInputComponent } from '../../../shared/components/inputs/loan-info-input/loan-info-input.component';
import { LoanTermsInputComponent } from '../../../shared/components/inputs/loan-terms-input/loan-terms-input.component';
import { NameInputComponent } from '../../../shared/components/inputs/name-input/name-input.component';
import { SignatureInputComponent } from '../../../shared/components/inputs/signature-input/signature-input.component';
import { SupportOpposeInputComponent } from '../../../shared/components/inputs/support-oppose-input/support-oppose-input.component';
import { TransactionContactLookupComponent } from '../../../shared/components/transaction-contact-lookup/transaction-contact-lookup.component';
import { SectionHeaderComponent } from './section-header/section-header.component';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [
    TransactionContactLookupComponent,
    CommitteeInputComponent,
    NameInputComponent,
    SectionHeaderComponent,
    AddressInputComponent,
    EmployerInputComponent,
    NgTemplateOutlet,
    AmountInputComponent,
    DebtInputComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
    LoanAgreementInputComponent,
    AdditionalInfoInputComponent,
    SignatureInputComponent,
    SupportOpposeInputComponent,
    CandidateInputComponent,
    ElectionInputComponent,
    AsyncPipe,
  ],
})
export class TransactionInputComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup([], { updateOn: 'blur' });
  @Input() formSubmitted = false;
  @Input() activeReport$?: Observable<Report>;
  @Input() transaction?: Transaction;
  @Input() isEditable = true;
  @Input() contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  @Input() memoCodeCheckboxLabel$?: Observable<string>;
  @Input() contributionAmountReadOnly = false;
  @Input() candidateInfoPosition = 'low';
  @Input() isSingle = false;

  @Output() contactSelect = new EventEmitter<[number, SelectItem<Contact>]>();
  @Output() candidateContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() quaternaryContactClear = new EventEmitter<void>();
  @Output() quinaryContactClear = new EventEmitter<void>();

  ContactTypes = ContactTypes;
  transactionType?: TransactionType;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  ngOnInit(): void {
    if (this.transaction) {
      this.transactionType = this.transaction.transactionType;
      this.candidateInfoPosition = this.transactionType.candidateInfoPosition || 'low';
      this.templateMap = this.transaction.transactionType.templateMap;
    } else {
      throw new Error('FECfile: No transaction passed to TransactionInputComponent');
    }

    // If there are mandatory values for any form fields, populate the form field and make it read-only
    for (const field in this.transaction.transactionType.mandatoryFormValues) {
      this.form.get(field)?.setValue(this.transaction.transactionType.mandatoryFormValues[field]);
      this.form.get(field)?.disable();
    }
  }

  contactTypeSelected(contactType: ContactTypes) {
    this.form.get('entity_type')?.setValue(contactType);
  }

  updateFormWithContact(contact: SelectItem<Contact>, index: number) {
    if (index === 0) this.form.get('entity_type')?.setValue(contact.value.type);
    this.contactSelect.emit([index, contact]);
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    this.candidateContactSelect.emit(selectItem);
  }

  clearFormQuaternaryContact() {
    this.quaternaryContactClear.emit();
  }

  clearFormQuinaryContact() {
    this.quinaryContactClear.emit();
  }

  get entityType(): ContactTypes {
    return this.form.get('entity_type')?.value;
  }
}
