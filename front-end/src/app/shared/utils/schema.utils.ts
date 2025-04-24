import { AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { JsonSchema, validate } from 'fecfile-validate';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';
import { SignalFormControl } from './signal-form-control';
import { Injector } from '@angular/core';

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
  static getFormGroupFields(injector: Injector, properties: string[]) {
    const group: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    properties.forEach((property) => (group[property] = new SignalFormControl(injector, '')));
    return group;
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
    'future_income',
    'collateral',
    'perfected_interest',
  ];
  static readonly DATE_FORMAT = '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';

  static getFormGroupFieldsNoBlur(injector: Injector, properties: string[], jsonSchema?: JsonSchema) {
    const group: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const dateProps = Object.keys(jsonSchema?.properties ?? {}).filter(
      (key) => jsonSchema?.properties[key]?.pattern === SchemaUtils.DATE_FORMAT,
    );
    properties.forEach((property) => {
      const updateOn = SchemaUtils.getUpdateOn(property, dateProps);
      group[property] = new SignalFormControl<string | Date | null | undefined>(injector, '', {
        updateOn,
      });
    });

    return group;
  }

  private static getUpdateOn(property: string, dateProps: string[]): 'change' | 'blur' | 'submit' {
    if (dateProps.includes(property)) return 'submit';
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
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

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
    const values: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
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
}
