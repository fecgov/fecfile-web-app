/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SchemaPathTree,
  PathKind,
  required,
  minLength,
  maxLength,
  pattern,
  createMetadataKey,
} from '@angular/forms/signals';
import { JsonSchema } from 'fecfile-validate';

export const requiredMessage = 'This is a required field';
export const PLACEHOLDER = createMetadataKey<string>();

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

function resolveFieldPath<T>(schemaPath: SchemaPathTree<T, PathKind.Root>, path: string[]): any {
  return path.reduce((current: any, key: string) => current?.[key], schemaPath);
}
