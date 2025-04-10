import { TableColumn } from './column';

export interface TableDataRow {
  [key: string]: any;
}

export interface TableData {  // eslint-disable-line
  columns: TableColumn[];
  data: TableDataRow[];
}

export interface SortColumn {
  key: string;
  name: string;
  handler?: Function;
}

export interface CheckBoxField {
  name: string,
  key: string,
  value: boolean,
}

export interface ChartField {
  name: string,
  key: string,
  color: string,
  axis: string,
  handler?: string,
}
