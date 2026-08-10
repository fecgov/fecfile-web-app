import { createMetadataKey } from '@angular/forms/signals';

export const requiredMessage = 'This is a required field';
export const maxLengthMessage = (length: number) =>
  `This field cannot contain more than ${length} alphanumeric characters.`;
export const PLACEHOLDER = createMetadataKey<string>();
