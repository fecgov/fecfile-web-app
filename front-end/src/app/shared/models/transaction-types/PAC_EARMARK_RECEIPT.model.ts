import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_EARMARK_RECEIPT';
import { ContactTypes } from '../contact.model';
import type { SchATransaction } from '../scha-transaction.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_EARMARK } from './ABSTRACT_EARMARK.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class PAC_EARMARK_RECEIPT extends ABSTRACT_EARMARK {
  override formFields = COMMITTEE_FORM_FIELDS;
  override contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_EARMARK_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleATransactionTypes.PAC_EARMARK_MEMO];

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchATransaction = transaction.children[0] as SchATransaction;
    let conduit = earmarkMemo.contributor_organization_name || '';
    if (
      earmarkMemo.entity_type === ContactTypes.INDIVIDUAL &&
      earmarkMemo.contributor_first_name &&
      earmarkMemo.contributor_last_name
    ) {
      conduit = `${earmarkMemo.contributor_first_name || ''} ${earmarkMemo.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Earmarked through ${conduit}`;
    }
    return '';
  }

  override readonly initializationData = {
    form_type: 'SA11C',
    transaction_type_identifier: ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
