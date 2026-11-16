import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';

import { STANDARD_AND_SECONDARY } from '../contact.model';
import { COMMITTEE, COMMITTEE_B_FORM_FIELDS, ELECTION_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE extends SchBTransactionType {
  formFields = [...COMMITTEE_B_FORM_FIELDS, ...ELECTION_FIELDS];
  contactTypeOptions = COMMITTEE;
  override contactConfig = STANDARD_AND_SECONDARY;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE,
  );
  schema = schema;

  override contact3IsRequired = true;
  override isCloneableTransactionType = true;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE,
    });
  }
}
