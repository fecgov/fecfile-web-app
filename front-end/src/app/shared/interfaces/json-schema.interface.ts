export interface JsonSchema {
  $schema: string;
  $id: string;
  version?: string;
  title?: string;
  type: string;
  required: string[];
  properties: {
    [key: string]: {
      type: string;
      const?: string | number | boolean;
      minLength?: number;
      maxLength?: number;
      minimum?: number;
      maximum?: number;
      pattern?: string;
    };
  };
}
