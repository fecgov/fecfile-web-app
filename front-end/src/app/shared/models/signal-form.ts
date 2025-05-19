import { signal, computed } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { JsonSchema, validate, ValidationError } from 'fecfile-validate';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';

export class SignalControl {
  private readonly property: string;
  readonly value = signal<string | null>(null);
  readonly disabled = signal(false);
  readonly errors = signal<ValidationErrors>({});
  readonly valid = computed(() => Object.keys(this.errors()).length === 0);
  readonly dirty = signal(false);

  readonly schema = signal<JsonSchema>(contactIndividualSchema);

  constructor(property: string) {
    this.property = property;
  }

  async validate() {
    let value = this.value();
    if (value === '') value = null;

    const errors = await validate(this.schema(), { [this.property]: value }, [this.property]);
    this.errors.set(this.buildErrors(errors, value));
  }

  reset(value?: string) {
    this.errors.set({});
    this.value.set(value ?? null);
    this.dirty.set(false);
  }

  private buildErrors<U>(errors: ValidationError[], value: U) {
    const result: ValidationErrors = {};
    if (errors.length) {
      errors.forEach((error) => {
        // The keyword === 'type' indicates a conditional check fail as part of an 'anyOf' JSON schema rule
        // Basically, we tried to pass a null to a JSON schema type: ["string"] rule rather than a type: ["string", "null"] rule.
        if (error.keyword === 'required' || (error.keyword === 'type' && error['params']['type'] === 'string')) {
          result['required'] = true;
        }
        if (error.keyword === 'minLength') {
          result['minLength'] = { requiredLength: error.params['limit'] };
        }
        if (error.keyword === 'maxLength' || error.keyword === 'maximum') {
          result['maxLength'] = { requiredLength: error.params['limit'] };
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
          if (value === '' || value === null || value === undefined) {
            result['required'] = true;
          } else {
            result['pattern'] = { requiredPattern: 'Value must be a number' };
          }
        }
        if (error.keyword === 'type' && error.params['type'].includes('boolean')) {
          result['pattern'] = { requiredPattern: error.message };
        }
      });
    }
    return result;
  }

  hasError(err: string): boolean {
    return !!this.errors()[err];
  }
}

export class SignalForm {
  readonly controls: { [key: string]: SignalControl };
  readonly valid = computed(() => {
    for (const control in this.controls) {
      if (!this.controls[control].valid()) return false;
    }
    return true;
  });

  readonly dirty = computed(() => {
    for (const control in this.controls) {
      if (this.controls[control].dirty()) return true;
    }
    return false;
  });

  constructor(controls: { [key: string]: SignalControl }) {
    this.controls = controls;
  }

  reset() {
    for (const control in this.controls) this.controls[control].reset();
  }
}
