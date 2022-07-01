export interface Transaction {
  id: number | null;
  report_id: number | null;
  form_type: string | null;
  filer_committee_id_number: string | null;
  transaction_id: string | null;
  transaction_type_identifier: string | null;
  contribution_purpose_descrip: string | null;
}
