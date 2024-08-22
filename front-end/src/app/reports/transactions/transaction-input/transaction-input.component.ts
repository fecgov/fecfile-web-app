import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { Observable } from 'rxjs';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { Report } from 'app/shared/models/report.model';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.component.html',
  styleUrls: ['../transaction.scss'],
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
  transactionType: TransactionType = {} as TransactionType;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  useParentContact?: boolean;
  hasCommitteeFecId = false;
  hasEmployeeFields?: boolean;
  hasLoanFinanceFields?: boolean;
  hasLoanTermsFields?: boolean;
  hasSignature1?: boolean;
  hasSignature2?: boolean;
  footer?: string;
  hasCommitteeOrCandidateInformation?: boolean;
  hasSupportOpposeCode?: boolean;
  hasCandidateInformation?: boolean;
  contact2IsRequired?: boolean;
  hasCandidateOffice = false;
  hasElectionInformation?: boolean;

  ngOnInit(): void {
    if (this.transaction) {
      this.transactionType = this.transaction.transactionType;
      this.templateMap = this.transaction.transactionType.templateMap;
      this.useParentContact = this.transactionType.getUseParentContact(this.transaction);
      this.hasCommitteeFecId = this.transactionType.hasCommitteeFecId();
      this.hasEmployeeFields = this.transactionType.hasEmployeeFields();
      this.hasLoanFinanceFields = this.transactionType.hasLoanFinanceFields();
      this.hasLoanTermsFields = this.transactionType.hasLoanTermsFields();
      this.hasSignature1 = this.transactionType.hasSignature1();
      this.hasSignature2 = this.transactionType.hasSignature2();
      this.footer = this.transactionType.getFooter(this.transaction);
      this.hasCommitteeOrCandidateInformation = this.transactionType.hasCommitteeOrCandidateInformation();
      this.hasSupportOpposeCode = this.transactionType.hasSupportOpposeCode();
      this.hasCandidateInformation = this.transactionType.hasCandidateInformation(this.form);
      this.contact2IsRequired = this.transactionType.contact2IsRequired(this.form);
      this.hasCandidateOffice = this.transactionType.hasCandidateOffice();
      this.hasElectionInformation = this.transactionType.hasElectionInformation();
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
}
