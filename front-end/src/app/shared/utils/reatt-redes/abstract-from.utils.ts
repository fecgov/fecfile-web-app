import { FormGroup } from "@angular/forms";
import { Transaction } from "../../models/transaction.model";
import { combineLatest, of } from "rxjs";
import { ContactTypes } from "../../models/contact.model";
import { TemplateMapKeyType } from "../../models/transaction-type.model";

export abstract class AbstractFromUtils {

  static readOnlyFields = [
    'organization_name',
    'last_name',
    'first_name',
    'middle_name',
    'prefix',
    'suffix',
    'employer',
    'occupation',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'amount',
    'purpose_description',
    'committee_fec_id',
    'committee_name',
  ];

  protected static overlayForm(fromForm: FormGroup, transaction: Transaction, toForm: FormGroup, redesReatText: string): FormGroup {
    const purposeDescControl = fromForm.get(transaction.transactionType.templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescControl?.clearValidators();
    fromForm.get('memo_code')?.clearValidators();

    // Watch for changes to the "TO" transaction entity name and then update the "FROM" transaction expenditure purpose description.
    combineLatest([
      toForm.get(transaction.transactionType.templateMap.organization_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.first_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.last_name)?.valueChanges ?? of(null),
    ]).subscribe(([orgName, firstName, lastName]) => {
      if (toForm.get('entity_type')?.value === ContactTypes.INDIVIDUAL) {
        purposeDescControl?.setValue(`${redesReatText} to ${lastName}, ${firstName}`);
      } else {
        purposeDescControl?.setValue(`${redesReatText} to ${orgName}`);
      }
    });

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(transaction.transactionType.templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });

    AbstractFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(transaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable()
    );

    return fromForm;
  }
}