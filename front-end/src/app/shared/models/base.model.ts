import { instanceToPlain, TransformFnParams, TransformationType } from 'class-transformer';
import { DateUtils } from '../utils/date.utils';

export abstract class BaseModel {
  toJson() {
    return instanceToPlain(this, { enableCircularCheck: true });
  }

  /**
   * Function handler for transforming the model class properties from Date to 'yyyy-mm-dd' string in
   * model class.
   *
   * @param {TransformFnParams} params
   * @returns {Date | string | null} Date of either string or Date type, depending on the transform
   */
  public static dateTransform(params: TransformFnParams): Date | string | null {
    if (params.type === TransformationType.PLAIN_TO_CLASS && params.value && typeof params.value === 'string') {
      return DateUtils.convertFecFormatToDate(params.value);
    }
    if (
      params.type === TransformationType.CLASS_TO_PLAIN &&
      params.value &&
      Object.prototype.toString.call(params.value) === '[object Date]'
    ) {
      return DateUtils.convertDateToFecFormat(params.value);
    }
    return params.value;
  }
}
