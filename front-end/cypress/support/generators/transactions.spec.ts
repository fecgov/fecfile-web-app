import * as _ from 'lodash';
import { groupANavTree, TransactionCategory, SchATransaction, TransactionFields, TransactionForm, TransactionField } from '../transaction_nav_trees.spec';

export type TransactionTree = {
  [accordion in TransactionCategory]?: {
    [transaction_type in SchATransaction]?: Transaction
  }
}

export type Transaction = {
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
  childTransactions?: Transaction[];
};

function genRandomTransaction(transactionForm: TransactionForm): Transaction {
  const outTransaction: Transaction = {}
  const fields: string[] = Object.keys(transactionForm);

  //Gets the value of the first field-key in the form that starts with "entityType"
  const entityTypeKey: string | undefined = fields.find((key) => {
    return key.startsWith('entityType');
  });

  if (entityTypeKey == undefined){
    console.log("Error: Transaction Generator - Entity Type not found", transactionForm);
    return {};
  }

  const entityTypeGenerator = TransactionFields[entityTypeKey]['generator'];
  const entityType: string = entityTypeGenerator();

  outTransaction[entityTypeKey] = entityType;

  for (const field of fields) {
    if (field == entityTypeKey) continue;
    if (field == "childTransactions") continue;

    const fieldRules = transactionForm[field];

    const universalField = !('entities' in fieldRules);
    const belongsToEntity = _.includes(fieldRules['entities'], entityType);
    //Skip if field is not universal or doesn't belong to the Transaction's entity type
    if (!universalField && !belongsToEntity) {
      continue;
    }

    if (fieldRules['required'] || _.random(10) < 2) {
      const args = fieldRules['genArgs'] || [];
      const fieldValue = fieldRules['generator'](...args);
      outTransaction[field] = fieldValue;
    }
  }

  if (transactionForm["childTransactions"]){
    outTransaction["childTransactions"] = [];
    const childTransactions: TransactionForm[] = transactionForm['childTransactions'];
    for (const childTransactionForm of childTransactions){
      outTransaction["childTransactions"] = [genRandomTransaction(childTransactionForm), ...outTransaction["childTransactions"]];
    }
  }

  return outTransaction;
}

export function generateTransactionObject(transactionGiven: TransactionTree = {}): TransactionTree {
  let accordion: string;
  if (Object.keys(transactionGiven).length == 0) {
    const accordions = Object.keys(groupANavTree);
    accordion = _.sample(accordions) as string;
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

  const newTransaction = genRandomTransaction(groupANavTree[accordion][transactionType]);
  
  let givenFields = {};
  if (transactionGiven[accordion] && transactionGiven[accordion][transactionType]){
    givenFields = transactionGiven[accordion][transactionType];
  }

  const finalFields = {
    ...newTransaction,
    ...givenFields,
  };

  const finalTransaction: TransactionTree = {};
  finalTransaction[accordion] = {};
  finalTransaction[accordion][transactionType] = finalFields;

  return finalTransaction;
}
