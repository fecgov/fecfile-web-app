/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMetadataKey } from '@angular/forms/signals';

export const PLACEHOLDER = createMetadataKey<string>();

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
