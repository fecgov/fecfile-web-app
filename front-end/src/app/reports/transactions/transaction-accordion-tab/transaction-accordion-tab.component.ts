import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction.model';
import { TransactionType } from '../../../shared/models/transaction-type.model';
import { FormGroup } from '@angular/forms';
import { LabelUtils, PrimeOptions } from '../../../shared/utils/label.utils';
import { Contact, ContactTypeLabels } from '../../../shared/models/contact.model';
import { of } from 'rxjs';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-transaction-accordion-tab',
  templateUrl: './transaction-accordion-tab.component.html',
  styleUrls: ['./transaction-accordion-tab.component.scss'],
})
export class TransactionAccordionTabComponent {
  @Input() transaction?: Transaction;
  @Input() transactionType?: TransactionType;
  @Input() isEditable = false;
  @Input() form!: FormGroup;
  @Input() formSubmitted = false;
  @Input() contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  @Input() memoCodeCheckboxLabel$ = of('');

  @Output() updateFormWithPrimaryContact = new EventEmitter<SelectItem<Contact>>();
  @Output() updateFormWithCandidateContact = new EventEmitter<SelectItem<Contact>>();
  @Output() updateFormWithSecondaryContact = new EventEmitter<SelectItem<Contact>>();
  @Output() updateFormWithTertiaryContact = new EventEmitter<SelectItem<Contact>>();
}
