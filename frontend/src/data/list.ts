import { TableData, SortColumn } from '@/components/ui/table-column/types';

import { singleRatio, percentage, money } from '@/services/renderers';

import listData from './mock';

export const valuationColumns = [
  {
    name: 'Today',
    key: 'stockPrice',
  },
  {
    name: '52 weeks',
    key: 'change',
  },
  {
    name: 'P/E TTM',
    key: 'priceEarningsRatioLtm',
    handler: singleRatio,
  },
  {
    name: 'FCF Yield',
    key: 'freeCashFlowYield',
    handler: percentage,
  },
];

export const historicalPerformanceColumns = [
  {
    name: 'Total Return',
    key: 'totalReturn',
    handler: percentage,
  },
  {
    name: 'FCF Growth',
    key: 'freeCashFlowGrowth',
    handler: percentage,
  },
  {
    name: 'EPS Growth',
    key: 'earningsPerShareGrowth',
    handler: percentage,
  },
];

export const forecastColumns = [
  {
    name: 'EPS Growth 5Y',
    key: 'earningsPerShare5y',
    handler: percentage,
  },
  {
    name: 'Last 4Q vs Forecast',
    key: 'priceChange',
  },
  {
    name: 'Your price alert (S)',
    key: 'priceChange',
  },
];

export const fundmentalColumns = [
  {
    name: 'ROA',
    key: 'roa',
    handler: percentage,
  },
  {
    name: 'ROE',
    key: 'roe',
    handler: percentage,
  },
  {
    name: 'Revenue',
    key: 'revenue',
    handler: money,
  },
  {
    name: 'Net Income',
    key: 'netIncome',
    handler: money,
  },
  {
    name: 'CFO',
    key: 'cashFlowFromOperatingActivities',
    handler: money,
  },
  {
    name: 'Capex',
    key: 'capex',
    handler: money,
  },
  {
    name: 'FCFF',
    key: 'freeCashFlow',
    handler: singleRatio,
  },
  {
    name: 'Leverage',
    key: 'leverage',
    handler: singleRatio,
  },
];

export const tableData: TableData = { // eslint-disable-line
  data: listData,
  columns: [
    {
      name: 'Name',
      key: 'name',
    },
    {
      name: 'Today',
      key: 'stockPrice',
    },
    {
      name: '52 weeks',
      key: 'change',
    },
    {
      name: 'P/E TTM',
      key: 'priceEarningsRatioLtm',
      handler: singleRatio,
    },
    {
      name: 'FCF Yield',
      key: 'freeCashFlowYield',
      handler: percentage,
    },
    {
      name: 'Total Return',
      key: 'totalReturn',
      handler: percentage,
    },
    {
      name: 'FCF Growth',
      key: 'freeCashFlowGrowth',
      handler: percentage,
    },
    {
      name: 'EPS Growth',
      key: 'earningsPerShareGrowth',
      handler: percentage,
    },
    {
      name: 'EPS Growth 5Y',
      key: 'earningsPerShare5y',
      handler: percentage,
    },
    {
      name: 'Last 4Q vs Forecast',
      key: 'priceChange',
    },
    {
      name: 'Your price alert (S)',
      key: 'priceChange',
    },
    {
      name: 'ROA',
      key: 'roa',
      handler: percentage,
    },
    {
      name: 'ROE',
      key: 'roe',
      handler: percentage,
    },
    {
      name: 'Revenue',
      key: 'revenue',
      handler: money,
    },
    {
      name: 'Net Income',
      key: 'netIncome',
      handler: money,
    },
    {
      name: 'CFO',
      key: 'cashFlowFromOperatingActivities',
      handler: money,
    },
    {
      name: 'Capex',
      key: 'capex',
      handler: money,
    },
    {
      name: 'FCFF',
      key: 'freeCashFlow',
      handler: singleRatio,
    },
    {
      name: 'Leverage',
      key: 'leverage',
      handler: singleRatio,
    },
    {
      name: 'Comment sign',
      key: 'comment',
    },
  ],
};
export const tableDataCondensed: TableData = { // eslint-disable-line
  data: listData,
  columns: [
    {
      name: 'Name',
      key: 'name',
    },
    {
      name: 'Today',
      key: 'stockPrice',
    },
    {
      name: '52 weeks',
      key: 'change',
    },
    {
      name: 'P/E TTM',
      key: 'priceEarningsRatioLtm',
      handler: singleRatio,
    },
    {
      name: 'FCF Yield',
      key: 'freeCashFlowYield',
      handler: percentage,
    },
    {
      name: 'Total Return',
      key: 'totalReturn',
      handler: percentage,
    },
    {
      name: 'FCF Growth',
      key: 'freeCashFlowGrowth',
      handler: percentage,
    },
    {
      name: 'EPS Growth',
      key: 'earningsPerShareGrowth',
      handler: percentage,
    },
    {
      name: 'ROA',
      key: 'roa',
      handler: percentage,
    },
    {
      name: 'ROE',
      key: 'roe',
      handler: percentage,
    },
    {
      name: 'Revenue',
      key: 'revenue',
      handler: money,
    },
    {
      name: 'Net Income',
      key: 'netIncome',
      handler: money,
    },
    {
      name: 'CFO',
      key: 'cashFlowFromOperatingActivities',
      handler: money,
    },
    {
      name: 'Capex',
      key: 'capex',
      handler: money,
    },
    {
      name: 'FCFF',
      key: 'freeCashFlow',
      handler: singleRatio,
    },
    {
      name: 'Leverage',
      key: 'leverage',
      handler: singleRatio,
    },
    {
      name: 'Comment sign',
      key: 'comment',
    },
  ],
};

export const sortColumns: SortColumn[] = [
  {
    name: 'Name',
    key: 'name',
  },
  {
    name: 'Today',
    key: 'stockPrice',
  },
  {
    name: '52 weeks',
    key: 'change',
  },
  {
    name: 'P/E TTM',
    key: 'priceEarningsRatioLtm',
    handler: singleRatio,
  },
  {
    name: 'FCF Yield',
    key: 'freeCashFlowYield',
    handler: percentage,
  },
  {
    name: 'Total Return',
    key: 'totalReturn',
    handler: percentage,
  },
  {
    name: 'FCF Growth',
    key: 'freeCashFlowGrowth',
    handler: percentage,
  },
  {
    name: 'EPS Growth',
    key: 'earningsPerShareGrowth',
    handler: percentage,
  },
  {
    name: 'EPS Growth 5Y',
    key: 'earningsPerShare5y',
    handler: percentage,
  },
  {
    name: 'Last 4Q vs Forecast',
    key: 'priceChange',
  },
  {
    name: 'Your price alert (S)',
    key: 'priceChange',
  },
  {
    name: 'ROA',
    key: 'roa',
    handler: percentage,
  },
  {
    name: 'ROE',
    key: 'roe',
    handler: percentage,
  },
  {
    name: 'Revenue',
    key: 'revenue',
    handler: money,
  },
  {
    name: 'Net Income',
    key: 'netIncome',
    handler: money,
  },
  {
    name: 'CFO',
    key: 'cashFlowFromOperatingActivities',
    handler: money,
  },
  {
    name: 'Capex',
    key: 'capex',
    handler: money,
  },
  {
    name: 'FCFF',
    key: 'freeCashFlow',
    handler: singleRatio,
  },
  {
    name: 'Leverage',
    key: 'leverage',
    handler: singleRatio,
  },
  {
    name: 'Comment sign',
    key: 'comment',
  },
];
