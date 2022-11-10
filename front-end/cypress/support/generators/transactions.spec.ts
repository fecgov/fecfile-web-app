import * as _ from 'lodash';
import {
  groupANavTree,
  TransactionCategory,
  SchATransactionName,
  TransactionFields,
  TransactionForm,
  TransactionEntityType,
  TransactionField,
  ChildTransactionForm,
  ChildTransactionName,
  PairedTransactionForm,
  childTransactionTree,
} from '../transaction_nav_trees.spec';
import {
  Contact,
  generateContactCommittee,
  generateContactIndividual,
  generateContactOrganization,
} from './contacts.spec';

export type TransactionPrototype = {
  entity_type?: TransactionEntityType;
  transaction_name?: SchATransactionName | ChildTransactionName;
  transaction_category?: TransactionCategory;
  contact?: Contact;
  isNewContact?: boolean;
  fields?: {
    memoTextDescription?: string;
    contributionAmount?: number;
    contributionDate?: Date;
  };
  childTransactions?: Transaction[];
};

export type Transaction = {
  entity_type: TransactionEntityType;
  transaction_name: SchATransactionName | ChildTransactionName;
  transaction_category: TransactionCategory;
  contact: Contact;
  isNewContact: boolean;
  fields: {
    memoTextDescription?: string;
    contributionAmount?: number;
    contributionDate?: Date;
  };
  childTransactions?: Transaction[];
};

export type PairedTransaction = {
  transaction_name: SchATransactionName;
  transaction_category: TransactionCategory;
  transactionA: Transaction;
  transactionB: Transaction;
};

/*
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

function genTransactionNavData(transactionGiven): [TransactionCategory, SchATransactionName] {
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

export function generateTransactionObject(transactionGiven: TransactionTree = {}): Transaction {
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
*/

export function getTransactionFormByName(transaction_name: string): TransactionForm | undefined {
  for (const category of Object.keys(groupANavTree)) {
    for (const tForm of Object.values(groupANavTree[category])) {
      if (tForm['transaction_name'] && tForm['transaction_name'] === transaction_name) {
        return tForm as TransactionForm;
      }
    }
  }
  for (const parentName of Object.keys(childTransactionTree)) {
    console.log(parentName);
    const childTransactions = Object.keys(childTransactionTree[parentName]);
    console.log(childTransactions);
    if (childTransactions.includes(transaction_name)) {
      return childTransactions[transaction_name];
    }
  }
  console.log('Form Retrieval Missed Name!', transaction_name);
}

function getTransactionFormByCategory(transaction_category: string): TransactionForm | undefined {
  if (Object.keys(groupANavTree).includes(transaction_category)) {
    const forms = Object.values(groupANavTree[transaction_category]);
    return _.sample(forms) as TransactionForm;
  }
}

function getTransactionFormAtRandom(): TransactionForm {
  let forms: TransactionForm[] = [];
  for (const category of Object.keys(groupANavTree)) {
    forms = [...forms, ...(Object.values(groupANavTree[category]) as TransactionForm[])];
  }

  return _.sample(forms) as TransactionForm;
}

export function getTransactionForm(transactionGiven?: TransactionPrototype): TransactionForm {
  let form: TransactionForm | undefined;
  if (transactionGiven) {
    if (transactionGiven['transaction_name']) {
      form = getTransactionFormByName(transactionGiven['transaction_name']);
    } else if (transactionGiven['transaction_category']) {
      form = getTransactionFormByCategory(transactionGiven['transaction_category']);
    }
  }

  if (!transactionGiven || !form) {
    form = getTransactionFormAtRandom();
  }

  return form;
}

function genEntityType(
  transactionForm: TransactionForm | ChildTransactionForm,
  transactionGiven?: TransactionPrototype
): TransactionEntityType {
  if (transactionGiven?.entity_type) {
    const entities = transactionForm.entity_type.entities;
    if (entities && entities.includes(transactionGiven.entity_type)) {
      return transactionGiven.entity_type as TransactionEntityType;
    }
  }
  if (!transactionForm.entity_type) console.log('Missing entity_type!', transactionForm);
  return transactionForm.entity_type.generator();
}

function retrieveContact(
  transactionForm: TransactionForm | ChildTransactionForm,
  transactionGiven?: TransactionPrototype
): Contact | undefined {
  if (transactionGiven?.contact) {
    const contact = transactionGiven.contact;
    if (transactionForm?.entity_type?.entities?.includes(contact?.contact_type)) {
      return contact;
    }
  }
}

export function generateTransactionObject(
  transactionGiven?: TransactionPrototype,
  generateAllChildren = true
): Transaction | PairedTransaction {
  const transactionForm = getTransactionForm(transactionGiven);

  return generateTransactionFromForm(transactionForm, transactionGiven, generateAllChildren);
}

function generateTransactionFromForm(
  transactionForm: TransactionForm | ChildTransactionForm | PairedTransactionForm,
  transactionGiven?: TransactionPrototype,
  generateAllChildren = true
): Transaction | PairedTransaction {
  if (transactionForm?.transactionA) {
    return generatePairedTransactionFromForm(transactionForm, transactionGiven, generateAllChildren);
  } else {
    return generateSingleTransactionFromForm(transactionForm, transactionGiven, generateAllChildren);
  }
}

function generateSingleTransactionFromForm(
  transactionForm: TransactionForm | ChildTransactionForm,
  transactionGiven?: TransactionPrototype,
  generateAllChildren = true
): Transaction {
  const transaction: TransactionPrototype = {
    transaction_name: transactionForm['transaction_name'],
  };
  if (transactionForm?.transaction_category)
    transaction['transaction_category'] = transactionForm?.transaction_category;

  // Generate the Entity Type
  transaction['entity_type'] = genEntityType(transactionForm, transactionGiven);

  // Generate the Contact and check whether or not it has already been made
  transaction['contact'] = retrieveContact(transactionForm, transactionGiven);
  if (transaction['contact']) {
    transaction['isNewContact'] = transactionGiven?.isNewContact ?? true;
  } else {
    const eType = transaction['entity_type'];
    if (eType === 'Committee') transaction['contact'] = generateContactCommittee({});
    if (eType === 'Individual') transaction['contact'] = generateContactIndividual({});
    if (eType === 'Organization') transaction['contact'] = generateContactOrganization({});
    transaction['isNewContact'] = true;
  }

  // Generate the values of the fields within the transaction
  transaction['fields'] = {};
  for (const fieldKey of Object.keys(transactionForm['fields'])) {
    const field = transactionForm['fields'][fieldKey];
    if (transactionGiven?.fields && Object.keys(transactionGiven?.fields).includes(fieldKey)) {
      transaction['fields'][fieldKey] = transactionGiven.fields[fieldKey];
    } else {
      const generator = field['generator'];
      if (field['required'] || _.random(10) < 2)
        transaction['fields'][fieldKey] = generator(...(field['genArgs'] ?? []));
    }
  }

  // Generate child transactions
  if (transactionForm['childTransactions']) {
    transaction['childTransactions'] = [];
    for (const childTransactionForm of transactionForm['childTransactions']) {
      transaction['childTransactions'] = [
        ...transaction['childTransactions'],
        generateTransactionFromForm(childTransactionForm, undefined, generateAllChildren),
      ];
    }
  }

  return transaction as Transaction;
}

function generatePairedTransactionFromForm(
  transactionForm: PairedTransactionForm,
  transactionGiven?: TransactionPrototype,
  generateAllChildren = true
): PairedTransaction {
  const transaction: object = {};
  transaction['transaction_name'] = transactionForm['transaction_name'];

  if (transactionForm?.transaction_category)
    transaction['transaction_category'] = transactionForm?.transaction_category;

  const transactionA = generateSingleTransactionFromForm(transactionForm.transactionA);
  const transactionB = generateSingleTransactionFromForm(transactionForm.transactionB);
  transaction['transactionA'] = transactionA;
  transaction['transactionB'] = transactionB;

  return transaction as PairedTransaction;
}
