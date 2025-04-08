import { plainToInstance } from 'class-transformer';

export class CommitteeManagementEvent {
  id = '';
  user_uuid = '';
  event = '';
  created = '';

  // prettier-ignore
  static fromJSON(json: any): CommitteeManagementEvent { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(CommitteeManagementEvent, json);
  }
}
