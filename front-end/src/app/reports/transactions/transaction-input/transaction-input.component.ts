import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { Observable } from 'rxjs';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { Report } from 'app/shared/models/report.model';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { TransactionContactLookupComponent } from '../../../shared/components/transaction-contact-lookup/transaction-contact-lookup.component';
import { CommitteeInputComponent } from '../../../shared/components/inputs/committee-input/committee-input.component';
import { NameInputComponent } from '../../../shared/components/inputs/name-input/name-input.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { EmployerInputComponent } from '../../../shared/components/inputs/employer-input/employer-input.component';
import { AmountInputComponent } from '../../../shared/components/inputs/amount-input/amount-input.component';
import { DebtInputComponent } from '../../../shared/components/inputs/debt-input/debt-input.component';
import { LoanInfoInputComponent } from '../../../shared/components/inputs/loan-info-input/loan-info-input.component';
import { LoanTermsInputComponent } from '../../../shared/components/inputs/loan-terms-input/loan-terms-input.component';
import { LoanAgreementInputComponent } from '../../../shared/components/inputs/loan-agreement-input/loan-agreement-input.component';
import { AdditionalInfoInputComponent } from '../../../shared/components/inputs/additional-info-input/additional-info-input.component';
import { SignatureInputComponent } from '../../../shared/components/inputs/signature-input/signature-input.component';
import { SupportOpposeInputComponent } from '../../../shared/components/inputs/support-oppose-input/support-oppose-input.component';
import { CandidateInputComponent } from '../../../shared/components/inputs/candidate-input/candidate-input.component';
import { ElectionInputComponent } from '../../../shared/components/inputs/election-input/election-input.component';

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

  @Output() primaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() candidateContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() secondaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() tertiaryContactSelect = new EventEmitter<SelectItem<Contact>>();

  ContactTypes = ContactTypes;
  transactionType?: TransactionType;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  ngOnInit(): void {
    if (this.transaction) {
      this.transactionType = this.transaction.transactionType;
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

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.form.get('entity_type')?.setValue(selectItem.value.type);
    this.primaryContactSelect.emit(selectItem);
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    this.candidateContactSelect.emit(selectItem);
  }

  updateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    this.secondaryContactSelect.emit(selectItem);
  }

  updateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    this.tertiaryContactSelect.emit(selectItem);
  }

  get entityType(): ContactTypes {
    return this.form.get('entity_type')?.value;
  }
}
