import { FormGroup } from '@angular/forms';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { MemoText } from 'app/shared/models/memo-text.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { Contact, ContactTypes } from '../../models/contact.model';
import { ContactIdMapType } from './transaction-contact.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { effect, Injector, runInInjectionContext, signal } from '@angular/core';

export type DateType = Date | string | undefined;

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
    injector: Injector,
  ) {
    const transactionType = transaction?.transactionType;
    const templateMap = transactionType?.templateMap;

    if (!transactionType || !templateMap) {
      throw new Error('Fecfile: Cannot find template map when initializing transaction form');
    }

    // Initial form state
    const entityTypeControl = form.get('entity_type') as SignalFormControl<string>;
    if (transaction.id) {
      form.patchValue({ ...transaction });
      TransactionFormUtils.patchMemoText(transaction, form);
      entityTypeControl?.disable();
    } else {
      component.resetForm();
      entityTypeControl?.enable();
    }

    // Contact IDs into signals
    Object.keys(transactionType.contactConfig ?? {}).forEach((contact) => {
      const id = (transaction[contact as keyof Transaction] as Contact)?.id ?? '';
      contactIdMap[contact] = signal<string>(id); // <-- was BehaviorSubject before
    });

    // Handle entity type logic
    const fields = ['last_name', 'first_name', 'middle_name', 'prefix', 'suffix', 'employer', 'occupation'];

    runInInjectionContext(injector, () => {
      effect(() => {
        const value = entityTypeControl.valueChangeSignal();
        if (value === ContactTypes.INDIVIDUAL || value === ContactTypes.CANDIDATE) {
          form.get(templateMap.organization_name)?.reset();
        }
        if (value === ContactTypes.ORGANIZATION || value === ContactTypes.COMMITTEE) {
          for (const field of fields) {
            form.get(templateMap[field as TemplateMapKeyType])?.reset();
          }
        }
      });

      // Handle employer/occupation validation triggers
      const watchField = (transaction as SchATransaction).aggregation_group
        ? templateMap.aggregate
        : templateMap.amount;

      effect(() => {
        const validationTrigger = component.getControl(watchField);
        validationTrigger?.valueChangeSignal(); // triggers effect
        form.get(templateMap.employer)?.updateValueAndValidity();
        form.get(templateMap.occupation)?.updateValueAndValidity();
      });

      // Aggregate + Calendar YTD logic
      if (transactionType.showAggregate) {
        this.handleShowAggregateValueChanges(component, form, transaction, contactIdMap, templateMap, injector);
      }

      if (transactionType.showCalendarYTD) {
        this.handleShowCalendarYTD(component, form, transaction, templateMap, injector);
      }

      // Schema validation
      const schema = transaction.transactionType?.schema;
      if (schema) {
        SchemaUtils.addJsonSchemaValidators(form, schema, false, transaction);
        form.updateValueAndValidity();
      }

      Object.entries(contactIdMap).forEach(([contact, contactSignal]) => {
        const contactConfig = transactionType.contactConfig[contact];
        effect(() => {
          const id = contactSignal();
          for (const field of ['committee_fec_id', 'candidate_fec_id']) {
            if (contactConfig[field]) {
              const control = form.get(templateMap[field as keyof TransactionTemplateMapType]);
              control?.clearAsyncValidators();
              control?.addAsyncValidators(contactService.getFecIdValidator(id));
              control?.updateValueAndValidity();
            }
          }
        });
      });
    });
  }

  // Only dynamically update non-inherited calendar_ytd values on the form input.
  // Inherited calendar_ytd display the value of the parent transaction and do not
  // include or change with the amount value of the child transaction.
  private static handleShowCalendarYTD(
    component: TransactionTypeBaseComponent,
    form: FormGroup<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    transaction: Transaction,
    templateMap: TransactionTemplateMapType,
    injector: Injector,
  ) {
    if (!transaction.transactionType.inheritCalendarYTD) {
      const dateCtrl = form.get(templateMap.date) as SignalFormControl;
      const date2Ctrl = form.get(templateMap.date2) as SignalFormControl;
      const electionCodeCtrl = form.get(templateMap.election_code) as SignalFormControl;
      const officeCtrl = form.get(templateMap.candidate_office) as SignalFormControl;
      const stateCtrl = form.get(templateMap.candidate_state) as SignalFormControl;
      const districtCtrl = form.get(templateMap.candidate_district) as SignalFormControl;
      const amountCtrl = form.get(templateMap.amount) as SignalFormControl;
      runInInjectionContext(injector, () => {
        effect(() => {
          const disbursement_date = dateCtrl.valueChangeSignal();
          const dissemination_date = date2Ctrl.valueChangeSignal();
          const election_code: string = electionCodeCtrl.valueChangeSignal();
          const candidate_office = officeCtrl.valueChangeSignal();
          const candidate_state = stateCtrl.valueChangeSignal();
          const candidate_district = districtCtrl.valueChangeSignal();
          const amount = amountCtrl.valueChangeSignal();

          // Only call backend once all fields are filled
          if (
            (!disbursement_date && !dissemination_date) ||
            !election_code ||
            election_code.length === 1 ||
            !candidate_office ||
            !candidate_state ||
            !candidate_district ||
            !amount
          )
            return;

          component.transactionService
            .getPreviousTransactionForCalendarYTD(
              transaction,
              disbursement_date,
              dissemination_date,
              election_code,
              candidate_office,
              candidate_state,
              candidate_district,
            )
            .then((previous) => this.updateAggregate(form, 'calendar_ytd', templateMap, transaction, previous, amount));
        });
      });
    } else {
      component.transactionService.get(transaction.parent_transaction?.id ?? '').then((parent) => {
        const inherited = (parent as SchETransaction).calendar_ytd_per_election_office;
        if (inherited) {
          this.updateAggregate(form, 'calendar_ytd', templateMap, transaction, undefined, inherited);
        }
      });
    }
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

    const payload: ScheduleTransaction = getFromJSON({
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
          [transaction.transactionType.templateMap.signatory_1_last_name]: committeeAccount.treasurer_name_2,
          [transaction.transactionType.templateMap.signatory_1_first_name]: committeeAccount.treasurer_name_1,
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

  static handleShowAggregateValueChanges(
    component: TransactionTypeBaseComponent,
    form: FormGroup,
    transaction: Transaction,
    contactIdMap: ContactIdMapType,
    templateMap: TransactionTemplateMapType,
    injector: Injector,
  ) {
    const contactIdSignal = contactIdMap['contact_1'];
    const dateControl = form.get(templateMap.date) as SignalFormControl<Date>;
    const amountControl = form.get(templateMap.amount) as SignalFormControl<number>;

    // Ensure initial values exist (you could guard more defensively if needed)
    effect(
      () => {
        const contribution_date = dateControl.valueChangeSignal();
        const amount = amountControl.valueChangeSignal();
        const contactId = contactIdSignal();

        if (!contribution_date || !amount || !contactId) return;

        component.transactionService
          .getPreviousTransactionForAggregate(transaction, contactId, contribution_date)
          .then((previous_transaction) => {
            this.updateAggregate(form, 'aggregate', templateMap, transaction, previous_transaction, amount);
          });
      },
      { injector },
    );
  }
}
