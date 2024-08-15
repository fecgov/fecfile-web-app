import { AbstractControl, FormGroup } from '@angular/forms';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { BehaviorSubject, combineLatestWith, merge, Observable, of, startWith, switchMap, takeUntil } from 'rxjs';
import { Contact, ContactTypes } from '../../models/contact.model';
import { ContactIdMapType } from './transaction-contact.utils';
import { ContactService } from 'app/shared/services/contact.service';
import { MemoText } from 'app/shared/models/memo-text.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

export class TransactionFormUtils {
  /**
   * The parameters after the "component" parameter need to be set to either the primary (parent)
   * component values or, if they are the second transaction type of a "double" transaction
   * input screen, those parameters need to be set to the "child" properties of the
   * child transaction type defined in the DoubleTransactionTypeBase class.
   * @param component
   * @param form - parent or child (i.e. form or childForm)
   * @param transaction - parent or child
   * @param contactIdMap - parent or child
   * @param contactService
   */
  static onInit(
    component: TransactionTypeBaseComponent,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactIdMap: ContactIdMapType,
    contactService: ContactService,
  ): void {
    if (transaction && transaction.id) {
      form.patchValue({ ...transaction });

      TransactionFormUtils.patchMemoText(transaction, form);
      form.get('entity_type')?.disable();
    } else {
      component.resetForm();
      form.get('entity_type')?.enable();
    }

    const transactionType = transaction?.transactionType;
    const templateMap = transactionType?.templateMap;
    if (!transactionType || !templateMap) {
      throw new Error('Fecfile: Cannot find template map when initializing transaction form');
    }

    Object.keys(transactionType.contactConfig ?? {}).forEach((contact) => {
      const id = (transaction[contact as keyof Transaction] as Contact)?.id ?? '';
      contactIdMap[contact] = new BehaviorSubject<string>(id);
    });

    form
      .get('entity_type')
      ?.valueChanges.pipe(takeUntil(component.destroy$))
      .subscribe((value: string) => {
        if (value === ContactTypes.INDIVIDUAL || value === ContactTypes.CANDIDATE) {
          form.get(templateMap.organization_name)?.reset();
        }
        if (value === ContactTypes.ORGANIZATION || value === ContactTypes.COMMITTEE) {
          form.get(templateMap.last_name)?.reset();
          form.get(templateMap.first_name)?.reset();
          form.get(templateMap.middle_name)?.reset();
          form.get(templateMap.prefix)?.reset();
          form.get(templateMap.suffix)?.reset();
          form.get(templateMap.employer)?.reset();
          form.get(templateMap.occupation)?.reset();
        }
      });

    if ((transaction as SchATransaction).aggregation_group) {
      form
        ?.get(templateMap.aggregate)
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe(() => {
          form.get(templateMap.employer)?.updateValueAndValidity();
          form.get(templateMap.occupation)?.updateValueAndValidity();
        });
    } else {
      form
        ?.get(templateMap.amount)
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe(() => {
          form.get(templateMap.employer)?.updateValueAndValidity();
          form.get(templateMap.occupation)?.updateValueAndValidity();
        });
    }

    if (transactionType.showAggregate) {
      const previous_transaction$: Observable<Transaction | undefined> =
        form.get(templateMap.date)?.valueChanges.pipe(
          startWith(form.get(templateMap.date)?.value),
          combineLatestWith(contactIdMap['contact_1']),
          switchMap(([contribution_date, contactId]) => {
            return component.transactionService.getPreviousTransactionForAggregate(
              transaction,
              contactId,
              contribution_date,
            );
          }),
        ) || of(undefined);
      form
        .get(templateMap.amount)
        ?.valueChanges.pipe(
          startWith(form.get(templateMap.amount)?.value),
          combineLatestWith(previous_transaction$, of(transaction)),
          takeUntil(component.destroy$),
        )
        .subscribe(([amount, previous_transaction, transaction]) => {
          this.updateAggregate(form, 'aggregate', templateMap, transaction, previous_transaction, amount);
        });
    }

    if (transactionType.showCalendarYTD) {
      // Only dynamically update non-inherited calendar_ytd values on the form input.
      // Inherited calendar_ytd display the value of the parent transaction and do not
      // include or change with the amount value of the child transaction.
      if (!transaction.transactionType.inheritCalendarYTD) {
        const previous_election$: Observable<Transaction | undefined> =
          merge(
            (form.get(templateMap.date) as AbstractControl).valueChanges,
            (form.get(templateMap.date2) as AbstractControl).valueChanges,
            (form.get(templateMap.election_code) as AbstractControl).valueChanges,
            (form.get(templateMap.candidate_office) as AbstractControl).valueChanges,
            (form.get(templateMap.candidate_state) as AbstractControl).valueChanges,
            (form.get(templateMap.candidate_district) as AbstractControl).valueChanges,
          ).pipe(
            switchMap(() => {
              const disbursement_date = form.get(templateMap.date)?.value as Date | undefined;
              const dissemination_date = form.get(templateMap.date2)?.value as Date | undefined;
              const election_code = form.get(templateMap.election_code)?.value;
              const candidate_office = form.get(templateMap.candidate_office)?.value;
              const candidate_state = form.get(templateMap.candidate_state)?.value;
              const candidate_district = form.get(templateMap.candidate_district)?.value;

              return component.transactionService.getPreviousTransactionForCalendarYTD(
                transaction,
                disbursement_date,
                dissemination_date,
                election_code,
                candidate_office,
                candidate_state,
                candidate_district,
              );
            }),
          ) || of(undefined);
        form
          .get(templateMap.amount)
          ?.valueChanges.pipe(
            startWith(form.get(templateMap.amount)?.value),
            combineLatestWith(previous_election$, of(transaction)),
            takeUntil(component.destroy$),
          )
          .subscribe(([amount, previous_election, transaction]) => {
            this.updateAggregate(form, 'calendar_ytd', templateMap, transaction, previous_election, amount);
          });
      } else {
        component.transactionService.get(transaction.parent_transaction?.id ?? '').subscribe((parent: Transaction) => {
          const inheritedElectionAggregate = (parent as SchETransaction).calendar_ytd_per_election_office;
          if (inheritedElectionAggregate) {
            this.updateAggregate(form, 'calendar_ytd', templateMap, transaction, undefined, inheritedElectionAggregate);
          }
        });
      }
    }

    const schema = transaction.transactionType?.schema;
    if (schema) {
      SchemaUtils.addJsonSchemaValidators(form, schema, false, transaction);
    }

    Object.entries(contactIdMap).forEach(([contact, id$]) => {
      const contactConfig = transactionType.contactConfig[contact];
      id$.pipe(takeUntil(component.destroy$)).subscribe((id) => {
        for (const field of ['committee_fec_id', 'candidate_fec_id']) {
          if (contactConfig[field]) {
            form.get(templateMap[field as keyof TransactionTemplateMapType])?.clearAsyncValidators();
            form
              .get(templateMap[field as keyof TransactionTemplateMapType])
              ?.addAsyncValidators(contactService.getFecIdValidator(id));
            form.get(templateMap[field as keyof TransactionTemplateMapType])?.updateValueAndValidity();
          }
        }
      });
    });
  }

  static updateAggregate(
    form: FormGroup,
    field: TemplateMapKeyType,
    templateMap: TransactionTemplateMapType,
    transaction: Transaction,
    previousTransaction: Transaction | undefined,
    amount: number,
  ) {
    const key = previousTransaction?.transactionType?.templateMap[field] as keyof ScheduleTransaction;
    const previousAggregate = previousTransaction ? +((previousTransaction as ScheduleTransaction)[key] || 0) : 0;
    if (transaction.force_unaggregated) {
      form.get(templateMap[field])?.setValue(previousAggregate);
    } else if (transaction.transactionType?.isRefund) {
      form.get(templateMap[field])?.setValue(previousAggregate - +amount);
    } else {
      form.get(templateMap[field])?.setValue(previousAggregate + +amount);
    }
  }

  static getPayloadTransaction(
    transaction: Transaction | undefined,
    activeReportId: string,
    form: FormGroup,
    formProperties: string[],
  ): Transaction {
    if (!transaction) {
      throw new Error('Fecfile: Payload transaction not found');
    }

    // Remove parent transaction links within the parent-child hierarchy in the
    // transaction objects to avoid a recursion overflow from the class-transformer
    // plainToClass() converter
    if (transaction?.children) {
      transaction.children.forEach((child) => {
        child.parent_transaction = undefined;
      });
    }

    let formValues = SchemaUtils.getFormValues(form, transaction.transactionType?.schema, formProperties);
    formValues = TransactionFormUtils.retrieveMemoText(transaction, form, formValues);
    formValues = TransactionFormUtils.addExtraFormFields(transaction, form, formValues);
    formValues = TransactionFormUtils.removeUnsavedFormFields(transaction, formValues);

    let payload: ScheduleTransaction = getFromJSON({
      ...transaction,
      ...formValues,
    });

    // The linkedF3xId form control is only present on the linked report input component
    // If this is present, we add its value as an ID to the payload's report ids
    const secondaryReportId = form.get('linkedF3xId')?.value;
    if (secondaryReportId) {
      payload['report_ids'] = [activeReportId, secondaryReportId];
    }

    return payload;
  }

  /**
   * Some form fields are not part of the FEC spec but internal state variables for the front-end. Add them to the payload.
   * @param transaction
   * @param form
   * @param formValues
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static addExtraFormFields(transaction: Transaction, form: FormGroup, formValues: any) {
    transaction.transactionType?.formFields.forEach((field) => {
      if (!(field in formValues)) {
        formValues[field] = form.get(field)?.value ?? null;
      }
    });
    return formValues;
  }

  /**
   * Some form fields are part of the FEC spec but we don't want them in the payload to be
   * saved in the backend. An example of this are loan_balance in Schedule C which is dynamically
   * calculated by the backend and not stored in the database.
   * @param transaction
   * @param formValues
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static removeUnsavedFormFields(transaction: Transaction, formValues: any) {
    transaction.getFieldsNotToSave().forEach((field: string) => delete formValues[field]);
    return formValues;
  }

  static resetForm(
    form: FormGroup,
    transaction: Transaction | undefined,
    contactTypeOptions: PrimeOptions,
    committeeAccount?: CommitteeAccount,
  ) {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();

    const defaultContactTypeOption: string = contactTypeOptions[0]?.value;

    if (transaction?.transactionType) {
      form.patchValue({
        entity_type: defaultContactTypeOption,
        [transaction.transactionType.templateMap.aggregate]: '0',
        memo_code: this.getMemoCodeConstant(transaction?.transactionType),
        [transaction.transactionType.templateMap.purpose_description]:
          transaction?.transactionType?.generatePurposeDescriptionWrapper(transaction),
      });

      if (transaction?.transactionType?.populateSignatoryOneWithTreasurer && committeeAccount) {
        form.patchValue({
          [transaction.transactionType.templateMap.signatory_1_last_name]: committeeAccount.treasurer_name_1,
          [transaction.transactionType.templateMap.signatory_1_first_name]: committeeAccount.treasurer_name_2,
          [transaction.transactionType.templateMap.signatory_1_middle_name]: committeeAccount.treasurer_name_middle,
          [transaction.transactionType.templateMap.signatory_1_prefix]: committeeAccount.treasurer_name_prefix,
          [transaction.transactionType.templateMap.signatory_1_suffix]: committeeAccount.treasurer_name_suffix,
        });
      }
    }
  }

  static getMemoCodeConstant(transactionType?: TransactionType): boolean | undefined {
    /** Look at validation schema to determine if the memo_code has a constant value.
     * If there is a constant value, return it, otherwise undefined
     */
    const memoCodeSchema = transactionType?.schema.properties['memo_code'];
    return memoCodeSchema?.const as boolean | undefined;
  }

  static isMemoCodeReadOnly(transactionType?: TransactionType): boolean {
    // Memo Code is read-only if there is a constant value in the schema.  Otherwise, it's mutable
    return TransactionFormUtils.getMemoCodeConstant(transactionType) !== undefined;
  }

  // prettier-ignore
  static retrieveMemoText(transaction: Transaction, form: FormGroup, formValues: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const text = form.get('text4000')?.value;
    if (text && text.length > 0) {
      const memo_text = MemoText.fromJSON({
        text4000: text,
        text_prefix: transaction.memo_text?.text_prefix,
        report_id: transaction?.report_ids?.[0],
        rec_type: 'TEXT',
      });

      if (transaction?.id) {
        memo_text.transaction_uuid = transaction.id;
      }

      formValues['memo_text'] = memo_text;
    } else {
      formValues['memo_text'] = undefined;
    }

    return formValues;
  }

  static patchMemoText(transaction: Transaction | undefined, form: FormGroup) {
    const memo_text = transaction?.memo_text;
    if (memo_text?.text4000) {
      form.patchValue({ text4000: memo_text.text4000 });
    }
  }
}
