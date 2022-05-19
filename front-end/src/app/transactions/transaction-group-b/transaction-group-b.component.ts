import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ContactTypes, ContactTypeLabels } from '../../shared/models/contact.model';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { DateUtils } from 'app/shared/utils/date.utils';

@Component({
  selector: 'app-transaction-group-b',
  templateUrl: './transaction-group-b.component.html',
})
export class TransactionGroupBComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() schema: JsonSchema | null = null;
  @Input() transaction: Transaction | null = null;

  formProperties: string[] = [
    'entity_type',
    'contributor_organization_name',
    'contributor_last_name',
    'contributor_first_name',
    'contributor_middle_name',
    'contributor_prefix',
    'contributor_suffix',
    'contributor_street_1',
    'contributor_street_2',
    'contributor_city',
    'contributor_state',
    'contributor_zip',
    'contribution_date',
    'contribution_amount',
    'contribution_aggregate',
    'contribution_purpose_descrip',
    'memo_code',
    'memo_text_description',
  ];
  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  formSubmitted = false;

  form: FormGroup = this.fb.group({});

  constructor(
    private messageService: MessageService,
    private transactionService: TransactionService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.form;

    // Intialize form on "Individual" entity type
    if (this.transaction?.id) {
      const txn = { ...this.transaction } as SchATransaction;
      this.form.patchValue({ ...txn });
      this.form.patchValue({ contribution_date: DateUtils.convertFecFormatToDate(txn.contribution_date) });
    } else {
      this.resetForm();
    }

    this.form
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(value as ContactTypes)) {
          this.form.patchValue({
            contributor_organization_name: '',
          });
        }
        if ([ContactTypes.ORGANIZATION, ContactTypes.COMMITTEE].includes(value as ContactTypes)) {
          this.form.patchValue({
            contributor_last_name: '',
            contributor_first_name: '',
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  save(navigateTo: 'list' | 'add another') {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: SchATransaction = SchATransaction.fromJSON({
      ...this.transaction,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    if (this.transaction?.transaction_type_identifier) {
      // Remove transaction_id from list of validate properties because it will be added in the back end.
      const fieldsToValidate: string[] = this.validateService
        .getSchemaProperties(this.schema)
        .filter((p) => p !== 'transaction_id');

      if (payload.id) {
        this.transactionService
          .update(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe(() => {
            this.navigateTo(navigateTo);
          });
      } else {
        this.transactionService
          .create(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe(() => {
            this.navigateTo(navigateTo);
          });
      }
    }
  }

  navigateTo(navigateTo: 'list' | 'add another') {
    if (navigateTo === 'add another') {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      this.resetForm();
    } else {
      this.router.navigateByUrl('/reports');
    }
  }

  private resetForm() {
    this.formSubmitted = false;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.patchValue({
      entity_type: ContactTypes.INDIVIDUAL,
      contribution_aggregate: '0',
      memo_code: false,
    });
  }
}
