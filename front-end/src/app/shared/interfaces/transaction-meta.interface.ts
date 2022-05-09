import { JsonSchema } from './json-schema.interface';
import { Schedule } from './schedule.interface';

export interface TransactionMeta {
  scheduleId: string;
  componentGroupId: string;
  schema: JsonSchema;
  transaction: Schedule;
}
