import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Contact, ContactTypes, ContactTypeLabels } from 'app/shared/models/contact.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { Observable } from 'rxjs';
import { NavigationControl, NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
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
  @Input() candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.CANDIDATE,
  ]);
  @Input() candidateContactTypeFormControl: FormControl = new FormControl(ContactTypes.CANDIDATE);
  @Input() memoCodeCheckboxLabel$?: Observable<string>;
  @Input() contributionAmountReadOnly = false;
  @Input() contactLookupLabel = 'CONTACT LOOKUP';
  @Input() candidateInfoPosition = 'low';

  @Output() primaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() candidateContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() secondaryContactSelect = new EventEmitter<SelectItem<Contact>>();

  @Input() getInlineControls = () => [] as NavigationControl[];
  @Output() navigate: EventEmitter<NavigationEvent> = new EventEmitter<NavigationEvent>();

  ContactTypes = ContactTypes;
  transactionType: TransactionType = {} as TransactionType;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;

  ngOnInit(): void {
    if (this.transaction) {
      this.transactionType = this.transaction.transactionType;
      this.templateMap = this.transaction.transactionType.templateMap;
    } else {
      throw new Error('FECfile: No transaction passed to TransactionInputComponent');
    }
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.primaryContactSelect.emit(selectItem);
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    this.candidateContactSelect.emit(selectItem);
  }

  updateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    this.secondaryContactSelect.emit(selectItem);
  }

  handleNavigate($event: NavigationEvent) {
    this.navigate.emit($event);
  }
}