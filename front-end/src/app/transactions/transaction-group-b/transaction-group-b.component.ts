import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ContactTypes, ContactTypeLabels } from '../../shared/models/contact.model';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { StatesCodeLabels, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';

@Component({
  selector: 'app-transaction-group-b',
  templateUrl: './transaction-group-b.component.html',
  styleUrls: ['./transaction-group-b.component.scss'],
})
export class TransactionGroupBComponent implements OnInit, OnDestroy {
  @Input() schema: JsonSchema | null = null;
  @Input() transaction: Transaction | null = null;

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  formSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = this.fb.group(
    this.validateService.getFormGroupFields(this.validateService.getSchemaProperties(this.schema))
  );

  constructor(
    private transactionService: TransactionService,
    private validateService: ValidateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.form;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  cancel() {}

  save(jump: 'list' | 'another') {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: SchATransaction = SchATransaction.fromJSON({
      ...this.transaction,
      ...this.validateService.getFormValues(this.form),
    });

    if (payload.id) {
      this.transactionService.update(payload).subscribe(() => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Successful',
        //   detail: 'Contact Updated',
        //   life: 3000,
        // });
      });
    } else {
      this.transactionService.create(payload).subscribe(() => {
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Successful',
        //   detail: 'Contact Created',
        //   life: 3000,
        // });
      });
    }
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.formSubmitted = false;
  }

  /**
   * Given the type of entity given, return the form properties for that type
   * @param {ContactTypes} type
   * @returns {JsonSchema} string[]
   */
  // private getFormProperties(type: ContactTypes): string[] {
  //   let properties: string[] = [];
  //   if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(type)) {
  //     properties = [
  //       'contributor_last_name',
  //       'contributor_first_name',
  //       'contributor_middle_name',
  //       'contributor_prefix',
  //       'contributor_suffix',
  //     ];
  //   }
  //   if ([ContactTypes.COMMITTEE, ContactTypes.ORGANIZATION].includes(type)) {
  //     properties = ['contributor_organization_name'];
  //   }
  //   return properties;
  // }
}
