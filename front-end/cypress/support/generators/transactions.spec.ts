import * as _ from 'lodash';
import { groupANavTree, TransactionCategory, SchATransaction, TransactionFields } from '../transaction_nav_trees.spec';

export type Transaction = {
  [accordion in TransactionCategory]?: {
    [transaction_type in SchATransaction]?: {
      entity_type?: 'Individual' | 'Committee' | 'Organization';
      contributorLastName?: string;
      contributorFirstName?: string;
      contributorMiddleName?: string;
      contributorPrefix?: string;
      contributorSuffix?: string;
      contributorOrganizationName?: string;
      contributorStreet1?: string;
      contributorStreet2?: string;
      contributorCity?: string;
      contributorZip?: string | number;
      memoTextDescription?: string;
      contributionAmount?: number;
    };
  };
};

export function generateTransactionObject(transactionGiven: Transaction = {}): Transaction {
  const newTransaction: Transaction = {};

  let accordion: string;
  if (Object.keys(transactionGiven).length == 0) {
    const accordions = Object.keys(groupANavTree);
    accordion = _.sample(accordions);
  } else {
    accordion = Object.keys(transactionGiven)[0];
  }

  let transactionType: string;
  if (!transactionGiven[accordion] || Object.keys(transactionGiven[accordion])?.length == 0) {
    const transactionTypes = Object.keys(groupANavTree[accordion]);
    transactionType = _.sample(transactionTypes);
  } else {
    transactionType = Object.keys(transactionGiven[accordion])[0];
  }

  const fields = Object.keys(groupANavTree[accordion][transactionType]);
  newTransaction[accordion] = {};
  newTransaction[accordion][transactionType] = {};

  //Gets the value of the first field-key in the form that starts with "entityType"
  const entityTypeKey = fields.find((key) => {
    return key.startsWith('entityType');
  });

  const entityTypeGenerator = TransactionFields[entityTypeKey]['generator'];
  const entityType = entityTypeGenerator();

  newTransaction[accordion][transactionType][entityTypeKey] = entityType;

  for (let field of fields) {
    const fieldRules = groupANavTree[accordion][transactionType][field];
    let fieldValue: string | number;

    if (field == entityTypeKey) continue;

    const universalField = !('entities' in fieldRules);
    const belongsToEntity = _.includes(fieldRules['entities'], entityType);
    //Skip if field is not universal or doesn't belong to the Transaction's entity type
    if (!universalField && !belongsToEntity) {
      continue;
    }

    if (fieldRules['required'] || _.random(10) < 2) {
      const args = fieldRules['genArgs'] || [];
      fieldValue = fieldRules['generator'](...args);
      newTransaction[accordion][transactionType][field] = fieldValue;
    }
  }

  let givenFields = {};
  if (transactionGiven[accordion] && transactionGiven[accordion][transactionType]){
    givenFields = transactionGiven[accordion][transactionType];
  }

  const finalFields = {
    ...newTransaction[accordion][transactionType],
    ...givenFields,
  };
  let finalTransaction: Transaction = {};
  finalTransaction[accordion] = {};
  finalTransaction[accordion][transactionType] = finalFields;

  return finalTransaction;
}
