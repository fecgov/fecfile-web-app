import { FormGroup, Validators } from '@angular/forms';
import { validate, ValidationError } from 'fecfile-validate';
import { JsonSchema } from '../interfaces/json-schema.interface';

export class ValidateUtils {
  /**
   * Validate a data object against a JSON Schema document
   * @param {JsonSchema} schema
   * @param data
   * @returns {ValidationError[]} array of validation errors if any
   */
  // prettier-ignore
  static validate(schema: JsonSchema, data: any): ValidationError[] { // eslint-disable-line @typescript-eslint/no-explicit-any
    const errors: ValidationError[] = validate(schema, data);
    console.log(errors);
    return errors;
  }

  /**
   * Returns an object to pass ot the FormBuilder group() method when creating
   * a reactive Angular form. The validation rules inserted into the form group
   * definition are figured out from the JSON schema files passed into the method.
   * @param {JsonSchema[]} schemas
   * @returns data structure to pass to the FormBuilder group() method
   */
  static getFormGroupFields(schemas: JsonSchema[]) {
    let groupFields = {};

    // Loop through each schema passed and merge the resulting group structures into one
    schemas.forEach((schema: JsonSchema) => {
      const fields: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      for (const property in schema.properties) {
        const validators = [];
        if (schema.required.includes(property)) {
          validators.push(Validators.required);
        }
        if ('minLength' in schema.properties[property] && schema.properties[property].minLength > 0) {
          validators.push(Validators.minLength(schema.properties[property].minLength));
        }
        if ('maxLength' in schema.properties[property] && schema.properties[property].maxLength > 0) {
          validators.push(Validators.maxLength(schema.properties[property].maxLength));
        }
        if ('pattern' in schema.properties[property]) {
          validators.push(Validators.pattern(schema.properties[property].pattern));
        }
        fields[property] = ['', validators];
      }
      groupFields = { ...groupFields, ...fields };
    });
    return groupFields;
  }

  /**
   * Returns an array of the property fields of a JSON schema.
   * @param {JsonSchema} schema
   * @returns {string[]} list of property names
   */
  static getSchemaProperties(schema: JsonSchema): string[] {
    return Object.keys(schema.properties);
  }

  /**
   * Given a form group and a schema, check to see if the angular form controls indicate invalid data in the form.
   * This is not to be confused with checking the form values against the JSON schema with the fecfile validator.
   * @param {FormGroup} form
   * @param {JsonSchema} schema
   * @returns {boolean} true when form values are invalid
   */
  static isFormInvalid(form: FormGroup, schema: JsonSchema): boolean {
    const properties: string[] = this.getSchemaProperties(schema);
    return properties.reduce(
      (isInvalid: boolean, property: string) => isInvalid || !!form?.get(property)?.invalid,
      false
    );
  }
}
