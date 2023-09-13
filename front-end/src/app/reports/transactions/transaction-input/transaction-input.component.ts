import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Contact, ContactTypes, ContactTypeLabels } from 'app/shared/models/contact.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { Observable } from 'rxjs';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.component.html',
})
export class TransactionInputComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
  @Input() isEditable = true;
  @Input() transaction?: Transaction;
  @Input() contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  @Input() memoCodeCheckboxLabel$?: Observable<string>;
  @Input() contributionAmountReadOnly = false;
  @Input() contactLookupLabel = 'CONTACT TYPE';
  @Input() candidateInfoPosition = 'low';

  @Output() primaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() candidateContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() secondaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() tertiaryContactSelect = new EventEmitter<SelectItem<Contact>>();

  ContactTypes = ContactTypes;
  transactionType: TransactionType = {} as TransactionType;
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
