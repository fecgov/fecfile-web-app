import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validate, ValidationError } from 'fecfile-validate';
import { JsonSchema } from '../interfaces/json-schema.interface';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  formValidatorSchema: JsonSchema | null = null;
  formValidatorForm: FormGroup | null = null;

  /**
   * Validate a data object against a JSON Schema document
   * @param {JsonSchema} schema
   * @param data
   * @param {string[] | undefined} fieldsToValidate
   * @returns {ValidationError[]} array of validation errors if any
   */
  // prettier-ignore
  validate(schema: JsonSchema, data: any, fieldsToValidate: string[] = []): ValidationError[] { // eslint-disable-line @typescript-eslint/no-explicit-any
    const errors: ValidationError[] = validate(schema, data, fieldsToValidate);
    return errors;
  }

  /**
   * Returns an array of the property fields of a JSON schema.
   * @param {JsonSchema} schema
   * @returns {string[]} list of property names
   */
  getSchemaProperties(schema: JsonSchema): string[] {
    return Object.keys(schema.properties);
  }

  /**
   * Returns an object to pass ot the FormBuilder group() method when creating
   * a reactive Angular form. The validation rules inserted into the form group
   * definition are figured out from the JSON schema files passed into the method.
   * @param {string[]} properties
   * @returns data structure to pass to the FormBuilder group() method
   */
  getFormGroupFields(properties: string[]) {
    const group: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    properties.forEach((property) => (group[property] = ['', [this.formValidator(property)]]));
    return group;
  }

  getFormValues(form: FormGroup) {
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

    if (this.formValidatorSchema) {
      this.getSchemaProperties(this.formValidatorSchema).forEach((property: string) => {
        if (form?.get(property)?.value) {
          formValues[property] = form?.get(property)?.value;
        }
      });
    }

    return formValues;
  }

  formValidator(property: string): ValidatorFn {
    return (): ValidationErrors | null => {
      if (!this.formValidatorSchema || !this.formValidatorForm) {
        return null;
      }

      const errors = this.validate(this.formValidatorSchema, this.getFormValues(this.formValidatorForm), [property]);

      if (errors.length > 0) {
        const result: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        errors.forEach((error) => {
          if (error.keyword === 'required') {
            result.required = true;
          }
          if (error.keyword === 'minLength') {
            result.minlength = { requiredLength: error.params['limit'] };
          }
          if (error.keyword === 'maxLength') {
            result.maxlength = { requiredLength: error.params['limit'] };
          }
          if (error.keyword === 'pattern') {
            result.pattern = {
              pattern: error.params['pattern'],
              message: error.message,
            };
          }
        });
        return result;
      }

      return null;
    };
  }
}
