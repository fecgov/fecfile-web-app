export interface Transaction {
  id: string | null;
  report_id: string | null;
  form_type: string | null;
  filer_committee_id_number: string | null;
  transaction_id: string | null;
  transaction_type_identifier: string | null;
  contribution_purpose_descrip: string | null;
  parent_transaction_id: string | null;
}
