import { TableRow } from '@/components/ui/table/types';
import { initialChartParams } from '@/data/chart';
import { Comment } from '@/rest-api/comments/assets';
import * as controls from '@/views/company/financials/data/controls';
import { tableRows } from '@/views/company/financials/data/rows';
import { settingsFonts } from '@/views/company/note/utils';

export interface State {
  loading: boolean;
  commentCursor: boolean;
  comment?: Comment;
  modal?: string;
  chartPeriod?: string;
  chartParams?: Array<string>,
  periodType?: string;
  viewType?: string;
  selectedRows: TableRow[];
  forecastEditingModalShow?: boolean;
  listViewType?: string;
  listShowSymbol: boolean;
  listAddedFields: Array<string>;
  listRemoveFields: Array<string>;
  listHighlight: boolean;
  noteSortType: number;
  noteFontType: string;
  noteAdditionalTypes: Array<number>;
}

export const state: State = {
  loading: true,
  commentCursor: false,
  comment: undefined,
  modal: undefined,
  chartPeriod: localStorage.getItem('chart-range') || '10Y',
  chartParams: JSON.parse(localStorage.getItem('chart-params') || JSON.stringify(initialChartParams)),
  periodType: localStorage.getItem('financials-period') || controls.periodControl.ANNUAL,
  viewType: localStorage.getItem('financials-view') || controls.viewControl.EXTENDED,
  selectedRows: [tableRows[0]],
  forecastEditingModalShow: (localStorage.getItem('forecast-editing-modal-show')?.toLocaleLowerCase() === 'false') || false,
  listViewType: localStorage.getItem('list-view') || controls.viewControl.EXTENDED,
  listShowSymbol: true,
  listAddedFields: [],
  listRemoveFields: JSON.parse(localStorage.getItem('list_removed_fields') || '["revenue","netIncome","cashFlowFromOperatingActivities","capex","freeCashFlow"]') || [],
  listHighlight: localStorage.getItem('list_highlight')?.toLocaleLowerCase() === 'true' || false,
  noteSortType: parseInt(localStorage.getItem('note_sort_type') || '1', 10),
  noteFontType: localStorage.getItem('note_font_type') || settingsFonts[0].name,
  noteAdditionalTypes: JSON.parse(localStorage.getItem('note_additional_types') || '[]') || [],
};
