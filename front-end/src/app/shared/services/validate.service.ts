import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validate, ValidationError } from 'fecfile-validate';
import { JsonSchema } from '../interfaces/json-schema.interface';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  /**
   * @property - This property is a placeholder for the schema to use in the form element
   * custom validator located in the method formValidator() below.
   */
  formValidatorSchema: JsonSchema | null = null;

  /**
   * @property - This property is a placeholder for the ng reactive form to use in the form
   * element custom validator located in the method formValidator() below.
   */
  formValidatorForm: FormGroup | null = null;

  /**
   * Validate a data object against a JSON Schema document
   * @param {JsonSchema} schema
   * @param data
   * @param {string[]} fieldsToValidate
   * @returns {ValidationError[]} array of validation errors if any
   */
  // prettier-ignore
  validate(schema: JsonSchema, data: any, fieldsToValidate: string[] = []): ValidationError[] { // eslint-disable-line @typescript-eslint/no-explicit-any
    return validate(schema, data, fieldsToValidate);
  }

  /**
   * Returns an array of the property fields for a given JSON schema.
   * @param {JsonSchema} schema
   * @returns {string[]} list of property names
   */
  getSchemaProperties(schema: JsonSchema): string[] {
    return Object.keys(schema.properties);
  }

  /**
   * Returns an object to pass ot the FormBuilder group() method when creating
   * a reactive Angular form whose validation will be managed by this service.
   * @param {string[]} properties
   * @returns data structure to pass to the FormBuilder group() method
   */
  getFormGroupFields(properties: string[]) {
    const group: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    properties.forEach((property) => (group[property] = ['', [this.formValidator(property)]]));
    return group;
  }

  /**
   *
   * @param {FormGroup} form
   * @returns object containing the form property values limited to the current validation schema
   */
  getFormValues(form: FormGroup) {
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (this.formValidatorSchema) {
      this.getSchemaProperties(this.formValidatorSchema).forEach((property: string) => {
        if (form?.get(property)?.value) {
          formValues[property] = form?.get(property)?.value;
        } else {
          formValues[property] = null;
        }
      });
    }

    return formValues;
  }

  /**
   * ng validator function for reactive forms. Provides validation based on the
   * JSON schema and form in the formValidationSchema and formValidationForm properties
   * @param {string} property - name of form property to validate
   * @returns {ValidationErrors | null}
   */
  formValidator(property: string): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.formValidatorSchema || !this.formValidatorForm) {
        return null;
      }

      const errors: ValidationError[] = this.validate(
        this.formValidatorSchema,
        this.getFormValues(this.formValidatorForm),
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
          if (error.keyword === 'maxLength') {
            result['maxlength'] = { requiredLength: error.params['limit'] };
          }
          if (error.keyword === 'pattern') {
            result['pattern'] = { requiredPattern: error.params['pattern'] };
          }
          if (error.keyword === 'enum') {
            result['pattern'] = { requiredPattern: `Allowed values: ${error.params['allowedValues'].join(', ')}` };
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
