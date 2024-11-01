import { plainToInstance } from 'class-transformer';

export class CashOnHand {
  id?: string;
  year?: string;
  cash_on_hand?: number;

  // prettier-ignore
  static fromJSON(json: any): CashOnHand { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(CashOnHand, json);
  }
}
