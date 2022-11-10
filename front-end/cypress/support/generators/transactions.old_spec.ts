import * as _ from 'lodash';
import {
  groupANavTree,
  TransactionCategory,
  SchATransactionName,
  TransactionFields,
  TransactionForm,
} from '../transaction_nav_trees.spec';
import { Contact } from './contacts.spec';

export type TransactionTree = {
  [accordion in TransactionCategory]?: {
    [transaction_type in SchATransactionName]?: Transaction;
  };
};

export type Transaction = {
  entity_type: 'Individual' | 'Committee' | 'Organization';
  memoTextDescription?: string;
  contributionAmount?: number;
  contributionDate?: Date;
  childTransactions?: {
    [key: string]: Transaction;
  };
};

export function transaction_matches_contact(
  transactionGiven: TransactionTree | Transaction,
  contactGiven: Contact
): boolean {
  let t: Transaction;
  if (Object.keys(transactionGiven).includes('contributionAmount')) {
    t = transactionGiven;
  } else {
    t = Object.values(transactionGiven)[0];
  }

  if (Object.values(t).includes('Individual')) {
    return contactGiven.contact_type === 'Individual';
  }
  if (Object.values(t).includes('Committee')) {
    return contactGiven.contact_type === 'Committee';
  }
  if (Object.values(t).includes('Organization')) {
    return contactGiven.contact_type === 'Organization';
  }

  return false;
}

export function wrap_transaction_with_tree(transaction: Transaction) {
  return {
    OTHER: {
      Other: transaction,
    },
  };
}

function genTransactionNavData(transactionGiven: TransactionTree = {}): [TransactionCategory, SchATransactionName] {
  let accordion: TransactionCategory;
  if (Object.keys(transactionGiven).length == 0) {
    const accordions = Object.keys(groupANavTree);
    accordion = _.sample(accordions) as TransactionCategory;
  } else {
    accordion = Object.keys(transactionGiven)[0] as TransactionCategory;
  }

  let transactionType: SchATransactionName;
  if (!transactionGiven[accordion] || Object.keys(transactionGiven[accordion])?.length == 0) {
    const transactionTypes = Object.keys(groupANavTree[accordion]);
    transactionType = _.sample(transactionTypes) as SchATransactionName;
  } else {
    transactionType = Object.keys(transactionGiven[accordion])[0] as SchATransactionName;
  }

  return [accordion, transactionType];
}

function chooseTransactionForm(accordion: TransactionCategory, transactionType: SchATransactionName): TransactionForm {
  const transactionForm: TransactionForm | undefined = groupANavTree[accordion][transactionType];

  if (!transactionForm) {
    console.log('Error: Invalid Transaction Category/Type', accordion, transactionType);
    return {};
  }
  return transactionForm;
}

function genTransactionField(
  field: string,
  transactionForm: TransactionForm,
  entityType: string,
  entityTypeKey: string
) {
  if (field == entityTypeKey) return;
  if (field == 'childTransactions') return;

  const fieldRules = transactionForm[field];

  const universalField = !('entities' in fieldRules);
  const belongsToEntity = _.includes(fieldRules['entities'], entityType);
  //Skip if field is not universal or doesn't belong to the Transaction's entity type
  if (!universalField && !belongsToEntity) {
    return;
  }

  if (fieldRules['required'] || _.random(10) < 2) {
    const args = fieldRules['genArgs'] || [];
    return fieldRules['generator'](...args);
  }
}

function genRandomTransaction(transactionForm: TransactionForm): Transaction {
  const outTransaction: Transaction = {};
  const fields: string[] = Object.keys(transactionForm);

  //Gets the value of the first field-key in the form that starts with "entityType"
  const entityTypeKey: string | undefined = fields.find((key) => {
    return key.startsWith('entityType');
  });

  if (entityTypeKey == undefined) {
    console.log('Error: Transaction Generator - Entity Type not found', transactionForm);
    return {};
  }

  const entityTypeGenerator = TransactionFields[entityTypeKey]['generator'];
  const entityType: string = entityTypeGenerator();

  outTransaction[entityTypeKey] = entityType;

  for (const field of fields) {
    const value = genTransactionField(field, transactionForm, entityType, entityTypeKey);
    if (value) outTransaction[field] = value;
  }

  if (transactionForm['childTransactions']) {
    outTransaction['childTransactions'] = {};
    const childTransactions = transactionForm['childTransactions'];
    for (const childName of Object.keys(childTransactions)) {
      const childTransactionForm = childTransactions[childName];
      outTransaction['childTransactions'][childName] = genRandomTransaction(childTransactionForm);
    }
  }

  return outTransaction;
}

export function generateTransactionObject(transactionGiven: TransactionTree = {}): TransactionTree {
  const [accordion, transactionType] = genTransactionNavData(transactionGiven);
  const transactionForm = chooseTransactionForm(accordion, transactionType);
  const newTransaction = genRandomTransaction(transactionForm);

  let givenFields = {};
  if (transactionGiven[accordion] && transactionGiven[accordion][transactionType]) {
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
