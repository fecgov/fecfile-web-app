import { MaybeFieldTree, PathKind, SchemaPath, validate, validateHttp, validateTree } from '@angular/forms/signals';
import { CookieService } from 'ngx-cookie-service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { getHeaders, QueryParams } from 'app/shared/services/api.service';
import { StringDate } from './date.input';
import { Coverage } from 'app/tools/election-cycle/election-cycle.model';

const invalidDateMessage = 'This date does not follow the correct format, e.g. 01/01/2020';
export function validateDate(schemaPath: SchemaPath<StringDate, 1, PathKind.Child>) {
  validate(schemaPath, ({ value }) => {
    let rawValue = value();
    if (!rawValue) return null;
    if (typeof rawValue === 'string') {
      // Fixes paste issue
      if (rawValue.includes('MM/DD/YYYY')) rawValue = rawValue.replaceAll('MM/DD/YYYY', '');
      const parsedTimestamp = Date.parse(rawValue);
      if (Number.isNaN(parsedTimestamp) || /[a-zA-Z]/.test(rawValue)) {
        return {
          kind: 'pattern',
          message: invalidDateMessage,
        };
      }
    }

    if (rawValue instanceof Date && Number.isNaN(rawValue.getTime())) {
      return {
        kind: 'pattern',
        message: invalidDateMessage,
      };
    }

    return null;
  });
}

export function validateDateAfter(coverageSchema: SchemaPath<Coverage>) {
  validateTree(coverageSchema, ({ value, fieldTree }) => {
    const start = value().startDate;
    const end = value().endDate;

    if (!start || !end || typeof start === 'string' || typeof end === 'string') return null;
    if (start.getTime() > end.getTime())
      return {
        kind: 'isAfter',
        message: `END DATE must be after START DATE`,
        fieldTree: fieldTree.endDate,
      };
    return null;
  });
}

export function validateDateOverlap(
  coverageSchema: SchemaPath<Coverage>,
  url: string,
  cookieService: CookieService,
  options?: {
    excludeId?: string;
    message?: string;
  },
) {
  const errorMessage = options?.message ?? 'The selected dates overlap with an existing period.';
  let startField: MaybeFieldTree<Date | null, string>;
  let endField: MaybeFieldTree<Date | null, string>;
  validateHttp(coverageSchema, {
    request: ({ value, fieldTree }) => {
      const start = value().startDate;
      const end = value().endDate;
      startField = fieldTree.startDate;
      endField = fieldTree.endDate;

      if (
        start instanceof Date &&
        !Number.isNaN(start.getTime()) &&
        end instanceof Date &&
        !Number.isNaN(end.getTime()) &&
        end >= start
      ) {
        const startStr = DateUtils.convertDateToFecFormat(start);
        const endStr = DateUtils.convertDateToFecFormat(end);
        const params: QueryParams = { start_date: startStr, end_date: endStr };
        if (options?.excludeId) params['exclude_id'] = options.excludeId;

        return {
          url,
          withCredentials: true,
          headers: getHeaders(cookieService),
          params,
        };
      }

      return undefined;
    },

    onSuccess: (response: { start_date: boolean; end_date: boolean }) => {
      const errors = [];
      if (response?.start_date) {
        errors.push({
          kind: 'overlap',
          message: errorMessage,
          fieldTree: startField,
        });
      }
      if (response?.end_date) {
        errors.push({
          kind: 'overlap',
          message: errorMessage,
          fieldTree: endField,
        });
      }
      return errors.length > 0 ? errors : null;
    },

    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify date coverage overlap.',
    }),
  });
}
