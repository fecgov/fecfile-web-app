/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { JsonSchema, validate } from 'fecfile-validate';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';
import { SubscriptionFormControl } from './subscription-form-control';
import { maxLength, minLength, PathKind, pattern, required, SchemaPathTree } from '@angular/forms/signals';
import { StringDate } from '../components/calendar/calendar.component';

export const requiredMessage = 'This is a required field.';

export class SchemaUtils {
  /**
   * Returns an array of the property fields for a given JSON schema.
   * @param {JsonSchema} schema
   * @returns {string[]} list of property names
   */
  static getSchemaProperties(schema: JsonSchema | undefined): string[] {
    if (schema) {
      return Object.keys(schema.properties);
    }
    return [];
  }

  /**
   * Returns an object to pass ot the FormBuilder group() method when creating
   * a reactive Angular form whose validation will be managed by this service.
   * @param {string[]} properties
   * @returns data structure to pass to the FormBuilder group() method
   */
  static getFormGroupFields(properties: string[]) {
    const group: any = {};
    properties.forEach((property) => (group[property] = new SubscriptionFormControl('')));
    return group;
  }

  static getFormInitialValue(schemaProperties: string[]) {
    const initialValue: Record<string, any> = {};
    schemaProperties.forEach((prop) => {
      initialValue[prop] = '';
    });
    return initialValue;
  }

  static readonly noBlur = [
    'statusBy',
    'committee_type',
    'filing_frequency',
    'report_code',
    'report_type_category',
    'change_of_address',
    'support_oppose_code',
    'userCertified',
    'secured',
    'memo_code',
    'loan_restructured',
    'line_of_credit',
    'others_liable',
    'perfected_interest',
    'future_income',
    'collateral',
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getFormGroupFieldsNoBlur(properties: string[], _jsonSchema?: JsonSchema) {
    const group: any = {};
    properties.forEach((property) => {
      const updateOn = SchemaUtils.getUpdateOn(property);
      group[property] = new SubscriptionFormControl<string | Date | null | undefined>('', {
        updateOn,
      });
    });

    return group;
  }

  private static getUpdateOn(property: string): 'change' | 'blur' {
    return SchemaUtils.noBlur.includes(property) ? 'change' : 'blur';
  }

  /**
   *
   * @param {FormGroup} form
   * @param {JsonSchema} jsonSchema - the schema to use in the form element custom validator.
   * @param {string[]} propertiesSubset - Only get values for the listed subset of schema parameters.
   * @returns object containing the form property values limited to the current validation schema
   * This method will 'null' any schema values that do not have a form value and, more importantly,
   * set those form fields with an empty '' value to null for the backend. It will also convert
   * strings to number types when necessary.
   */
  static getFormValues(form: FormGroup, jsonSchema?: JsonSchema, propertiesSubset: string[] = []) {
    const formValues: any = {};

    if (jsonSchema) {
      SchemaUtils.getSchemaProperties(jsonSchema).forEach((property: string) => {
        if (propertiesSubset.length > 0 && !propertiesSubset.includes(property)) {
          return;
        }
        formValues[property] = SchemaUtils.getPropertyValue(property, form, jsonSchema);
      });
    }

    return formValues;
  }

  /**
   *
   * @param transaction Transaction object to get values from.
   * This method returns "non-form" values that may be required
   * for validation of form fields.
   */
  static getNonFormValues(transaction?: Transaction) {
    const values: any = {};
    if (transaction) {
      values['transaction_type_identifier'] = transaction.transaction_type_identifier;
    }
    return values;
  }

  /**
   * Convert the form input value to the appropriate type.
   * @param {string} property
   * @param {FormGroup} form
   * @param {JsonSchema} jsonSchema - the schema to use in the form element custom validator.
   * @returns
   */
  private static getPropertyValue(property: string, form: FormGroup, jsonSchema?: JsonSchema) {
    // Undefined and empty strings are set to null.
    if (
      form?.get(property)?.value === undefined ||
      form?.get(property)?.value === '' ||
      form?.get(property)?.value === null
    ) {
      return null;
    }

    // Convert a string to number if expected in the schema.
    if (
      (Array.isArray(jsonSchema?.properties[property].type) &&
        jsonSchema?.properties[property].type.includes('number')) ||
      jsonSchema?.properties[property].type === 'number'
    ) {
      return Number(form?.get(property)?.value);
    }

    // Convert date to string
    if (Object.prototype.toString.call(form?.get(property)?.value) === '[object Date]') {
      return DateUtils.convertDateToFecFormat(form?.get(property)?.value);
    }

    // All else are strings so copy straight into value
    return form?.get(property)?.value;
  }

  /**
   * This method adds JSON schema validators to a form
   * for the JsonSchema passed in, removing existing
   * validators first (if clearExistingValidators === true).
   * @param form formGroup to add validators to.
   * @param jsonSchema JSON schema to add validators for.
   * @param clearExistingValidators flag specifying whether
   * @param transaction (if any) to add validators for.
   *   to remove existing form validators first for each field.
   */
  static addJsonSchemaValidators(
    form: FormGroup,
    jsonSchema: JsonSchema,
    clearExistingValidators: boolean,
    transaction?: Transaction,
  ) {
    for (const key in form.controls) {
      if (clearExistingValidators) {
        form.get(key)?.clearAsyncValidators();
      }
      form.get(key)?.addAsyncValidators(SchemaUtils.jsonSchemaValidator(key, form, jsonSchema, transaction));
    }
    form.updateValueAndValidity();
  }

  /**
   * ng validator function for reactive forms. Provides validation based on the
   * JSON schema and form in the jsonSchema and formGroup properties
   * @param {string} property - name of form property to validate
   * @param {JsonSchema} jsonSchema - the schema to use in the form element custom validator.
   * @param {FormGroup} form - the ng reactive form to use in the form element custom validator
   * @param {Transaction} transaction - Transaction (if any) associated with the property passed in.
   * @returns {ValidationErrors | undefined} generated by the Ajv validation library
   */
  static jsonSchemaValidator(
    property: string,
    form: FormGroup,
    jsonSchema: JsonSchema,
    transaction?: Transaction,
  ): AsyncValidatorFn {
    return async (): Promise<ValidationErrors | null> => {
      const data = {
        ...SchemaUtils.getFormValues(form, jsonSchema),
        ...SchemaUtils.getNonFormValues(transaction),
      };

      const errors = await validate(jsonSchema, data, [property]);
      if (errors.length) {
        const result: ValidationErrors = {};
        errors.forEach((error) => {
          // The keyword === 'type' indicates a conditional check fail as part of an 'anyOf' JSON schema rule
          // Basically, we tried to pass a null to a JSON schema type: ["string"] rule rather than a type: ["string", "null"] rule.
          if (error.keyword === 'required' || (error.keyword === 'type' && error['params']['type'] === 'string')) {
            result['required'] = true;
          }
          if (error.keyword === 'minLength') {
            result['minlength'] = { requiredLength: error.params['limit'] };
          }
          if (error.keyword === 'maxLength' || error.keyword === 'maximum') {
            result['maxlength'] = { requiredLength: error.params['limit'] };
          }
          if (error.keyword === 'minimum') {
            result['min'] = { min: error.params['limit'] };
          }
          if (error.keyword === 'exclusiveMinimum') {
            result['exclusiveMin'] = { exclusiveMin: error.params['limit'] };
          }
          if (error.keyword === 'maximum') {
            result['max'] = { max: error.params['limit'] };
          }
          if (error.keyword === 'exclusiveMaximum') {
            result['exclusiveMax'] = { exclusiveMax: error.params['limit'] };
          }
          if (error.keyword === 'pattern') {
            result['pattern'] = { requiredPattern: error.params['pattern'] };
          }
          if (error.keyword === 'enum') {
            result['pattern'] = { requiredPattern: `Allowed values: ${error.params['allowedValues'].join(', ')}` };
          }
          if (error.keyword === 'type' && error.params['type'] === 'number') {
            if (
              form?.get(error.path)?.value === '' ||
              form?.get(error.path)?.value === null ||
              form?.get(error.path)?.value === undefined
            ) {
              result['required'] = true;
            } else {
              result['pattern'] = { requiredPattern: 'Value must be a number' };
            }
          }
          if (error.keyword === 'type' && error.params['type'].includes('boolean')) {
            result['pattern'] = { requiredPattern: error.message };
          }
        });
        return result;
      }

      return null;
    };
  }

  static async signalJsonSchemaValidator(
    property: string,
    formData: any,
    jsonSchema: JsonSchema,
    transaction?: Transaction,
  ) {
    const data = {
      ...formData,
      ...SchemaUtils.getNonFormValues(transaction),
    };
    const errors = await validate(jsonSchema, data, [property]);
    if (errors.length === 0) return null;
    const result: ValidationErrors = {};
    errors.forEach((error) => {
      // The keyword === 'type' indicates a conditional check fail as part of an 'anyOf' JSON schema rule
      // Basically, we tried to pass a null to a JSON schema type: ["string"] rule rather than a type: ["string", "null"] rule.
      if (error.keyword === 'required' || (error.keyword === 'type' && error['params']['type'] === 'string')) {
        result['required'] = true;
      }
      if (error.keyword === 'minLength') {
        result['minlength'] = { requiredLength: error.params['limit'] };
      }
      if (error.keyword === 'maxLength' || error.keyword === 'maximum') {
        result['maxlength'] = { requiredLength: error.params['limit'] };
      }
      if (error.keyword === 'minimum') {
        result['min'] = { min: error.params['limit'] };
      }
      if (error.keyword === 'exclusiveMinimum') {
        result['exclusiveMin'] = { exclusiveMin: error.params['limit'] };
      }
      if (error.keyword === 'maximum') {
        result['max'] = { max: error.params['limit'] };
      }
      if (error.keyword === 'exclusiveMaximum') {
        result['exclusiveMax'] = { exclusiveMax: error.params['limit'] };
      }
      if (error.keyword === 'pattern') {
        result['pattern'] = { requiredPattern: error.params['pattern'] };
      }
      if (error.keyword === 'enum') {
        result['pattern'] = { requiredPattern: `Allowed values: ${error.params['allowedValues'].join(', ')}` };
      }
      if (error.keyword === 'type' && error.params['type'] === 'number') {
        // if (
        //   form?.get(error.path)?.value === '' ||
        //   form?.get(error.path)?.value === null ||
        //   form?.get(error.path)?.value === undefined
        // ) {
        //   result['required'] = true;
        // } else {
        //   result['pattern'] = { requiredPattern: 'Value must be a number' };
        // }
      }
      if (error.keyword === 'type' && error.params['type'].includes('boolean')) {
        result['pattern'] = { requiredPattern: error.message };
      }
    });
    return result;
  }

  static schemaFormValidatorBuilder<T>(
    schema: JsonSchema,
    schemaPath: SchemaPathTree<T, PathKind.Root>,
    schemaFieldMap: Record<string, string[]>,
  ) {
    const requiredFields = schema['required'] || [];
    Object.keys(schema.properties).forEach((key) => {
      const propConfig = schema.properties[key];
      const path = schemaFieldMap[key];
      if (!path) return;

      const fieldPath = resolveFieldPath(schemaPath, path);
      if (!fieldPath) return;

      if (requiredFields.includes(key)) required(fieldPath, { message: requiredMessage });
      if (propConfig.minLength !== undefined)
        minLength(fieldPath, propConfig.minLength, {
          message: `This field must contain at least ${propConfig.minLength} alphanumeric characters.`,
        });
      if (propConfig.maxLength !== undefined) {
        maxLength(fieldPath, propConfig.maxLength, {
          message: `This field cannot contain more than ${propConfig.maxLength} alphanumeric characters.`,
        });
      }

      if (propConfig.pattern) {
        const regex = new RegExp(propConfig.pattern);
        pattern(
          fieldPath,
          ({ value }) => {
            let v = value() as StringDate;
            if (v === '' || v === null || v === undefined) {
              return undefined;
            }

            if (v instanceof Date) {
              if (Number.isNaN(v.getTime())) return undefined;

              const year = v.getFullYear();
              const month = String(v.getMonth() + 1).padStart(2, '0');
              const day = String(v.getDate()).padStart(2, '0');
              v = `${year}-${month}-${day}`;
            }

            if (regex.test(v)) {
              return undefined;
            }

            return /$^/;
          },
          {
            message: 'This field contains characters that are not allowed.',
          },
        );
      }
    });

    if (schema.allOf && Array.isArray(schema.allOf)) {
      schema.allOf.forEach((clause) => {
        if (!clause.if || !clause.then) return;

        const ifProps = clause.if.properties || {};
        const triggerKeys = Object.keys(ifProps);
        if (triggerKeys.length === 0) return;

        const triggerKey = triggerKeys[0];
        const expectedValue = ifProps[triggerKey].const;
        const thenRequired = clause.then.required || [];

        const triggerPath = schemaFieldMap[triggerKey];
        if (!triggerPath) return;

        thenRequired.forEach((targetFieldKey: string) => {
          const targetPath = schemaFieldMap[targetFieldKey];
          if (!targetPath) return;

          const targetFieldFormPath = resolveFieldPath(schemaPath, targetPath);
          const triggerFieldFormPath = resolveFieldPath(schemaPath, triggerPath);

          if (targetFieldFormPath && triggerFieldFormPath) {
            required(targetFieldFormPath, {
              when: ({ valueOf }) => {
                return valueOf(triggerFieldFormPath) === expectedValue;
              },
              message: requiredMessage,
            });
          }
        });
      });
    }
  }

  static generatePathMapFromForm<T>(
    obj: T,
    currentPath: string[] = [],
    map: Record<string, string[]> = {},
  ): Record<string, string[]> {
    if (!obj || typeof obj !== 'object') return map;

    Object.keys(obj).forEach((key) => {
      const nextPath = [...currentPath, key];
      const propertyValue = obj[key as keyof T];

      if (propertyValue && typeof propertyValue === 'object' && !Array.isArray(propertyValue)) {
        SchemaUtils.generatePathMapFromForm(propertyValue, nextPath, map);
      } else {
        map[key] = nextPath;
      }
    });

    return map;
  }

  static flattenPayload(data: any): Record<string, any> {
    const flat: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        Object.assign(flat, data[key]);
      } else {
        flat[key] = data[key];
      }
    });

    const flat2: Record<string, any> = {};
    Object.keys(flat).forEach((key) => {
      if (flat[key] === '') flat2[key] = null;
      else flat2[key] = flat[key];
    });

    return flat2;
  }
}

function resolveFieldPath<T>(schemaPath: SchemaPathTree<T, PathKind.Root>, path: string[]): any {
  return path.reduce((current: any, key: string) => current?.[key], schemaPath);
}
