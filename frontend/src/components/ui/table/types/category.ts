export interface TableCategory {
  name: string;
  tableName?: string;
  key: string;
  values: any[];
  actualValues?: any[];
  editable?: boolean;
  color?: string;
  hidden?: boolean;
}
