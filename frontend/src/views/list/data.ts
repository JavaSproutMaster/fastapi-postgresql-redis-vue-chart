import { CheckBoxField } from '@/components/ui/table-column/types/data';

export const addFields: CheckBoxField[] = [
  {
    name: 'Revenue',
    key: 'revenue',
    value: false,
  },
  {
    name: 'Net Income',
    key: 'netIncome',
    value: false,
  },
  {
    name: 'CFO',
    key: 'cashFlowFromOperatingActivities',
    value: false,
  },
  {
    name: 'CAPEX',
    key: 'capex',
    value: false,
  },
  {
    name: 'FCFF',
    key: 'freeCashFlow',
    value: false,
  },
];

export const removeFields: CheckBoxField[] = [
  {
    name: 'Today',
    key: 'stockPrice',
    value: false,
  },
  {
    name: '52 weeks',
    key: 'change',
    value: false,
  },
  {
    name: 'P/E TTM',
    key: 'priceEarningsRatioLtm',
    value: false,
  },
  {
    name: 'FCF Yield',
    key: 'freeCashFlowYield',
    value: false,
  },
  {
    name: 'FCF Growth',
    key: 'freeCashFlowGrowth',
    value: false,
  },
  {
    name: 'Total Return',
    key: 'totalReturn',
    value: false,
  },
  {
    name: 'EPS Growth',
    key: 'earningsPerShareGrowth',
    value: false,
  },
  {
    name: 'EPS Growth 5Y',
    key: 'earningsPerShare5y',
    value: false,
  },
  {
    name: 'Last 4Q vs Forecast',
    key: 'priceChange',
    value: false,
  },
  {
    name: 'Your price alert (S)',
    key: 'priceChange',
    value: false,
  },
  {
    name: 'ROA',
    key: 'roa',
    value: false,
  },
  {
    name: 'ROE',
    key: 'roe',
    value: false,
  },
  {
    name: 'Leverage',
    key: 'leverage',
    value: false,
  },
  {
    name: 'Comment sign',
    key: 'comment',
    value: false,
  },
];
export const removeFieldsCondensed: CheckBoxField[] = [
  {
    name: 'Today',
    key: 'stockPrice',
    value: false,
  },
  {
    name: '52 weeks',
    key: 'change',
    value: false,
  },
  {
    name: 'P/E TTM',
    key: 'priceEarningsRatioLtm',
    value: false,
  },
  {
    name: 'FCF Yield',
    key: 'freeCashFlowYield',
    value: false,
  },
  {
    name: 'Total Return',
    key: 'totalReturn',
    value: false,
  },
  {
    name: 'FCF Growth',
    key: 'freeCashFlowGrowth',
    value: false,
  },
  {
    name: 'EPS Growth',
    key: 'earningsPerShareGrowth',
    value: false,
  },
  {
    name: 'ROA',
    key: 'roa',
    value: false,
  },
  {
    name: 'ROE',
    key: 'roe',
    value: false,
  },
  {
    name: 'Leverage',
    key: 'leverage',
    value: false,
  },
  {
    name: 'Comment sign',
    key: 'comment',
    value: false,
  },
];
