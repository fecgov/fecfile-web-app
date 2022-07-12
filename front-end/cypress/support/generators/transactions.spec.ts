import * as _ from 'lodash';
import * as generator from './generators.spec';
import { groupANavTree, TransactionNavTree, TransactionField } from '../transaction_nav_trees.spec';

export type Transaction = {
  [accordion: string]: {
    [transaction_type: string]: {
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

  const accordions = Object.keys(groupANavTree);
  const accordion = _.sample(accordions);
  const transactionTypes = Object.keys(groupANavTree[accordion]);
  const transactionType = _.sample(transactionTypes);
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

  const finalTransaction = { ...newTransaction, ...transactionGiven };

  return finalTransaction;
}
