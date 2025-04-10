import { Comment } from '@/rest-api/comments/assets';
import { TableCategory } from './category';
import { TableRow } from './row';

export interface TableData {
  title?: string;
  categories: TableCategory[];
  rows: TableRow[];
  column: string;
  viewCount?: number;
  columnName: string;
  comments?: Comment[];
  hideCategories?: boolean;
  editEvent?: boolean;
  tableType?: string;
}
