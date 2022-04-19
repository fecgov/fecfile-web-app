import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validate, ValidationError } from 'fecfile-validate';
import { JsonSchema } from '../interfaces/json-schema.interface';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor() {}

  validate(
    schema: Record<string, string | number | boolean | null>,
    data: Record<string, string | number | boolean | null>
  ): ValidationError[] {
    const errors: ValidationError[] = validate(schema, data);
    console.log(errors);
    return errors;
  }

  getFormGroupFields(schemas: JsonSchema[]) {
    let groupFields = {};
    schemas.forEach((schema: JsonSchema) => {
      const schemaFields: any = {};
      for (const property in schema.properties) {
        const validators = [];
        if (schema.required.includes(property)) {
          validators.push(Validators.required);
        }
        if ('maxLength' in schema.properties[property]) {
          validators.push(Validators.maxLength(schema.properties[property].maxLength));
        }
        if ('pattern' in schema.properties[property]) {
          validators.push(Validators.pattern(schema.properties[property].pattern));
        }
        schemaFields[property] = ['', validators];
      }
      groupFields = { ...groupFields, ...schemaFields };
    });
    return groupFields;
    // form: FormGroup = this.fb.group({
    //   type: ['', [Validators.required]],
    //   candidate_id: ['', [Validators.required, Validators.maxLength(9)]],
    //   committee_id: ['', [Validators.required, Validators.maxLength(9)]],
    //   name: ['', [Validators.required, Validators.maxLength(200)]],
    //   last_name: ['', [Validators.required, Validators.maxLength(30)]],
    //   first_name: ['', [Validators.required, Validators.maxLength(20)]],
    //   middle_name: ['', [Validators.maxLength(20)]],
    //   prefix: ['', [Validators.maxLength(10)]],
    //   suffix: ['', [Validators.maxLength(10)]],
    //   street_1: ['', [Validators.required, Validators.maxLength(34)]],
    //   street_2: ['', [Validators.maxLength(34)]],
    //   city: ['', [Validators.required, Validators.maxLength(30)]],
    //   state: ['', [Validators.required]],
    //   zip: ['', [Validators.required, Validators.maxLength(9)]],
    //   employer: ['', [Validators.maxLength(38)]],
    //   occupation: ['', [Validators.maxLength(38)]],
    //   candidate_office: ['', [Validators.required, Validators.maxLength(10)]],
    //   candidate_state: ['', [Validators.required, Validators.maxLength(10)]],
    //   candidate_district: ['', [Validators.required, Validators.maxLength(10)]],
    //   telephone: ['', [Validators.pattern('[0-9]{10}')]],
    //   country: ['', [Validators.required]],
    // });
  }
}
