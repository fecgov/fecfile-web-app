import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { validate, ValidationError } from 'fecfile-validate';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { Transaction } from '../models/transaction.model';
import { DateUtils } from './date.utils';

export class ValidateUtils {

  /**
   * Validate a data object against a JSON Schema document
   * @param {JsonSchema} schema
   * @param data
   * @param {string[]} fieldsToValidate
   * @returns {ValidationError[]} array of validation errors if any
   */
  // prettier-ignore
  static validate(schema: JsonSchema, data: any, fieldsToValidate: string[] = []): ValidationError[] { // eslint-disable-line @typescript-eslint/no-explicit-any
    return validate(schema, data, fieldsToValidate);
  }

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
  static getFormGroupFields(properties: string[], transaction?: Transaction,
    formValidatorSchema?: JsonSchema, formValidatorForm?: FormGroup<any>) {
    const group: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    properties.forEach((property) => (group[property] = ['',
      [ValidateUtils.formValidator(property, transaction,
        formValidatorSchema, formValidatorForm)]]));
    return group;
  }

  /**
   *
   * @param {FormGroup} form
   * @param {string[]} propertiesSubset - Only get values for the listed subset of schema parameters.
   * @param {JsonSchema} formValidatorSchema - the schema to use in the form element custom validator.
   * @returns object containing the form property values limited to the current validation schema
   * This method will 'null' any schema values that do not have a form value and, more importantly,
   * set those form fields with an empty '' value to null for the backend. It will also convert
   * strings to number types when necessary.
   */
  static getFormValues(form: FormGroup, propertiesSubset: string[] = [],
    formValidatorSchema?: JsonSchema) {
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (formValidatorSchema) {
      ValidateUtils.getSchemaProperties(formValidatorSchema).forEach((property: string) => {
        if (propertiesSubset.length > 0 && !propertiesSubset.includes(property)) {
          return;
        }
        formValues[property] = ValidateUtils.getPropertyValue(property, form);
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
      values['transaction_type_identifier'] =
        transaction.transaction_type_identifier;
    }
    return values;
  }

  /**
   * Convert the form input value to the appropriate type.
   * @param {string} property
   * @param {FromGroup} form
   * @param {JsonSchema} formValidatorSchema - the schema to use in the form element custom validator.
   * @returns
   */
  private static getPropertyValue(property: string, form: FormGroup,
    formValidatorSchema?: JsonSchema) {
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
      (Array.isArray(formValidatorSchema?.properties[property].type) &&
        formValidatorSchema?.properties[property].type.includes('number')) ||
      formValidatorSchema?.properties[property].type === 'number'
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
   * ng validator function for reactive forms. Provides validation based on the
   * JSON schema and form in the formValidationSchema and formValidationForm properties
   * @param {string} property - name of form property to validate
   * @param {Transaction} transaction - Transaction (if any) associated with the property passed in.
   * @param {JsonSchema} formValidatorSchema - the schema to use in the form element custom validator.
   * @param {FormGroup} formValidatorForm - the ng reactive form to use in the form element custom 
   * validator
   * @returns {ValidationErrors | undefined}
   */
  static formValidator(property: string, transaction?: Transaction,
    formValidatorSchema?: JsonSchema, formValidatorForm?: FormGroup): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!formValidatorSchema || !formValidatorForm) {
        return null;
      }
      const data = {
        ...ValidateUtils.getFormValues(
          formValidatorForm, undefined, formValidatorSchema),
        ...ValidateUtils.getNonFormValues(transaction)
      }
      const errors: ValidationError[] = ValidateUtils.validate(
        formValidatorSchema,
        data,
        [property]
      );

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
              formValidatorForm?.get(error.path)?.value === '' ||
              formValidatorForm?.get(error.path)?.value === null ||
              formValidatorForm?.get(error.path)?.value === undefined
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

  static passwordValidator(): ValidatorFn | ValidatorFn[] {
    const v = Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern('.*[A-Z].*'),
      Validators.pattern('.*[a-z].*'),
      Validators.pattern('.*[0-9].*'),
      Validators.pattern('.*[!@#$%&*()].*'),
    ]);

    return v ? v : [];
  }
}
