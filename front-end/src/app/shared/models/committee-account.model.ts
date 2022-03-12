import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class CommitteeAccount extends BaseModel {
  city: string | null = null;
  cmte_dsgn: string | null = null;
  cmte_filed_type: string | null = null;
  cmte_filing_freq: string | null = null;
  cmte_type: string | null = null;
  cmte_type_category: string | null = null;
  committeeid: string = '';
  committeename: string = '';
  created_at: string | null = null;
  email_on_file: string | null = null;
  email_on_file_1: string | null = null;
  fax: string | null = null;
  levin_accounts: string | null = null;
  phone_number: string | null = null;
  state: string | null = null;
  street1: string | null = null;
  street2: string | null = null;
  treasureremail: string | null = null;
  treasurerfirstname: string | null = null;
  treasurerlastname: string | null = null;
  treasurermiddlename: string | null = null;
  treasurerphone: string | null = null;
  treasurerprefix: string | null = null;
  treasurersuffix: string | null = null;
  website: string | null = null;
  zipcode: string | null = null;

  static getInstance(json: any): CommitteeAccount {
    return plainToClass(CommitteeAccount, json);
  }
}
