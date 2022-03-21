import { instanceToPlain } from 'class-transformer';

export abstract class BaseModel {
  toJson(): any {
    return instanceToPlain(this);
  }
}
