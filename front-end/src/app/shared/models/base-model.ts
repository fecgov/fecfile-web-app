import { instanceToPlain } from 'class-transformer';

export abstract class BaseModel {
  getJson(): any {
    return instanceToPlain(this);
  }
}
