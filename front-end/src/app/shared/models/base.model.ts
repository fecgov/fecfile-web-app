import { instanceToPlain } from 'class-transformer';

export abstract class BaseModel {
  toJson() {
    return instanceToPlain(this);
  }
}
