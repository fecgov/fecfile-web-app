/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency } from '@angular/common';
import { resource, untracked } from '@angular/core';
import {
  SchemaPathTree,
  PathKind,
  required,
  minLength,
  maxLength,
  pattern,
  createMetadataKey,
  validateAsync,
  SchemaPath,
  ValidationError,
} from '@angular/forms/signals';
import { JsonSchema, validate, ValidationError as FecValidationError } from 'fecfile-validate';

export const requiredMessage = 'This is a required field';
export const patternErrorMessage = 'This field contains characters that are not allowed.';
export const PLACEHOLDER = createMetadataKey<string>();

export type CrossFieldDependencies = Record<string, SchemaPath<any>[]>;

export function validateAllFields<T>(
  schemaPath: SchemaPath<any>,
  rootPath: SchemaPath<T>,
  jsonSchema: JsonSchema,
  schemaFieldMap: Record<string, string[]>,
  dependencies: CrossFieldDependencies = {},
) {
  Object.keys(jsonSchema.properties).forEach((key) => {
    const path = schemaFieldMap[key];
    if (!path) return;

    const fieldPath = resolveFieldPath(schemaPath, path);
    if (!fieldPath) return;
    const fieldDeps = dependencies[key] || [];
    if (fieldDeps.length > 0) console.log('fieldDeps', fieldDeps);
    validateAJV(fieldPath, jsonSchema, rootPath, key, fieldDeps);
  });
}

export function validateAJV<T>(
  schemaPath: SchemaPath<string>,
  jsonSchema: JsonSchema,
  rootPath: SchemaPath<T>,
  property: string,
  dependencies: SchemaPath<any>[] = [],
) {
  validateAsync(schemaPath, {
    params: ({ value, valueOf }) => {
      const data = untracked(() => flattenPayload(valueOf(rootPath)));
      dependencies.forEach((dep) => {
        const depValue = valueOf(dep);
        console.log(dep, depValue);
      });
      return {
        data,
        value: value(),
      };
    },

    factory: (params) =>
      resource({
        params,
        loader: async ({ params }) => {
          const errors = await validate(jsonSchema, params.data, [property]);
          return {
            isValid: errors.length === 0,
            errors: errors || [],
            value: params.value,
          };
        },
      }),
    onSuccess: (result) => {
      if (result.isValid) return null;
      return parseErrors(result.errors, result.value);
    },

    onError: () => ({
      kind: 'validatorError',
      message: 'An error occurred during asynchronous AJV validation execution.',
    }),
  });
}

function parseErrors(errors: FecValidationError[], value: string): ValidationError[] {
  const results: ValidationError[] = [];
  errors.forEach((error) => {
    if (error.keyword === 'required' || (error.keyword === 'type' && error['params']['type'] === 'string')) {
      results.push({ kind: 'required', message: requiredMessage });
    }
    if (error.keyword === 'minLength') {
      results.push({
        kind: 'minlength',
        message: `This field must contain at least ${error.params['limit']} alphanumeric characters.`,
      });
    }
    if (error.keyword === 'maxLength' || error.keyword === 'maximum') {
      results.push({
        kind: 'maxlength',
        message: `This field cannot contain more than ${error.params['limit']} alphanumeric characters.`,
      });
    }
    if (error.keyword === 'minimum') {
      results.push({
        kind: 'min',
        message: `This field must be greater than or equal to ${formatCurrency(
          error.params['limit'],
          'en-US',
          '$',
          'USD',
        )}.`,
      });
    }
    if (error.keyword === 'exclusiveMinimum') {
      results.push({
        kind: 'exclusiveMin',
        message: `This field must be greater than ${formatCurrency(error.params['limit'], 'en-US', '$', 'USD')}.`,
      });
    }
    if (error.keyword === 'maximum') {
      results.push({
        kind: 'max',
        message: `This field must be less than or equal to ${formatCurrency(
          error.params['limit'],
          'en-US',
          '$',
          'USD',
        )}.`,
      });
    }
    if (error.keyword === 'exclusiveMaximum') {
      results.push({
        kind: 'exclusiveMax',
        message: `This field must be less than ${formatCurrency(error.params['limit'], 'en-US', '$', 'USD')}.`,
      });
    }
    if (error.keyword === 'pattern') {
      results.push({ kind: 'pattern', message: patternErrorMessage });
    }
    if (error.keyword === 'enum') {
      results.push({ kind: 'pattern', message: patternErrorMessage });
    }
    if (error.keyword === 'type' && error.params['type'] === 'number') {
      if (value === '' || value === null || value === undefined) {
        results.push({ kind: 'required', message: requiredMessage });
      } else {
        results.push({ kind: 'pattern', message: patternErrorMessage });
      }
    }
    if (error.keyword === 'type' && error.params['type'].includes('boolean')) {
      results.push({ kind: 'pattern', message: patternErrorMessage });
    }
  });
  return results;
}

export function schemaFormValidatorBuilder<T>(
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
          let v = value() as string | Date | null;
          if (v === '' || v === null) {
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

export function generatePathMapFromForm<T>(
  obj: T,
  currentPath: string[] = [],
  map: Record<string, string[]> = {},
): Record<string, string[]> {
  if (!obj || typeof obj !== 'object') return map;

  Object.keys(obj).forEach((key) => {
    const nextPath = [...currentPath, key];
    const propertyValue = obj[key as keyof T];

    if (propertyValue && typeof propertyValue === 'object' && !Array.isArray(propertyValue)) {
      generatePathMapFromForm(propertyValue, nextPath, map);
    } else {
      map[key] = nextPath;
    }
  });

  return map;
}

export function flattenPayload(data: any): Record<string, any> {
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

function resolveFieldPath<T>(schemaPath: SchemaPathTree<T, PathKind.Root> | SchemaPath<T>, path: string[]): any {
  return path.reduce((current: any, key: string) => current?.[key], schemaPath);
}
