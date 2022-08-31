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
      const?: any;
      minLength?: number;
      maxLength?: number;
      minimum?: number;
      maximum?: number;
      pattern?: string;
    };
  };
}
