export interface Transaction {
  id: number | undefined;
  report_id: number | undefined;
  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | undefined;
  transaction_type_identifier: string | undefined;
  contribution_purpose_descrip: string | undefined;
  parent_transaction_id: number | undefined;
}
