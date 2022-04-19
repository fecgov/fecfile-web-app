export interface JsonSchema {
  $schema: string;
  $id: string;
  version: string;
  title: string;
  type: string;
  required: string[];
  properties: {
    type: string;
    minLength: number;
    maxLength: number;
    pattern: string;
  }[];
}
