import * as _ from 'lodash';
import {
  groupANavTree,
  TransactionNavTree,
  TransactionField,
  TransactionCategory,
  SchATransaction,
} from '../transaction_nav_trees.spec';

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
  let newTransaction: Transaction = {};

  let accordion: string;
  if (Object.keys(transactionGiven).length == 0) {
    const accordions = Object.keys(groupANavTree);
    accordion = _.sample(accordions);
  } else {
    accordion = Object.keys(transactionGiven)[0];
  }

  let transactionType: string;
  if (Object.keys(transactionGiven[accordion])?.length == 0) {
    const transactionTypes = Object.keys(groupANavTree[accordion]);
    transactionType = _.sample(transactionTypes);
    console.log('New Type');
  } else {
    transactionType = Object.keys(transactionGiven[accordion])[0];
    console.log('Given Type');
  }

  const transactionFields = Object.keys(groupANavTree[accordion][transactionType]);
  newTransaction[accordion] = {};
  newTransaction[accordion][transactionType] = {};
  for (let field of transactionFields) {
    const fieldRules = groupANavTree[accordion][transactionType][field];
    let fieldValue: string | number;

    if (fieldRules['required'] || _.random(10) < 2) {
      if ('genArgs' in fieldRules) {
        fieldValue = fieldRules['generator'](...fieldRules['genArgs']);
      } else {
        fieldValue = fieldRules['generator']();
      }
      newTransaction[accordion][transactionType][field] = fieldValue;
    }
  }

  const finalFields = {
    ...newTransaction[accordion][transactionType],
    ...transactionGiven[accordion][transactionType],
  };
  let finalTransaction: Transaction = {};
  finalTransaction[accordion] = {};
  finalTransaction[accordion][transactionType] = finalFields;

  return finalTransaction;
}
