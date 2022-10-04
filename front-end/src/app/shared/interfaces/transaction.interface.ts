export interface Transaction {
  id: string | undefined;
  report_id: string | undefined;
  contact_id: string | undefined;
  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | null;
  transaction_type_identifier: string | undefined;
  contribution_purpose_descrip: string | undefined;
  parent_transaction_id: string | undefined;
}
